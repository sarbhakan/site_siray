(() => {
  'use strict';
  const summary = document.getElementById('publication-summary');
  const panel = document.getElementById('publication-panel');
  const compact = {checking:'Vérification…',pending:'Mise en ligne en cours',published:'Site à jour',failed:'Publication bloquée',delayed:'Publication à vérifier',offline:'Hors connexion',unknown:'Vérifier la publication'};
  window.addEventListener('siray:publication', ({ detail }) => {
    summary.textContent = compact[detail.status] || 'Publication';
    if (['failed', 'delayed'].includes(detail.status)) panel.open = true;
  });
  window.addEventListener('siray:publication-ready', () => { panel.open = true; });
  try {
    if (!window.CMS || !window.SirayStudioWidgets) throw new Error('Chargement incomplet');
    window.SirayStudioWidgets.init(window.CMS);
    window.SirayContentValidation.init(window.CMS);
    window.SirayPublication.init(window.CMS);
    document.getElementById('admin-loading')?.remove();
    window.CMS.init();
  } catch {
    const loading = document.getElementById('admin-loading') || document.createElement('main');
    loading.id = 'admin-loading';
    loading.replaceChildren();
    const message = document.createElement('p');
    message.textContent = 'L’éditeur n’a pas pu se charger. Vérifiez votre connexion, puis rechargez cette page.';
    const reload = document.createElement('button');
    reload.textContent = 'Réessayer';reload.type='button';reload.addEventListener('click', () => location.reload());
    loading.append(message,reload);document.getElementById('nc-root').append(loading);
  }
})();
