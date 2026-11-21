import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createServer } from 'vite';
import { transform } from '@astrojs/compiler-rs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Load the real adapter with Vite's TypeScript/JSON support, without a network listener.
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'silent',
});
let validateExtraSections;
let collections;
try {
  ({ validateExtraSections, collections } = await server.ssrLoadModule('/src/data/site.ts'));
} finally {
  await server.close();
}

const validSection = (overrides = {}) => ({ title: 'Un décor à votre image', text: 'Partagez vos inspirations.', ...overrides });
const withLink = (href) => [validSection({ button: { label: 'Découvrir', href } })];

test('existing catalogue remains compatible and adds no sections that were not entered', async () => {
  const catalog = JSON.parse(await readFile(new URL('../src/content/catalog.json', import.meta.url), 'utf8'));
  assert.equal(collections.length, 7);
  for (const item of collections) {
    const stored = catalog.collections.find((entry) => entry.slug === item.slug);
    assert.deepEqual(item.extraSections, validateExtraSections(stored.extraSections));
  }
  assert.deepEqual(validateExtraSections(undefined), []);
  assert.deepEqual(validateExtraSections(null), []);
  assert.deepEqual(validateExtraSections([]), []);
});

test('optional list and button are normalized without changing plain text', () => {
  assert.deepEqual(validateExtraSections([validSection({ items: ['Décor floral', 'Écriture personnalisée'], button: { label: '', href: '' } })]), [validSection({ items: ['Décor floral', 'Écriture personnalisée'] })]);
  assert.equal(validateExtraSections(withLink('/contact/#allergies'))[0].button.href, '/contact/#allergies');
  assert.equal(validateExtraSections(withLink('https://www.instagram.com/siraysignature/'))[0].button.href, 'https://www.instagram.com/siraysignature/');
});

for (const href of [
  'javascript:alert(1)', 'data:text/html,test', 'http://example.com', '//example.com',
  '///example.com', '/\\example.com', '\\example.com', 'https://user:pass@example.com',
  'https://user@example.com', 'https:example.com', '/%5cexample.com', '/%0aexample.com',
  '/%00test', 'https://example.com/\nnext', '\nhttps://example.com', '\thttps://example.com',
  '/page\rnext', '/page\u007fnext', '/page\u0085next', '/page%zz', '#formats', 'contact/',
]) {
  test(`rejects unsafe or unsupported button URL ${JSON.stringify(href)}`, () => {
    assert.throws(() => validateExtraSections(withLink(href)), /lien du bouton/u);
  });
}

for (const invalid of [
  {}, ['text'], [null], [validSection({ title: '' })], [validSection({ text: ' ' })],
  [validSection({ title: 'a'.repeat(121) })], [validSection({ text: 'a'.repeat(4001) })],
  [validSection({ items: 'Un élément' })], [validSection({ items: [''] })],
  [validSection({ items: ['a'.repeat(301)] })], [validSection({ items: Array(13).fill('Texte') })],
  [validSection({ button: [] })], [validSection({ button: { label: 'Découvrir' } })],
  [validSection({ button: { href: '/contact/' } })],
  [validSection({ button: { label: 'a'.repeat(81), href: '/contact/' } })],
  [validSection({ button: { label: 'Découvrir', href: `/${'a'.repeat(2048)}` } })],
  Array.from({ length: 13 }, () => validSection()),
]) {
  test(`fails closed on malformed or excessive custom content ${JSON.stringify(invalid).slice(0, 75)}`, () => {
    assert.throws(() => validateExtraSections(invalid), /Rubrique personnalisée invalide/u);
  });
}

test('accepts the documented size limits', () => {
  const sections = Array.from({ length: 12 }, () => validSection({ title: 'a'.repeat(120), text: 'a'.repeat(4000), items: Array(12).fill('a'.repeat(300)), button: { label: 'a'.repeat(80), href: `/${'a'.repeat(2047)}` } }));
  assert.equal(validateExtraSections(sections).length, 12);
});

// Compile and render the actual Astro template with its styles and no client script.
// This checks text escaping, links, IDs and the no-JS fallback through Astro's renderer.
const source = await readFile(new URL('../src/components/ExtraSections.astro', import.meta.url), 'utf8');
const compiled = transform(source, {
  filename: 'ExtraSections.astro',
  internalURL: import.meta.resolve('astro/compiler-runtime'),
  resolvePath: (path) => path,
  inlineComponentAssets: true,
});
const { default: ExtraSections } = await import(`data:text/javascript;base64,${Buffer.from(compiled.code).toString('base64')}`);
const container = await AstroContainer.create();

test('custom content is rendered and readable without JavaScript', async () => {
  const html = await container.renderToString(ExtraSections, { props: { sections: validateExtraSections([
    validSection({ title: 'Événement & décor', items: ['Fleurs', 'Rubans'], button: { label: 'Préparer mon projet', href: '/contact/' } }),
    validSection({ title: 'Événement & décor', text: 'Une autre rubrique.' }),
  ]) } });
  assert.match(html, /id="extra-0"/u);
  assert.match(html, /id="extra-1"/u);
  assert.match(html, /data-v5-panel/u);
  assert.match(html, /aria-labelledby="extra-heading-0"/u);
  assert.match(html, /href="\/contact\/"/u);
  assert.match(html, /<li[^>]*>Fleurs<\/li>/u);
  assert.match(html, /Une autre rubrique\./u);
  assert.doesNotMatch(html, /\shidden(?:\s|=|>)|<script\b/u);
});

test('custom section titles, body, list and button labels cannot inject HTML', async () => {
  const payload = '<script>alert("test")</script>';
  const html = await container.renderToString(ExtraSections, { props: { sections: validateExtraSections([validSection({ title: payload, text: payload, items: [payload], button: { label: '<img src=x onerror=alert(1)>', href: '/contact/' } })]) } });
  assert.doesNotMatch(html, /<script\b|<img\b/u);
  assert.match(html, /&lt;script&gt;/u);
  assert.match(html, /&lt;img/u);
});

test('renaming headings keeps panel IDs stable and an empty collection adds no markup', async () => {
  const render = (title) => container.renderToString(ExtraSections, { props: { sections: [validSection({ title })] } });
  assert.match(await render('Ancien titre'), /id="extra-0"/u);
  assert.match(await render('Nouveau titre'), /id="extra-0"/u);
  const emptyHtml = await container.renderToString(ExtraSections, { props: { sections: [] } });
  assert.doesNotMatch(emptyHtml, /<section\b|<h2\b|<a\b/u);
});
