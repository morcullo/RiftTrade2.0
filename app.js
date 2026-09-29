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
const marketGrid = document.querySelector('#market-grid');
const marketStatus = document.querySelector('#market-status');
const emptyMessage = document.querySelector('#market-empty');

let cards = [];

function getCardImageUrl(card) {
  if (card.image_url) return card.image_url;
  const imageName = card.image_path || card.image_file;
  if (!imageName || !window.RIFTTRADE_SUPABASE_URL) return '';
  return `${window.RIFTTRADE_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/card-images/${encodeURIComponent(imageName)}`;
}

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = cards.filter((card) => {
    const searchable = [card.name, card.set_name, card.set_code, card.type, card.rarity, card.ability_text].filter(Boolean).join(' ').toLowerCase();
    return searchable.includes(query);
  });
  marketGrid.innerHTML = matches.map((card) => {
    const imageUrl = getCardImageUrl(card);
    const setLabel = [card.set_name || card.set_code, card.collector_number].filter(Boolean).join(' · ');
    return `<article class="listing" data-search="${escapeHtml(card.name)}">
      <div class="card-art${imageUrl ? ' has-image' : ''}"${imageUrl ? ` style="background-image: url('${escapeHtml(imageUrl)}')"` : ''}>
        <span>${escapeHtml(card.name)}</span><strong>${escapeHtml(card.rarity || card.type || 'CARD')}</strong><small>${escapeHtml(setLabel || 'RIFTBOUND')}</small>
      </div>
      <div class="listing-copy"><div><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(card.set_name || card.set_code || 'Riftbound catalog')}</span></div><b>Catalog</b></div>
      <button class="trade-button" type="button">View card <span>→</span></button>
    </article>`;
  }).join('');
  emptyMessage.hidden = matches.length !== 0;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function loadCards() {
  if (!window.riftTradeSupabase) {
    marketStatus.textContent = 'Add your Supabase URL and anon key to load the card catalog.';
    return;
  }
  const { data, error } = await window.riftTradeSupabase
    .from('cards')
    .select('id, name, set_code, set_name, collector_number, rarity, type, ability_text, image_file, image_path, image_url')
    .order('name')
    .limit(120);
  if (error) {
    marketStatus.textContent = `Could not load cards: ${error.message}`;
    return;
  }
  cards = data || [];
  marketStatus.textContent = cards.length ? `${cards.length} cards from your catalog` : 'No cards found. Import cards.csv into Supabase first.';
  renderCards();
}

searchInput.addEventListener('input', renderCards);
loadCards();

const initialView = window.location.hash.slice(1);
showView(views.some((view) => view.dataset.page === initialView) ? initialView : 'home');