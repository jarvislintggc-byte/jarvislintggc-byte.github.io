(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('site-locale-data').textContent);
  const locales = Object.keys(data.prefixes);
  const root = document.documentElement;
  const canonical = path => path.replace(/^\/(?:zh|ja)(?=\/)/, '').replace(/index\.html$/, '');
  const pathFor = (locale, path = location.pathname) => data.prefixes[locale] + canonical(path);
  const save = locale => { try { localStorage.setItem('jarvis-site-language', locale); localStorage.setItem('jarvis-journey-language', locale); } catch {} };
  const originalTexts = [];
  // Only the intro and navigation update in place. The running game owns its DOM.
  for (const container of document.querySelectorAll('#intro,#site-menu,.skip')) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('.site-language,script,style')) continue;
      const shown = node.textContent.trim();
      const original = Object.entries(data.text[data.locale] || {}).find(([, value]) => value === shown)?.[0] || shown;
      originalTexts.push({node, original, leading: node.textContent.match(/^\s*/)[0], trailing: node.textContent.match(/\s*$/)[0]});
    }
  }
  const originalLabels = [...document.querySelectorAll('#intro [aria-label],#site-menu [aria-label]')].map(node => {
    const shown = node.getAttribute('aria-label');
    return {node, original: Object.entries(data.text[data.locale] || {}).find(([, value]) => value === shown)?.[0] || shown};
  });
  function applyHome(locale, notify = true, replaceURL = true) {
    if (!locales.includes(locale)) return;
    const dictionary = data.text[locale] || {};
    for (const item of originalTexts) item.node.textContent = item.leading + (dictionary[item.original] || item.original) + item.trailing;
    for (const item of originalLabels) item.node.setAttribute('aria-label', dictionary[item.original] || item.original);
    root.lang = locale;
    data.locale = locale;
    document.title = `${data.pageNames[locale][0]} — Jarvis Lin`;
    document.querySelector('meta[name=description]').content = {en:'Jarvis Lin: entrepreneurship, supply chain experience, and cross-border business.','zh-Hant':'Jarvis Lin 的創業、供應鏈實務與跨境商業經歷。',ja:'Jarvis Lin の起業、サプライチェーン、国境を越えたビジネスの経験。'}[locale];
    for (const nav of document.querySelectorAll('.site-language')) {
      nav.setAttribute('aria-label', data.names[locale]);
      for (const a of nav.querySelectorAll('[data-site-language]')) {
        if (a.dataset.siteLanguage === locale) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      }
    }
    for (const a of document.querySelectorAll('a[href]')) {
      if (a.hasAttribute('data-site-language')) continue;
      const url = new URL(a.href);
      if (url.origin === location.origin && /^\/(?:zh\/|ja\/)?(?:(?:my-story|experience|what-i-bring|connect)\/)?$/.test(url.pathname)) a.href = pathFor(locale, url.pathname) + url.search + url.hash;
    }
    save(locale);
    if (replaceURL) history.replaceState(history.state, '', pathFor(locale) + location.search + location.hash);
    if (notify) document.dispatchEvent(new CustomEvent('sitelanguage', {detail: {language: locale}}));
  }
  save(data.locale);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-site-language]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const locale = link.dataset.siteLanguage;
    if (!locales.includes(locale)) return;
    save(locale);
    if (data.slug === '') {
      event.preventDefault();
      applyHome(locale);
      return;
    }
    const url = new URL(link.href);
    const activeFilter = document.querySelector('[data-filter][aria-pressed="true"]')?.dataset.filter;
    if (activeFilter && activeFilter !== 'all') url.searchParams.set('category', activeFilter);
    const note = document.querySelector('#note-dialog[open]')?.dataset.note;
    if (note) url.searchParams.set('note', note);
    const place = document.querySelector('[data-place][aria-selected="true"]')?.dataset.place;
    if (place) url.searchParams.set('place', place);
    link.href = url.href;
  });
  document.addEventListener('journeylanguage', event => {
    if (data.slug === '' && event.detail?.language !== data.locale) applyHome(event.detail.language, false);
  });
  window.addEventListener('popstate', () => {
    if (data.slug === '') applyHome(location.pathname.startsWith('/ja/') ? 'ja' : location.pathname.startsWith('/zh/') ? 'zh-Hant' : 'en', true, false);
  });
})();
