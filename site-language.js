(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('site-locale-data').textContent);
  if (data.slug === '' && location.hash === '#journey-game') {
    location.replace(data.prefixes[data.locale] + '/my-story/#journey-game');
    return;
  }
  const locales = Object.keys(data.prefixes);
  const root = document.documentElement;
  const canonical = path => path.replace(/^\/(?:zh|ja)(?=\/)/, '').replace(/index\.html$/, '');
  const pathFor = (locale, path = location.pathname) => data.prefixes[locale] + canonical(path);
  const save = locale => { try { localStorage.setItem('jarvis-site-language', locale); localStorage.setItem('jarvis-journey-language', locale); } catch {} };
  const originalTexts = [];
  // Only the intro and navigation update in place. The running game owns its DOM.
  for (const container of document.querySelectorAll('#intro,#journey,.home-main,.page-header,.page-footer,#site-menu,.skip')) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('.site-language,.life-journey,script,style')) continue;
      if (originalTexts.some(item => item.node === node)) continue;
      const shown = node.textContent.trim();
      const original = Object.entries(data.text[data.locale] || {}).find(([, value]) => value === shown)?.[0] || shown;
      originalTexts.push({node, original, leading: node.textContent.match(/^\s*/)[0], trailing: node.textContent.match(/\s*$/)[0]});
    }
  }
  const originalLabels = [...document.querySelectorAll('.home-main [aria-label],.home-main [alt],#intro [aria-label],#journey [aria-label],.page-header [aria-label],#site-menu [aria-label]')].flatMap(node => {
    if (node.closest('.life-journey')) return [];
    return ['aria-label', 'alt'].filter(attribute => node.hasAttribute(attribute)).map(attribute => {
      const shown = node.getAttribute(attribute);
      return {node, attribute, original: Object.entries(data.text[data.locale] || {}).find(([, value]) => value === shown)?.[0] || shown};
    });
  });
  function applyHome(locale, notify = true, replaceURL = true) {
    if (!locales.includes(locale)) return;
    const dictionary = data.text[locale] || {};
    for (const item of originalTexts) item.node.textContent = item.leading + (dictionary[item.original] || item.original) + item.trailing;
    for (const item of originalLabels) item.node.setAttribute(item.attribute, dictionary[item.original] || item.original);
    root.lang = locale;
    data.locale = locale;
    document.title = `${data.pageNames[locale][data.slug === 'my-story' ? 1 : 0]} — Jarvis Lin`;
    const pageLocation = document.querySelector('.page-location');
    if (data.slug === 'my-story' && pageLocation) pageLocation.textContent = '01 / ' + data.pageNames[locale][1].toUpperCase();
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
    if ((data.slug === '' || data.slug === 'my-story')) {
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
    if ((data.slug === '' || data.slug === 'my-story') && event.detail?.language !== data.locale) applyHome(event.detail.language, false);
  });
  window.addEventListener('popstate', () => {
    if ((data.slug === '' || data.slug === 'my-story')) applyHome(location.pathname.startsWith('/ja/') ? 'ja' : location.pathname.startsWith('/zh/') ? 'zh-Hant' : 'en', true, false);
  });
})();

// Translate the open article in place, retaining its layout and reading position.
(() => {
 const dialog=document.querySelector('#note-dialog');
 if(!dialog||!document.body.classList.contains('page-experience'))return;
 const paths={en:'','zh-Hant':'/zh',ja:'/ja'},documents=new Map();let request=0;
 document.addEventListener('click',async event=>{
  const link=event.target.closest('#note-dialog a[data-site-language]');
  if(!link||!dialog.open||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  const lang=link.dataset.siteLanguage,id=dialog.dataset.note;
  if(!(lang in paths)||!id)return;
  event.preventDefault();event.stopImmediatePropagation();
  const serial=++request;
  const sectionList=[...dialog.querySelectorAll('.note-article-section')],top=dialog.getBoundingClientRect().top+dialog.querySelector('.dialog-top').getBoundingClientRect().height;
  let sectionIndex=sectionList.findIndex(s=>s.getBoundingClientRect().bottom>top);
  const section=sectionList[sectionIndex],offset=section?Math.max(0,(top-section.getBoundingClientRect().top)/Math.max(1,section.getBoundingClientRect().height)):0;
  const scroll=dialog.scrollTop;
  dialog.setAttribute('aria-busy','true');
  try{
   if(!documents.has(lang))documents.set(lang,fetch(paths[lang]+'/experience/').then(r=>{if(!r.ok)throw Error(r.status);return r.text();}).then(h=>new DOMParser().parseFromString(h,'text/html')).catch(e=>{documents.delete(lang);throw e;}));
   const doc=await documents.get(lang);if(serial!==request||!dialog.open)return;
   const card=doc.getElementById(id),template=doc.getElementById('note-content-'+id);if(!card)throw Error('Missing article');
   dialog.lang=lang;
   dialog.querySelector('#note-dialog-category').textContent=card.querySelector('.card-meta').textContent;
   dialog.querySelector('#note-dialog-title').textContent=card.querySelector('h3').textContent;
   dialog.querySelector('#note-dialog-subtitle').textContent=card.querySelector('.note-subtitle').textContent;
   dialog.querySelector('#note-dialog-body').replaceChildren(...(template?[template.content.cloneNode(true)]:[]));
   const pending=dialog.querySelector('#note-dialog-pending');if(pending)pending.hidden=Boolean(template);
   const translatedPending=doc.querySelector('#note-dialog-pending');if(pending&&translatedPending)pending.textContent=translatedPending.textContent;
   const translatedClose=doc.querySelector('#note-dialog-close');if(translatedClose)dialog.querySelector('#note-dialog-close').setAttribute('aria-label',translatedClose.getAttribute('aria-label'));
   dialog.querySelectorAll('[data-site-language]').forEach(a=>{if(a.dataset.siteLanguage===lang)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
   dialog.scrollTop=scroll;
   requestAnimationFrame(()=>{if(serial!==request)return;const next=dialog.querySelectorAll('.note-article-section')[sectionIndex];if(next&&scroll>0){const headerBottom=dialog.getBoundingClientRect().top+dialog.querySelector('.dialog-top').getBoundingClientRect().height;dialog.scrollTop+=next.getBoundingClientRect().top+offset*next.getBoundingClientRect().height-headerBottom;}});
  }catch{if(serial===request)location.assign(paths[lang]+'/experience/?note='+encodeURIComponent(id));}
  finally{if(serial===request)dialog.removeAttribute('aria-busy');}
 },true);
 dialog.addEventListener('close',()=>{request++;dialog.removeAttribute('aria-busy');dialog.lang=document.documentElement.lang;dialog.querySelectorAll('[data-site-language]').forEach(a=>{if(a.dataset.siteLanguage===dialog.lang)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});});
})();
