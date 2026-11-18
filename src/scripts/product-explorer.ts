let disposeProductExplorer = () => {};

function initializeProductExplorer() {
  disposeProductExplorer();
  const controller = new AbortController();
  const { signal } = controller;

  document.querySelectorAll<HTMLElement>('[data-v5-tabset]').forEach((root) => {
    const list = root.querySelector<HTMLElement>('[data-v5-tablist]');
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-v5-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-v5-panel]'));
    if (!list || !tabs.length || tabs.length !== panels.length) return;
    const panelFor = (tab: HTMLButtonElement) => panels.find((panel) => panel.id === tab.dataset.v5Tab);
    if (tabs.some((tab) => !panelFor(tab))) return;

    list.setAttribute('role', 'tablist');
    tabs.forEach((tab) => {
      const panel = panelFor(tab)!;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    });

    const activate = (active: HTMLButtonElement, moveFocus = false) => {
      tabs.forEach((tab) => {
        const selected = tab === active;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panelFor(tab)!.hidden = !selected;
      });
      if (moveFocus) active.focus({ preventScroll: true });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab), { signal });
      tab.addEventListener('keydown', (event) => {
        let next: number | undefined;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          activate(tabs[next], true);
        }
      }, { signal });
    });

    const hashTarget = document.getElementById(location.hash.slice(1));
    const initial = hashTarget && tabs.find((tab) => {
      const panel = panelFor(tab)!;
      return panel === hashTarget || panel.contains(hashTarget);
    });
    activate(initial || tabs[0]);
    root.classList.add('is-ready');
    list.hidden = false;
  });

  document.querySelectorAll<HTMLElement>('[data-v5-brunch]').forEach((root) => {
    const controls = root.querySelector<HTMLElement>('[data-v5-brunch-controls]');
    const select = root.querySelector<HTMLSelectElement>('[data-v5-brunch-select]');
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-v5-box-choice]'));
    const boxes = Array.from(root.querySelectorAll<HTMLElement>('[data-v5-box]'));
    const status = root.querySelector<HTMLElement>('[data-v5-brunch-status]');
    if (!controls || !select || !boxes.length || buttons.length !== boxes.length) return;
    const showBox = (index: number, announce = false) => {
      if (index < 0 || index >= boxes.length) return;
      boxes.forEach((box, position) => { box.hidden = position !== index; });
      buttons.forEach((button, position) => {
        button.setAttribute('aria-pressed', String(position === index));
        button.setAttribute('aria-controls', 'brunch-details');
      });
      select.value = String(index);
      if (announce && status) status.textContent = `Composition ${select.options[index].text} affichée.`;
    };
    buttons.forEach((button, index) => button.addEventListener('click', () => showBox(index, true), { signal }));
    select.addEventListener('change', () => showBox(select.selectedIndex, true), { signal });
    showBox(0);
    root.classList.add('is-ready');
    controls.hidden = false;
  });

  disposeProductExplorer = () => controller.abort();
}

initializeProductExplorer();
document.addEventListener('astro:page-load', initializeProductExplorer);
document.addEventListener('astro:before-swap', () => disposeProductExplorer());
