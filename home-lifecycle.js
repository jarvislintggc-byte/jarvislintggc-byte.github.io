(() => {
  'use strict';
  const callbacks = new Set();
  let ready = false, main, experience, pending = false;
  function refresh() {
    pending = false;
    if (!ready) return;
    experience = document.querySelector('#experience');
    for (const callback of callbacks) callback();
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(refresh); } }
  window.JarvisHome = {get ready() { return ready; }, onReady(callback) { callbacks.add(callback); if (ready) schedule(); }};
  document.addEventListener('jarvis:home-ready', () => {
    ready = true; main = document.querySelector('#main'); refresh();
    // Only remount after Framer replaces a section at a responsive breakpoint.
    new MutationObserver(() => { if (!experience?.isConnected) schedule(); }).observe(main, {subtree: true, childList: true});
  }, {once: true});
  window.addEventListener('resize', schedule, {passive: true});
})();
