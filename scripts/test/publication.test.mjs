import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { buildPublication, canonicalStringify, hashContent, CONTENT_FILES } from '../build-publication.mjs';

const SOURCE = await readFile(new URL('../../public/admin/publication-status.js', import.meta.url), 'utf8');
const SHA = 'a'.repeat(40);
const OTHER_SHA = 'b'.repeat(40);
const baseData = { title: 'Siray', list: ['Fraise', 'Chocolat'] };
const hashes = { photos: hashContent(baseData), catalogue: hashContent(baseData), pages: hashContent(baseData) };
const makeReceipt = (contentHashes = hashes, commit = SHA) => ({ schemaVersion: 1, commit, builtAt: '2026-11-21T18:00:00.000Z', contentHashes });

class FakeTarget {
  listeners = new Map();
  addEventListener(type, handler) { this.listeners.set(type, handler); }
  removeEventListener(type, handler) { if (this.listeners.get(type) === handler) this.listeners.delete(type); }
  dispatchEvent(event) { this.listeners.get(event.type)?.(event); }
}
class FakeElement extends FakeTarget {
  textContent = '';
  dataset = {};
  children = [];
  attributes = {};
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  setAttribute(key, value) { this.attributes[key] = value; }
}
function fakeEntry(collection, data, path) {
  const values = { collection, path, data: { toJS: () => data } };
  return { get: (key) => values[key] };
}

async function save(app, entry) {
  await app.hooks.postSave({ entry });
  await app.controller.check();
}

function browser({ receipt = makeReceipt(), githubStatus = 'completed', conclusion = 'success', main = SHA, apiFail = false, apiStatus = 429, apiHeaders = {}, storage = new Map(), cms = true } = {}) {
  const host = new FakeElement();
  const window = new FakeTarget();
  const document = new FakeTarget();
  const navigator = { onLine: true };
  const timers = new Map();
  let counter = 0;
  let time = Date.parse('2026-11-21T18:00:00.000Z');
  const calls = [];
  const events = [];
  const hooks = {};
  const state = { receipt, main, apiFail, apiStatus, apiHeaders, githubStatus, conclusion, receiptFail: false, fetchGate: null };
  window.setTimeout = (fn, delay) => { const id = ++counter; timers.set(id, { fn, delay }); return id; };
  window.clearTimeout = (id) => timers.delete(id);
  window.dispatchEvent = (event) => { events.push(event); return true; };
  window.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  document.getElementById = (id) => id === 'publication-status' ? host : undefined;
  document.createElement = () => new FakeElement();
  document.hidden = false;
  class FakeDate extends Date { static now() { return time; } }
  const fetch = async (url, options) => {
    calls.push({ url, options });
    if (state.fetchGate && String(url).startsWith('/publication.json')) await state.fetchGate;
    if (String(url).startsWith('/publication.json')) {
      if (state.receiptFail) throw new TypeError('offline');
      return { ok: true, status: 200, json: async () => state.receipt };
    }
    if (state.apiFail) return { ok: false, status: state.apiStatus, headers: { get: (name) => state.apiHeaders[name] ?? null } };
    const payload = url.endsWith('/git/ref/heads/main')
      ? { object: { sha: state.main } }
      : { check_runs: [{ name: 'Cloudflare Pages', head_sha: state.main, status: state.githubStatus, conclusion: state.conclusion }] };
    return { ok: true, status: 200, json: async () => payload };
  };
  runInNewContext(SOURCE, {
    window, document, navigator, fetch, crypto: webcrypto, TextEncoder, Uint8Array, AbortController, Date: FakeDate,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  });
  const CMS = { registerEventListener: ({ name, handler }) => { hooks[name] = handler; } };
  const controller = window.SirayPublication.init(cms ? CMS : undefined);
  return { host, controller, CMS, hooks, calls, events, state, timers, storage, navigator, document, window, tick: (ms) => { time += ms; } };
}

async function manualCheck(app) {
  app.host.children[2].children[0].dispatchEvent({ type: 'click' });
  await app.controller.check();
}

async function nextPoll(app) {
  const timer = [...app.timers].find(([, value]) => value.delay === 15000);
  assert.ok(timer, 'publication polling remains scheduled');
  app.timers.delete(timer[0]);
  timer[1].fn();
  await app.controller.check();
}

test('canonical hashes ignore object key order but preserve arrays, Unicode and JSON values', () => {
  assert.equal(hashContent({ b: ['framboise', 'é'], a: { z: true, a: null } }), hashContent({ a: { a: null, z: true }, b: ['framboise', 'é'] }));
  assert.notEqual(hashContent(['fruits', 'chocolat']), hashContent(['chocolat', 'fruits']));
  assert.equal(canonicalStringify({ omitted: undefined, numeric: NaN }), '{"numeric":null}');
  assert.equal(canonicalStringify(JSON.parse('{"__proto__":{"x":1},"a":2}')), '{"__proto__":{"x":1},"a":2}');
});

test('build receipt describes exactly the three editable files, not their contents or environment secrets', async () => {
  const root = await mkdtemp(join(tmpdir(), 'siray-publication-'));
  try {
    await mkdir(join(root, 'src/content'), { recursive: true });
    await mkdir(join(root, 'public'));
    for (const path of Object.values(CONTENT_FILES)) await writeFile(join(root, path), JSON.stringify(baseData));
    const receipt = await buildPublication({ root, env: { CF_PAGES_COMMIT_SHA: SHA, GITHUB_CLIENT_SECRET: 'must-never-appear' }, now: new Date('2026-11-21T18:00:00Z') });
    assert.deepEqual(receipt, makeReceipt());
    const text = await readFile(join(root, 'public/publication.json'), 'utf8');
    assert.equal(text.includes('must-never-appear'), false);
    assert.equal(text.includes('Fraise'), false);
    await assert.rejects(buildPublication({ root, env: { CF_PAGES_COMMIT_SHA: '../invalid' } }), /Identifiant/);
  } finally { await rm(root, { recursive: true }); }
});

test('initial state reports up to date only when public receipt matches GitHub main', async () => {
  const app = browser();
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'published');
    assert.equal(app.host.children[0].attributes['aria-live'], 'polite');
    assert.equal(app.calls.length, 3);
    for (const call of app.calls) {
      assert.equal(call.options.credentials, 'omit');
      assert.equal(call.options.cache, 'no-store');
      assert.deepEqual(Object.keys(call.options.headers), ['Accept']);
    }
    await app.controller.check();
    assert.equal(app.calls.filter((call) => call.url.startsWith('https://api.github.com')).length, 2);
  } finally { app.controller.destroy(); }
});

test('postSave compares persisted content, not an optimistic save acknowledgment', async () => {
  const app = browser();
  try {
    await app.controller.ready;
    const changed = { ...baseData, title: 'Nouvelle présentation' };
    await save(app, fakeEntry('photos', changed, 'src/content/photography.json'));
    assert.equal(app.controller.getState().state, 'pending');
    assert.equal(app.controller.getState().pendingCollections[0], 'photos');
    app.state.receipt = makeReceipt({ ...hashes, photos: hashContent(changed) }, OTHER_SHA);
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'published');
    assert.equal(app.events.filter((event) => event.type === 'siray:publication-ready').length, 1);
    assert.equal(app.controller.getState().pendingCollections.length, 0);
    await app.controller.check();
    assert.equal(app.events.filter((event) => event.type === 'siray:publication-ready').length, 1);
    assert.equal(app.controller.getState().state, 'published');
  } finally { app.controller.destroy(); }
});

test('browser and build canonicalization match nested fields even with reordered keys and optional empty values', async () => {
  const app = browser();
  try {
    await app.controller.ready;
    const changed = { object: { second: null, first: 'é', empty: '', absent: undefined }, array: [3, 2, 1] };
    const reordered = { array: [3, 2, 1], object: { empty: '', first: 'é', second: null } };
    app.state.receipt = makeReceipt({ ...hashes, pages: hashContent(reordered) });
    await save(app, fakeEntry('pages', changed));
    assert.equal(app.controller.getState().state, 'published');
  } finally { app.controller.destroy(); }
});

test('several saves are tracked until every affected collection matches the published receipt', async () => {
  const app = browser();
  try {
    await app.controller.ready;
    const photo = { photo: 'new.webp' };
    const prices = { price: 22 };
    await save(app, fakeEntry('photos', photo));
    await save(app, fakeEntry('catalogue', prices));
    app.state.receipt = makeReceipt({ ...hashes, photos: hashContent(photo) });
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'pending');
    app.state.receipt = makeReceipt({ ...hashes, photos: hashContent(photo), catalogue: hashContent(prices) });
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'published');
  } finally { app.controller.destroy(); }
});

test('a later save of the same collection supersedes its previous expectation', async () => {
  const app = browser();
  try {
    await app.controller.ready;
    await save(app, fakeEntry('catalogue', { price: 21 }));
    await save(app, fakeEntry('catalogue', { price: 22 }));
    app.state.receipt = makeReceipt({ ...hashes, catalogue: hashContent({ price: 21 }) });
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'pending');
    app.state.receipt = makeReceipt({ ...hashes, catalogue: hashContent({ price: 22 }) });
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'published');
  } finally { app.controller.destroy(); }
});

test('invalid receipts, unknown entries and fetch errors never announce publication', async () => {
  const app = browser({ receipt: { schemaVersion: 1, contentHashes: {} } });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'unknown');
    await save(app, fakeEntry('unrecognized', baseData));
    assert.equal(app.controller.getState().pendingCollections.length, 0);
    app.state.receiptFail = true;
    await save(app, fakeEntry('photos', { changed: true }));
    assert.equal(app.controller.getState().state, 'unknown');
    assert.equal(app.events.some((event) => event.type === 'siray:publication-ready'), false);
  } finally { app.controller.destroy(); }
});

test('a failed Cloudflare check is visible while the public site keeps the previous receipt', async () => {
  const app = browser({ main: OTHER_SHA, conclusion: 'failure' });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'failed');
    app.tick(120001);
    await save(app, fakeEntry('pages', { changed: true }));
    assert.equal(app.controller.getState().state, 'failed');
    assert.equal(app.events.some((event) => event.type === 'siray:publication-ready'), false);
  } finally { app.controller.destroy(); }
});

test('a cancelled deployment waits for a replacement without announcing a build failure', async () => {
  const app = browser({ main: OTHER_SHA, conclusion: 'cancelled' });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'pending');
    assert.match(app.controller.getState().message, /annulée/);
    assert.equal(app.events.some((event) => event.detail?.status === 'failed'), false);
    app.tick(600001);
    await nextPoll(app);
    assert.equal(app.controller.getState().state, 'delayed');
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), false);
  } finally { app.controller.destroy(); }
});

test('a cancelled attempt retains saved fingerprints until the replacement is publicly verified', async () => {
  const app = browser({ main: OTHER_SHA, conclusion: 'cancelled' });
  try {
    await app.controller.ready;
    const changed = { title: 'Nouvelle pâtisserie' };
    await save(app, fakeEntry('photos', changed));
    app.tick(120001);
    await nextPoll(app);
    assert.equal(app.controller.getState().state, 'pending');
    assert.match(app.controller.getState().message, /annulée/);
    assert.equal(app.controller.getState().pendingCollections.length, 1);
    app.state.receipt = makeReceipt({ ...hashes, photos: hashContent(changed) }, OTHER_SHA);
    await nextPoll(app);
    assert.equal(app.controller.getState().state, 'published');
    assert.equal(app.controller.getState().pendingCollections.length, 0);
  } finally { app.controller.destroy(); }
});

test('manual verification refreshes a cached failed GitHub check immediately', async () => {
  const app = browser({ main: OTHER_SHA, conclusion: 'failure' });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'failed');
    app.state.githubStatus = 'in_progress';
    app.state.conclusion = null;
    await manualCheck(app);
    assert.equal(app.calls.filter((call) => call.url.startsWith('https://api.github.com')).length, 4);
    assert.equal(app.controller.getState().state, 'pending');
    assert.equal(app.events.some((event) => event.type === 'siray:publication-ready'), false);
  } finally { app.controller.destroy(); }
});

test('manual verification still respects GitHub 403 and 429 backoff headers', async () => {
  for (const apiStatus of [403, 429]) {
    const app = browser({ apiFail: true, apiStatus, apiHeaders: { 'retry-after': '300' } });
    try {
      await app.controller.ready;
      app.state.apiFail = false;
      await manualCheck(app);
      app.tick(120001);
      await manualCheck(app);
      assert.equal(app.calls.filter((call) => call.url.startsWith('https://api.github.com')).length, 1);
      app.tick(180000);
      await manualCheck(app);
      assert.equal(app.calls.filter((call) => call.url.startsWith('https://api.github.com')).length, 3);
      assert.equal(app.controller.getState().state, 'published');
    } finally { app.controller.destroy(); }
  }
});

test('a failed head opened without a local save recovers automatically after an external repair', async () => {
  const app = browser({ main: OTHER_SHA, conclusion: 'failure' });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'failed');
    app.state.main = 'c'.repeat(40);
    app.state.githubStatus = 'in_progress';
    app.state.conclusion = null;
    app.tick(120001);
    await nextPoll(app);
    assert.equal(app.controller.getState().state, 'pending');
    app.state.receipt = makeReceipt(hashes, app.state.main);
    await nextPoll(app);
    assert.equal(app.controller.getState().state, 'published');
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), false);
  } finally { app.controller.destroy(); }
});

test('watching a failed head stops after ten minutes and a manual check restarts bounded tracking', async () => {
  const app = browser({ main: OTHER_SHA, conclusion: 'failure' });
  try {
    await app.controller.ready;
    app.tick(600001);
    await nextPoll(app);
    assert.equal(app.controller.getState().state, 'failed');
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), false);
    await manualCheck(app);
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), true);
    app.tick(600001);
    await nextPoll(app);
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), false);
  } finally { app.controller.destroy(); }
});

test('rate-limited GitHub does not prevent exact public-content verification and respects the backoff', async () => {
  const app = browser({ apiFail: true });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'unknown');
    const changed = { change: 'photo' };
    await save(app, fakeEntry('photos', changed));
    app.state.receipt = makeReceipt({ ...hashes, photos: hashContent(changed) });
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'published');
    assert.equal(app.calls.filter((call) => call.url.startsWith('https://api.github.com')).length, 1);
  } finally { app.controller.destroy(); }
});

test('offline and delayed states preserve pending work without false success; polling pauses when hidden', async () => {
  const app = browser();
  try {
    await app.controller.ready;
    app.navigator.onLine = false;
    await save(app, fakeEntry('pages', { changed: true }));
    assert.equal(app.controller.getState().state, 'offline');
    assert.equal(app.controller.getState().pendingCollections.length, 1);
    app.navigator.onLine = true;
    app.document.hidden = true;
    await app.controller.check();
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), false);
    app.document.hidden = false;
    app.tick(600001);
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'delayed');
    assert.equal(app.controller.getState().pendingCollections.length, 1);
  } finally { app.controller.destroy(); }
});

test('initial pending deployment is polled even when this page has just been reopened', async () => {
  const app = browser({ main: OTHER_SHA, githubStatus: 'in_progress', conclusion: null });
  try {
    await app.controller.ready;
    assert.equal(app.controller.getState().state, 'pending');
    assert.ok([...app.timers.values()].some((timer) => timer.delay === 15000));
    app.state.receipt = makeReceipt(hashes, OTHER_SHA);
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'published');
    assert.equal([...app.timers.values()].some((timer) => timer.delay === 15000), false);
  } finally { app.controller.destroy(); }
});

test('postSave finishes while the publication request is still waiting for the network', { timeout: 1000 }, async () => {
  const app = browser();
  let release;
  try {
    await app.controller.ready;
    app.state.fetchGate = new Promise((resolve) => { release = resolve; });
    await app.hooks.postSave({ entry: fakeEntry('photos', { changed: 'new-photo' }) });
    assert.equal(app.controller.getState().state, 'pending');
    release();
    await app.controller.check();
    assert.equal(app.controller.getState().state, 'pending');
  } finally { release?.(); app.controller.destroy(); }
});

test('destroy removes polling and hooks become inert; displayed text never contains saved content', async () => {
  const app = browser();
  await app.controller.ready;
  await save(app, fakeEntry('photos', { privateMarker: 'do-not-display-this' }));
  assert.equal(JSON.stringify(app.controller.getState()).includes('do-not-display-this'), false);
  assert.equal(app.host.children.map((child) => child.textContent).join('').includes('do-not-display-this'), false);
  app.controller.destroy();
  assert.equal(app.timers.size, 0);
  const before = app.calls.length;
  await save(app, fakeEntry('photos', { changed: true }));
  assert.equal(app.calls.length, before);
});

test('landing without CMS resumes saved fingerprints across routes and clears only after exact publication', async () => {
  const storage = new Map();
  const changed = { photo: 'nouveau-gateau.webp', alt: 'not-stored-as-content' };
  const editor = browser({ storage });
  await editor.controller.ready;
  await save(editor, fakeEntry('photos', changed));
  const persisted = [...storage.values()].join('');
  assert.equal(persisted.includes('not-stored-as-content'), false);
  assert.equal(persisted.includes('nouveau-gateau.webp'), false);
  editor.controller.destroy();
  const landing = browser({ storage, cms: false });
  try {
    await landing.controller.ready;
    assert.equal(landing.controller.getState().state, 'pending');
    landing.state.receipt = makeReceipt({ ...hashes, photos: hashContent(changed) }, OTHER_SHA);
    await landing.controller.check();
    assert.equal(landing.controller.getState().state, 'published');
    assert.equal(storage.size, 0);
    landing.window.SirayPublication.init(landing.CMS);
    assert.equal(typeof landing.hooks.postSave, 'function');
  } finally { landing.controller.destroy(); }
});

test('malformed, expired or unknown pending metadata is ignored', async () => {
  const invalid = [
    'not-json',
    JSON.stringify({ version: 1, savedAt: 1, expected: { photos: hashes.photos } }),
    JSON.stringify({ version: 1, savedAt: Date.parse('2026-11-21T18:00:00Z'), expected: { strangers: hashes.photos } }),
    JSON.stringify({ version: 1, savedAt: Date.parse('2026-11-21T18:00:00Z'), expected: { photos: '../bad' } }),
  ];
  for (const payload of invalid) {
    const app = browser({ storage: new Map([['siray:publication:v1', payload]]) });
    try {
      await app.controller.ready;
      assert.equal(app.controller.getState().pendingCollections.length, 0);
      assert.equal(app.controller.getState().state, 'published');
    } finally { app.controller.destroy(); }
  }
});
