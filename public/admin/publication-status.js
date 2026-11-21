/** Sveltia postSave integration. No token access, no DOM inspection of the CMS, no content storage. */
(() => {
  'use strict';

  const REPO_API = 'https://api.github.com/repos/sarbhakan/site_siray';
  const FILES = Object.freeze({
    'src/content/photography.json': 'photos',
    'src/content/catalog.json': 'catalogue',
    'src/content/pages.json': 'pages',
  });
  const NAMES = Object.freeze({ photos: 'Photographies', catalogue: 'Catalogue et tarifs', pages: 'Textes des pages' });
  const POLL_MS = 15000;
  const GITHUB_MS = 120000;
  const MAX_WAIT_MS = 10 * 60 * 1000;
  const STORAGE_KEY = 'siray:publication:v1';
  const validHash = (value) => typeof value === 'string' && /^[a-f\d]{64}$/i.test(value);
  const validCommit = (value) => typeof value === 'string' && /^[a-f\d]{40}$/i.test(value);

  function canonicalStringify(value) {
    const json = JSON.parse(JSON.stringify(value));
    function encode(item) {
      if (item === null || typeof item !== 'object') return JSON.stringify(item);
      if (Array.isArray(item)) return `[${item.map(encode).join(',')}]`;
      return `{${Object.keys(item).sort().map((key) => `${JSON.stringify(key)}:${encode(item[key])}`).join(',')}}`;
    }
    return encode(json);
  }

  async function hashContent(value) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalStringify(value)));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  const entryValue = (entry, name) => typeof entry?.get === 'function' ? entry.get(name) : entry?.[name];
  const entryData = (entry) => {
    const data = entryValue(entry, 'data');
    return typeof data?.toJS === 'function' ? data.toJS() : data;
  };

  let activeController;
  let attachActiveCMS;
  function init(CMS) {
    if (activeController) { attachActiveCMS?.(CMS); return activeController; }
    const host = document.getElementById('publication-status');
    if (!host) return undefined;

    let disposed = false;
    let pollTimer;
    let checking;
    let revision = 0;
    let deadline = 0;
    let lastSavedAt = 0;
    let nextGitHubAt = 0;
    let latestCommit;
    let lastReceipt;
    let lastBuild;
    let confirmedCommit;
    let state = 'checking';
    let message = '';
    let detail = '';
    const expected = new Map();

    function restorePending() {
      try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        const names = Object.keys(saved?.expected || {});
        if (saved?.version !== 1 || !Number.isFinite(saved.savedAt) || saved.savedAt > Date.now() + 300000
          || Date.now() - saved.savedAt > 7 * 24 * 60 * 60 * 1000 || !names.length || names.length > 3
          || !names.every((name) => Object.hasOwn(NAMES, name) && validHash(saved.expected[name]))) return;
        for (const name of names) expected.set(name, { revision: ++revision, hash: saved.expected[name] });
        lastSavedAt = saved.savedAt;
        deadline = lastSavedAt + MAX_WAIT_MS;
      } catch { /* Private browsing or disabled storage: tracking still works in this tab. */ }
    }

    function persistPending() {
      try {
        if (!expected.size) { window.localStorage.removeItem(STORAGE_KEY); return; }
        const pending = Object.fromEntries([...expected].filter(([, value]) => validHash(value.hash)).map(([name, value]) => [name, value.hash]));
        if (Object.keys(pending).length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, savedAt: lastSavedAt, expected: pending }));
      } catch { /* No editorial content, identity or credentials are ever stored by this module. */ }
    }
    restorePending();

    const statusText = document.createElement('p');
    statusText.className = 'publication-message';
    statusText.setAttribute('role', 'status');
    statusText.setAttribute('aria-live', 'polite');
    statusText.setAttribute('aria-atomic', 'true');
    const explanation = document.createElement('p');
    explanation.className = 'publication-detail';
    const actions = document.createElement('div');
    actions.className = 'publication-actions';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.textContent = 'Vérifier la publication';
    const visit = document.createElement('a');
    visit.href = '/';
    visit.target = '_blank';
    visit.rel = 'noopener';
    visit.textContent = 'Voir le site';
    actions.append(refresh, visit);
    host.replaceChildren(statusText, explanation, actions);

    function render(next, title, text) {
      if (disposed) return;
      const changed = state !== next || message !== title;
      state = next;
      message = title;
      detail = text;
      host.dataset.state = next;
      if (statusText.textContent !== title) statusText.textContent = title;
      if (explanation.textContent !== text) explanation.textContent = text;
      if (changed) window.dispatchEvent(new CustomEvent('siray:publication', { detail: { status: next, message: title } }));
    }

    function schedule() {
      window.clearTimeout(pollTimer);
      const watchingHead = validCommit(latestCommit) && lastReceipt?.commit !== latestCommit && state === 'pending';
      if (disposed || document.hidden || navigator.onLine === false || (!expected.size && !watchingHead) || Date.now() >= deadline) return;
      pollTimer = window.setTimeout(() => { void check(); }, POLL_MS);
    }

    async function request(url, api = false) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(url, {
          cache: 'no-store', credentials: 'omit', redirect: 'error', signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (api && (response.status === 403 || response.status === 429)) {
          const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000;
          const retry = Number(response.headers.get('retry-after')) * 1000 + Date.now();
          nextGitHubAt = Math.max(nextGitHubAt, Number.isFinite(reset) ? reset : 0, Number.isFinite(retry) ? retry : 0, Date.now() + GITHUB_MS);
        }
        if (!response.ok) throw new Error('Suivi indisponible.');
        return await response.json();
      } finally { window.clearTimeout(timeout); }
    }

    async function inspectGitHub() {
      if (Date.now() < nextGitHubAt) return;
      nextGitHubAt = Date.now() + GITHUB_MS;
      const observedRevision = revision;
      try {
        const ref = await request(`${REPO_API}/git/ref/heads/main`, true);
        const sha = ref?.object?.sha;
        if (!validCommit(sha)) return;
        const checks = await request(`${REPO_API}/commits/${sha}/check-runs`, true);
        if (disposed || observedRevision !== revision) return;
        latestCommit = sha;
        const build = Array.isArray(checks?.check_runs)
          ? checks.check_runs.filter((item) => item.name === 'Cloudflare Pages' && item.head_sha === sha)
            .sort((a, b) => String(b.completed_at || b.started_at || '').localeCompare(String(a.completed_at || a.started_at || '')))[0]
          : undefined;
        lastBuild = build ? { sha, status: build.status, conclusion: build.conclusion } : undefined;
      } catch { /* The public receipt can still prove publication when GitHub is unavailable. */ }
    }

    function reconcile(receipt) {
      if (expected.size) {
        const matched = [...expected].every(([name, expectation]) => expectation.hash && receipt.contentHashes[name] === expectation.hash);
        if (matched) {
          const publishedCollections = [...expected.keys()];
          expected.clear();
          deadline = 0;
          confirmedCommit = receipt.commit;
          persistPending();
          render('published', 'Vos modifications sont en ligne.', 'Ouvrez le site pour vérifier la photo, le texte ou le tarif.');
          window.dispatchEvent(new CustomEvent('siray:publication-ready', {
            detail: { collections: publishedCollections, commit: receipt.commit },
          }));
          return;
        }
        if (lastBuild?.sha === latestCommit && lastBuild.status === 'completed'
          && ['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure'].includes(lastBuild.conclusion)) {
          render('failed', 'La mise en ligne est bloquée.', 'Vos modifications sont enregistrées. La dernière version réussie reste visible ; prévenez Hakan.');
        } else if (Date.now() >= deadline) {
          render('delayed', 'La publication prend plus de temps que prévu.', 'Vos modifications sont enregistrées. Touchez « Vérifier la publication » pour relancer le suivi.');
        } else {
          const names = [...expected.keys()].map((name) => NAMES[name]).join(', ');
          render('pending', 'Modifications enregistrées — mise en ligne en cours.', `${names}. Gardez cet onglet ouvert : ce message confirmera leur publication.`);
        }
      } else if (validCommit(receipt.commit) && receipt.commit === confirmedCommit) {
        render('published', 'Vos modifications sont en ligne.', 'Ouvrez le site pour vérifier la photo, le texte ou le tarif.');
      } else if (validCommit(receipt.commit) && latestCommit === receipt.commit) {
        render('published', 'Le site est à jour.', 'Les dernières modifications enregistrées sont en ligne.');
      } else if (validCommit(receipt.commit) && latestCommit && latestCommit !== receipt.commit) {
        if (lastBuild?.status === 'completed' && ['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure'].includes(lastBuild.conclusion)) {
          render('failed', 'La dernière mise en ligne est bloquée.', 'Le site affiche la dernière version réussie. Prévenez Hakan pour vérifier la publication.');
        } else if (deadline && Date.now() >= deadline) {
          render('delayed', 'La publication prend plus de temps que prévu.', 'Le site reste consultable. Touchez « Vérifier la publication » pour relancer le suivi.');
        } else {
          if (!deadline) deadline = Date.now() + MAX_WAIT_MS;
          render('pending', 'Vérification des dernières modifications en cours.', 'Le suivi confirmera quand la version enregistrée sera visible sur le site.');
        }
      } else {
        render('unknown', 'Version publiée consultable.', 'Le suivi complet est momentanément indisponible. « Voir le site » permet de vérifier le résultat.');
      }
    }

    async function performCheck() {
      if (disposed) return;
      if (navigator.onLine === false) {
        render('offline', 'Connexion interrompue.', 'Le suivi reprendra au retour de la connexion. Gardez vos modifications ouvertes.');
        return;
      }
      refresh.disabled = true;
      try {
        const [receipt] = await Promise.all([
          request(`/publication.json?verification=${Date.now()}`), inspectGitHub(),
        ]);
        if (disposed) return;
        if (receipt?.schemaVersion !== 1 || (receipt.commit !== null && !validCommit(receipt.commit)) || !receipt.contentHashes
          || !Object.keys(NAMES).every((name) => validHash(receipt.contentHashes[name]))) {
          throw new Error('Témoin de publication invalide.');
        }
        lastReceipt = receipt;
        reconcile(receipt);
      } catch {
        if (!disposed) render('unknown', 'Impossible de vérifier la publication pour le moment.', expected.size
          ? 'Vos modifications sont enregistrées. Le suivi réessaiera ; vous pouvez aussi ouvrir le site.'
          : 'Réessayez avec « Vérifier la publication », ou ouvrez le site.');
      } finally {
        if (!disposed) refresh.disabled = false;
        schedule();
      }
    }

    function check() {
      if (checking) return checking;
      checking = performCheck().finally(() => { checking = undefined; });
      return checking;
    }

    async function onSave({ entry } = {}) {
      if (disposed) return;
      const path = entryValue(entry, 'path')?.replace(/^\//, '');
      const collection = entryValue(entry, 'collection');
      const name = FILES[path] || (Object.hasOwn(NAMES, collection) ? collection : undefined);
      if (!name) return;
      const data = entryData(entry);
      const saveRevision = ++revision;
      expected.set(name, { revision: saveRevision });
      lastSavedAt = Date.now();
      deadline = lastSavedAt + MAX_WAIT_MS;
      lastBuild = undefined;
      render('pending', 'Modifications enregistrées — mise en ligne en cours.', 'Gardez cet onglet ouvert : ce message confirmera leur publication.');
      try {
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Contenu non reconnu.');
        const hash = await hashContent(data);
        if (disposed || expected.get(name)?.revision !== saveRevision) return;
        expected.set(name, { revision: saveRevision, hash });
        persistPending();
        // Sveltia waits for postSave hooks: never hold its Save button while the network is slow.
        if (checking) void checking.finally(() => { void check(); });
        else void check();
      } catch {
        if (!disposed && expected.get(name)?.revision === saveRevision) {
          render('unknown', 'Enregistré. Le suivi automatique est indisponible.', 'Ouvrez le site après quelques minutes pour vérifier le résultat.');
        }
      }
    }

    const manualCheck = () => {
      if ((expected.size || state === 'delayed') && Date.now() >= deadline) deadline = Date.now() + MAX_WAIT_MS;
      void check();
    };
    const resume = () => { if (!document.hidden) void check(); else window.clearTimeout(pollTimer); };
    const sync = (event) => { if (event.key === STORAGE_KEY) { restorePending(); void check(); } };
    refresh.addEventListener('click', manualCheck);
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('online', resume);
    window.addEventListener('offline', resume);
    window.addEventListener('storage', sync);
    let registered = false;
    attachActiveCMS = (candidate) => {
      if (!registered && typeof candidate?.registerEventListener === 'function') {
        candidate.registerEventListener({ name: 'postSave', handler: onSave });
        registered = true;
      }
    };
    attachActiveCMS(CMS);
    render('checking', 'Vérification de la publication…', 'Enregistrer lance la mise en ligne ; ce suivi confirme quand le site est prêt.');
    activeController = {
      check,
      getState: () => ({ state, message, detail, pendingCollections: [...expected.keys()], publishedCommit: lastReceipt?.commit ?? null }),
      destroy: () => {
        disposed = true;
        window.clearTimeout(pollTimer);
        refresh.removeEventListener('click', manualCheck);
        document.removeEventListener('visibilitychange', resume);
        window.removeEventListener('online', resume);
        window.removeEventListener('offline', resume);
        window.removeEventListener('storage', sync);
        activeController = undefined;
        attachActiveCMS = undefined;
      },
    };
    activeController.ready = check();
    return activeController;
  }

  window.SirayPublication = Object.freeze({ init });
})();
