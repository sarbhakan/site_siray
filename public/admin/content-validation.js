/* Catalogue checks before a CMS save. The build repeats these checks in src/data/site.ts.
 * No content is changed here; rejecting a preSave hook stops Sveltia before the commit.
 */
(() => {
  'use strict';

  const registered = new WeakSet();
  const object = (entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry);

  function validateExtraSections(value, collectionName = 'prestation') {
    const invalid = (field) => {
      throw new Error(`Dans « ${collectionName} », vérifiez ${field}. Corrigez cette rubrique avant d’enregistrer.`);
    };
    const text = (entry, field, maximum) => {
      if (typeof entry !== 'string' || !entry.trim() || entry.length > maximum) invalid(field);
      return entry.trim();
    };
    const safeHref = (entry) => {
      const help = 'la destination du bouton : une page commençant par / ou une adresse https://, sans identifiants ni caractères de contrôle';
      if (typeof entry === 'string' && /[\u0000-\u001f\u007f-\u009f]/u.test(entry)) invalid(help);
      const href = text(entry, help, 2048);
      if (/[\u0000-\u0020\u007f-\u009f\\]/u.test(href)) invalid(help);
      let decoded;
      try { decoded = decodeURIComponent(href); } catch { return invalid(help); }
      if (/[\u0000-\u001f\u007f-\u009f\\]/u.test(decoded)) invalid(help);
      const internal = href.startsWith('/') && !href.startsWith('//');
      if (!internal && !/^https:\/\//iu.test(href)) invalid(help);
      let url;
      try { url = new URL(href, 'https://siraysignature.fr'); } catch { return invalid(help); }
      if (url.protocol !== 'https:' || url.username || url.password) invalid(help);
      if (internal && url.origin !== 'https://siraysignature.fr') invalid(help);
      return internal ? href : url.href;
    };
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value) || value.length > 12) invalid('le nombre de rubriques supplémentaires : 12 au maximum');
    return value.map((entry, index) => {
      const location = `de la rubrique supplémentaire ${index + 1}`;
      if (!object(entry)) return invalid(`le contenu ${location}`);
      const section = {
        title: text(entry.title, `le titre ${location} : de 1 à 120 caractères`, 120),
        text: text(entry.text, `le texte ${location} : de 1 à 4 000 caractères`, 4000),
      };
      if (entry.items !== undefined && entry.items !== null) {
        if (!Array.isArray(entry.items) || entry.items.length > 12) invalid(`la liste ${location} : 12 éléments au maximum`);
        section.items = entry.items.map((item) => text(item, `chaque élément ${location} : de 1 à 300 caractères`, 300));
      }
      if (entry.button !== undefined && entry.button !== null) {
        if (!object(entry.button)) return invalid(`le bouton ${location}`);
        const { label, href } = entry.button;
        const blank = (part) => part === undefined || part === null || (typeof part === 'string' && !part.trim());
        if (typeof href === 'string' && /[\u0000-\u001f\u007f-\u009f]/u.test(href)) invalid(`la destination du bouton ${location}`);
        if (!blank(label) || !blank(href)) {
          section.button = {
            label: text(label, `le texte du bouton ${location} : renseignez le texte et la destination ensemble, 80 caractères au maximum`, 80),
            href: safeHref(href),
          };
        }
      }
      return section;
    });
  }

  function validateCatalogue(data) {
    if (!object(data) || !Array.isArray(data.collections)) {
      throw new Error('Le catalogue n’a pas pu être vérifié. Gardez cette page ouverte et prévenez Hakan.');
    }
    for (const [index, collection] of data.collections.entries()) {
      if (!object(collection)) throw new Error(`La prestation ${index + 1} n’a pas pu être vérifiée.`);
      validateExtraSections(collection.extraSections, typeof collection.name === 'string' ? collection.name : `prestation ${index + 1}`);
    }
  }

  const entryValue = (entry, name) => typeof entry?.get === 'function' ? entry.get(name) : entry?.[name];

  function init(CMS) {
    if (typeof CMS?.registerEventListener !== 'function') throw new Error('La vérification du catalogue nécessite Sveltia CMS.');
    if (registered.has(CMS)) return;
    CMS.registerEventListener({
      name: 'preSave',
      handler: ({ entry } = {}) => {
        const path = entryValue(entry, 'path');
        if (entryValue(entry, 'collection') !== 'catalogue' && path !== 'src/content/catalog.json' && path !== '/src/content/catalog.json') return;
        const data = entryValue(entry, 'data');
        validateCatalogue(typeof data?.toJS === 'function' ? data.toJS() : data);
        // Return nothing: valid content is saved exactly as entered, with no reformatting here.
      },
    });
    registered.add(CMS);
  }

  window.SirayContentValidation = Object.freeze({ init, validateCatalogue, validateExtraSections });
})();
