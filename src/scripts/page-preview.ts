import { baselineDrafts, previewModel, previewValue, safePreviewURL, readPreviewMessage, type DraftKind, type PreviewDrafts } from '../lib/page-preview-model';
import { photoCropStyle } from '../lib/photo-crop';

// This module is loaded only by /admin/apercu/*, never by a visitor page.
const nonce = new URL(location.href).searchParams.get('nonce') || '';
const view = location.pathname.split('/').filter(Boolean).at(-1) || 'accueil';
const active = parent !== window && /^[a-zA-Z0-9_-]{16,128}$/.test(nonce);
const drafts: PreviewDrafts = structuredClone(baselineDrafts);
const assets: Record<string, string> = Object.create(null);
const templates = new WeakMap<Element, Element>();
const initialImages = new Map<string, { src: string; srcset: string | null }>();
const origin = location.origin;
const emit = (type: string, details: Record<string, unknown> = {}) => {
  if (active) parent.postMessage({ type, nonce, view, ...details }, origin);
};
const plainText = (value: unknown) => value === undefined || value === null ? '' : typeof value === 'string' || typeof value === 'number' ? String(value) : '';
const isVisible = (value: unknown) => Array.isArray(value) ? value.length > 0 : Boolean(value);

for (const wrapper of document.querySelectorAll<HTMLElement>('[data-preview-image]')) {
  const image = wrapper.querySelector<HTMLImageElement>('img');
  if (image && wrapper.dataset.previewFile) initialImages.set(wrapper.dataset.previewFile, { src: image.dataset.src || image.getAttribute('src') || '', srcset: image.dataset.srcset || image.getAttribute('srcset') });
}

function updatePhoto(wrapper: HTMLElement, value: unknown) {
  if (!value || typeof value !== 'object') return;
  const photo = value as { file?: unknown; alt?: unknown; position?: unknown; zoom?: unknown };
  const image = wrapper.querySelector<HTMLImageElement>('img');
  if (!image) return;
  const file = plainText(photo.file);
  const baseline = initialImages.get(file);
  const resolved = safePreviewURL(assets[file], origin, true) || (baseline && safePreviewURL(baseline.src, origin, true)) || (file.startsWith('/images/') ? safePreviewURL(file, origin, true) : undefined);
  if (resolved) {
    const unchanged = file === wrapper.dataset.previewFile && !assets[file];
    if (!unchanged) {
      image.src = resolved;
      if (!assets[file] && baseline?.srcset) image.srcset = baseline.srcset;
      else image.removeAttribute('srcset');
      image.removeAttribute('data-src');
      image.removeAttribute('data-srcset');
    }
    wrapper.dataset.previewFile = file;
  }
  image.alt = plainText(photo.alt);
  const zoom = typeof photo.zoom === 'number' && Number.isFinite(photo.zoom) ? Math.max(1, Math.min(2, photo.zoom)) : 1;
  image.style.cssText = photoCropStyle(photo.position, zoom);
  wrapper.classList.toggle('siray-photo-crop--zoomed', zoom > 1);
}

function bind(node: Element, model: unknown, context?: unknown, index = 0) {
  if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) return;
  const value = (path: string) => previewValue(model, path, context);
  if (node.hasAttribute('data-preview-visible')) (node as HTMLElement).hidden = !isVisible(value(node.getAttribute('data-preview-visible')!));
  for (const attribute of Array.from(node.attributes)) {
    if (!attribute.name.startsWith('data-preview-attr-')) continue;
    const name = attribute.name.slice('data-preview-attr-'.length);
    // Only these application-authored DOM attributes are ever writable.
    if (!['href', 'id', 'value', 'aria-labelledby', 'data-category', 'data-v5-tab', 'data-v5-box', 'data-v5-box-choice'].includes(name)) continue;
    const raw = plainText(value(attribute.value));
    if (name === 'href') {
      const href = safePreviewURL(raw, origin);
      if (href) node.setAttribute('href', href); else node.removeAttribute('href');
    } else node.setAttribute(name, raw);
  }
  if (node.hasAttribute('data-preview-image')) updatePhoto(node as HTMLElement, value(node.getAttribute('data-preview-image')!));
  if (node.hasAttribute('data-preview-text')) {
    const text = plainText(value(node.getAttribute('data-preview-text')!));
    if (node.hasAttribute('data-preview-first-strong') && index === 0) {
      const strong = document.createElement('strong');
      // Preserve Astro's scoped style attributes on newly created semantic text.
      for (const attr of Array.from(node.attributes)) if (attr.name.startsWith('data-astro-cid-')) strong.setAttribute(attr.name, '');
      strong.textContent = text;
      node.replaceChildren(strong);
    } else node.textContent = text;
    return;
  }
  if (node.hasAttribute('data-preview-each')) {
    const list = value(node.getAttribute('data-preview-each')!);
    const values = Array.isArray(list) ? list : [];
    let template = templates.get(node);
    if (!template && node.firstElementChild) {
      template = node.firstElementChild.cloneNode(true) as Element;
      templates.set(node, template);
    }
    if (!template) return;
    const children = values.slice(0, 1000).map((item, itemIndex) => {
      const child = template!.cloneNode(true) as Element;
      if (child instanceof HTMLElement) child.hidden = false;
      if (child.hasAttribute('data-slide')) {
        child.classList.toggle('is-active', itemIndex === 0);
        child.setAttribute('aria-hidden', String(itemIndex !== 0));
        child.removeAttribute('style');
      }
      bind(child, model, item, itemIndex);
      return child;
    });
    node.replaceChildren(...children);
    return;
  }
  for (const child of Array.from(node.children)) bind(child, model, context, index);
}

let applying = false;
function apply() {
  if (applying) return;
  applying = true;
  try {
    // Validate/derive before touching the current render. Incomplete forms retain
    // the last good page and receive an explicit error in the editor.
    const model = previewModel(drafts);
    const selected = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"][aria-selected="true"]')).map((tab) => tab.id);
    const opened = Array.from(document.querySelectorAll<HTMLDetailsElement>('details[open]')).filter((item) => item.classList.contains('platter-choice')).map((item) => item.querySelector('.platter-name')?.textContent);
    const brunchChoice = document.querySelector<HTMLSelectElement>('[data-v5-brunch-select]')?.value;
    const scroll = window.scrollY;
    document.dispatchEvent(new Event('astro:before-swap'));
    bind(document.body, model);
    const brunchSelect = document.querySelector<HTMLSelectElement>('[data-v5-brunch-select]');
    if (brunchSelect && brunchChoice && Number(brunchChoice) < brunchSelect.options.length) brunchSelect.value = brunchChoice;
    document.dispatchEvent(new Event('astro:page-load'));
    // Keep the chosen pane visible while the photographer adjusts its content.
    for (const id of selected) {
      const activeTab = document.getElementById(id);
      const list = activeTab?.closest('[role="tablist"]');
      if (!list) continue;
      for (const tab of list.querySelectorAll<HTMLElement>('[role="tab"]')) {
        const isSelected = tab === activeTab;
        tab.setAttribute('aria-selected', String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        const panelId = tab.getAttribute('aria-controls');
        const panel = panelId && document.getElementById(panelId);
        if (panel) panel.hidden = !isSelected;
      }
    }
    for (const detail of document.querySelectorAll<HTMLDetailsElement>('.platter-choice')) detail.open = opened.includes(detail.querySelector('.platter-name')?.textContent);
    requestAnimationFrame(() => window.scrollTo({ top: scroll, behavior: 'instant' }));
    emit('siray-preview-status', { status: 'ready' });
  } catch (error) {
    emit('siray-preview-status', { status: 'error', message: error instanceof Error ? error.message : 'Complétez les champs en cours pour actualiser l’aperçu.' });
  } finally { applying = false; }
}

if (active) {
  window.addEventListener('message', (event: MessageEvent) => {
    const message = readPreviewMessage(event, parent, origin, nonce);
    if (!message) return;
    const { kind, data, assets: nextAssets } = message;
    // The draft lives only in this iframe's memory. It is never sent to a server,
    // localStorage, a service worker, or the public production page.
    try {
      (drafts as unknown as Record<DraftKind, unknown>)[kind as DraftKind] = structuredClone(data);
      if (nextAssets && typeof nextAssets === 'object' && !Array.isArray(nextAssets)) {
        for (const [file, url] of Object.entries(nextAssets)) {
          const safe = safePreviewURL(url, origin, true);
          if (safe && file.length < 2048) assets[file] = safe;
        }
      }
      apply();
    } catch { emit('siray-preview-status', { status: 'error', message: 'Le brouillon n’a pas pu être lu. Fermez puis rouvrez l’aperçu.' }); }
  });
  const routes: Record<string, string> = { '/': 'accueil', '/creations/': 'prestations', '/galerie/': 'galerie', '/la-maison/': 'maison', '/contact/': 'projet', '/buffets/': 'buffets', '/plateaux/': 'plateaux' };
  for (const slug of ['layer-cakes', 'bento-cakes', 'mignardises', 'cupcakes', 'brunch-box']) routes[`/creations/${slug}/`] = slug;
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== origin || !routes[url.pathname]) return;
    const target = routes[url.pathname];
    const raw = link.getAttribute('href') || '';
    if (raw.startsWith('#')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (target === view && url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    else emit('siray-preview-navigate', { view: target, hash: url.hash });
  }, true);
  emit('siray-preview-ready');
}
