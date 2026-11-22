/* Shared photo-library rules for the form, unsaved previews and preSave.
 * Values remain local until the CMS saves the whole photography document.
 */
(function installPhotoGallery(global) {
  'use strict';
  const categories = Object.freeze(['layer-cakes', 'bento-cakes', 'mignardises', 'cupcakes', 'brunch-box', 'buffets', 'plateaux']);
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const valid = photo => object(photo) && text(photo.file) && text(photo.alt) && text(photo.label) && categories.includes(photo.category);
  const snapshot = photo => Object.fromEntries(['file', 'alt', 'label', 'category', 'position', 'zoom']
    .filter(key => photo[key] !== undefined).map(key => [key, photo[key]]));
  const placements = data => [
    ...(Array.isArray(data?.homeSlides) ? data.homeSlides : []),
    ...(object(data?.homePhotos) ? Object.values(data.homePhotos) : []),
    ...(Array.isArray(data?.collections) ? data.collections.flatMap(item => object(item)
      ? ['cover', 'detail', 'request', 'home'].map(key => item[key]) : []) : []),
  ].filter(object);

  // The recycle bin changes gallery visibility only. Keep the source file,
  // captions, crop and placement references so a restore never needs a reupload.
  function setTrashed(gallery, identifier, trashed) {
    if (!Array.isArray(gallery)) return gallery;
    const file = Number.isInteger(identifier) ? gallery[identifier]?.file : identifier;
    if (!text(file)) return gallery;
    return gallery.map(photo => {
      if (!object(photo) || photo.file !== file) return photo;
      if (trashed) return photo.trashed === true ? photo : { ...photo, trashed: true };
      if (!('trashed' in photo)) return photo;
      const restored = { ...photo };
      delete restored.trashed;
      return restored;
    });
  }
  const trash = (gallery, identifier) => setTrashed(gallery, identifier, true);
  const restore = (gallery, identifier) => setTrashed(gallery, identifier, false);

  function usages(data, file) {
    if (!text(file)) return [];
    const found = [];
    const add = (photo, label) => { if (photo?.file === file) found.push(label); };
    (Array.isArray(data?.homeSlides) ? data.homeSlides : []).forEach((photo, index) =>
      add(photo, `Diaporama de l’accueil — photo ${index + 1}`));
    const homeLabels = {
      maison: 'Accueil — présentation de la maison', cakes: 'Accueil — les gâteaux',
      tables: 'Accueil — les tables à partager', petitesDouceurs: 'Accueil — les petites douceurs',
      maisonCake: 'La maison — photographie de gâteau', maisonTable: 'La maison — photographie de table',
    };
    Object.entries(object(data?.homePhotos) ? data.homePhotos : {}).forEach(([key, photo]) =>
      add(photo, typeof homeLabels[key] === 'string' ? homeLabels[key] : `Accueil et maison — ${key}`));
    const collectionLabels = {
      'layer-cakes': 'Layer cakes', 'bento-cakes': 'Bento cakes', mignardises: 'Mignardises',
      cupcakes: 'Cupcakes', 'brunch-box': 'Brunch box', buffets: 'Buffets', plateaux: 'Plateaux',
    };
    const placementLabels = {
      cover: 'grande photo', detail: 'petite photo', request: 'carte « À découvrir aussi »', home: 'carte sur l’accueil',
    };
    (Array.isArray(data?.collections) ? data.collections : []).forEach((collection, index) => {
      if (!object(collection)) return;
      const family = typeof collectionLabels[collection.slug] === 'string' ? collectionLabels[collection.slug] : `Prestation ${index + 1}`;
      Object.entries(placementLabels).forEach(([key, label]) => add(collection[key], `${family} — ${label}`));
    });
    return [...new Set(found)];
  }

  function find(data, file) {
    if (!text(file)) return undefined;
    const photos = [...(Array.isArray(data?.gallery) ? data.gallery : []), ...placements(data)];
    return photos.flatMap(photo => [photo, ...(Array.isArray(photo?._galleryArchive) ? photo._galleryArchive : [])])
      .find(photo => valid(photo) && photo.file === file);
  }

  // Preserve all preceding choices, including files uploaded and replaced again
  // before the first save. Keeping their blob references in the field also lets
  // Sveltia upload them atomically with the document instead of discarding them.
  function archiveReplacement(current, next, data) {
    const previous = object(current) ? current : {};
    const history = Array.isArray(previous._galleryArchive) ? previous._galleryArchive.slice() : [];
    const original = valid(previous) ? previous : find(data, previous.file);
    if (original && previous.file !== next.file) history.push(snapshot({ ...original, ...previous,
      label: text(previous.label) ? previous.label : original.label,
      category: categories.includes(previous.category) ? previous.category : original.category,
      alt: text(previous.alt) ? previous.alt : original.alt }));
    const seen = new Set();
    const archive = history.filter(photo => {
      if (!valid(photo) || seen.has(photo.file) || photo.file === next.file) return false;
      seen.add(photo.file); return true;
    }).map(snapshot);
    return { ...next, _galleryArchive: archive.length ? archive : undefined };
  }

  function prepare(data) {
    if (!object(data) || !Array.isArray(data.gallery)) return data;
    const result = { ...data };
    const gallery = [], known = new Set(), pending = [];
    const add = (photo, existing = false) => {
      if (known.has(photo.file)) {
        // A duplicate must not make a deliberately hidden file reappear. The
        // first row still owns its caption, crop and position in the gallery.
        if (existing && photo.trashed === true) {
          const index = gallery.findIndex(item => item?.file === photo.file);
          if (index !== -1 && gallery[index]?.trashed !== true) gallery[index] = { ...gallery[index], trashed: true };
        }
        return;
      }
      known.add(photo.file); gallery.push(existing ? photo : snapshot(photo));
    };
    const copy = (photo, galleryEntry = false) => {
      if (!object(photo)) return photo;
      const next = { ...photo };
      // Reusing a file from the recycle bin on a page does not hide that page
      // image. The flag belongs to its gallery record, never its placements.
      if (!galleryEntry) delete next.trashed;
      if (next._galleryArchive !== undefined) {
        if (!Array.isArray(next._galleryArchive) || next._galleryArchive.some(item => !valid(item))) {
          throw new Error('Une photo conservée pour la galerie est incomplète. Gardez cette page ouverte et prévenez Hakan.');
        }
        pending.push(...next._galleryArchive.map(snapshot));
        delete next._galleryArchive;
      }
      return next;
    };
    // Existing gallery order, names and crop settings take precedence over a
    // reused photograph's placement-specific crop. Only exact file duplicates
    // are coalesced; no name or approximate image matching is used.
    for (const photo of data.gallery) {
      const next = copy(photo, true);
      if (object(next) && next.trashed !== undefined && typeof next.trashed !== 'boolean') {
        throw new Error('Dans « Galerie », l’état de la corbeille doit être un booléen. Remettez cette photo dans la galerie ou dans la corbeille avant d’enregistrer.');
      }
      if (!valid(next)) {
        // Keep the existing validation contract and its actionable field errors.
        gallery.push(next);
        if (text(next?.file)) known.add(next.file);
      } else add(next, true);
    }
    if (Array.isArray(data.homeSlides)) result.homeSlides = data.homeSlides.map(photo => copy(photo));
    if (object(data.homePhotos)) result.homePhotos = Object.fromEntries(Object.entries(data.homePhotos).map(([key, photo]) => [key, copy(photo)]));
    if (Array.isArray(data.collections)) result.collections = data.collections.map(item => {
      if (!object(item)) return item;
      return { ...item, ...Object.fromEntries(['cover', 'detail', 'request', 'home'].filter(key => key in item).map(key => [key, copy(item[key])])) };
    });
    pending.push(...placements(result));
    for (const photo of pending) {
      if (known.has(photo.file)) continue;
      if (!valid(photo)) {
        // Historical illustrations in /images stay outside the client gallery.
        // All new CMS uploads and named photos must be classified before save.
        if (/^(?:blob:|\/src\/assets\/uploads\/)/.test(String(photo.file || '')) || photo.label !== undefined || photo.category !== undefined) {
          throw new Error('Pour conserver cette photo dans la galerie, renseignez son nom, sa catégorie et sa description avant d’enregistrer.');
        }
        continue;
      }
      add(photo);
    }
    result.gallery = gallery;
    return result;
  }

  global.SirayPhotoGallery = Object.freeze({ categories, valid, snapshot, placements, find, archiveReplacement, trash, restore, usages, prepare });
})(typeof window !== 'undefined' ? window : globalThis);
