const archive = document.querySelector('.learning-notes-archive');
const grid = archive?.querySelector('.notes-grid');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.work-card[data-category]')];
const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');

let requestedFilter = filters.find(button => button.getAttribute('aria-pressed') === 'true');
let transition;

function applyFilter(button) {
  for (const filter of filters) {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  }

  for (const card of cards) {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  }

  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = document.documentElement.lang === 'ja' ? `${count} 件の記事を表示しています。` : document.documentElement.lang === 'zh-Hant' ? `顯示 ${count} 篇文章。` : `${count} ${count === 1 ? 'note' : 'notes'} shown.`;
}

async function switchFilter(button) {
  if (button === requestedFilter) return;
  requestedFilter = button;

  const opacity = grid ? getComputedStyle(grid).opacity : '1';
  transition?.cancel();
  if (!grid?.animate || !motion.matches) {
    transition = undefined;
    grid?.classList.remove('is-switching');
    applyFilter(button);
    return;
  }

  grid.classList.add('is-switching');
  const exit = grid.animate([{opacity}, {opacity: 0}], {
    duration: 190, easing: 'ease-in', fill: 'both',
  });
  transition = exit;

  try {
    await exit.finished;
  } catch {
    return;
  }

  if (archive.getBoundingClientRect().top < 0) {
    archive.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  applyFilter(button);

  const entrance = grid.animate(
    [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}],
    {duration: 360, easing: 'cubic-bezier(.2,.65,.25,1)'},
  );
  transition = entrance;
  exit.cancel();

  try {
    await entrance.finished;
  } catch {
    return;
  }

  transition = undefined;
  grid.classList.remove('is-switching');
}

for (const button of filters) {
  button.addEventListener('click', () => switchFilter(button));
}

const category = new URLSearchParams(location.search).get('category');
const initialFilter = filters.find(button => button.dataset.filter === category);
if (initialFilter) {
  requestedFilter = initialFilter;
  applyFilter(initialFilter);
}
