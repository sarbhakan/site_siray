#!/usr/bin/env python3
"""Independent checks of generated pages, links, labels and shipped asset size."""
import argparse
from collections import Counter
import gzip
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
from urllib.parse import unquote, urljoin, urlsplit
from urllib.error import HTTPError
from urllib.request import urlopen


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.nodes, self.stack = path, [], []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "text": "", "line": self.getpos()[0]}
        self.nodes.append(node)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(node)
        if tag == "img":
            for parent in self.stack:
                parent["text"] += " " + (node["attrs"].get("alt") or "")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                del self.stack[i:]
                return

    def handle_data(self, text):
        for node in self.stack:
            node["text"] += text

    def select(self, tag):
        return [n for n in self.nodes if n["tag"] == tag]


def check(dist, base_url=None):
    pages = {p.resolve(): Page(p) for p in sorted(dist.rglob("*.html"))}
    issues, warnings, metrics = [], [], []
    titles = []

    def fail(page, message, line=1):
        issues.append({"file": str(page.path), "line": line, "message": message})

    def resolve(page, raw):
        route = "/" + page.path.relative_to(dist).as_posix()
        if route.endswith("index.html"):
            route = route[:-10]
        target = urlsplit(urljoin("https://site.invalid" + route, raw))
        if target.netloc and target.netloc != "site.invalid":
            return None, target.fragment
        if target.scheme not in {"", "https", "http"}:
            return None, target.fragment
        path = (dist / unquote(target.path).lstrip("/")).resolve()
        if path.is_dir():
            path /= "index.html"
        elif not path.exists() and not path.suffix:
            path /= "index.html"
        return path, unquote(target.fragment)

    if not pages:
        raise ValueError("No generated HTML found. Run npm run build first.")

    for page in pages.values():
        ids = [n["attrs"]["id"] for n in page.nodes if n["attrs"].get("id")]
        for duplicate, count in Counter(ids).items():
            if count > 1:
                fail(page, "Duplicate id: " + duplicate)
        html = page.select("html")
        if not html or html[0]["attrs"].get("lang") != "fr":
            fail(page, "Expected French document language")
        for tag in ["title", "h1", "main"]:
            nodes = page.select(tag)
            if len(nodes) != 1 or (tag != "main" and not nodes[0]["text"].strip()):
                fail(page, "Expected one nonempty " + tag)
        if page.select("title"):
            titles.append(page.select("title")[0]["text"].strip())
        descriptions = [n for n in page.select("meta") if n["attrs"].get("name") == "description" and n["attrs"].get("content")]
        if len(descriptions) != 1:
            fail(page, "Expected one nonempty meta description")
        for n in page.select("img"):
            a = n["attrs"]
            if "alt" not in a:
                fail(page, "Image is missing alt", n["line"])
            if not a.get("width") or not a.get("height"):
                fail(page, "Image does not reserve dimensions", n["line"])
            if a.get("loading") == "lazy" and a.get("fetchpriority") == "high":
                fail(page, "Image is both lazy and high priority", n["line"])
        for n in page.select("button") + page.select("a"):
            a = n["attrs"]
            if not (a.get("aria-label") or a.get("aria-labelledby") or n["text"].strip()):
                fail(page, "Control without an accessible name", n["line"])
        for n in page.nodes:
            a = n["attrs"]
            if a.get("aria-controls") and a["aria-controls"] not in ids:
                fail(page, "aria-controls target is absent", n["line"])
            candidates = []
            if n["tag"] in {"a", "link"} and "href" in a:
                candidates.append(a["href"] or "")
            if n["tag"] in {"img", "script", "source"} and a.get("src"):
                candidates.append(a["src"])
            candidates += [part.strip().split()[0] for part in (a.get("srcset") or "").split(",") if part.strip()]
            for raw in candidates:
                if not raw or raw == "#" or raw.lower().startswith("javascript:"):
                    fail(page, "Empty or inoperative link: " + repr(raw), n["line"])
                    continue
                if "instagram.com" in raw and raw.rstrip("/") != "https://www.instagram.com/siraysignature":
                    fail(page, "Instagram differs from the confirmed account", n["line"])
                path, fragment = resolve(page, raw)
                if path is None:
                    continue
                if not path.is_file():
                    fail(page, "Missing local destination: " + raw, n["line"])
                elif fragment and path in pages:
                    # Exact Sveltia file-entry routes use hash navigation, not HTML anchor IDs.
                    cms_route = path == dist / "admin/editeur/index.html" and fragment in {
                        "/collections/photos/entries/photos", "/collections/catalogue/entries/catalogue", "/collections/pages/entries/pages"
                    }
                    if cms_route:
                        continue
                    targets = {node["attrs"].get("id") for node in pages[path].nodes}
                    # Category deep links are a documented gallery interaction.
                    targets |= {node["attrs"].get("data-filter") for node in pages[path].nodes}
                    if fragment not in targets:
                        fail(page, "Missing fragment: " + raw, n["line"])
        js = {resolve(page, n["attrs"]["src"])[0] for n in page.select("script") if n["attrs"].get("src")}
        js_bytes = sum(len(gzip.compress(p.read_bytes())) for p in js if p and p.is_file())
        metrics.append({"route": str(page.path.relative_to(dist)), "html_bytes": page.path.stat().st_size, "initial_js_gzip_bytes": js_bytes})
        if js_bytes > 80 * 1024:
            warnings.append({"file": str(page.path), "message": "Initial scripts exceed the 80 KiB gzip target"})
        if base_url:
            route = page.path.relative_to(dist).as_posix().removesuffix("index.html")
            with urlopen(base_url.rstrip("/") + "/" + route, timeout=10) as response:
                if response.status != 200 or b"<html" not in response.read(1024).lower():
                    fail(page, "HTTP route does not serve HTML with status 200")
    if len(titles) != len(set(titles)):
        issues.append({"file": str(dist), "line": 1, "message": "Page titles are duplicated"})
    for path in sorted((dist / "images").glob("*.webp")):
        if path.stat().st_size > 400 * 1024:
            warnings.append({"file": str(path), "message": "Image exceeds the 400 KiB large visual budget"})
    if base_url:
        try:
            with urlopen(base_url.rstrip("/") + "/__qa_missing_page__/", timeout=10) as response:
                issues.append({"file": str(dist), "line": 1, "message": "Unknown URL returned " + str(response.status) + " instead of 404"})
        except HTTPError as error:
            if error.code != 404:
                issues.append({"file": str(dist), "line": 1, "message": "Unknown URL returned " + str(error.code) + " instead of 404"})
    return {"pages": len(pages), "issues": issues, "warnings": warnings, "metrics": metrics,
            "scope": "Static HTML and optional HTTP only; browser focus, rendering, contrast and touch require separate checks."}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dist", default="dist")
    parser.add_argument("--url", help="Optional local production preview URL")
    args = parser.parse_args()
    try:
        report = check(Path(args.dist).resolve(), args.url)
    except Exception as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False))
        sys.exit(2)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    sys.exit(bool(report["issues"]))
