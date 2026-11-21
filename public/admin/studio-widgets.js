/* Siray Signature editor extensions. Sveltia CMS 0.270.0 public API only.
 * Existing photo values remain valid; optional zoom is also rendered by the site.
 * pickFile applies the CMS upload naming, validation and image transformations.
 */
(function installSirayStudio(global) {
  'use strict';

  const CATEGORY_OPTIONS = [
    ['layer-cakes', 'Layer cakes'], ['bento-cakes', 'Bento cakes'],
    ['mignardises', 'Mignardises'], ['cupcakes', 'Cupcakes'],
    ['brunch-box', 'Brunch box'], ['buffets', 'Buffets'], ['plateaux', 'Plateaux'],
  ];
  const CATEGORY_NAMES = Object.fromEntries(CATEGORY_OPTIONS);
  const CONTEXTS = {
    hero: [['Diaporama · mobile et ordinateur', 3 / 4]],
    cover: [['Page de la prestation', 4 / 5], ['Liste des prestations', 4 / 3]],
    detail: [['Détail · mobile', 96 / 100], ['Détail · ordinateur', 1]],
    request: [['À découvrir', 4 / 5]],
    home: [['Accueil', 4 / 5]],
    'home-wide': [['Tables · mobile', 16 / 9], ['Tables · ordinateur', 4 / 5]],
    gallery: [['Galerie', 4 / 5]],
  };
  const plain = (value) => value && typeof value.toJS === 'function' ? value.toJS() : value;
  const option = (field, key, fallback) => (typeof field?.get === 'function' ? field.get(key) : field?.[key]) ?? fallback;
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  function parsePosition(value) {
    const match = typeof value === 'string' && value.trim().match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
    return match ? [clamp(Number(match[1])), clamp(Number(match[2]))] : [50, 50];
  }

  function positionString(x, y) {
    return `${Number(clamp(Number(x) || 0).toFixed(3))}% ${Number(clamp(Number(y) || 0).toFixed(3))}%`;
  }

  function photoZoom(value) {
    return typeof value === 'number' && Number.isFinite(value) ? clamp(value, 1, 2) : 1;
  }

  // The visible source rectangle for object-fit: cover, including the real site
  // zoom. Percentages let the original-image diagram work at any screen size.
  function cropWindow(width, height, ratio, position = '50% 50%', zoom = 1) {
    if (!(width > 0 && height > 0 && ratio > 0) || ![width, height, ratio].every(Number.isFinite)) return null;
    const [x, y] = parsePosition(position);
    const scale = Math.max(ratio / width, 1 / height) * photoZoom(zoom);
    const w = Math.min(width, ratio / scale), h = Math.min(height, 1 / scale);
    return { left: (width - w) * x / width, top: (height - h) * y / height,
      width: 100 * w / width, height: 100 * h / height,
      horizontal: width - w > width * .001, vertical: height - h > height * .001 };
  }

  // Percent position controls the overflow, not the frame width. Using the
  // rendered overflow makes the photograph follow the finger pixel for pixel.
  function dragPosition(width, height, frameWidth, frameHeight, position, zoom, dx, dy) {
    const [x, y] = parsePosition(position);
    if (![width, height, frameWidth, frameHeight].every(n => Number.isFinite(n) && n > 0) ||
        ![dx, dy].every(Number.isFinite)) return positionString(x, y);
    const scale = Math.max(frameWidth / width, frameHeight / height) * photoZoom(zoom);
    const overflowX = width * scale - frameWidth, overflowY = height * scale - frameHeight;
    return positionString(overflowX > width * scale * .001 ? x - dx / overflowX * 100 : x,
      overflowY > height * scale * .001 ? y - dy / overflowY * 100 : y);
  }

  function safeImageURL(path, getAsset) {
    if (typeof path !== 'string' || !path) return '';
    let url = '';
    try { url = getAsset?.(path)?.url || path; } catch { url = path; }
    if (typeof url !== 'string' || /[\\\u0000-\u0020\u007f]/.test(url)) return '';
    // A CMS asset may be a draft blob or an authenticated repository URL.
    // Refuse executable and inline document URLs, including SVG data URLs.
    if (/^(?:blob:|https?:\/\/|\/(?!\/))/.test(url)) return url;
    return '';
  }

  function photoValue(value) {
    const current = plain(value);
    return current && typeof current === 'object' && !Array.isArray(current) ? current : {};
  }

  function init(CMS) {
    if (!CMS?.React || !CMS.registerFieldType) {
      throw new Error('Les outils photo nécessitent Sveltia CMS 0.270.0.');
    }
    if (init.registered) return;
    const React = CMS.React;
    const h = React.createElement;
    const { useState, useEffect, useRef, useImperativeHandle, forwardRef } = React;

    function ImageFrame({ photo, getAsset, ratio = 4 / 5, whole = false, onDimensions, className = '', ...props }) {
      const src = safeImageURL(photo?.file, getAsset);
      const [failed, setFailed] = useState(false);
      useEffect(() => setFailed(false), [src]);
      return h('div', { className: `siray-image-frame ${className}`, style: { aspectRatio: String(ratio) }, ...props },
        src && !failed ? h('img', {
          src, alt: photo.alt || '', decoding: 'async', loading: 'lazy',
          draggable: false,
          style: { objectFit: whole ? 'contain' : 'cover', objectPosition: whole ? '50% 50%' : photo.position || '50% 50%',
            scale: whole ? '1' : String(photoZoom(photo.zoom)), transformOrigin: photo.position || '50% 50%' },
          onLoad: event => onDimensions?.({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }),
          onError: () => setFailed(true),
        }) : h('p', { className: 'siray-image-empty' }, failed ? 'La photo ne s’affiche pas. Choisissez-la à nouveau.' : 'Choisissez une photographie.'),
      );
    }

    const PhotoControl = forwardRef(function PhotoControl(props, ref) {
      const { value, field, forID, onChange, pickFile, getAsset } = props;
      const incoming = photoValue(value);
      // Respond to every input locally, without waiting for the CMS data bridge.
      // The ref also preserves a preceding input if two events occur in one frame.
      const [current, setCurrent] = useState(incoming);
      const currentRef = useRef(incoming);
      useEffect(() => { currentRef.current = incoming; setCurrent(incoming); }, [value]);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState('');
      const [view, setView] = useState(0);
      const [whole, setWhole] = useState(false);
      const [dimensions, setDimensions] = useState(null);
      const dragRef = useRef(null);
      const [dragging, setDragging] = useState(false);
      useEffect(() => setDimensions(null), [current.file]);
      const context = option(field, 'photo_context', 'cover');
      const frames = CONTEXTS[context] || CONTEXTS.cover;
      const gallery = option(field, 'show_gallery_fields', false);
      const [x, y] = parsePosition(current.position);
      const zoom = photoZoom(current.zoom);
      const ratio = frames[view]?.[1] || frames[0][1];
      const zone = dimensions && cropWindow(dimensions.width, dimensions.height, ratio, current.position, zoom);
      const hintID = `${forID}-crop-help`;
      const dragHintID = `${forID}-drag-help`;
      const errorID = `${forID}-photo-error`;
      const update = (patch) => {
        const next = { ...currentRef.current, ...patch };
        if (Object.entries(patch).every(([key, item]) => currentRef.current[key] === item)) return;
        currentRef.current = next;
        setCurrent(next);
        onChange(next);
      };
      const change = (key, next) => update({ [key]: next });

      const endDrag = (event) => {
        const drag = dragRef.current;
        if (!drag || (event && event.pointerId !== drag.id)) return;
        dragRef.current = null;
        setDragging(false);
        if (drag.node.hasPointerCapture?.(drag.id)) drag.node.releasePointerCapture(drag.id);
      };
      useEffect(() => { endDrag(); }, [current.file, view, whole, zoom]);
      useEffect(() => () => {
        const drag = dragRef.current;
        dragRef.current = null;
        if (drag?.node.hasPointerCapture?.(drag.id)) drag.node.releasePointerCapture(drag.id);
      }, []);

      const startDrag = (event) => {
        if (event.isPrimary === false || event.button !== 0 || whole || dragRef.current) return;
        const node = event.currentTarget, image = node.querySelector('img');
        const rect = node.getBoundingClientRect();
        const width = image?.naturalWidth, height = image?.naturalHeight;
        const live = currentRef.current;
        const window = cropWindow(width, height, rect.width / rect.height, live.position, live.zoom);
        if (!rect.width || !rect.height || !window || (!window.horizontal && !window.vertical)) return;
        try { node.setPointerCapture(event.pointerId); } catch { return; }
        dragRef.current = { id: event.pointerId, node, width, height, frameWidth: rect.width, frameHeight: rect.height,
          x: event.clientX, y: event.clientY, position: live.position, zoom: live.zoom, file: live.file };
        setDragging(true);
        event.preventDefault();
      };
      const moveDrag = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        if (currentRef.current.file !== drag.file || currentRef.current.zoom !== drag.zoom) { endDrag(event); return; }
        const position = dragPosition(drag.width, drag.height, drag.frameWidth, drag.frameHeight,
          drag.position, drag.zoom, event.clientX - drag.x, event.clientY - drag.y);
        change('position', position);
        event.preventDefault();
      };

      useImperativeHandle(ref, () => ({
        isValid: () => {
          if (!current.file) return { error: { message: 'Choisissez une photographie avant d’enregistrer.' } };
          if (!current.alt?.trim()) return { error: { message: 'Décrivez la photographie avant d’enregistrer.' } };
          if (gallery && !current.label?.trim()) return { error: { message: 'Ajoutez le titre de cette photo dans la galerie.' } };
          if (gallery && !CATEGORY_NAMES[current.category]) return { error: { message: 'Choisissez la catégorie de cette photo.' } };
          return true;
        },
      }), [current.file, current.alt, current.label, current.category, gallery]);

      const choosePhoto = async () => {
        setBusy(true);
        setError('');
        setNotice('');
        try {
          const selected = await pickFile({ kind: 'image', accept: 'image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif', multiple: false, allowURL: false });
          if (!selected || Array.isArray(selected)) return;
          // Do not rewrite the temporary blob URL: Sveltia replaces it at save time.
          update({ file: selected.value, position: currentRef.current.position || '50% 50%' });
          setWhole(false);
          setNotice('Photo choisie. Vérifiez le cadrage et la description, puis enregistrez.');
        } catch {
          setError('Cette photo n’a pas pu être ajoutée. Réessayez avec une photo JPEG, PNG, WebP ou HEIC de moins de 20 Mo.');
        } finally { setBusy(false); }
      };

      const crop = (axis, next) => {
        setWhole(false);
        const [liveX, liveY] = parsePosition(currentRef.current.position);
        change('position', positionString(axis === 'x' ? next : liveX, axis === 'y' ? next : liveY));
      };

      return h('div', { className: 'siray-photo-editor', 'aria-busy': busy },
        option(field, 'photo_label', '') && h('p', { className: 'siray-photo-destination' }, option(field, 'photo_label', '')),
        h('div', { className: 'siray-photo-toolbar' },
          h('button', { id: forID, type: 'button', className: 'siray-studio-button', disabled: busy,
            onClick: choosePhoto, 'aria-describedby': error ? errorID : undefined }, busy ? 'Préparation de la photo…' : current.file ? 'Remplacer la photo' : 'Choisir une photo'),
          h('p', { className: 'siray-studio-help' }, 'Depuis le téléphone ou la bibliothèque du site. Les nouvelles photos sont optimisées automatiquement.'),
        ),
        error && h('p', { id: errorID, className: 'siray-studio-error', role: 'alert' }, error),
        h('p', { className: 'siray-studio-notice', role: 'status', 'aria-live': 'polite' }, notice),
        current.file && h('div', { className: 'siray-photo-workspace' },
          h('div', { className: 'siray-photo-preview' },
            h('div', { className: 'siray-preview-switch', role: 'group', 'aria-label': 'Vérifier le cadrage' },
              ...frames.map(([label], index) => h('button', { key: label, type: 'button', 'aria-pressed': !whole && index === view,
                onClick: () => { setView(index); setWhole(false); } }, label)),
              h('button', { type: 'button', 'aria-pressed': whole, onClick: () => setWhole(true) }, 'Image entière'),
            ),
            h('p', { className: 'siray-crop-caption' }, whole ? 'Photo originale, sans recadrage' : 'Résultat sur le site'),
            h(ImageFrame, { photo: current, getAsset, ratio, whole, onDimensions: setDimensions,
              className: `siray-crop-frame${!whole && (zone?.horizontal || zone?.vertical) ? ' siray-crop-movable' : ''}${dragging ? ' siray-crop-dragging' : ''}`,
              'aria-label': whole ? 'La photographie entière' : 'Aperçu du cadrage sur le site',
              'aria-describedby': whole ? undefined : dragHintID,
              onPointerDown: startDrag, onPointerMove: moveDrag, onPointerUp: endDrag,
              onPointerCancel: endDrag, onLostPointerCapture: endDrag,
              onDragStart: event => event.preventDefault() }),
            !whole && h('p', { id: dragHintID, className: 'siray-drag-help' },
              'Glissez la photo avec un doigt pour la cadrer. Pour faire défiler la page, glissez à côté. Les curseurs restent disponibles.'),
            zone && h('div', { className: 'siray-source-preview' },
              h('p', { className: 'siray-crop-caption' }, 'Zone conservée dans l’original'),
              h('div', { className: 'siray-source-sheet', style: { aspectRatio: String(dimensions.width / dimensions.height), maxWidth: `${156 * dimensions.width / dimensions.height}px` },
                role: 'img', 'aria-label': 'Le rectangle clair délimite la partie visible dans le format choisi.' },
                h('img', { src: safeImageURL(current.file, getAsset), alt: '', decoding: 'async' }),
                h('span', { className: 'siray-source-window', style: { left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%` } }),
              ),
            ),
          ),
          h('div', { className: 'siray-photo-settings' },
            h('fieldset', { className: 'siray-crop-controls', 'aria-describedby': hintID },
              h('legend', null, 'Ajuster le cadrage'),
              h('p', { id: hintID, className: 'siray-studio-help' }, 'L’aperçu bouge pendant le réglage. Rien n’est publié avant « Enregistrer ».') ,
              h('label', { className: 'siray-range-label', htmlFor: `${forID}-zoom` },
                h('span', null, 'Resserrer le cadre'), h('output', { htmlFor: `${forID}-zoom` }, `× ${zoom.toFixed(2)}`),
                h('input', { id: `${forID}-zoom`, type: 'range', min: 1, max: 2, step: .01, value: zoom,
                  'aria-valuetext': `Zoom ${zoom.toFixed(2)} fois`,
                  onInput: event => { setWhole(false); change('zoom', photoZoom(Number(event.currentTarget.value))); },
                  onChange: event => { setWhole(false); change('zoom', photoZoom(Number(event.target.value))); } }),
              ),
              ...[['x', 'Gauche — droite', x], ['y', 'Haut — bas', y]].map(([axis, label, number]) =>
                h('label', { className: 'siray-range-label', key: axis, htmlFor: `${forID}-${axis}` },
                  h('span', null, label), h('output', { htmlFor: `${forID}-${axis}` }, `${Math.round(number)} %`),
                  h('input', { id: `${forID}-${axis}`, type: 'range', min: 0, max: 100, step: 1, value: number,
                    'aria-valuetext': `${Math.round(number)} pour cent`,
                    onInput: event => crop(axis, event.currentTarget.value), onChange: event => crop(axis, event.target.value) }),
                )),
              zone && h('p', { className: 'siray-crop-explanation' },
                !zone.horizontal && !zone.vertical ? 'La photo tient entièrement dans ce cadre. Augmentez le zoom pour pouvoir la déplacer.' :
                !zone.horizontal ? 'Dans ce format, seul le déplacement haut–bas est visible. Augmentez le zoom pour agir aussi de gauche à droite.' :
                !zone.vertical ? 'Dans ce format, seul le déplacement gauche–droite est visible. Augmentez le zoom pour agir aussi de haut en bas.' :
                'Le rectangle sur l’original montre ce qui restera visible. Vérifiez chaque format proposé.'),
              h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary',
                onClick: () => { setWhole(false); update({ position: '50% 50%', zoom: 1 }); } }, 'Réinitialiser le cadrage'),
            ),
            h('p', { className: 'siray-crop-impact' }, 'Ce réglage s’applique aux formats proposés pour cet emplacement. Les autres photos ne changent pas. L’aperçu est immédiat ; le site public attend votre enregistrement.'),
            h('label', { className: 'siray-studio-field', htmlFor: `${forID}-alt` },
              h('span', null, 'Description pour l’accessibilité'),
              h('textarea', { id: `${forID}-alt`, value: current.alt || '', rows: 3, maxLength: 500,
                onChange: (event) => change('alt', event.target.value), 'aria-describedby': `${forID}-alt-help` }),
              h('small', { id: `${forID}-alt-help` }, 'Décrivez ce qui est visible. Cette description aide les personnes qui ne voient pas l’image.'),
            ),
            gallery && h('div', { className: 'siray-gallery-fields' },
              h('label', { className: 'siray-studio-field', htmlFor: `${forID}-label` }, h('span', null, 'Légende visible sous la photo'),
                h('input', { id: `${forID}-label`, type: 'text', value: current.label || '', maxLength: 120, onChange: (event) => change('label', event.target.value) })),
              h('label', { className: 'siray-studio-field', htmlFor: `${forID}-category` }, h('span', null, 'Catégorie'),
                h('select', { id: `${forID}-category`, value: current.category || '', onChange: (event) => change('category', event.target.value) },
                  h('option', { value: '', disabled: true }, 'Choisir une catégorie'),
                  ...CATEGORY_OPTIONS.map(([id, label]) => h('option', { key: id, value: id }, label)))),
            ),
          ),
        ),
      );
    });

    function PhotoPreview({ value, getAsset, field }) {
      const photo = photoValue(value);
      return h('figure', { className: 'siray-preview-photo' },
        h(ImageFrame, { photo, getAsset, ratio: CONTEXTS[option(field, 'photo_context', 'cover')]?.[0][1] || 4 / 5 }),
        photo.label && h('figcaption', null, photo.label),
      );
    }

    function PhotoSummary({ value, getAsset }) {
      const photo = photoValue(value);
      const src = safeImageURL(photo.file, getAsset);
      return h('span', { className: 'siray-photo-summary' },
        src && h('span', { className: 'siray-summary-frame' }, h('img', { src, alt: '', width: 56, height: 56, loading: 'lazy',
          style: { objectPosition: photo.position || '50% 50%', scale: String(photoZoom(photo.zoom)), transformOrigin: photo.position || '50% 50%' } })),
        h('span', null, photo.label || photo.alt || 'Nouvelle photographie'),
      );
    }

    const photoSchema = { properties: {
      photo_context: { type: 'string', enum: Object.keys(CONTEXTS) },
      photo_label: { type: 'string' },
      show_gallery_fields: { type: 'boolean' },
    } };
    CMS.registerFieldType({ name: 'siray-photo', controlComponent: PhotoControl,
      previewComponent: PhotoPreview, summaryComponent: PhotoSummary, schema: photoSchema });

    // Keep Sveltia's native, directly rendered field previews. Registering a
    // collection preview template or preview stylesheet forces a blob iframe,
    // which may be blocked by embedded browsers. The custom photo field above
    // supplies its image preview through the supported previewComponent API.
    init.registered = true;
  }

  global.SirayStudioWidgets = { init, helpers: { parsePosition, positionString, photoZoom, cropWindow, dragPosition, safeImageURL, photoValue } };
})(typeof window !== 'undefined' ? window : globalThis);
