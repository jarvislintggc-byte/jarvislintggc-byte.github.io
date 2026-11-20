(() => {
  'use strict';

  const archive = document.querySelector('.learning-notes-archive');
  if (!archive) return;

  const grid = archive.querySelector('.notes-grid');
  const covers = [...grid.querySelectorAll('.card-cover')];
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const view = document.createElement('span');
  view.className = 'note-hover-view';
  view.textContent = 'VIEW';
  view.setAttribute('aria-hidden', 'true');
  let observer;

  grid.addEventListener('pointermove', event => {
    if (!hoverPointer.matches || event.pointerType !== 'mouse') return;
    const cover = event.target.closest('.work-note')?.querySelector('.card-cover');
    const bounds = cover?.getBoundingClientRect();
    if (!bounds || event.clientX < bounds.left || event.clientX >= bounds.right ||
      event.clientY < bounds.top || event.clientY >= bounds.bottom) {
      view.remove();
      return;
    }

    if (view.parentElement !== cover) cover.append(view);
    const x = Math.max(4, Math.min(event.clientX - bounds.left + 12, bounds.width - view.offsetWidth - 4));
    const y = Math.max(4, Math.min(event.clientY - bounds.top - view.offsetHeight / 2, bounds.height - view.offsetHeight - 4));
    view.style.translate = `${x}px ${y}px`;
  });

  grid.addEventListener('pointerleave', () => view.remove());
  window.addEventListener('scroll', () => view.remove(), {passive: true});

  function observeCovers() {
    observer?.disconnect();
    if (!motion.matches || !('IntersectionObserver' in window)) return;

    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!grid.classList.contains('is-switching')) {
          entry.target.closest('.work-note').classList.add('is-revealing');
        }
        observer.unobserve(entry.target);
      }
    }, {threshold: .12});

    for (const cover of covers) observer.observe(cover);
  }

  motion.addEventListener('change', observeCovers);
  observeCovers();
})();
