const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.work-card[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = document.documentElement.lang === 'ja' ? `${count} 件の記事を表示しています。` : document.documentElement.lang === 'zh-Hant' ? `顯示 ${count} 篇文章。` : `${count} ${count === 1 ? 'note' : 'notes'} shown.`;
}));


const requestedCategory = new URLSearchParams(location.search).get('category');
if (requestedCategory) filters.find(button => button.dataset.filter === requestedCategory)?.click();
