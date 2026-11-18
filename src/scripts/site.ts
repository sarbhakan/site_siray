import { gsap } from 'gsap';

let cleanup = () => {};

function initialize() {
  cleanup();
  document.documentElement.classList.add('js');
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups: (() => void)[] = [];

  const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
  const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  if (menu && menuToggle) {
    menuToggle.addEventListener(
      'click',
      () => {
        menu.showModal();
        menuToggle.setAttribute('aria-expanded', 'true');
      },
      { signal },
    );
    menu
      .querySelector('[data-close-menu]')
      ?.addEventListener('click', () => menu.close(), { signal });
    menu.addEventListener(
      'close',
      () => menuToggle.setAttribute('aria-expanded', 'false'),
      { signal },
    );
    menu
      .querySelectorAll('a')
      .forEach((a) =>
        a.addEventListener('click', () => menu.close(), { signal }),
      );
    cleanups.push(() => {
      if (menu.open) menu.close();
    });
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
    let timer: ReturnType<typeof setTimeout> | undefined;
    let animation: gsap.core.Timeline | undefined;
    const canRun = () =>
      !pausedByUser && !reduced.matches && inView && !document.hidden;
    const schedule = () => {
      clearTimeout(timer);
      const scheduledGeneration = ++generation;
      hero.dataset.running = String(canRun());
      surface.disabled = reduced.matches;
      surface.setAttribute('aria-pressed', String(pausedByUser));
      surface.setAttribute(
        'aria-label',
        reduced.matches
          ? 'Photographies d’ambiance'
          : pausedByUser
            ? 'Reprendre le défilement des photographies'
            : 'Figer le défilement des photographies',
      );
      if (canRun())
        timer = setTimeout(() => {
          void change(scheduledGeneration);
        }, 6500);
    };
    const change = async (scheduledGeneration: number) => {
      const targetIndex = (current + 1) % slides.length;
      const target = slides[targetIndex];
      const img = target.querySelector('img');
      if (img) {
        img.loading = 'eager';
        await img.decode().catch(() => {});
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
          gsap.set(slides, { opacity: 0, visibility: 'hidden' });
          gsap.set(slides[current], { opacity: 1, visibility: 'visible' });
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
  const lightbox = document.querySelector<HTMLDialogElement>('.lightbox');
  if (gallery && lightbox) {
    const items = Array.from(
      gallery.querySelectorAll<HTMLElement>('[data-lightbox-index]'),
    );
    const figures = Array.from(
      gallery.querySelectorAll<HTMLElement>('.gallery-card'),
    );
    const filters = Array.from(
      gallery.querySelectorAll<HTMLButtonElement>('[data-filter]'),
    );
    const image = lightbox.querySelector<HTMLImageElement>('img')!;
    const caption = lightbox.querySelector<HTMLElement>('.lightbox-caption')!;
    let selected = items[0];
    let origin: HTMLElement | undefined;
    const visibleItems = () =>
      items.filter(
        (item) => !item.closest<HTMLElement>('.gallery-card')?.hidden,
      );
    const show = (item: HTMLElement) => {
      selected = item;
      image.src = item.dataset.image || '';
      image.alt = item.querySelector('img')?.alt || '';
      const visible = visibleItems();
      caption.textContent = `${item.dataset.caption} · ${visible.indexOf(item) + 1} / ${visible.length}`;
    };
    const move = (direction: number) => {
      const visible = visibleItems();
      show(
        visible[
          (visible.indexOf(selected) + direction + visible.length) %
            visible.length
        ],
      );
    };
    items.forEach((item) =>
      item.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          origin = item;
          show(item);
          lightbox.showModal();
        },
        { signal },
      ),
    );
    lightbox
      .querySelector('[data-lightbox-close]')
      ?.addEventListener('click', () => lightbox.close(), { signal });
    lightbox
      .querySelector('[data-lightbox-next]')
      ?.addEventListener('click', () => move(1), { signal });
    lightbox
      .querySelector('[data-lightbox-prev]')
      ?.addEventListener('click', () => move(-1), { signal });
    lightbox.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          move(1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          move(-1);
        }
      },
      { signal },
    );
    lightbox.addEventListener('close', () => origin?.focus(), { signal });
    let startX = 0;
    lightbox.addEventListener(
      'touchstart',
      (event) => {
        startX = event.changedTouches[0].screenX;
      },
      { signal, passive: true },
    );
    lightbox.addEventListener(
      'touchend',
      (event) => {
        const distance = event.changedTouches[0].screenX - startX;
        if (Math.abs(distance) > 70) move(distance < 0 ? 1 : -1);
      },
      { signal, passive: true },
    );
    const filter = (category: string) => {
      if (!filters.some((button) => button.dataset.filter === category))
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
    };
    filters.forEach((button) =>
      button.addEventListener(
        'click',
        () => {
          const category = button.dataset.filter || 'all';
          filter(category);
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
    cleanups.push(() => {
      if (lightbox.open) lightbox.close();
    });
  }

  cleanup = () => {
    controller.abort();
    cleanups.forEach((fn) => fn());
  };
}

document.addEventListener('astro:page-load', initialize);
document.addEventListener('astro:before-swap', () => cleanup());
