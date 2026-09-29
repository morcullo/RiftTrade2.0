const views = [...document.querySelectorAll('[data-page]')];
const navItems = [...document.querySelectorAll('[data-view]')];

function showView(viewName) {
  views.forEach((view) => {
    const isCurrent = view.dataset.page === viewName;
    view.hidden = !isCurrent;
    view.classList.toggle('is-visible', isCurrent);
  });
  navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.view === viewName));
  history.replaceState(null, '', `#${viewName}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach((item) => item.addEventListener('click', () => showView(item.dataset.view)));
document.querySelectorAll('[data-go]').forEach((item) => item.addEventListener('click', () => showView(item.dataset.go)));

const searchInput = document.querySelector('#card-search');
const listings = [...document.querySelectorAll('.listing')];
const emptyMessage = document.querySelector('#market-empty');
searchInput.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  let matchCount = 0;
  listings.forEach((listing) => {
    const matches = listing.dataset.search.includes(query);
    listing.hidden = !matches;
    if (matches) matchCount += 1;
  });
  emptyMessage.hidden = matchCount !== 0;
});

const initialView = window.location.hash.slice(1);
showView(views.some((view) => view.dataset.page === initialView) ? initialView : 'home');