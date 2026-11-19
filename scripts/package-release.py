#!/usr/bin/env python3
"""Package a checked static dist for Netlify Drop and Cloudflare Pages, without building."""
import argparse
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import ipaddress
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


LOCAL_URL = re.compile(
    r"(?:https?:)?//(?:localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])(?=[:/\s\"'<>]|$)",
    re.IGNORECASE,
)
MAX_DROP_FILES = 1000
MAX_FILE_BYTES = 25 * 1024 * 1024


def public_origin(value):
    parsed = urlsplit(value)
    host = parsed.hostname or ''
    local = host == 'localhost' or host.endswith(('.localhost', '.local'))
    address = None
    try:
        address = ipaddress.ip_address(host)
        local = local or not address.is_global
    except ValueError:
        pass
    if (parsed.scheme != 'https' or not host or local or parsed.username
            or parsed.password or parsed.query or parsed.fragment
            or parsed.path not in ('', '/')):
        raise ValueError('L’URL doit être une origine HTTPS publique sans chemin, identifiants, paramètres ou fragment.')
    # Normalize host and default port like URL.origin in the Astro configuration.
    port = parsed.port
    if address:
        normalized_host = f'[{address.compressed}]' if address.version == 6 else address.compressed
    else:
        normalized_host = host.encode('idna').decode('ascii').lower()
        labels = normalized_host.rstrip('.').split('.')
        if len(normalized_host) > 253 or any(not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', label) for label in labels):
            raise ValueError('Le nom d’hôte de --site-url est invalide.')
    suffix = f':{port}' if port not in (None, 443) else ''
    return f'https://{normalized_host}{suffix}'


class Metadata(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.canonicals, self.images = [], []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and 'canonical' in attrs.get('rel', '').split():
            self.canonicals.append(attrs.get('href', ''))
        if tag == 'meta' and attrs.get('property') == 'og:image':
            self.images.append(attrs.get('content', ''))


def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def inspect_dist(dist, site_url):
    if not dist.is_dir():
        raise ValueError(f'Dossier de sortie introuvable : {dist}. Exécuter la compilation avant de créer les archives.')
    files = []
    for path in sorted(dist.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Lien symbolique refusé dans le site : {path.relative_to(dist)}')
        if not path.is_file():
            continue
        relative = path.relative_to(dist)
        if any(part.startswith('.') and part != '.well-known' for part in relative.parts):
            raise ValueError(f'Fichier caché inattendu dans le site : {relative}')
        if any(part in ('node_modules', 'src', '__pycache__') for part in relative.parts):
            raise ValueError(f'Le dossier fourni contient des sources ou dépendances : {relative}')
        if path.stat().st_size > MAX_FILE_BYTES:
            raise ValueError(f'{relative} dépasse les 25 MiB par fichier acceptés par Cloudflare Pages.')
        files.append(path)
    if len(files) > MAX_DROP_FILES:
        raise ValueError(f'{len(files)} fichiers : la limite du dépôt manuel Cloudflare est de 1 000. Utiliser Wrangler ou réduire les fichiers.')
    for required in ('index.html', '404.html', '_headers'):
        if not (dist / required).is_file():
            raise ValueError(f'Fichier requis absent : {required}. Recompiler le site et ses ressources publiques.')
    html_files = [path for path in files if path.suffix == '.html']
    relative_images = 0
    for path in html_files:
        html = path.read_text(encoding='utf-8')
        if LOCAL_URL.search(html):
            raise ValueError(f'URL locale présente dans {path.relative_to(dist)}. Corriger les métadonnées et recompiler.')
        metadata = Metadata(html)
        if site_url:
            if len(metadata.canonicals) != 1:
                raise ValueError(f'{path.relative_to(dist)} : une URL canonique est attendue avec --site-url.')
            for url in metadata.canonicals + metadata.images:
                parsed = urlsplit(url)
                if f'{parsed.scheme}://{parsed.netloc}' != site_url:
                    raise ValueError(f'{path.relative_to(dist)} : une métadonnée ne correspond pas à --site-url.')
        relative_images += sum(url.startswith('/') and not url.startswith('//') for url in metadata.images)
    return files, len(html_files), relative_images


def write_zip(destination, dist, files):
    with ZipFile(destination, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            info = ZipInfo(path.relative_to(dist).as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
    with ZipFile(destination) as archive:
        damaged = archive.testzip()
        if damaged:
            raise ValueError(f'Archive corrompue : {destination.name}, fichier {damaged}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', default='dist', help='Dossier statique déjà compilé et contrôlé (défaut : dist).')
    parser.add_argument('--output-dir', default='releases', help='Dossier de livraison, hors du dist (défaut : releases).')
    parser.add_argument('--version', default='v8', help='Suffixe de livraison, par exemple v8.')
    parser.add_argument('--site-url', help='Facultatif : vérifie l’origine HTTPS déjà utilisée à la compilation ; ne modifie pas le HTML.')
    args = parser.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*', args.version):
        raise ValueError('La version doit contenir uniquement lettres, chiffres, points, tirets et traits de soulignement.')
    dist = Path(args.dist).resolve()
    output = Path(args.output_dir).resolve()
    if output == dist or dist in output.parents:
        raise ValueError('Le dossier de livraison doit rester en dehors du dossier statique.')
    site_url = public_origin(args.site_url) if args.site_url else None
    files, html_count, relative_images = inspect_dist(dist, site_url)
    guide_source = Path(__file__).resolve().parents[1] / 'docs' / 'deployment.md'
    if not guide_source.is_file():
        raise ValueError('Guide docs/deployment.md introuvable dans le projet.')
    output.mkdir(parents=True, exist_ok=True)
    prefix = f'siray-signature-{args.version}'
    artifacts = []
    for provider in ('netlify', 'cloudflare-pages'):
        path = output / f'{prefix}-{provider}.zip'
        write_zip(path, dist, files)
        artifacts.append({'file': path.name, 'target': provider, 'bytes': path.stat().st_size, 'sha256': sha256(path)})
    guide = output / f'{prefix}-deployment.md'
    guide.write_text(guide_source.read_text(encoding='utf-8'), encoding='utf-8')
    warnings = []
    if not site_url:
        warnings.append('URL de production non vérifiée : le site reste portable. Après attribution du nom, recompiler avec SITE_URL puis recréer les archives pour les métadonnées de partage et de référencement.')
    if relative_images:
        warnings.append(f'{relative_images} image(s) de partage utilisent un chemin relatif ; une origine finale est nécessaire pour garantir leur interprétation par les réseaux sociaux.')
    manifest = {
        'version': args.version,
        'created_at_utc': datetime.now(timezone.utc).isoformat(),
        'source_dist': str(dist),
        'site_url_verified': site_url,
        'file_count': len(files),
        'html_pages': html_count,
        'uncompressed_bytes': sum(path.stat().st_size for path in files),
        'archives': artifacts,
        'guide': {'file': guide.name, 'sha256': sha256(guide)},
        'files': [{'path': path.relative_to(dist).as_posix(), 'bytes': path.stat().st_size, 'sha256': sha256(path)} for path in files],
        'warnings': warnings,
        'scope': 'Packaging et contrôles structurels uniquement. Aucun build, compte, téléversement ou déploiement distant effectué par ce script.',
    }
    manifest_path = output / f'{prefix}-manifest.json'
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    checksums = output / f'{prefix}-SHA256SUMS.txt'
    checksum_files = [output / entry['file'] for entry in artifacts] + [guide, manifest_path]
    checksums.write_text(''.join(f'{sha256(path)}  {path.name}\n' for path in checksum_files), encoding='utf-8')
    print(json.dumps({'output_dir': str(output), 'files': len(files), 'html_pages': html_count,
                      'archives': artifacts, 'manifest': manifest_path.name, 'guide': guide.name,
                      'checksums': checksums.name, 'warnings': warnings}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError) as error:
        print(f'Erreur : {error}', file=sys.stderr)
        sys.exit(1)
