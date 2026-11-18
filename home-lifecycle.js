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

  const mobileHero = window.matchMedia('(max-width: 809.98px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let portraitFrame = 0;
  let lastFlipDistance = -1;
  let lastPinnedOffset = -1;
  let lastFaceProgress = -1;

  function updatePortrait() {
    portraitFrame = 0;
    if (!mobileHero.matches) return;
    const hero = document.getElementById('hero-section');
    const heading = hero?.querySelector('h1');
    if (!heading) return;
    // Use the layout height so the visible 20% enlargement cannot change the scroll distance.
    const headingHeight = heading.offsetHeight;
    if (!headingHeight) return;
    const flipDistance = headingHeight;
    const pinnedOffset = Math.min(flipDistance, Math.max(0, -hero.getBoundingClientRect().top));
    const scrollProgress = pinnedOffset / flipDistance;
    const faceProgress = reducedMotion.matches ? Number(scrollProgress >= 0.5) : scrollProgress;
    const style = document.documentElement.style;

    // Store scroll state outside the Framer markup so hydration can replace it.
    if (flipDistance !== lastFlipDistance) {
      style.setProperty('--jarvis-mobile-hero-distance', `${flipDistance}px`);
      lastFlipDistance = flipDistance;
    }
    if (pinnedOffset !== lastPinnedOffset) {
      style.setProperty('--jarvis-mobile-hero-pin', `${pinnedOffset}px`);
      lastPinnedOffset = pinnedOffset;
    }
    if (faceProgress !== lastFaceProgress) {
      style.setProperty('--jarvis-mobile-portrait-progress', faceProgress);
      lastFaceProgress = faceProgress;
    }
  }

  function schedulePortrait() {
    if (mobileHero.matches && !portraitFrame) portraitFrame = requestAnimationFrame(updatePortrait);
  }

  window.addEventListener('scroll', schedulePortrait, {capture: true, passive: true});
  window.addEventListener('resize', schedulePortrait, {passive: true});
  window.addEventListener('pageshow', schedulePortrait);
  mobileHero.addEventListener('change', schedulePortrait);
  reducedMotion.addEventListener('change', schedulePortrait);
  window.JarvisHome.onReady(schedulePortrait);
  document.fonts?.ready.then(schedulePortrait);
  schedulePortrait();
})();
