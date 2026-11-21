type AnimationEngine = typeof import('gsap')['gsap'];

let cleanup = () => {};

function initialize() {
  cleanup();
  document.documentElement.classList.add('js');
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups: (() => void)[] = [];

  const catalogMenu = document.querySelector<HTMLDetailsElement>(
    '[data-catalog-menu]',
  );
  if (catalogMenu) {
    document.addEventListener(
      'click',
      (event) => {
        if (!catalogMenu.contains(event.target as Node))
          catalogMenu.open = false;
      },
      { signal },
    );
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape' && catalogMenu.open) {
          catalogMenu.open = false;
          catalogMenu.querySelector('summary')?.focus();
        }
      },
      { signal },
    );
    catalogMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener(
        'click',
        () => {
          catalogMenu.open = false;
        },
        { signal },
      ),
    );
  }

  const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
  const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  if (menu && menuToggle) {
    let menuMotion: Animation | undefined;
    let closing = false;
    const stopMenuMotion = () => {
      const previous = menuMotion;
      menuMotion = undefined;
      previous?.cancel();
    };
    const closeMenu = () => {
      stopMenuMotion();
      closing = false;
      if (menu.open) menu.close();
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    const moveMenu = (
      from: string,
      to: string,
      duration: number,
      easing: string,
      complete = () => {},
    ) => {
      const animation = menu.animate(
        [{ transform: from }, { transform: to }],
        { duration, easing, fill: 'both' },
      );
      menuMotion = animation;
      void animation.finished.then(() => {
        // A close, resize or Astro navigation can supersede this animation.
        if (menuMotion !== animation) return;
        menuMotion = undefined;
        animation.cancel();
        complete();
      }, () => {});
    };
    const requestMenuClose = () => {
      if (!menu.open || closing) return;
      if (reduced.matches || typeof menu.animate !== 'function') {
        closeMenu();
        return;
      }
      // Start from the current position, even when opening is interrupted.
      const position = getComputedStyle(menu).transform;
      stopMenuMotion();
      closing = true;
      moveMenu(position, 'translateX(-100%)', 320,
        'cubic-bezier(0.4, 0, 0.7, 1)', closeMenu);
    };
    menuToggle.addEventListener(
      'click',
      () => {
        if (menu.open) return;
        stopMenuMotion();
        closing = false;
        menu.scrollTop = 0;
        menu.showModal();
        menuToggle.setAttribute('aria-expanded', 'true');
        if (!reduced.matches && typeof menu.animate === 'function') {
          moveMenu('translateX(-100%)', 'translateX(0)', 560,
            'cubic-bezier(0.32, 0, 0.2, 1)');
        }
      },
      { signal },
    );
    menu
      .querySelector('[data-close-menu]')
      ?.addEventListener('click', requestMenuClose, { signal });
    menu.addEventListener('cancel', (event) => {
      if (!event.cancelable) return;
      event.preventDefault();
      requestMenuClose();
    }, { signal });
    menu.addEventListener(
      'close',
      () => {
        // A queued close event must not affect a menu already reopened.
        if (menu.open) return;
        stopMenuMotion();
        closing = false;
        menuToggle.setAttribute('aria-expanded', 'false');
      },
      { signal },
    );
    menu
      .querySelectorAll('a')
      .forEach((a) =>
        a.addEventListener('click', closeMenu, { signal }),
      );
    const desktopMenu = window.matchMedia('(min-width: 960px)');
    desktopMenu.addEventListener('change', () => {
      if (desktopMenu.matches) closeMenu();
    }, { signal });
    reduced.addEventListener('change', () => {
      if (!reduced.matches) return;
      if (closing) closeMenu();
      else stopMenuMotion();
    }, { signal });
    cleanups.push(closeMenu);
  }

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const surface = hero?.querySelector<HTMLButtonElement>(
    '[data-slide-surface]',
  );
  if (hero && surface) {
    const slides = Array.from(
      hero.querySelectorAll<HTMLElement>('[data-slide]'),
    );
    let current = 0;
    let pausedByUser = false;
    let inView = true;
    let disposed = false;
    let generation = 0;
    let engine: AnimationEngine | undefined;
    let enginePromise: Promise<AnimationEngine | undefined> | undefined;
    let animationUnavailable = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let animation: ReturnType<AnimationEngine['timeline']> | undefined;
    const canRun = () =>
      !disposed && !animationUnavailable && !pausedByUser &&
      !reduced.matches && inView && !document.hidden;
    const loadEngine = () => {
      // Only the visible, animated hero needs GSAP. Keep one request in flight.
      enginePromise ??= import('gsap')
        .then(({ gsap }) => {
          if (!disposed) engine = gsap;
          return gsap;
        })
        .catch(() => {
          // A failed optional animation must leave a usable, static photograph.
          if (!disposed) {
            animationUnavailable = true;
            schedule();
          }
          return undefined;
        });
      return enginePromise;
    };
    const schedule = () => {
      if (disposed) return;
      clearTimeout(timer);
      const scheduledGeneration = ++generation;
      hero.dataset.running = String(canRun());
      surface.disabled = reduced.matches || animationUnavailable;
      surface.setAttribute('aria-pressed', String(pausedByUser));
      surface.setAttribute(
        'aria-label',
        surface.disabled
          ? 'Les créations en images'
          : pausedByUser
            ? 'Reprendre le défilement des photographies'
            : 'Figer le défilement des photographies',
      );
      if (canRun()) {
        void loadEngine();
        timer = setTimeout(() => {
          void change(scheduledGeneration);
        }, 6500);
      }
    };
    const change = async (scheduledGeneration: number) => {
      if (disposed || scheduledGeneration !== generation || !canRun()) return;
      const gsap = await loadEngine();
      if (!gsap || disposed || scheduledGeneration !== generation || !canRun()) return;
      const targetIndex = (current + 1) % slides.length;
      const target = slides[targetIndex];
      const img = target.querySelector('img');
      if (img) {
        img.loading = 'eager';
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          delete img.dataset.srcset;
        }
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        await img.decode().catch(() => {});
        // Keep the current photograph when the next one cannot be loaded.
        if (!img.complete || img.naturalWidth === 0) {
          if (!disposed && scheduledGeneration === generation && canRun()) schedule();
          return;
        }
      }
      if (disposed || scheduledGeneration !== generation || !canRun()) return;
      animation?.kill();
      const old = slides[current];
      slides.forEach((slide) => {
        slide.classList.remove('is-active');
        slide.setAttribute('aria-hidden', 'true');
      });
      gsap.set(slides, { opacity: 0, visibility: 'hidden' });
      gsap.set(old, { opacity: 1, visibility: 'visible' });
      gsap.set(target, { opacity: 0, visibility: 'visible' });
      target.classList.add('is-active');
      target.setAttribute('aria-hidden', 'false');
      animation = gsap
        .timeline()
        .to(target, { opacity: 1, duration: 0.85, ease: 'power3.out' }, 0)
        .to(old, { opacity: 0, duration: 0.85 }, 0)
        .set(old, { visibility: 'hidden' });
      current = targetIndex;
      schedule();
    };
    surface.addEventListener(
      'click',
      () => {
        pausedByUser = !pausedByUser;
        schedule();
      },
      { signal },
    );
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.2 },
    );
    observer.observe(surface);
    document.addEventListener('visibilitychange', schedule, { signal });
    reduced.addEventListener(
      'change',
      () => {
        if (reduced.matches) {
          animation?.kill();
          engine?.set(slides, { opacity: 0, visibility: 'hidden' });
          engine?.set(slides[current], { opacity: 1, visibility: 'visible' });
        }
        schedule();
      },
      { signal },
    );
    schedule();
    cleanups.push(() => {
      disposed = true;
      generation++;
      clearTimeout(timer);
      animation?.kill();
      observer.disconnect();
    });
  }

  const gallery = document.querySelector<HTMLElement>('[data-gallery]');
  if (gallery) {
    const figures = Array.from(
      gallery.querySelectorAll<HTMLElement>('.gallery-card'),
    );
    const filters = Array.from(
      gallery.querySelectorAll<HTMLButtonElement>('[data-filter]'),
    );
    const categories = new Set([
      'all',
      'layer-cakes',
      'bento-cakes',
      'mignardises',
      'cupcakes',
      'brunch-box',
      'buffets',
      'plateaux',
    ]);
    const categoryAliases: Record<string, string> = {
      cakes: 'layer-cakes',
      douceurs: 'mignardises',
      tables: 'buffets',
    };
    const filter = (category: string) => {
      category = categoryAliases[category] || category;
      if (
        !categories.has(category) ||
        !filters.some((button) => button.dataset.filter === category)
      )
        category = 'all';
      filters.forEach((button) =>
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.filter === category),
        ),
      );
      figures.forEach((figure) => {
        figure.hidden =
          category !== 'all' && figure.dataset.category !== category;
      });
      const count = figures.filter((figure) => !figure.hidden).length;
      const status = gallery.querySelector('.gallery-status');
      if (status)
        status.textContent = `${count} photographie${count > 1 ? 's' : ''}`;
      return category;
    };
    filters.forEach((button) =>
      button.addEventListener(
        'click',
        () => {
          const category = filter(button.dataset.filter || 'all');
          history.replaceState(
            null,
            '',
            category === 'all' ? location.pathname : `#${category}`,
          );
        },
        { signal },
      ),
    );
    filter(location.hash.slice(1) || 'all');
    window.addEventListener(
      'hashchange',
      () => filter(location.hash.slice(1) || 'all'),
      { signal },
    );
  }

  cleanup = () => {
    controller.abort();
    cleanups.forEach((fn) => fn());
  };
}

document.addEventListener('astro:page-load', initialize);
document.addEventListener('astro:before-swap', () => cleanup());
