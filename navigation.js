window.initJarvisNavigation = () => {
  'use strict';
  const triggers = [...document.querySelectorAll('#menu-trigger,#game-menu-trigger')];
  let trigger = triggers[0];
  const menu = document.querySelector('#site-menu');
  const closeButton = document.querySelector('#menu-close');
  const links = [...menu.querySelectorAll('.menu-list a')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let closeTimer;

  function updateCurrent() {
    const current = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
    links.forEach(link => {
      const path = link.pathname.replace(/\/+$/, '') || '/';
      const active = path === current;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  function openMenu(event) {
    trigger=event?.currentTarget||trigger;
    if (menu.open) return;
    clearTimeout(closeTimer);
    closing = false;
    updateCurrent();
    menu.classList.remove('is-open', 'is-closing');
    menu.showModal();
    menu.scrollTop = 0;
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('modal-open');
    // Establish the off-screen state before animating the top-layer dialog in.
    void menu.offsetHeight;
    requestAnimationFrame(() => { if (menu.open && !closing) menu.classList.add('is-open'); });
  }
  function closeMenu() {
    if (!menu.open || closing) return;
    closing = true;
    menu.classList.add('is-closing');
    menu.classList.remove('is-open');
    // The timeout also handles interrupted transitions and hidden browser tabs.
    closeTimer = setTimeout(() => { if (menu.open) menu.close(); }, reducedMotion.matches ? 0 : 680);
  }
  triggers.forEach(button=>button.addEventListener('click',openMenu));
  closeButton.addEventListener('click', () => closeMenu());
  menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    // Keep keyboard navigation in the panel, including at both ends of the list.
    const focusable = [...menu.querySelectorAll('a[href],button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  menu.addEventListener('transitionend', event => {
    if (event.target === menu && event.propertyName === 'transform' && closing && menu.open) menu.close();
  });
  // Links, including language choices, navigate natively without waiting for a close animation.
  menu.addEventListener('close', () => {
    clearTimeout(closeTimer);
    closing = false;
    menu.classList.remove('is-open', 'is-closing');
    trigger.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    trigger.focus({ preventScroll: true });
  });
};
