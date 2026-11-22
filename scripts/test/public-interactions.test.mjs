import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../../src/scripts/site.ts', import.meta.url), 'utf8');
const script = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

class Target {
  listeners = new Map();
  attributes = {};
  dataset = {};
  style = {};
  hidden = false;
  textContent = '';
  classList = { add() {}, remove() {} };
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }
  dispatch(type) { this.listeners.get(type)?.forEach(listener => listener({ type })); }
  setAttribute(name, value) { this.attributes[name] = value; }
}

function browser({ photographs, reduced = false, gallery = false } = {}) {
  const document = new Target();
  document.documentElement = new Target();
  document.hidden = false;
  const window = new Target();
  window.matchMedia = () => Object.assign(new Target(), { matches: reduced });
  const timers = new Map();
  let timerIndex = 0;
  let animationImports = 0;
  const surface = Object.assign(new Target(), { disabled: true });
  const description = new Target();
  const slides = (photographs || []).map(alt => {
    const image = { alt, loading: 'lazy', dataset: {}, complete: true, naturalWidth: 900, decode: async () => {} };
    const slide = new Target();
    slide.querySelector = selector => selector === 'img' ? image : null;
    return slide;
  });
  const hero = new Target();
  hero.querySelector = selector => selector === '[data-slide-surface]' ? surface : selector === '[data-hero-description]' ? description : null;
  hero.querySelectorAll = () => slides;
  const categories = ['all', 'bento-cakes', 'cupcakes'];
  const filters = categories.map(filter => Object.assign(new Target(), { dataset: { filter } }));
  const figures = categories.slice(1).map(category => Object.assign(new Target(), { dataset: { category } }));
  const status = new Target();
  const galleryElement = new Target();
  galleryElement.querySelectorAll = selector => selector === '.gallery-card' ? figures : filters;
  galleryElement.querySelector = () => status;
  document.querySelector = selector => selector === '[data-hero]' && photographs ? hero : selector === '[data-gallery]' && gallery ? galleryElement : null;
  const location = new URL('https://siraysignature.fr/galerie/?utm_source=instagram&siray_preview=example');
  const initialState = { index: 3, scrollX: 0, scrollY: 870 };
  const history = {
    state: initialState,
    replaceState(state, unused, target) { this.state = state; location.href = new URL(target, location).href; },
  };
  const apply = (elements, properties) => {
    (Array.isArray(elements) ? elements : [elements]).forEach(element => Object.assign(element.style, properties));
  };
  const gsap = {
    set: apply,
    timeline() {
      return { to(element, properties) { apply(element, properties); return this; }, set(element, properties) { apply(element, properties); return this; }, kill() {} };
    },
  };
  runInNewContext(script, {
    document, window, location, history, URL, AbortController,
    setTimeout: (callback, delay) => { const id = ++timerIndex; timers.set(id, { callback, delay }); return id; },
    clearTimeout: id => timers.delete(id),
    IntersectionObserver: class { observe() {} disconnect() {} },
    require: name => { assert.equal(name, 'gsap'); animationImports++; return { gsap }; },
  });
  document.dispatch('astro:page-load');
  return { document, surface, description, slides, hero, filters, figures, status, history, initialState, location, timers, imports: () => animationImports };
}

test('gallery filters keep Astro history and query parameters while adding and clearing only the category hash', () => {
  const app = browser({ gallery: true });
  app.filters[1].dispatch('click');
  assert.equal(app.history.state, app.initialState);
  assert.equal(app.history.state.scrollY, 870);
  assert.equal(app.location.hash, '#bento-cakes');
  assert.equal(app.location.searchParams.get('utm_source'), 'instagram');
  assert.equal(app.location.searchParams.get('siray_preview'), 'example');
  assert.deepEqual(app.figures.map(figure => figure.hidden), [false, true]);
  assert.equal(app.status.textContent, '1 photographie');
  app.filters[0].dispatch('click');
  assert.equal(app.location.hash, '');
  assert.equal(app.location.searchParams.get('siray_preview'), 'example');
  assert.equal(app.history.state, app.initialState);
  assert.deepEqual(app.figures.map(figure => figure.hidden), [false, false]);
});

test('the hero describes the active photograph and updates the description after its automatic change', async () => {
  const app = browser({ photographs: ['Layer cake fleuri', 'Buffet de réception'] });
  assert.equal(app.description.textContent, 'Layer cake fleuri');
  assert.equal(app.surface.disabled, false);
  await new Promise(setImmediate);
  const timer = [...app.timers.values()].find(entry => entry.delay === 6500);
  assert.ok(timer);
  timer.callback();
  await new Promise(setImmediate);
  assert.equal(app.description.textContent, 'Buffet de réception');
  assert.equal(app.slides[1].attributes['aria-hidden'], 'false');
  assert.equal(app.slides[0].attributes['aria-hidden'], 'true');
  app.surface.dispatch('click');
  assert.equal(app.surface.attributes['aria-pressed'], 'true');
  assert.equal(app.hero.dataset.running, 'false');
  assert.equal(app.description.textContent, 'Buffet de réception');
  assert.equal(app.description.attributes['aria-live'], undefined);
});

test('one valid home photograph stays static, described and visible without loading an animation engine', async () => {
  const app = browser({ photographs: ['Bento cake fleuri'] });
  await new Promise(setImmediate);
  assert.equal(app.description.textContent, 'Bento cake fleuri');
  assert.equal(app.surface.disabled, true);
  assert.equal(app.surface.attributes['aria-label'], 'Les créations en images');
  assert.equal(app.hero.dataset.running, 'false');
  assert.equal(app.timers.size, 0);
  assert.equal(app.imports(), 0);
  assert.notEqual(app.slides[0].style.visibility, 'hidden');
});

test('reduced motion leaves every photograph static while keeping its accessible description', async () => {
  const app = browser({ photographs: ['Layer cake fleuri', 'Buffet'], reduced: true });
  await new Promise(setImmediate);
  assert.equal(app.description.textContent, 'Layer cake fleuri');
  assert.equal(app.surface.disabled, true);
  assert.equal(app.timers.size, 0);
  assert.equal(app.imports(), 0);
});
