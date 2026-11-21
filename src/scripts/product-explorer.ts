let disposeProductExplorer = () => {};

function initializeProductExplorer() {
  disposeProductExplorer();
  const controller = new AbortController();
  const { signal } = controller;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0;

  const cancelScroll = () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  };

  // Follow a deliberate choice, leaving its controls above the newly visible text.
  // Native scrolling stays untouched outside this short, interruptible movement.
  const revealSelection = (controls: HTMLElement) => {
    cancelScroll();
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      if (!controls.isConnected || !controls.getClientRects().length) return;

      const header = document.querySelector<HTMLElement>('.site-header');
      const offset = (header?.getBoundingClientRect().height || 0) + 16;
      const start = window.scrollY;
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.min(maximum, Math.max(0, start + controls.getBoundingClientRect().top - offset));
      const distance = target - start;
      if (Math.abs(distance) < 4) return;
      if (reducedMotion.matches) {
        window.scrollTo({ top: target, behavior: 'instant' });
        return;
      }

      const started = performance.now();
      const duration = 440;
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        // "instant" prevents the page's CSS smooth scrolling from stacking
        // another animation behind each frame of this controlled transition.
        window.scrollTo({ top: start + distance * eased, behavior: 'instant' });
        scrollFrame = progress < 1 ? window.requestAnimationFrame(step) : 0;
      };
      scrollFrame = window.requestAnimationFrame(step);
    });
  };

  window.addEventListener('wheel', cancelScroll, { passive: true, signal });
  window.addEventListener('touchstart', cancelScroll, { passive: true, signal });
  window.addEventListener('pointerdown', cancelScroll, { passive: true, signal });
  window.addEventListener('keydown', cancelScroll, { signal });
  window.addEventListener('resize', cancelScroll, { signal });
  reducedMotion.addEventListener('change', cancelScroll, { signal });

  const enhanceTabs = (
    root: HTMLElement,
    listSelector: string,
    tabSelector: string,
    panelSelector: string,
    targetData: string,
  ) => {
    const list = root.querySelector<HTMLElement>(listSelector);
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(tabSelector));
    const panels = Array.from(root.querySelectorAll<HTMLElement>(panelSelector));
    if (!list || !tabs.length || tabs.length !== panels.length) return;
    const panelFor = (tab: HTMLButtonElement) => panels.find((panel) => panel.id === tab.dataset[targetData]);
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
      tab.addEventListener('click', () => {
        activate(tab);
        revealSelection(list);
      }, { signal });
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
    const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
    activate(initial || selected || tabs[0]);
    root.classList.add('is-ready');
    list.hidden = false;
  };

  document.querySelectorAll<HTMLElement>('[data-v5-tabset]').forEach((root) => {
    enhanceTabs(root, '[data-v5-tablist]', '[data-v5-tab]', '[data-v5-panel]', 'v5Tab');
  });
  document.querySelectorAll<HTMLElement>('[data-v6-flavors]').forEach((root) => {
    enhanceTabs(root, '[data-v6-flavor-controls]', '[data-v6-flavor-choice]', '[data-v6-flavor-panel]', 'v6FlavorChoice');
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
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      showBox(index, true);
      revealSelection(controls);
    }, { signal }));
    select.addEventListener('change', () => {
      showBox(select.selectedIndex, true);
      revealSelection(controls);
    }, { signal });
    showBox(select.selectedIndex);
    root.classList.add('is-ready');
    controls.hidden = false;
  });

  disposeProductExplorer = () => {
    cancelScroll();
    controller.abort();
  };
}

initializeProductExplorer();
document.addEventListener('astro:page-load', initializeProductExplorer);
document.addEventListener('astro:before-swap', () => disposeProductExplorer());
