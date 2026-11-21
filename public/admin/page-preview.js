/* Full-page local drafts, through Sveltia's read-only entry API. No persistence. */
(function installPagePreview(global) {
  'use strict';
  const views = Object.freeze([
    ['accueil', 'Accueil'], ['prestations', 'Toutes les prestations'],
    ['layer-cakes', 'Layer cakes'], ['bento-cakes', 'Bento cakes'], ['mignardises', 'Mignardises'],
    ['cupcakes', 'Cupcakes'], ['brunch-box', 'Brunch box'], ['buffets', 'Buffets'], ['plateaux', 'Plateaux'],
    ['galerie', 'Galerie'], ['maison', 'La maison'], ['projet', 'Votre projet'],
  ]);
  const validView = value => views.some(([key]) => key === value);
  const plain = value => typeof value?.toJS === 'function' ? value.toJS() : value;
  const fieldValue = (field, key) => typeof field?.get === 'function' ? field.get(key) : field?.[key];
  const snapshot = (entry, kind, getAsset) => {
    const current = plain(typeof entry?.get === 'function' ? entry.get('data') : entry?.data);
    if (!current || typeof current !== 'object' || Array.isArray(current)) throw new Error('Le contenu n’est pas encore disponible. Fermez cet aperçu puis réessayez.');
    const data = kind === 'photos' ? global.SirayPhotoGallery.prepare(current) : current;
    const assets = Object.create(null);
    const visit = value => {
      if (!value || typeof value !== 'object') return;
      if (typeof value.file === 'string') {
        const url = global.SirayStudioWidgets.helpers.safeImageURL(value.file, getAsset);
        if (url) assets[value.file] = url;
      }
      Object.values(value).forEach(visit);
    };
    if (kind === 'photos') visit(data);
    return { kind, data, assets };
  };

  function init(CMS) {
    if (!CMS?.React || !CMS.registerFieldType) throw new Error('L’aperçu nécessite Sveltia CMS.');
    if (init.registered) return;
    const { createElement: h, useState, useEffect, useRef } = CMS.React;

    function PreviewDialog({ entry, kind, getAsset, onClose, trigger }) {
      const [view, setView] = useState(kind === 'catalogue' ? 'prestations' : 'accueil');
      const [device, setDevice] = useState('mobile');
      const [status, setStatus] = useState('Ouverture de la page…');
      const [error, setError] = useState('');
      const [retry, setRetry] = useState(0);
      const [anchor, setAnchor] = useState('');
      const [size, setSize] = useState({ width: 320, height: 500 });
      const dialog = useRef(null), frame = useRef(null), stage = useRef(null), ready = useRef(false);
      const nonce = useRef(global.crypto.randomUUID());
      const latest = useRef({ entry, kind, getAsset });
      latest.current = { entry, kind, getAsset };
      const send = () => {
        if (!ready.current || !frame.current?.contentWindow) return;
        try {
          const payload = snapshot(latest.current.entry, latest.current.kind, latest.current.getAsset);
          frame.current.contentWindow.postMessage({ type: 'siray-preview-draft', nonce: nonce.current, payload }, global.location.origin);
          setError('');
        } catch (failure) { setError(failure.message || 'L’aperçu ne peut pas être préparé. Fermez-le et vérifiez les champs.'); }
      };
      useEffect(() => {
        const doc = global.document, node = dialog.current;
        const previous = [doc.body.style.overflow, doc.documentElement.style.overflow];
        node.showModal(); doc.body.style.overflow = 'hidden'; doc.documentElement.style.overflow = 'hidden';
        node.querySelector('h2').focus({ preventScroll: true });
        return () => {
          doc.body.style.overflow = previous[0]; doc.documentElement.style.overflow = previous[1];
          if (node.open) node.close();
          if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        };
      }, []);
      useEffect(() => {
        const observer = new ResizeObserver(([item]) => setSize({ width: item.contentRect.width, height: item.contentRect.height }));
        observer.observe(stage.current); return () => observer.disconnect();
      }, []);
      useEffect(() => {
        ready.current = false; setStatus('Ouverture de la page…'); setError('');
        const timeout = setTimeout(() => { if (!ready.current) setError('La page met du temps à s’ouvrir. Vérifiez votre connexion puis touchez « Réessayer ».'); }, 20000);
        return () => clearTimeout(timeout);
      }, [view, retry]);
      useEffect(() => {
        const receive = event => {
          if (event.origin !== global.location.origin || event.source !== frame.current?.contentWindow || event.data?.nonce !== nonce.current) return;
          if (event.data.type === 'siray-preview-ready') { ready.current = true; send(); }
          if (event.data.type === 'siray-preview-navigate' && validView(event.data.view)) {
            setAnchor(typeof event.data.hash === 'string' && /^#[a-zA-Z0-9_-]{1,100}$/.test(event.data.hash) ? event.data.hash : '');
            setView(event.data.view);
          }
          if (event.data.type === 'siray-preview-status') {
            if (event.data.status === 'ready') { setStatus('Aperçu à jour · rien n’est publié'); setError(''); }
            if (event.data.status === 'error') setError('Certains champs ne peuvent pas être prévisualisés. Fermez cet aperçu et vérifiez vos modifications.');
          }
        };
        global.addEventListener('message', receive);
        return () => global.removeEventListener('message', receive);
      }, []);
      useEffect(() => { const timer = setTimeout(send, 120); return () => clearTimeout(timer); }, [entry, getAsset]);
      const width = device === 'mobile' ? 390 : 1280;
      const scale = Math.min(1, Math.max(1, size.width) / width);
      const height = Math.max(1, size.height) / scale;
      return h('dialog', { ref: dialog, className: 'siray-page-dialog', 'aria-labelledby': 'siray-page-title',
        onCancel: event => { event.preventDefault(); onClose(); },
        onKeyDown: event => {
          event.stopPropagation();
          if (event.key === 'Escape') { event.preventDefault(); onClose(); }
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') event.preventDefault();
        } },
        h('header', { className: 'siray-page-header' },
          h('div', null, h('h2', { id: 'siray-page-title', tabIndex: -1 }, 'Votre site avant publication'),
            h('p', null, 'Modifications de la rubrique ouverte. Les autres contenus restent ceux du site en ligne.')),
          h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary', onClick: onClose }, 'Fermer l’aperçu')),
        h('div', { className: 'siray-page-tools' },
          h('label', null, h('span', null, 'Page à regarder'),
            h('select', { value: view, onChange: event => { setAnchor(''); setView(event.target.value); } }, ...views.map(([value, label]) => h('option', { key: value, value }, label)))),
          h('div', { className: 'siray-page-devices', role: 'group', 'aria-label': 'Largeur de l’aperçu' },
            ...[['mobile', 'Téléphone', '390 px'], ['desktop', 'Ordinateur', '1 280 px']].map(([key, label, detail]) => h('button', {
              key, type: 'button', 'aria-pressed': device === key, onClick: () => setDevice(key),
            }, label, h('small', null, detail))))),
        h('div', { className: 'siray-page-status', role: 'status', 'aria-live': 'polite' }, error || status,
          error && h('button', { type: 'button', onClick: () => setRetry(n => n + 1) }, 'Réessayer')),
        h('div', { className: 'siray-page-stage', ref: stage },
          h('div', { className: 'siray-page-viewport', style: { width: width * scale, height: Math.max(1, size.height) } },
            h('iframe', { key: `${view}-${retry}`, ref: frame, title: `Aperçu ${views.find(([key]) => key === view)?.[1]} — ${device === 'mobile' ? 'téléphone' : 'ordinateur'}`,
              src: `/admin/apercu/${view}/?nonce=${encodeURIComponent(nonce.current)}${anchor}`,
              style: { width, height, transform: `scale(${scale})` }, sandbox: 'allow-scripts allow-same-origin',
              referrerPolicy: 'same-origin' }))),
      );
    }

    function PreviewControl({ entry, field, getAsset }) {
      const [open, setOpen] = useState(false), trigger = useRef(null);
      const kind = fieldValue(field, 'preview_kind');
      return h('div', { className: 'siray-page-launcher' },
        h('button', { ref: trigger, type: 'button', className: 'siray-studio-button', onClick: () => setOpen(true) }, 'Prévisualiser les pages'),
        h('p', null, 'Regardez vos modifications sur une page complète, en téléphone ou ordinateur, avant d’enregistrer.'),
        open && h(PreviewDialog, { entry, kind, getAsset, trigger: trigger.current, onClose: () => setOpen(false) }));
    }
    CMS.registerFieldType({ name: 'siray-page-preview', controlComponent: PreviewControl,
      schema: { properties: { preview_kind: { type: 'string', enum: ['photos', 'catalogue', 'pages'] } } } });
    init.registered = true;
  }
  global.SirayPagePreview = Object.freeze({ init, views, snapshot, validView });
})(typeof window !== 'undefined' ? window : globalThis);
