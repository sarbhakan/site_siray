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
  if (hero) {
    const slides = Array.from(
      hero.querySelectorAll<HTMLElement>('[data-slide]'),
    );
    const toggle = hero.querySelector<HTMLButtonElement>('[data-slide-toggle]');
    let current = 0;
    let playing = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    let animation: gsap.core.Timeline | undefined;
    const change = (next: number) => {
      const old = slides[current];
      const target = slides[(next + slides.length) % slides.length];
      if (old === target) return;
      animation?.kill();
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
        .to(
          target,
          {
            opacity: 1,
            duration: reduced.matches ? 0 : 0.6,
            ease: 'power2.out',
          },
          0,
        )
        .to(old, { opacity: 0, duration: reduced.matches ? 0 : 0.6 }, 0)
        .set(old, { visibility: 'hidden' });
      current = slides.indexOf(target);
      const count = hero.querySelector('[data-slide-count]');
      const label = hero.querySelector('[data-slide-label]');
      if (count)
        count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (label) label.textContent = target.dataset.label || '';
    };
    const pause = () => {
      playing = false;
      clearInterval(timer);
      toggle?.setAttribute('aria-label', 'Lancer le diaporama');
      toggle?.setAttribute('aria-pressed', 'false');
      toggle?.querySelector('[data-pause]')?.setAttribute('hidden', '');
      toggle?.querySelector('[data-play]')?.removeAttribute('hidden');
    };
    const play = () => {
      if (reduced.matches) return;
      playing = true;
      toggle?.setAttribute('aria-label', 'Mettre le diaporama en pause');
      toggle?.setAttribute('aria-pressed', 'true');
      toggle?.querySelector('[data-play]')?.setAttribute('hidden', '');
      toggle?.querySelector('[data-pause]')?.removeAttribute('hidden');
      clearInterval(timer);
      timer = setInterval(() => {
        if (!document.hidden) change(current + 1);
      }, 5500);
    };
    hero.querySelector('[data-slide-next]')?.addEventListener(
      'click',
      () => {
        pause();
        change(current + 1);
      },
      { signal },
    );
    hero.querySelector('[data-slide-prev]')?.addEventListener(
      'click',
      () => {
        pause();
        change(current - 1);
      },
      { signal },
    );
    toggle?.addEventListener('click', () => (playing ? pause() : play()), {
      signal,
    });
    const motionChange = () => {
      if (reduced.matches) {
        pause();
        toggle?.setAttribute('hidden', '');
      } else toggle?.removeAttribute('hidden');
    };
    reduced.addEventListener('change', motionChange, { signal });
    motionChange();
    hero.addEventListener(
      'focusin',
      (event) => {
        if (playing && !toggle?.contains(event.target as Node)) pause();
      },
      { signal },
    );
    cleanups.push(() => {
      clearInterval(timer);
      animation?.kill();
    });
  }

  const preview = document.querySelector<HTMLImageElement>(
    '.collection-preview img',
  );
  if (preview) {
    document.querySelectorAll<HTMLElement>('[data-preview]').forEach((row) => {
      const update = () => {
        if (preview.getAttribute('src') === row.dataset.preview) return;
        preview.removeAttribute('srcset');
        preview.src = row.dataset.preview || '';
        preview.alt = row.dataset.previewAlt || '';
      };
      row.addEventListener('mouseenter', update, { signal });
      row.addEventListener('focus', update, { signal });
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
