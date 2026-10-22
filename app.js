const places = {
  taiwan: { kicker: 'THE STARTING POINT', title: 'Taiwanese roots.\nA multilingual perspective.', description: 'I am from Taiwan, and Mandarin is my native language. My experience extends across Japan and the United States, with business communication in Mandarin, Japanese, and English.', metric: '中 · 日 · EN', caption: 'Native Mandarin, Japanese JLPT N1, and English IELTS 7.0.', character: '根', label: 'ROOTED IN TAIWAN' },
  japan: { kicker: 'THE ENTREPRENEURIAL CHAPTER', title: 'Learning by building.\nAnd running the business.', description: 'I spent approximately four years living, studying, and building businesses in Japan. My ventures included food service, campus retail, delivery brands, custom PC assembly, and e-commerce.', metric: 'JPY 100M+', caption: 'Combined revenue across all ventures over approximately three years.', character: '築', label: 'BUILDING IN JAPAN' },
  arizona: { kicker: 'THE SUPPLY CHAIN CHAPTER', title: 'Connecting operations\nto a wider perspective.', description: 'I graduated in May 2026 from Arizona State University’s W. P. Carey School of Business with a Master of Science in Supply Chain Management.', metric: 'M.S. · 2026', caption: 'Supply Chain Management, Arizona State University.', character: '拓', label: 'LEARNING IN ARIZONA' }
};

const placeTabs = [...document.querySelectorAll('[data-place]')];
function selectPlace(tab) {
  const place = places[tab.dataset.place];
  placeTabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  document.querySelector('#place-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#place-kicker').textContent = place.kicker;
  document.querySelector('#place-title').replaceChildren(...place.title.split('\n').flatMap((line, i) => i ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
  document.querySelector('#place-description').textContent = place.description;
  document.querySelector('#place-metric').textContent = place.metric;
  document.querySelector('#place-caption').textContent = place.caption;
  document.querySelector('#place-character').textContent = place.character;
  document.querySelector('#place-side-label').textContent = place.label;
}
placeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPlace(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % placeTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + placeTabs.length) % placeTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = placeTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectPlace(placeTabs[next]); placeTabs[next].focus(); }
  });
});

const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.work-card[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = document.documentElement.lang === 'zh-Hant' ? `顯示 ${count} 篇文章。` : `${count} ${count === 1 ? 'note' : 'notes'} shown.`;
}));

const noteDialog = document.querySelector('#note-dialog');
let noteTrigger;
document.querySelectorAll('[data-note-open]').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.work-note');
  noteTrigger = button;
  document.querySelector('#note-dialog-category').textContent = card.querySelector('.card-meta').textContent;
  document.querySelector('#note-dialog-title').textContent = card.querySelector('h3').textContent;
  document.querySelector('#note-dialog-subtitle').textContent = card.querySelector('.note-subtitle').textContent;
  const template = document.getElementById(`note-content-${button.dataset.noteOpen}`);
  const body = document.querySelector('#note-dialog-body');
  body.replaceChildren();
  if (template) body.append(template.content.cloneNode(true));
  document.querySelector('#note-dialog-pending').hidden = Boolean(template);
  noteDialog.showModal();
  noteDialog.scrollTop = 0;
  document.body.classList.add('modal-open');
}));
document.querySelector('#note-dialog-close')?.addEventListener('click', () => noteDialog.close());
noteDialog?.addEventListener('close', () => {
  if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  noteTrigger?.focus({preventScroll:true});
});
noteDialog?.addEventListener('click', event => {
  const bounds = noteDialog.getBoundingClientRect();
  if (event.target === noteDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) noteDialog.close();
});

// Fresh visits and reloads begin at the page top; direct section links still work.
window.addEventListener('pageshow', event => {
  if (!event.persisted && !location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
