(() => {
  'use strict';
  const callbacks = new Set();
  let ready = false, pending = false;
  function refresh() {
    pending = false;
    if (!ready) return;
    for (const callback of callbacks) callback();
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(refresh); } }
  window.JarvisHome = {get ready() { return ready; }, onReady(callback) { callbacks.add(callback); if (ready) schedule(); }};
  document.addEventListener('jarvis:home-ready', () => {
    ready = true; refresh();
  }, {once: true});
  window.addEventListener('resize', schedule, {passive: true});
  if (document.documentElement.dataset.jarvisHomeReady === 'true') { ready = true; schedule(); }
})();
