/* Siray Signature editor extensions. Sveltia CMS 0.270.0 public API only.
 * Photo values keep the existing { file, alt, position } content shape.
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
    hero: [['Accueil', 3 / 4]],
    cover: [['Page de la prestation', 4 / 5], ['Liste des prestations', 4 / 3]],
    detail: [['Petit détail', 1]],
    request: [['À découvrir', 4 / 5]],
    home: [['Accueil', 4 / 5]],
    'home-wide': [['Accueil · tables et brunchs', 16 / 9]],
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

  function getEntryData(entry) {
    return plain(typeof entry?.get === 'function' ? entry.get('data') : entry?.data) || {};
  }

  function photoValue(value) {
    const current = plain(value);
    return current && typeof current === 'object' && !Array.isArray(current) ? current : {};
  }

  function init(CMS) {
    if (!CMS?.React || !CMS.registerFieldType || !CMS.registerPreviewTemplate) {
      throw new Error('Les outils photo nécessitent Sveltia CMS 0.270.0.');
    }
    if (init.registered) return;
    const React = CMS.React;
    const h = React.createElement;
    const { useState, useEffect, useImperativeHandle, forwardRef } = React;

    function ImageFrame({ photo, getAsset, ratio = 4 / 5, whole = false, className = '', ...props }) {
      const src = safeImageURL(photo?.file, getAsset);
      const [failed, setFailed] = useState(false);
      useEffect(() => setFailed(false), [src]);
      return h('div', { className: `siray-image-frame ${className}`, style: { aspectRatio: String(ratio) }, ...props },
        src && !failed ? h('img', {
          src, alt: photo.alt || '', decoding: 'async', loading: 'lazy',
          style: { objectFit: whole ? 'contain' : 'cover', objectPosition: photo.position || '50% 50%' },
          onError: () => setFailed(true),
        }) : h('p', { className: 'siray-image-empty' }, failed ? 'La photo ne s’affiche pas. Choisissez-la à nouveau.' : 'Choisissez une photographie.'),
      );
    }

    const PhotoControl = forwardRef(function PhotoControl(props, ref) {
      const { value, field, forID, onChange, pickFile, getAsset } = props;
      const current = photoValue(value);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');
      const [notice, setNotice] = useState('');
      const [view, setView] = useState(0);
      const [whole, setWhole] = useState(false);
      const context = option(field, 'photo_context', 'cover');
      const frames = CONTEXTS[context] || CONTEXTS.cover;
      const gallery = option(field, 'show_gallery_fields', false);
      const [x, y] = parsePosition(current.position);
      const hintID = `${forID}-crop-help`;
      const errorID = `${forID}-photo-error`;
      const change = (key, next) => onChange({ ...current, [key]: next });

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
          onChange({ ...current, file: selected.value, position: current.position || '50% 50%' });
          setWhole(false);
          setNotice('Photo choisie. Vérifiez le cadrage et la description, puis enregistrez.');
        } catch {
          setError('Cette photo n’a pas pu être ajoutée. Réessayez avec une photo JPEG, PNG, WebP ou HEIC de moins de 20 Mo.');
        } finally { setBusy(false); }
      };

      const crop = (axis, next) => {
        setWhole(false);
        change('position', positionString(axis === 'x' ? next : x, axis === 'y' ? next : y));
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
            h(ImageFrame, { photo: current, getAsset, ratio: frames[view]?.[1] || frames[0][1], whole,
              className: 'siray-crop-frame', 'aria-label': whole ? 'La photographie entière' : 'Aperçu du cadrage sur le site' }),
            h('p', { className: 'siray-studio-help' }, whole ? 'La photo entière permet de repérer les détails à conserver.' : 'Le cadrage change immédiatement dans cet aperçu. Il s’adapte ensuite à la taille de l’écran.'),
          ),
          h('div', { className: 'siray-photo-settings' },
            h('fieldset', { className: 'siray-crop-controls', 'aria-describedby': hintID },
              h('legend', null, 'Ajuster le cadrage'),
              h('p', { id: hintID, className: 'siray-studio-help' }, 'Déplacez les curseurs jusqu’à bien voir votre création. La photo d’origine reste entière.'),
              ...[['x', 'Gauche — droite', x], ['y', 'Haut — bas', y]].map(([axis, label, number]) =>
                h('label', { className: 'siray-range-label', key: axis, htmlFor: `${forID}-${axis}` },
                  h('span', null, label), h('output', { htmlFor: `${forID}-${axis}` }, `${Math.round(number)} %`),
                  h('input', { id: `${forID}-${axis}`, type: 'range', min: 0, max: 100, step: 1, value: number,
                    'aria-valuetext': `${Math.round(number)} pour cent`, onChange: (event) => crop(axis, event.target.value) }),
                )),
              h('button', { type: 'button', className: 'siray-studio-button siray-studio-button-secondary',
                onClick: () => { setWhole(false); change('position', '50% 50%'); } }, 'Recentrer la photo'),
            ),
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
        src && h('img', { src, alt: '', width: 56, height: 56, loading: 'lazy', style: { objectPosition: photo.position || '50% 50%' } }),
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

    function PreviewShell({ title, children }) {
      return h('main', { className: 'siray-content-preview' },
        h('header', { className: 'siray-content-preview-header' }, h('p', null, 'Siray Signature'), h('h1', null, title),
          h('p', null, 'Aperçu des modifications en cours. Enregistrez pour lancer leur mise en ligne.')),
        children,
      );
    }

    function PhotoCard({ photo, title, path, getAsset, context = 'cover' }) {
      return h('figure', { className: 'siray-preview-photo', 'data-key-path': path, tabIndex: 0 },
        h(ImageFrame, { photo, getAsset, ratio: CONTEXTS[context]?.[0][1] || 4 / 5 }),
        h('figcaption', null, h('strong', null, title), photo.alt && h('span', null, photo.alt)),
      );
    }

    function PhotosPreview({ entry, getAsset }) {
      const data = getEntryData(entry);
      return h(PreviewShell, { title: 'Les photographies' },
        h('section', null, h('h2', null, 'Le défilement d’accueil'),
          h('div', { className: 'siray-preview-photo-grid' }, ...(data.homeSlides || []).map((photo, index) =>
            h(PhotoCard, { key: `slide-${index}`, photo, title: `Photo ${index + 1}`, path: `homeSlides.${index}`, getAsset, context: 'hero' })))),
        h('section', null, h('h2', null, 'Les sept prestations'),
          ...(data.collections || []).map((item, index) => h('section', { className: 'siray-preview-family', key: item.slug },
            h('h3', null, CATEGORY_NAMES[item.slug] || item.slug),
            h('div', { className: 'siray-preview-photo-grid' }, ...[['cover', 'Photo principale'], ['detail', 'Petit détail'], ['home', 'Sur l’accueil'], ['request', 'À découvrir']].map(([key, label]) =>
              h(PhotoCard, { key, photo: item[key] || {}, title: label, path: `collections.${index}.${key}`, getAsset, context: key }))),
          )),
        ),
        h('section', null, h('h2', null, 'La galerie'), h('div', { className: 'siray-preview-photo-grid' },
          ...(data.gallery || []).map((photo, index) => h(PhotoCard, { key: `gallery-${index}`, photo,
            title: `${photo.label || 'Photo'} · ${CATEGORY_NAMES[photo.category] || ''}`, path: `gallery.${index}`, getAsset, context: 'gallery' })))),
        h('section', null, h('h2', null, 'Les autres photos'), h('div', { className: 'siray-preview-photo-grid' },
          ...Object.entries(data.homePhotos || {}).map(([key, photo]) => h(PhotoCard, { key, photo,
            title: ({ maison: 'Accueil · la maison', cakes: 'Galerie · cakes', tables: 'Galerie · tables', petitesDouceurs: 'Galerie · petites douceurs', maisonCake: 'La maison · pâtisserie', maisonTable: 'La maison · tables' })[key] || key,
            path: `homePhotos.${key}`, getAsset, context: key === 'tables' ? 'home-wide' : 'home' })))),
      );
    }

    const currency = (number) => Number.isFinite(Number(number))
      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(Number(number)) : '';
    const text = (value) => typeof value === 'string' ? value
      : value && typeof value === 'object' && typeof value.name === 'string'
        ? `${value.name}${value.detail ? ` · ${value.detail}` : ''}` : '';
    const editable = (tag, content, path, props = {}) => content ? h(tag, { 'data-key-path': path, tabIndex: 0, ...props }, content) : null;
    const list = (values, path) => Array.isArray(values) && values.length ? h('ul', { className: 'siray-preview-list' },
      ...values.map((item, index) => editable('li', text(item), `${path}.${index}`, { key: index }))) : null;

    function ContentBlocks({ blocks, path }) {
      return Array.isArray(blocks) ? blocks.filter((block) => block?.enabled !== false).map((block, index) => h('section', { className: 'siray-preview-block', key: index, 'data-key-path': `${path}.${index}`, tabIndex: 0 },
        h('h3', null, block.title || ''), block.text && h('p', null, block.text), list(block.items, `${path}.${index}.items`),
        block.button?.label && h('span', { className: 'siray-preview-button-label' }, block.button.label),
      )) : null;
    }

    function CataloguePreview({ entry }) {
      const data = getEntryData(entry);
      return h(PreviewShell, { title: 'Les textes et les tarifs' },
        ...(data.collections || []).map((item, index) => {
          const path = `collections.${index}`;
          return h('section', { key: item.slug, className: 'siray-preview-family' },
            editable('h2', item.name, `${path}.name`), editable('p', item.intro, `${path}.intro`, { className: 'siray-preview-lead' }),
            editable('p', item.text, `${path}.text`), editable('p', item.priceSummary, `${path}.priceSummary`, { className: 'siray-preview-price' }),
            list(item.possibilities, `${path}.possibilities`),
            item.tariffs?.length > 0 && h('div', { className: 'siray-preview-prices' }, ...item.tariffs.map((tariff, tariffIndex) => h('div', {
              key: tariffIndex, 'data-key-path': `${path}.tariffs.${tariffIndex}`, tabIndex: 0 },
              h('div', null, h('strong', null, tariff.label), tariff.description && h('p', null, tariff.description), tariff.detail && h('p', null, tariff.detail)),
              h('strong', null, currency(tariff.price)),
            ))),
            editable('p', item.priceNote, `${path}.priceNote`),
            h(ContentBlocks, { blocks: item.extraSections || item.sections, path: `${path}.${item.extraSections ? 'extraSections' : 'sections'}` }),
          );
        }),
        h('section', null, h('h2', null, 'Les brunch box'), ...(data.brunchBoxes || []).map((box, index) => h('section', { key: box.name, className: 'siray-preview-block' },
          editable('h3', box.name, `brunchBoxes.${index}.name`), editable('p', `${currency(box.price)} par personne`, `brunchBoxes.${index}.price`, { className: 'siray-preview-price' }),
          h('h4', null, 'Sucré'), list(box.sweet, `brunchBoxes.${index}.sweet`), h('h4', null, 'Salé'), list(box.savory, `brunchBoxes.${index}.savory`),
          h('h4', null, 'Boisson'), list(Array.isArray(box.drink) ? box.drink : [box.drink], `brunchBoxes.${index}.drink`),
        ))),
        h('section', null, h('h2', null, 'Les saveurs classiques'), ...(data.classicFlavorGroups || []).map((group, index) =>
          h('section', { key: group.name }, editable('h3', group.name, `classicFlavorGroups.${index}.name`), list(group.flavors, `classicFlavorGroups.${index}.flavors`)))),
        h('section', null, h('h2', null, 'Les associations Signature'), ...(data.signatureFlavors || []).map((flavor, index) =>
          h('div', { className: 'siray-preview-block', key: index }, editable('h3', flavor.name, `signatureFlavors.${index}.name`), editable('p', flavor.composition, `signatureFlavors.${index}.composition`)))),
        h('section', null, h('h2', null, 'Les saveurs des cupcakes'), ...(data.cupcakeFlavors || []).map((flavor, index) =>
          editable('p', `${flavor.name}${flavor.family ? ` · ${flavor.family}` : ''}`, `cupcakeFlavors.${index}`, { key: index }))),
        data.mignardiseMenu && h('section', null,
          editable('h2', data.mignardiseMenu.savoryTitle, 'mignardiseMenu.savoryTitle'), editable('p', data.mignardiseMenu.savoryIntro, 'mignardiseMenu.savoryIntro'), list(data.mignardiseMenu.savory, 'mignardiseMenu.savory'), editable('p', data.mignardiseMenu.savoryFinale, 'mignardiseMenu.savoryFinale'),
          editable('h3', data.mignardiseMenu.sweetTitle, 'mignardiseMenu.sweetTitle'), editable('p', data.mignardiseMenu.sweetText, 'mignardiseMenu.sweetText')),
        h('section', null, h('h2', null, 'L’installation du buffet'), ...(data.buffetServiceSteps || []).map((step, index) =>
          h('div', { className: 'siray-preview-block', key: index }, editable('h3', step.title, `buffetServiceSteps.${index}.title`), editable('p', step.text, `buffetServiceSteps.${index}.text`)))),
      );
    }

    function PagesPreview({ entry }) {
      const data = getEntryData(entry);
      const labels = { home: 'L’accueil', maison: 'La maison', project: 'Votre projet' };
      return h(PreviewShell, { title: 'Les pages du site' }, ...Object.entries(data).map(([key, page]) =>
        h('section', { className: 'siray-preview-family', key }, h('h2', null, labels[key] || key),
          ...Object.entries(page || {}).map(([name, value]) => {
            const path = `${key}.${name}`;
            if (['pageTitle', 'metaDescription', 'extraSections', 'sections'].includes(name)) return null;
            if (Array.isArray(value)) return value.map((item, index) => typeof item === 'string'
              ? editable('p', item, `${path}.${index}`, { key: `${name}-${index}` })
              : h('div', { className: 'siray-preview-block', key: `${name}-${index}` },
                editable('h3', item.title || item.label, `${path}.${index}.${item.title ? 'title' : 'label'}`),
                editable('p', item.text, `${path}.${index}.text`)));
            return typeof value === 'string' ? editable(name === 'title' || /Title$/.test(name) ? 'h3' : 'p', value, path, { key: name }) : null;
          }),
          h(ContentBlocks, { blocks: page.extraSections || page.sections, path: `${key}.${page.extraSections ? 'extraSections' : 'sections'}` }),
        )),
      );
    }

    CMS.registerPreviewTemplate('photos', PhotosPreview);
    CMS.registerPreviewTemplate('catalogue', CataloguePreview);
    CMS.registerPreviewTemplate('pages', PagesPreview);
    CMS.registerPreviewStyle('/admin/studio-widgets.css');
    init.registered = true;
  }

  global.SirayStudioWidgets = { init, helpers: { parsePosition, positionString, safeImageURL, getEntryData, photoValue } };
})(typeof window !== 'undefined' ? window : globalThis);
