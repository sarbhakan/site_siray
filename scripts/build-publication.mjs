/** Public build receipt. Only hashes and deployment metadata, never editorial content or credentials. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const CONTENT_FILES = Object.freeze({
  photos: 'src/content/photography.json',
  catalogue: 'src/content/catalog.json',
  pages: 'src/content/pages.json',
});

/** Match JSON persistence, then sort object keys recursively; array order remains meaningful. */
export function canonicalStringify(value) {
  const json = JSON.parse(JSON.stringify(value));
  function encode(item) {
    if (item === null || typeof item !== 'object') return JSON.stringify(item);
    if (Array.isArray(item)) return `[${item.map(encode).join(',')}]`;
    return `{${Object.keys(item).sort().map((key) => `${JSON.stringify(key)}:${encode(item[key])}`).join(',')}}`;
  }
  return encode(json);
}

export function hashContent(value) {
  return createHash('sha256').update(canonicalStringify(value), 'utf8').digest('hex');
}

export async function buildPublication({
  root = fileURLToPath(new URL('../', import.meta.url)),
  env = process.env,
  now = new Date(),
} = {}) {
  let commit = env.CF_PAGES_COMMIT_SHA;
  if (!commit) {
    try {
      commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch { commit = null; }
  }
  if (commit !== null && !/^[a-f\d]{40}$/i.test(commit)) {
    throw new Error('Identifiant de publication invalide.');
  }
  const contentHashes = Object.fromEntries(await Promise.all(Object.entries(CONTENT_FILES).map(async ([name, file]) => {
    const data = JSON.parse(await readFile(resolve(root, file), 'utf8'));
    return [name, hashContent(data)];
  })));
  const receipt = { schemaVersion: 1, commit: commit?.toLowerCase() ?? null, builtAt: now.toISOString(), contentHashes };
  await writeFile(resolve(root, 'public/publication.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildPublication();
  console.log('Témoin de publication généré : trois empreintes de contenu, sans données privées.');
}
