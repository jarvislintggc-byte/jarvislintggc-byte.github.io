(() => {
  'use strict';
  const pageLanguage = () => document.documentElement.lang || 'en';
  const messages = {
    en: {loading: 'Loading article…', error: 'The article could not load. Please try again.', retry: 'Try again', close: 'Close'},
    'zh-Hant': {loading: '文章載入中…', error: '文章暫時無法載入，請再試一次。', retry: '重新載入', close: '關閉'},
    ja: {loading: '記事を読み込み中…', error: '記事を読み込めません。もう一度お試しください。', retry: '再試行', close: '閉じる'}
  };
  let dialog = document.getElementById('note-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'note-dialog';
    dialog.className = 'note-article-dialog jarvis-home-article';
    dialog.setAttribute('aria-labelledby', 'note-dialog-title');
    dialog.setAttribute('aria-describedby', 'note-dialog-subtitle');
    dialog.innerHTML = '<div class="dialog-top"><span id="note-dialog-category"></span><div class="dialog-actions"><nav aria-label="Language"></nav><button type="button" id="note-dialog-close">×</button></div></div><div class="dialog-content"><h2 id="note-dialog-title"></h2><p id="note-dialog-subtitle"></p><div id="note-dialog-body"></div><p class="case-note" id="note-dialog-pending"></p></div>';
    document.body.append(dialog);
  }
  dialog.setAttribute('data-lenis-prevent', '');
  const nav = dialog.querySelector('.dialog-actions nav');
  nav.replaceChildren(...[['zh-Hant', '中文'], ['en', 'EN'], ['ja', '日本語']].map(([language, label]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.articleLanguage = language; button.textContent = label; return button;
  }));
  const part = id => dialog.querySelector('#note-dialog-' + id);
  let request = 0, opener, pageTop = 0;
  function signal() { document.dispatchEvent(new CustomEvent('article:state', {detail: {open: dialog.open}})); }
  async function show(id, language, preserve = false) {
    const serial = ++request;
    const ui = messages[language];
    const scroll = dialog.scrollTop;
    const sections = [...dialog.querySelectorAll('.note-article-section')];
    const headerBottom = dialog.getBoundingClientRect().top + dialog.querySelector('.dialog-top').getBoundingClientRect().height;
    const index = sections.findIndex(section => section.getBoundingClientRect().bottom > headerBottom);
    const rect = sections[index]?.getBoundingClientRect();
    const offset = rect ? (headerBottom - rect.top) / Math.max(1, rect.height) : 0;
    dialog.dataset.note = id; dialog.lang = language; dialog.setAttribute('aria-busy', 'true');
    part('close').setAttribute('aria-label', ui.close);
    nav.querySelectorAll('button').forEach(button => button.setAttribute('aria-current', button.dataset.articleLanguage === language ? 'page' : 'false'));
    if (!preserve) { part('title').textContent = ui.loading; part('category').textContent = ''; part('subtitle').textContent = ''; part('body').replaceChildren(); part('pending').hidden = true; }
    try {
      const article = await window.JarvisArticles.article(language, id);
      if (serial !== request || !dialog.open) return;
      part('title').textContent = article.title;
      part('category').textContent = article.category;
      part('subtitle').textContent = article.subtitle;
      // HTML is generated from the site's escaped content catalog, never user input.
      part('body').innerHTML = article.html;
      part('pending').textContent = article.pending;
      part('pending').hidden = article.status !== 'draft';
      dialog.scrollTop = preserve ? scroll : 0;
      if (preserve && scroll > 0) requestAnimationFrame(() => {
        if (serial !== request || !dialog.open) return;
        const next = dialog.querySelectorAll('.note-article-section')[index];
        if (next) { const r = next.getBoundingClientRect(); dialog.scrollTop += r.top + offset * r.height - (dialog.getBoundingClientRect().top + dialog.querySelector('.dialog-top').getBoundingClientRect().height); }
      });
    } catch {
      if (serial !== request || !dialog.open) return;
      const message = document.createElement('p'), retry = document.createElement('button');
      message.setAttribute('role', 'alert'); message.textContent = ui.error;
      retry.type = 'button'; retry.textContent = ui.retry; retry.addEventListener('click', () => show(id, language, preserve));
      part('body').replaceChildren(message, retry);
    } finally { if (serial === request) dialog.removeAttribute('aria-busy'); }
  }
  function open(id, trigger, language = pageLanguage()) {
    if (dialog.open) return;
    opener = trigger || document.activeElement; pageTop = window.scrollY;
    dialog.showModal(); document.body.classList.add('modal-open'); signal();
    return show(id, language);
  }
  window.JarvisArticleDialog = {open, get isOpen() { return dialog.open; }};
  document.addEventListener('click', event => {
    const language = event.target.closest('#note-dialog [data-article-language]');
    if (language) { event.preventDefault(); show(dialog.dataset.note, language.dataset.articleLanguage, true); return; }
    const trigger = event.target.closest('[data-note-open]');
    if (trigger) { event.preventDefault(); open(trigger.dataset.noteOpen, trigger); }
  });
  part('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    request++; dialog.removeAttribute('aria-busy');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    window.scrollTo({top: pageTop, behavior: 'instant'}); opener?.focus({preventScroll: true}); signal();
  });
  const requested = new URLSearchParams(location.search).get('note');
  if (requested) { const button = [...document.querySelectorAll('[data-note-open]')].find(item => item.dataset.noteOpen === requested); if (button) open(requested, button); }
})();
