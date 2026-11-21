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

  // Keep the source point beneath the fingers' midpoint in place while scaling.
  // The gesture rebases after each move, so reversing at a zoom limit responds
  // immediately instead of requiring the fingers to cross an old threshold.
  function pinchCrop(frame, from, to) {
    const { width, height, frameWidth, frameHeight } = frame;
    const zoom = photoZoom(frame.zoom), position = positionString(...parsePosition(frame.position));
    if (![width, height, frameWidth, frameHeight, from.distance, to.distance].every(n => Number.isFinite(n) && n > 0) ||
        ![from.x, from.y, to.x, to.y].every(Number.isFinite)) return { zoom, position };
    const nextZoom = Number(photoZoom(zoom * to.distance / from.distance).toFixed(4));
    const fit = Math.max(frameWidth / width, frameHeight / height);
    const point = parsePosition(position).map((p, axis) => {
      const extent = [frameWidth, frameHeight][axis], source = [width, height][axis];
      const before = source * fit * zoom, after = source * fit * nextZoom;
      const oldOffset = (extent - before) * p / 100;
      const anchor = ([from.x, from.y][axis] - oldOffset) / before;
      const overflow = after - extent;
      return overflow > after * .001 ? (anchor * after - [to.x, to.y][axis]) / overflow * 100 : p;
    });
    return { zoom: nextZoom, position: positionString(...point) };
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

  // A full-screen crop is a local transaction. Do not emit default values when
  // nothing changed, or overwrite captions edited elsewhere in the meantime.
  function cropPatch(before, after) {
    const patch = {};
    const position = positionString(...parsePosition(after.position));
    if (position !== positionString(...parsePosition(before.position))) patch.position = position;
    if (photoZoom(before.zoom) !== photoZoom(after.zoom)) patch.zoom = photoZoom(after.zoom);
    return patch;
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
      const cropOnly = props.cropOnly === true;
      const incoming = photoValue(value);
      // Respond to every input locally, without waiting for the CMS data bridge.
      // The ref also preserves a preceding input if two events occur in one frame.
      const [current, setCurrent] = useState(incoming);
      const currentRef = useRef(incoming);
      useEffect(() => { currentRef.current = incoming; setCurrent(incoming); }, [value]);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState('');
      const [view, setView] = useState(props.initialView || 0);
      const [whole, setWhole] = useState(false);
      const [dimensions, setDimensions] = useState(null);
      const [fullScreen, setFullScreen] = useState(null);
      const stageRef = useRef(null);
      const [stageSize, setStageSize] = useState(null);
      const dragRef = useRef(null);
      const [dragging, setDragging] = useState(false);
      useEffect(() => { setDimensions(null); setFullScreen(null); }, [current.file]);
      useEffect(() => {
        if (!cropOnly || !stageRef.current || !global.ResizeObserver) return;
        const observer = new global.ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          setStageSize({ width, height });
        });
        observer.observe(stageRef.current);
        return () => observer.disconnect();
      }, [cropOnly]);
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

      const endDrag = () => {
        const drag = dragRef.current;
        if (!drag) return;
        dragRef.current = null;
        setDragging(false);
        for (const id of drag.points.keys()) if (drag.node.hasPointerCapture?.(id)) drag.node.releasePointerCapture(id);
      };
      useEffect(() => { endDrag(); }, [current.file, view, whole]);
      useEffect(() => {
        const cancel = () => endDrag();
        global.addEventListener?.('resize', cancel);
        global.addEventListener?.('blur', cancel);
        return () => {
          global.removeEventListener?.('resize', cancel);
          global.removeEventListener?.('blur', cancel);
          const drag = dragRef.current;
          dragRef.current = null;
          if (drag) for (const id of drag.points.keys()) if (drag.node.hasPointerCapture?.(id)) drag.node.releasePointerCapture(id);
        };
      }, []);

      const metrics = drag => {
        const [a, b] = [...drag.points.values()];
        return b ? { x: (a.x + b.x) / 2 - drag.left, y: (a.y + b.y) / 2 - drag.top,
          distance: Math.hypot(b.x - a.x, b.y - a.y) } : { x: a.x, y: a.y };
      };
      const rebase = drag => {
        const live = currentRef.current;
        drag.expectedZoom = photoZoom(live.zoom);
        drag.expectedPosition = live.position;
        drag.phase = { width: drag.width, height: drag.height, frameWidth: drag.frameWidth, frameHeight: drag.frameHeight,
          position: live.position, zoom: live.zoom, metrics: metrics(drag) };
      };

      const startDrag = (event) => {
        if (event.button !== 0 || whole) return;
        const existing = dragRef.current;
        if (existing) {
          // Only a second finger can join; ignore extra fingers, mouse and pen.
          if (event.pointerType !== 'touch' || existing.type !== 'touch' || existing.points.size !== 1 || existing.points.has(event.pointerId)) return;
          try { existing.node.setPointerCapture(event.pointerId); } catch { return; }
          existing.points.set(event.pointerId, { x: event.clientX, y: event.clientY });
          rebase(existing);
          event.preventDefault();
          return;
        }
        if (event.isPrimary === false) return;
        const node = event.currentTarget, image = node.querySelector('img');
        const rect = node.getBoundingClientRect();
        const width = image?.naturalWidth, height = image?.naturalHeight;
        const live = currentRef.current;
        const window = cropWindow(width, height, rect.width / rect.height, live.position, live.zoom);
        // Touch must start even at zoom 1, when the first finger cannot yet pan.
        if (!rect.width || !rect.height || !window || (event.pointerType !== 'touch' && !window.horizontal && !window.vertical)) return;
        try { node.setPointerCapture(event.pointerId); } catch { return; }
        const drag = { node, width, height, frameWidth: rect.width, frameHeight: rect.height,
          left: rect.left, top: rect.top, type: event.pointerType, file: live.file,
          points: new Map([[event.pointerId, { x: event.clientX, y: event.clientY }]]) };
        dragRef.current = drag;
        rebase(drag);
        setDragging(true);
        event.preventDefault();
      };
      const moveDrag = (event) => {
        const drag = dragRef.current;
        if (!drag || !drag.points.has(event.pointerId)) return;
        const live = currentRef.current;
        if (live.file !== drag.file || photoZoom(live.zoom) !== drag.expectedZoom || live.position !== drag.expectedPosition) { endDrag(); return; }
        drag.points.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const next = metrics(drag), phase = drag.phase;
        if (drag.points.size === 2) {
          // Coincident fingers have no usable distance. Wait, then rebase.
          if (phase.metrics.distance >= 2 && next.distance >= 2) update(pinchCrop(phase, phase.metrics, next));
        } else {
          change('position', dragPosition(drag.width, drag.height, drag.frameWidth, drag.frameHeight,
            phase.position, phase.zoom, next.x - phase.metrics.x, next.y - phase.metrics.y));
        }
        rebase(drag);
        event.preventDefault();
      };
      const releasePointer = event => {
        const drag = dragRef.current;
        if (!drag || !drag.points.has(event.pointerId)) return;
        drag.points.delete(event.pointerId);
        if (!drag.points.size) { dragRef.current = null; setDragging(false); }
        else rebase(drag);
        if (drag.node.hasPointerCapture?.(event.pointerId)) drag.node.releasePointerCapture(event.pointerId);
      };
      const cancelPointer = event => {
        if (dragRef.current?.points.has(event.pointerId)) endDrag();
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
        endDrag();
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
        endDrag();
        setWhole(false);
        const [liveX, liveY] = parsePosition(currentRef.current.position);
        change('position', positionString(axis === 'x' ? next : liveX, axis === 'y' ? next : liveY));
      };

      const selectView = index => {
        endDrag(); setView(index); setWhole(false); props.onCropViewChange?.(index);
      };
      const resetCrop = () => { endDrag(); setWhole(false); update({ position: '50% 50%', zoom: 1 }); };
      const renderFrame = extra => h(ImageFrame, { photo: current, getAsset, ratio, whole, onDimensions: setDimensions,
        className: `siray-crop-frame${!whole && zone ? ' siray-crop-interactive' : ''}${!whole && (zone?.horizontal || zone?.vertical) ? ' siray-crop-movable' : ''}${dragging ? ' siray-crop-dragging' : ''}`,
        'aria-label': whole ? 'La photographie entière' : 'Aperçu du cadrage sur le site',
        'aria-describedby': cropOnly ? `${forID}-instructions` : whole ? undefined : dragHintID,
        onPointerDown: startDrag, onPointerMove: moveDrag, onPointerUp: releasePointer,
        onPointerCancel: cancelPointer, onLostPointerCapture: cancelPointer,
        onDragStart: event => event.preventDefault(), ...extra });
      const renderZoom = () => h('label', { className: 'siray-range-label', htmlFor: `${forID}-zoom` },
        h('span', null, 'Resserrer le cadre'), h('output', { htmlFor: `${forID}-zoom` }, `× ${zoom.toFixed(2)}`),
        h('input', { id: `${forID}-zoom`, type: 'range', min: 1, max: 2, step: .01, value: zoom,
          'aria-valuetext': `Zoom ${zoom.toFixed(2)} fois`,
          onInput: event => { endDrag(); setWhole(false); change('zoom', photoZoom(Number(event.currentTarget.value))); },
          onChange: event => { endDrag(); setWhole(false); change('zoom', photoZoom(Number(event.target.value))); } }));
      const renderAxes = () => [['x', 'Gauche — droite', x], ['y', 'Haut — bas', y]].map(([axis, label, number]) =>
        h('label', { className: 'siray-range-label', key: axis, htmlFor: `${forID}-${axis}` },
          h('span', null, label), h('output', { htmlFor: `${forID}-${axis}` }, `${Math.round(number)} %`),
          h('input', { id: `${forID}-${axis}`, type: 'range', min: 0, max: 100, step: 1, value: number,
            'aria-valuetext': `${Math.round(number)} pour cent`,
            onInput: event => crop(axis, event.currentTarget.value), onChange: event => crop(axis, event.target.value) })));

      if (cropOnly) {
        const width = stageSize ? Math.max(1, Math.min(stageSize.width, stageSize.height * ratio)) : 1;
        return h('div', { className: 'siray-full-crop-editor' },
          frames.length > 1 ? h('div', { className: 'siray-preview-switch', role: 'group', 'aria-label': 'Format à vérifier' },
            ...frames.map(([label], index) => h('button', { key: label, type: 'button', 'aria-pressed': index === view,
              onClick: () => selectView(index) }, label))) : h('p', { className: 'siray-dialog-format' }, frames[0][0]),
          h('div', { className: 'siray-dialog-stage', ref: stageRef }, renderFrame({
            style: { aspectRatio: String(ratio), width: `${width}px` } })),
          h('div', { className: 'siray-dialog-adjustments' }, renderZoom(),
            h('details', { onToggle: () => endDrag() },
              h('summary', null, 'Réglages précis'), renderAxes(),
              h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary', onClick: resetCrop }, 'Réinitialiser le cadrage'))),
        );
      }

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
                onClick: () => selectView(index) }, label)),
              h('button', { type: 'button', 'aria-pressed': whole, onClick: () => { endDrag(); setWhole(true); } }, 'Image entière'),
            ),
            h('p', { className: 'siray-crop-caption' }, whole ? 'Photo originale, sans recadrage' : 'Résultat sur le site'),
            renderFrame(),
            h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary siray-open-crop',
              onClick: event => { endDrag(); setFullScreen({ photo: { ...currentRef.current }, trigger: event.currentTarget, view }); } }, 'Cadrer en plein écran'),
            !whole && h('p', { id: dragHintID, className: 'siray-drag-help' },
              'Un doigt pour déplacer. Deux doigts pour zoomer ou dézoomer. Pour défiler, glissez à côté.'),
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
              renderZoom(), renderAxes(),
              zone && h('p', { className: 'siray-crop-explanation' },
                !zone.horizontal && !zone.vertical ? 'La photo tient entièrement dans ce cadre. Augmentez le zoom pour pouvoir la déplacer.' :
                !zone.horizontal ? 'Dans ce format, seul le déplacement haut–bas est visible. Augmentez le zoom pour agir aussi de gauche à droite.' :
                !zone.vertical ? 'Dans ce format, seul le déplacement gauche–droite est visible. Augmentez le zoom pour agir aussi de haut en bas.' :
                'Le rectangle sur l’original montre ce qui restera visible. Vérifiez chaque format proposé.'),
              h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary',
                onClick: resetCrop }, 'Réinitialiser le cadrage'),
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
        fullScreen && h(FullScreenCrop, { photo: fullScreen.photo, field, forID: `${forID}-fullscreen`, getAsset,
          initialView: fullScreen.view, trigger: fullScreen.trigger, onClose: () => setFullScreen(null),
          onConfirm: (patch, selectedView) => {
            if (currentRef.current.file === fullScreen.photo.file) { update(patch); setView(selectedView); setWhole(false); }
            setFullScreen(null);
          } }),
      );
    });

    function FullScreenCrop({ photo, field, forID, getAsset, initialView, trigger, onClose, onConfirm }) {
      const [draft, setDraft] = useState({ ...photo });
      const draftRef = useRef({ ...photo }), viewRef = useRef(initialView), dialogRef = useRef(null);
      useEffect(() => {
        const dialog = dialogRef.current, doc = global.document;
        const previous = [doc.body.style.overflow, doc.documentElement.style.overflow];
        dialog.showModal();
        doc.body.style.overflow = 'hidden'; doc.documentElement.style.overflow = 'hidden';
        dialog.querySelector('h2').focus({ preventScroll: true });
        return () => {
          doc.body.style.overflow = previous[0]; doc.documentElement.style.overflow = previous[1];
          if (dialog.open) dialog.close();
          if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        };
      }, []);
      return h('dialog', { ref: dialogRef, className: 'siray-crop-dialog', 'aria-labelledby': `${forID}-title`,
        'aria-describedby': `${forID}-instructions`,
        onCancel: event => { event.preventDefault(); event.stopPropagation(); onClose(); },
        onKeyDown: event => {
          event.stopPropagation();
          if (event.key === 'Escape') { event.preventDefault(); onClose(); }
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') event.preventDefault();
        },
        onClick: event => {
          if (event.target !== event.currentTarget) return;
          const r = event.currentTarget.getBoundingClientRect();
          if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose();
        } },
        h('header', { className: 'siray-dialog-header' }, h('h2', { id: `${forID}-title`, tabIndex: -1 }, 'Cadrer la photo'),
          h('p', { id: `${forID}-instructions` }, 'Un doigt pour déplacer, deux doigts pour zoomer.')),
        h('div', { className: 'siray-dialog-body' }, h(PhotoControl, { value: draft, field, forID, getAsset,
          cropOnly: true, initialView, onCropViewChange: index => { viewRef.current = index; },
          onChange: next => { draftRef.current = next; setDraft(next); } })),
        h('footer', { className: 'siray-dialog-footer' },
          h('p', null, 'Validez ici, puis « Enregistrer » dans l’éditeur pour publier.'),
          h('div', { className: 'siray-dialog-actions' },
            h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary', onClick: onClose }, 'Annuler'),
            h('button', { type: 'button', className: 'siray-studio-button', onClick: () => onConfirm(cropPatch(photo, draftRef.current), viewRef.current) }, 'Valider le cadrage'))),
      );
    }

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

  global.SirayStudioWidgets = { init, helpers: { parsePosition, positionString, photoZoom, cropWindow, dragPosition, pinchCrop, cropPatch, safeImageURL, photoValue } };
})(typeof window !== 'undefined' ? window : globalThis);
