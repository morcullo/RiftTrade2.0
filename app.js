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
const catalogSearch = document.querySelector('#catalog-search');
const catalogGrid = document.querySelector('#catalog-grid');
const catalogCount = document.querySelector('#catalog-count');
const catalogStatus = document.querySelector('#catalog-status');
const catalogEmpty = document.querySelector('#catalog-empty');
const catalogSetFilter = document.querySelector('#catalog-set-filter');
const catalogDomainOptions = document.querySelector('#catalog-domain-options');
const catalogRarityFilter = document.querySelector('#catalog-rarity-filter');
const catalogTypeFilter = document.querySelector('#catalog-type-filter');
const catalogFilterClear = document.querySelector('#catalog-filter-clear');
const openListingButton = document.querySelector('#open-listing');
const listingDialog = document.querySelector('#listing-dialog');
const listingClose = document.querySelector('#listing-close');
const listingForm = document.querySelector('#listing-form');
const listingCardSearch = document.querySelector('#listing-card-search');
const listingCardResults = document.querySelector('#listing-card-results');
const listingCardSelected = document.querySelector('#listing-card-selected');
const listingMessage = document.querySelector('#listing-message');
const listingSubmit = document.querySelector('#listing-submit');
const listingName = document.querySelector('#listing-name');
const listingType = document.querySelector('#listing-type');
const listingLanguage = document.querySelector('#listing-language');
const listingDescription = document.querySelector('#listing-description');
const accountDialog = document.querySelector('#account-dialog');
const profileButton = document.querySelector('#profile-button');
const accountClose = document.querySelector('#account-close');
const authForm = document.querySelector('#auth-form');
const authLinks = document.querySelector('#auth-links');
const authMessage = document.querySelector('#auth-message');
const authTitle = document.querySelector('#account-title');
const authIntro = document.querySelector('#account-intro');
const authSubmit = document.querySelector('#auth-submit');
const passwordField = document.querySelector('#password-field');
const newPasswordField = document.querySelector('#new-password-field');
const nameField = document.querySelector('#name-field');
const signedInPanel = document.querySelector('#signed-in-panel');
const signedInEmail = document.querySelector('#signed-in-email');
const authEmail = document.querySelector('#auth-email');
const authPassword = document.querySelector('#auth-password');
const authNewPassword = document.querySelector('#auth-new-password');
const authName = document.querySelector('#auth-name');
const heroCardBack = document.querySelector('#hero-card-back');
const heroCardFront = document.querySelector('#hero-card-front');
const metricCardsListed = document.querySelector('#metric-cards-listed');
const metricActiveTraders = document.querySelector('#metric-active-traders');
const metricTradesCompleted = document.querySelector('#metric-trades-completed');
const cardDialog = document.querySelector('#card-dialog');
const cardDialogClose = document.querySelector('#card-close');
const cardDialogArt = document.querySelector('#card-dialog-art');
const cardDialogTitle = document.querySelector('#card-dialog-title');
const cardDialogBadges = document.querySelector('#card-dialog-badges');
const cardDialogSet = document.querySelector('#card-dialog-set');
const cardDialogStats = document.querySelector('#card-dialog-stats');
const cardDialogAbility = document.querySelector('#card-dialog-ability');
const cardDialogTags = document.querySelector('#card-dialog-tags');
const cardDialogMarketplace = document.querySelector('#card-dialog-marketplace');
const listingDetailsDialog = document.querySelector('#listing-details-dialog');
const listingDetailsClose = document.querySelector('#listing-details-close');
const listingDetailsTitle = document.querySelector('#listing-details-title');
const listingDetailsSeller = document.querySelector('#listing-details-seller');
const listingDetailsMeta = document.querySelector('#listing-details-meta');
const listingDetailsDescription = document.querySelector('#listing-details-description');
const listingDetailsCards = document.querySelector('#listing-details-cards');
const listingDetailsActions = document.querySelector('#listing-details-actions');
const listingEditButton = document.querySelector('#listing-edit');
const listingPendingButton = document.querySelector('#listing-pending');
const listingSoldButton = document.querySelector('#listing-sold');
const listingDeleteButton = document.querySelector('#listing-delete');
const listingDialogTitle = document.querySelector('#listing-title');
const myListingsGrid = document.querySelector('#my-listings-grid');
const myListingsCount = document.querySelector('#my-listings-count');
const myListingsStatus = document.querySelector('#my-listings-status');
const myListingsEmpty = document.querySelector('#my-listings-empty');
let editingListingId = null;

let cards = [];
let listings = [];
let myListings = [];
let selectedListingCardIds = [];
let selectedListingCardQuantities = {};
let selectedListingCardConditions = {};
let selectedListingCardPrices = {};
let authMode = 'signin';

function getCardImageUrl(card) {
  if (card.image_url && /^https?:\/\//i.test(card.image_url)) return card.image_url;
  const imageName = String(card.image_path || card.image_file || '')
    .replace(/^card-images\//, '')
    .replace(/^\//, '');
  if (!imageName || !window.riftTradeSupabase) return '';
  return window.riftTradeSupabase.storage.from('card-images').getPublicUrl(imageName).data.publicUrl;
}

function updateListingCard(listing) {
  const article = marketGrid.querySelector(`[data-listing-id="${CSS.escape(listing.id)}"]`);
  if (!article) return;
  const listingCards = listing.listing_cards || [];
  const activeCardIndex = Math.min(Number(listing.activeCardIndex || 0), Math.max(listingCards.length - 1, 0));
  const card = listingCards[activeCardIndex]?.card || {};
  const imageUrl = getCardImageUrl(card);
  const cardArt = article.querySelector('.card-art');
  const image = cardArt.querySelector('img');
  const placeholder = cardArt.querySelector(':scope > span:not(.listing-image-count)');
  cardArt.classList.toggle('has-image', Boolean(imageUrl));
  if (imageUrl) {
    if (image) {
      image.src = imageUrl;
      image.alt = `${card.name || 'Riftbound card'} card art`;
    } else {
      cardArt.insertAdjacentHTML('afterbegin', `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name || 'Riftbound card')} card art" loading="lazy" />`);
    }
    placeholder?.remove();
  } else {
    image?.remove();
    if (!placeholder) cardArt.insertAdjacentHTML('afterbegin', `<span>${escapeHtml(card.name || listing.title)}</span>`);
    else placeholder.textContent = card.name || listing.title;
  }
  const badges = cardArt.querySelector('.card-badges');
  if (badges) badges.outerHTML = renderCardBadges(card);
  else if (renderCardBadges(card)) cardArt.insertAdjacentHTML('beforeend', renderCardBadges(card));
  const count = cardArt.querySelector('.listing-image-count');
  if (count) count.textContent = `${activeCardIndex + 1} / ${listingCards.length}`;
}

function renderListings() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = listings.filter((listing) => {
    const listingCards = listing.listing_cards || [];
    const searchable = [listing.title, listing.description, listing.seller?.display_name, ...listingCards.flatMap(({ card }) => [card?.name, card?.set_name, card?.code])].filter(Boolean).join(' ').toLowerCase();
    return searchable.includes(query);
  });
  marketGrid.innerHTML = matches.map((listing) => {
    const listingCards = listing.listing_cards || [];
    const isGrid = listingCards.length > 1 && listingCards.length <= 8;
    const isCarousel = listingCards.length > 8;
    const carouselPageSize = 4;
    const totalCarouselPages = Math.ceil(listingCards.length / carouselPageSize);
    const activeCarouselPage = isCarousel ? Math.min(Math.floor(Number(listing.activeCardIndex || 0) / carouselPageSize), totalCarouselPages - 1) : 0;
    const visibleCards = isCarousel ? listingCards.slice(activeCarouselPage * carouselPageSize, (activeCarouselPage + 1) * carouselPageSize) : listingCards;
    const card = listingCards[0]?.card || {};
    const imageUrl = getCardImageUrl(card);
    const seller = listing.seller?.display_name || listing.seller?.username || 'RiftTrade member';
    const price = listingPriceLabel(listing);
    const cardArt = isGrid || isCarousel
      ? visibleCards.map(({ card: listingCard, quantity: listingQuantity }) => {
        const listingImageUrl = getCardImageUrl(listingCard || {});
        const quantity = Math.max(Number(listingQuantity) || 1, 1);
        const quantityBadge = isCarousel && quantity > 1 ? `<span class="listing-card-quantity-badge">X${quantity}</span>` : '';
        return `<span class="listing-card-tile">${listingImageUrl ? `<img src="${escapeHtml(listingImageUrl)}" alt="${escapeHtml(listingCard?.name || 'Riftbound card')} card art" loading="lazy" />` : `<span>${escapeHtml(listingCard?.name || 'Riftbound card')}</span>`}${quantityBadge}</span>`;
      }).join('')
      : imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" loading="lazy" />` : `<span>${escapeHtml(card.name || listing.title)}</span>`;
    const carouselControls = isCarousel ? `<button class="listing-image-button listing-image-prev" data-listing-id="${escapeHtml(listing.id)}" data-direction="-1" type="button" aria-label="Previous card page">←</button><span class="listing-image-count">${activeCarouselPage + 1} / ${totalCarouselPages}</span><button class="listing-image-button listing-image-next" data-listing-id="${escapeHtml(listing.id)}" data-direction="1" type="button" aria-label="Next card page">→</button>` : '';
    return `<article class="listing" data-listing-id="${escapeHtml(listing.id)}" data-search="${escapeHtml(listing.title)}" tabindex="0" role="button" aria-label="Open listing ${escapeHtml(listing.title)}">
      <div class="card-art${isGrid || isCarousel ? ` multi-card-art${listingCards.length === 2 ? ' two-card-art' : ''}` : imageUrl ? ' has-image' : ''}">
        ${cardArt}
        ${isGrid || isCarousel ? '' : renderCardBadges(card)}${carouselControls}
      </div>
      <div class="listing-copy"><div class="listing-summary"><strong>${escapeHtml(listing.title)}</strong><b>${escapeHtml(price)}</b></div><div class="listing-poster"><span>By ${escapeHtml(seller)}</span></div></div>
    </article>`;
  }).join('');
  emptyMessage.hidden = matches.length !== 0;
  marketGrid.querySelectorAll('.listing').forEach((article) => {
    const openListing = () => {
      openListingDetails(article.dataset.listingId);
    };
    article.addEventListener('click', (event) => {
      if (event.target.closest('.listing-image-button')) return;
      openListing();
    });
    article.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openListing();
    });
  });
  marketGrid.querySelectorAll('.listing-image-button').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const listing = listings.find((item) => item.id === button.dataset.listingId);
    if (!listing) return;
    const cardsInListing = listing.listing_cards || [];
    const pageSize = 8;
    const totalPages = Math.ceil(cardsInListing.length / pageSize);
    const currentPage = Math.floor(Number(listing.activeCardIndex || 0) / pageSize);
    const nextPage = (currentPage + Number(button.dataset.direction) + totalPages) % totalPages;
    listing.activeCardIndex = nextPage * pageSize;
    renderListings();
  }));
}

function renderCatalog() {
  const query = normalizeCardSearch(catalogSearch.value);
  const selectedSet = catalogSetFilter.value;
  const selectedDomains = [...catalogDomainOptions.querySelectorAll('input:checked')].map((input) => input.value);
  const selectedRarity = catalogRarityFilter.value;
  const selectedType = catalogTypeFilter.value;
  const matches = cards.filter((card) => {
    if (selectedSet && card.set_name !== selectedSet) return false;
    if (selectedRarity && card.rarity !== selectedRarity) return false;
    if (selectedType && card.type !== selectedType) return false;
    if (selectedDomains.length && !selectedDomains.every((domain) => cardDomains(card).includes(domain))) return false;
    return !query || scoreCardSearchMatch(card, query) > 0;
  });
  catalogGrid.innerHTML = matches.map((card) => {
    const imageUrl = getCardImageUrl(card);
    const details = [card.code || card.public_code, card.set_name, card.rarity].filter(Boolean).join(' · ');
    return `<button class="catalog-card" data-catalog-card-id="${escapeHtml(card.id)}" type="button" aria-label="View details for ${escapeHtml(card.name)}"><div class="catalog-card-art${imageUrl ? ' has-image' : ''}">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" loading="lazy" />` : `<span>${escapeHtml(card.name)}</span>`}${renderCardBadges(card)}</div><span class="catalog-card-copy"><strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(details || 'Riftbound card')}</small></span></button>`;
  }).join('');
  catalogCount.textContent = `${matches.length} / ${cards.length} cards`;
  const activeFilterCount = [selectedSet, selectedRarity, selectedType].filter(Boolean).length + selectedDomains.length;
  catalogStatus.textContent = query || activeFilterCount ? `Showing ${matches.length} matching card${matches.length === 1 ? '' : 's'}.` : `${cards.length} cards in the catalog.`;
  catalogEmpty.hidden = matches.length !== 0;
}

function cardDomains(card) {
  if (Array.isArray(card.domains)) return card.domains;
  return String(card.domains || '').split(/[|,]/).map((domain) => domain.trim()).filter(Boolean);
}

function populateCatalogFilters() {
  const values = (getValue) => [...new Set(cards.flatMap((card) => getValue(card)).filter(Boolean))].sort((left, right) => left.localeCompare(right));
  const setOptions = values((card) => [card.set_name]);
  const domainOptions = values((card) => cardDomains(card));
  const rarityOptions = values((card) => [card.rarity]);
  const typeOptions = values((card) => [card.type]);
  catalogSetFilter.innerHTML = '<option value="">All sets</option>' + setOptions.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  catalogDomainOptions.innerHTML = domainOptions.map((value) => `<label><input type="checkbox" value="${escapeHtml(value)}" />${escapeHtml(value)}</label>`).join('');
  catalogRarityFilter.innerHTML = '<option value="">All rarities</option>' + rarityOptions.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  catalogTypeFilter.innerHTML = '<option value="">All types</option>' + typeOptions.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
}

function listingStatusLabel(status) {
  return { active: 'Active', paused: 'Pending', completed: 'Sold', draft: 'Draft', cancelled: 'Cancelled' }[status] || status || 'Unknown';
}

function listingCardCount(listingCards) {
  return listingCards.reduce((total, { quantity }) => total + Math.max(Number(quantity) || 1, 1), 0);
}

function formatDollar(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  return `$${amount.toFixed(2).replace(/\.00$/, '')}`;
}

function listingPriceLabel(listing) {
  const listingCards = listing.listing_cards || [];
  const cardPrices = listingCards.map(({ price }) => Number(price)).filter(Number.isFinite);
  if (listingCards.length > 1) {
    if (!cardPrices.length) return 'Make an offer';
    const lowest = Math.min(...cardPrices);
    const highest = Math.max(...cardPrices);
    return lowest === highest ? formatDollar(lowest) : `${formatDollar(lowest)}-${formatDollar(highest)}`;
  }
  if (cardPrices.length) return formatDollar(cardPrices[0]);
  return listing.price !== null && listing.price !== undefined ? formatDollar(listing.price) : 'Make an offer';
}

function renderMyListings() {
  myListingsGrid.innerHTML = myListings.map((listing) => {
    const listingCards = listing.listing_cards || [];
    const cardNames = listingCards.map(({ card, quantity }) => `${quantity > 1 ? `${quantity}× ` : ''}${card?.name || 'Riftbound card'}`).join(', ');
    const listingType = listing.listing_type === 'sale' ? 'For sale' : listing.listing_type === 'trade_or_sale' ? 'Trade or sale' : 'For trade';
    const price = listingPriceLabel(listing);
    const cardCount = listingCardCount(listingCards);
    const status = listingStatusLabel(listing.status);
    const statusClass = listing.status === 'completed' ? 'complete' : listing.status === 'active' ? 'pending' : 'waiting';
    return `<article class="my-listing-row"><div class="my-listing-main"><strong>${escapeHtml(listing.title)}</strong><span>${escapeHtml(cardNames || 'No cards attached')}</span><small>${escapeHtml([listingType, price, `${cardCount} card${cardCount === 1 ? '' : 's'}`].join(' · '))}</small></div><span class="trade-status ${statusClass}">${escapeHtml(status)}</span><button class="row-arrow my-listing-open" data-listing-id="${escapeHtml(listing.id)}" type="button" aria-label="Open listing ${escapeHtml(listing.title)}">→</button></article>`;
  }).join('');
  myListingsCount.textContent = `${myListings.length} listing${myListings.length === 1 ? '' : 's'}`;
  myListingsEmpty.hidden = myListings.length !== 0;
  myListingsGrid.querySelectorAll('.my-listing-open').forEach((button) => button.addEventListener('click', () => openListingDetails(button.dataset.listingId)));
}

function renderHeroCards() {
  const imageCards = cards.filter((card) => card.is_signed && getCardImageUrl(card));
  const normalizedCardName = (card) => normalizeCardSearch(card.name);
  const heroCards = [
    imageCards.find((card) => normalizedCardName(card).includes('ahri') && normalizedCardName(card).includes('inquisitive'))
      || imageCards.find((card) => normalizedCardName(card).includes('ahri')),
    imageCards.find((card) => normalizedCardName(card).includes('kai sa')),
  ].filter(Boolean);
  if (heroCards.length < 2) return;
  const [frontCard, backCard] = heroCards;
  heroCardBack.classList.add('has-image');
  heroCardFront.classList.add('has-image');
  heroCardBack.innerHTML = `<img src="${escapeHtml(getCardImageUrl(backCard))}" alt="${escapeHtml(backCard.name)} card art" />`;
  heroCardFront.innerHTML = `<img src="${escapeHtml(getCardImageUrl(frontCard))}" alt="${escapeHtml(frontCard.name)} card art" />`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function renderCardBadges(card) {
  const badges = [];
  if (card.is_signed) badges.push('Signature');
  else if (card.is_overnumbered) badges.push('Overnumbered');
  return badges.length ? `<span class="card-badges">${badges.map((badge) => `<span class="card-badge">${badge}</span>`).join('')}</span>` : '';
}

function renderCardText(text) {
  let rendered = escapeHtml(text);
  rendered = rendered.replace(/\{might\}/gi, '<span class="card-symbol card-symbol-might" role="img" aria-label="Might">⚔</span>');
  rendered = rendered.replace(/\{energy:(\d+)\}/gi, '<span class="card-symbol card-symbol-energy" role="img" aria-label="Energy $1">⚡$1</span>');
  rendered = rendered.replace(/\{power:([a-z]+)\}/gi, (_, domain) => `<span class="card-symbol card-symbol-power card-symbol-power-${domain.toLowerCase()}" role="img" aria-label="${escapeHtml(domain)} power">◆</span>`);
  rendered = rendered.replace(/\{exhaust\}/gi, '<span class="card-symbol card-symbol-exhaust" role="img" aria-label="Exhaust">↻</span>');
  rendered = rendered.replace(/\[([^\]]+)\]/g, '<span class="card-keyword">$1</span>');
  return rendered.replace(/\r?\n/g, '<br />');
}

function renderCardStatValue(label, value) {
  if (label === 'Cost') return `<span class="card-stat-symbol card-symbol-energy" role="img" aria-label="Energy">⚡</span>${escapeHtml(value)}`;
  if (label === 'Might') return `<span class="card-stat-symbol card-symbol-might" role="img" aria-label="Might">⚔</span>${escapeHtml(value)}`;
  if (label === 'Power') return `<span class="card-stat-symbol card-symbol-power" role="img" aria-label="Power">◆</span>${escapeHtml(value)}`;
  return escapeHtml(value);
}

function openCardDialog(cardId) {
  const card = cards.find((item) => item.id === cardId);
  if (!card) return;
  cardDialogMarketplace.dataset.cardName = card.name;
  const imageUrl = getCardImageUrl(card);
  cardDialogTitle.textContent = card.name;
  cardDialogBadges.innerHTML = renderCardBadges(card);
  cardDialogSet.textContent = [card.set_name || card.set_code, card.public_code].filter(Boolean).join(' · ') || 'Riftbound catalog';
  cardDialogArt.className = `card-dialog-art${imageUrl ? ' has-image' : ''}`;
  cardDialogArt.innerHTML = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" />` : `<span>${escapeHtml(card.name)}</span>`;
  const stats = [['Rarity', card.rarity], ['Type', card.type], ['Cost', card.cost], ['Might', card.might], ['Power', card.power], ['Domains', Array.isArray(card.domains) ? card.domains.join(', ') : card.domains]];
  cardDialogStats.innerHTML = stats.filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${renderCardStatValue(label, value)}</dd></div>`).join('');
  cardDialogAbility.innerHTML = renderCardText(card.ability_text || 'No ability text listed.');
  cardDialogTags.textContent = Array.isArray(card.tags) && card.tags.length ? `Tags: ${card.tags.join(', ')}` : '';
  cardDialog.showModal();
}

function openListingDetails(listingId) {
  const listing = listings.find((item) => item.id === listingId);
  if (!listing) return;
  listingDetailsDialog.dataset.listingId = listing.id;
  const listingCards = listing.listing_cards || [];
  const seller = listing.seller?.display_name || listing.seller?.username || 'RiftTrade member';
  const listingType = listing.listing_type === 'sale' ? 'For sale' : listing.listing_type === 'trade_or_sale' ? 'Trade or sale' : 'For trade';
  const price = listingPriceLabel(listing);
  const cardCount = listingCardCount(listingCards);
  listingDetailsTitle.textContent = listing.title;
  listingDetailsSeller.textContent = `Listed by ${seller}`;
  listingDetailsMeta.textContent = [listingType, price, `${cardCount} card${cardCount === 1 ? '' : 's'}`].join(' · ');
  listingDetailsDescription.textContent = listing.description || 'No description provided.';
  listingDetailsActions.hidden = true;
  listingDetailsCards.innerHTML = listingCards.map(({ card, quantity, condition, language, price }) => {
    const imageUrl = getCardImageUrl(card || {});
    return `<button class="listing-details-card" data-card-id="${escapeHtml(card?.id || '')}" type="button"><span class="listing-details-card-art${imageUrl ? ' has-image' : ''}">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" />` : `<span>${escapeHtml(card?.name || 'Riftbound card')}</span>`}</span><span class="listing-details-card-copy"><span class="listing-details-card-title"><strong>${escapeHtml(card?.name || 'Riftbound card')}</strong>${renderCardBadges(card || {})}</span><span>${escapeHtml([condition?.replaceAll('_', ' '), language].filter(Boolean).join(' · '))}</span>${price !== null && price !== undefined ? `<small>${escapeHtml(`${formatDollar(price)} each`)}</small>` : ''}</span><span class="listing-details-quantity">× ${escapeHtml(quantity || 1)}</span></button>`;
  }).join('');
  listingDetailsCards.querySelectorAll('[data-card-id]').forEach((button) => button.addEventListener('click', () => openCardDialog(button.dataset.cardId)));
  window.riftTradeSupabase?.auth.getUser().then(({ data: { user } }) => {
    const isOwner = Boolean(user && user.id === listing.seller_id);
    listingDetailsActions.hidden = !isOwner;
    listingPendingButton.hidden = listing.status !== 'active';
    listingSoldButton.hidden = listing.status !== 'active';
  });
  listingDetailsDialog.showModal();
}

cardDialogClose.addEventListener('click', () => cardDialog.close());
cardDialog.addEventListener('click', (event) => { if (event.target === cardDialog) cardDialog.close(); });
cardDialogMarketplace.addEventListener('click', () => {
  searchInput.value = cardDialogMarketplace.dataset.cardName || '';
  cardDialog.close();
  showView('marketplace');
  renderListings();
  searchInput.focus();
});
listingDetailsClose.addEventListener('click', () => listingDetailsDialog.close());
listingDetailsDialog.addEventListener('click', (event) => { if (event.target === listingDetailsDialog) listingDetailsDialog.close(); });

function openListingForm(listing = null) {
  editingListingId = listing?.id || null;
  listingDialogTitle.textContent = listing ? 'Edit listing' : 'Create a listing';
  listingSubmit.innerHTML = listing ? 'Save changes <span>→</span>' : 'Create listing <span>→</span>';
  if (listing) {
    listingName.value = listing.title || '';
    listingType.value = listing.listing_type || 'trade';
    listingDescription.value = listing.description || '';
    selectedListingCardQuantities = Object.fromEntries((listing.listing_cards || []).filter(({ card }) => card?.id).map(({ card, quantity }) => [card.id, Math.max(Number(quantity) || 1, 1)]));
    selectedListingCardConditions = Object.fromEntries((listing.listing_cards || []).filter(({ card }) => card?.id).map(({ card, condition }) => [card.id, condition || 'near_mint']));
    selectedListingCardPrices = Object.fromEntries((listing.listing_cards || []).filter(({ card, price }) => card?.id && price !== null && price !== undefined).map(({ card, price }) => [card.id, price]));
    selectedListingCardIds = Object.keys(selectedListingCardQuantities);
    listingCardSearch.value = '';
    renderSelectedListingCards();
    listingLanguage.value = listing.listing_cards?.[0]?.language || 'English';
  } else {
    listingForm.reset();
    populateListingCards();
    listingLanguage.value = 'English';
  }
  listingMessage.textContent = '';
  listingDialog.showModal();
}

async function updateListingStatus(status) {
  const listingId = listingDetailsDialog.dataset.listingId;
  if (!listingId || !window.riftTradeSupabase) return;
  const { error } = await window.riftTradeSupabase.from('listings').update({ status }).eq('id', listingId);
  if (error) return setListingMessage(error.message, true);
  listingDetailsDialog.close();
  await loadListings();
}

listingEditButton.addEventListener('click', () => {
  const listing = listings.find((item) => item.id === listingDetailsDialog.dataset.listingId);
  if (!listing) return;
  listingDetailsDialog.close();
  openListingForm(listing);
});
listingPendingButton.addEventListener('click', () => updateListingStatus('paused'));
listingSoldButton.addEventListener('click', () => updateListingStatus('completed'));
listingDeleteButton.addEventListener('click', async () => {
  const listingId = listingDetailsDialog.dataset.listingId;
  if (!listingId || !window.confirm('Delete this listing?')) return;
  const { error } = await window.riftTradeSupabase.from('listings').delete().eq('id', listingId);
  if (error) return setListingMessage(error.message, true);
  listingDetailsDialog.close();
  await loadListings();
});

function setListingMessage(message, isError = false) {
  listingMessage.textContent = message;
  listingMessage.classList.toggle('is-error', isError);
}

openListingButton.addEventListener('click', async () => {
  if (!window.riftTradeSupabase) return setListingMessage('Configure Supabase before creating a listing.', true);
  const { data: { session } } = await window.riftTradeSupabase.auth.getSession();
  if (!session) {
    openAccount();
    setAuthMessage('Sign in before creating a listing.', true);
    return;
  }
  openListingForm();
});
listingClose.addEventListener('click', () => listingDialog.close());
listingDialog.addEventListener('click', (event) => { if (event.target === listingDialog) listingDialog.close(); });

listingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.riftTradeSupabase) return setListingMessage('Configure Supabase before creating a listing.', true);
  listingSubmit.disabled = true;
  setListingMessage('Publishing...');
  const { data: { user } } = await window.riftTradeSupabase.auth.getUser();
  if (!user) {
    listingSubmit.disabled = false;
    return setListingMessage('Sign in before creating a listing.', true);
  }
  if (!selectedListingCardIds.length) {
    listingSubmit.disabled = false;
    return setListingMessage('Choose at least one card for the listing.', true);
  }
  const totalPrice = selectedListingCardIds.reduce((total, cardId) => total + (Number(selectedListingCardPrices[cardId]) || 0), 0);
  const hasCardPrice = selectedListingCardIds.some((cardId) => selectedListingCardPrices[cardId] !== '');
  const listingPayload = { title: listingName.value.trim(), description: listingDescription.value.trim() || null, listing_type: listingType.value, price: hasCardPrice ? totalPrice : null };
  const listingRequest = editingListingId
    ? window.riftTradeSupabase.from('listings').update(listingPayload).eq('id', editingListingId).select('id').single()
    : window.riftTradeSupabase.from('listings').insert({ ...listingPayload, seller_id: user.id }).select('id').single();
  const { data: listing, error: listingError } = await listingRequest;
  if (listingError) {
    listingSubmit.disabled = false;
    return setListingMessage(listingError.message, true);
  }
  if (editingListingId) await window.riftTradeSupabase.from('listing_cards').delete().eq('listing_id', editingListingId);
  const { error: cardError } = await window.riftTradeSupabase
    .from('listing_cards')
    .insert(selectedListingCardIds.map((cardId) => ({ listing_id: listing.id, card_id: cardId, quantity: selectedListingCardQuantities[cardId] || 1, condition: selectedListingCardConditions[cardId] || 'near_mint', price: selectedListingCardPrices[cardId] === '' ? null : Number(selectedListingCardPrices[cardId]) || null, language: listingLanguage.value.trim(), notes: listingDescription.value.trim() || null })));
  if (cardError) {
    if (!editingListingId) await window.riftTradeSupabase.from('listings').delete().eq('id', listing.id);
    listingSubmit.disabled = false;
    return setListingMessage(cardError.message, true);
  }
  listingForm.reset();
  populateListingCards();
  listingLanguage.value = 'English';
  listingSubmit.disabled = false;
  listingDialog.close();
  editingListingId = null;
  await loadListings();
});

function renderListingCardResults() {
  const query = normalizeCardSearch(listingCardSearch.value);
  const matches = cards
    .filter((card) => !selectedListingCardIds.includes(card.id))
    .map((card) => ({ card, score: scoreCardSearchMatch(card, query) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 12)
    .map(({ card }) => card);
    listingCardResults.innerHTML = matches.map((card) => { const imageUrl = getCardImageUrl(card); const badge = card.is_signed ? 'Signature' : card.is_overnumbered ? 'Overnumbered' : ''; return `<button class="listing-card-option" type="button" data-listing-card-id="${escapeHtml(card.id)}">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" loading="lazy" />` : '<span class="listing-card-option-placeholder">R</span>'}<span class="listing-card-option-copy"><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(card.code || card.public_code || card.id)}${card.set_name ? ` · ${escapeHtml(card.set_name)}` : ''}</span>${badge ? `<em class="listing-card-option-badge ${badge === 'Signature' ? 'is-signature' : ''}">${badge}</em>` : ''}</span></button>`; }).join('');
  listingCardResults.hidden = matches.length === 0;
}

function normalizeCardSearch(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function cardSearchFields(card) {
  return [card.name, card.code, card.public_code, card.set_name, card.set_code]
    .filter(Boolean)
    .map(normalizeCardSearch);
}

function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function scoreSearchToken(queryToken, candidateTokens) {
  let bestScore = 0;
  candidateTokens.forEach((candidateToken) => {
    if (candidateToken === queryToken) bestScore = Math.max(bestScore, 100);
    else if (candidateToken.startsWith(queryToken) || queryToken.startsWith(candidateToken)) bestScore = Math.max(bestScore, 80);
    else if (queryToken.length >= 3 && candidateToken.length >= 3) {
      const distance = editDistance(queryToken, candidateToken);
      const allowedDistance = queryToken.length >= 8 ? 2 : queryToken.length >= 5 ? 1 : 0;
      if (distance <= allowedDistance) bestScore = Math.max(bestScore, 60 - distance * 10);
    }
  });
  return bestScore;
}

function scoreCardSearchMatch(card, query) {
  if (!query) return 1;
  const fields = cardSearchFields(card);
  const combined = fields.join(' ');
  if (fields[0].includes(query)) return 500;
  if (combined.includes(query)) return 300;
  const queryTokens = query.split(' ');
  const tokenScores = queryTokens.map((token) => {
    const nameScore = scoreSearchToken(token, fields[0].split(' '));
    const metadataScore = scoreSearchToken(token, fields.slice(1).flatMap((field) => field.split(' ')));
    return Math.max(nameScore + (nameScore ? 100 : 0), metadataScore);
  });
  if (tokenScores.some((score) => score === 0)) return 0;
  return tokenScores.reduce((total, score) => total + score, 0);
}

function populateListingCards() {
  listingCardSearch.value = '';
  selectedListingCardIds = [];
  selectedListingCardQuantities = {};
  selectedListingCardConditions = {};
  selectedListingCardPrices = {};
  listingCardSelected.innerHTML = '';
  listingCardSearch.setCustomValidity('Choose at least one card from the search results.');
}

listingCardSearch.addEventListener('input', () => {
  renderListingCardResults();
});
listingCardSearch.addEventListener('focus', renderListingCardResults);
listingCardResults.addEventListener('click', (event) => {
  const option = event.target.closest('[data-listing-card-id]');
  if (!option) return;
  const card = cards.find((item) => item.id === option.dataset.listingCardId);
  if (!card) return;
  if (!selectedListingCardIds.includes(card.id)) {
    selectedListingCardIds.push(card.id);
    selectedListingCardQuantities[card.id] = 1;
    selectedListingCardConditions[card.id] = 'near_mint';
    selectedListingCardPrices[card.id] = '';
  }
  listingCardSearch.value = '';
  renderSelectedListingCards();
  listingCardSearch.blur();
  listingCardResults.hidden = true;
});

function renderSelectedListingCards() {
  listingCardSelected.innerHTML = selectedListingCardIds.map((cardId) => {
    const card = cards.find((item) => item.id === cardId);
    if (!card) return '';
    const imageUrl = getCardImageUrl(card);
      const badge = card.is_signed ? 'Signature' : card.is_overnumbered ? 'Overnumbered' : '';
      const condition = selectedListingCardConditions[card.id] || 'near_mint';
      const price = selectedListingCardPrices[card.id] ?? '';
      return `<span class="listing-card-selected-item">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" />` : ''}<span>${escapeHtml(card.name)}${badge ? `<small class="listing-card-option-badge ${badge === 'Signature' ? 'is-signature' : ''}">${badge}</small>` : ''}</span><label class="listing-card-quantity">Qty<input type="number" min="1" max="999" step="1" value="${selectedListingCardQuantities[card.id] || 1}" data-listing-card-quantity="${escapeHtml(card.id)}" aria-label="Quantity for ${escapeHtml(card.name)}" /></label><label class="listing-card-condition">Condition<select data-listing-card-condition="${escapeHtml(card.id)}" aria-label="Condition for ${escapeHtml(card.name)}"><option value="near_mint"${condition === 'near_mint' ? ' selected' : ''}>Near mint</option><option value="lightly_played"${condition === 'lightly_played' ? ' selected' : ''}>Lightly played</option><option value="moderately_played"${condition === 'moderately_played' ? ' selected' : ''}>Moderately played</option><option value="heavily_played"${condition === 'heavily_played' ? ' selected' : ''}>Heavily played</option><option value="damaged"${condition === 'damaged' ? ' selected' : ''}>Damaged</option></select></label><label class="listing-card-price">Price<input type="number" min="0" step="0.01" value="${escapeHtml(price)}" data-listing-card-price="${escapeHtml(card.id)}" aria-label="Price for ${escapeHtml(card.name)}" /></label><button type="button" data-remove-listing-card="${escapeHtml(card.id)}" aria-label="Remove ${escapeHtml(card.name)}">×</button></span>`;
  }).join('');
  listingCardSearch.setCustomValidity(selectedListingCardIds.length ? '' : 'Choose at least one card from the search results.');
}

listingCardSelected.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-listing-card]');
  if (!removeButton) return;
  selectedListingCardIds = selectedListingCardIds.filter((cardId) => cardId !== removeButton.dataset.removeListingCard);
    delete selectedListingCardQuantities[removeButton.dataset.removeListingCard];
    delete selectedListingCardConditions[removeButton.dataset.removeListingCard];
    delete selectedListingCardPrices[removeButton.dataset.removeListingCard];
  renderSelectedListingCards();
  listingCardResults.hidden = true;
});

listingCardSelected.addEventListener('input', (event) => {
  const quantityInput = event.target.closest('[data-listing-card-quantity]');
  if (!quantityInput) return;
  selectedListingCardQuantities[quantityInput.dataset.listingCardQuantity] = Math.max(Number(quantityInput.value) || 1, 1);
});

listingCardSelected.addEventListener('change', (event) => {
  const conditionSelect = event.target.closest('[data-listing-card-condition]');
  if (conditionSelect) selectedListingCardConditions[conditionSelect.dataset.listingCardCondition] = conditionSelect.value;
  const priceInput = event.target.closest('[data-listing-card-price]');
  if (priceInput) selectedListingCardPrices[priceInput.dataset.listingCardPrice] = priceInput.value;
});

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.listing-card-picker')) listingCardResults.hidden = true;
});

async function loadCatalog() {
  if (!window.riftTradeSupabase) {
    marketStatus.textContent = 'Add your Supabase URL and anon key to load listings.';
    return;
  }
  const pageSize = 1000;
  const catalog = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await window.riftTradeSupabase
      .from('cards')
      .select('id, name, code, public_code, set_code, set_name, collector_number, rarity, type, cost, might, power, domains, tags, ability_text, image_file, image_path, image_url, is_overnumbered, is_signed')
      .order('name')
      .range(offset, offset + pageSize - 1);
    if (error) {
      marketStatus.textContent = `Could not load cards: ${error.message}`;
      return;
    }
    catalog.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }
  cards = catalog;
  populateListingCards();
  populateCatalogFilters();
  renderHeroCards();
  renderCatalog();
}

function formatMetric(value) {
  if (value === null || value === undefined) return '—';
  const number = Number(value);
  return Number.isFinite(number) ? new Intl.NumberFormat().format(number) : '—';
}

function renderHomeStats(stats) {
  metricCardsListed.textContent = formatMetric(stats.cards_listed);
  metricActiveTraders.textContent = formatMetric(stats.active_traders);
  metricTradesCompleted.textContent = formatMetric(stats.trades_completed);
}

async function loadHomeStats() {
  if (!window.riftTradeSupabase) return;
  const { data, error } = await window.riftTradeSupabase.rpc('get_public_stats');
  if (!error && data?.[0]) {
    renderHomeStats(data[0]);
    return;
  }
  const [{ count: activeTraders }, { data: activeCards }] = await Promise.all([
    window.riftTradeSupabase.from('profiles').select('id', { count: 'exact', head: true }),
    window.riftTradeSupabase.from('listing_cards').select('quantity, listings!inner(status)').eq('listings.status', 'active'),
  ]);
  renderHomeStats({
    cards_listed: (activeCards || []).reduce((total, { quantity }) => total + Math.max(Number(quantity) || 1, 1), 0),
    active_traders: activeTraders,
    trades_completed: null,
  });
}

function listingSelect(includeCardPrice = true) {
  return `id, title, description, listing_type, price, currency, status, seller_id, created_at, seller:profiles(display_name, username), listing_cards(quantity, condition, ${includeCardPrice ? 'price, ' : ''}language, notes, card:cards(id, name, code, public_code, set_code, set_name, collector_number, rarity, type, cost, might, power, domains, tags, ability_text, image_file, image_path, image_url, is_overnumbered, is_signed))`;
}

async function loadListings() {
  if (!window.riftTradeSupabase) return;
  let { data, error } = await window.riftTradeSupabase
    .from('listings')
    .select(listingSelect())
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error?.message?.includes('listing_cards_1.price')) ({ data, error } = await window.riftTradeSupabase.from('listings').select(listingSelect(false)).eq('status', 'active').order('created_at', { ascending: false }));
  if (error) {
    marketStatus.textContent = `Could not load listings: ${error.message}`;
    return;
  }
  listings = data || [];
  marketStatus.textContent = listings.length ? `${listings.length} active listings` : 'No active listings yet. Be the first to list a card.';
  renderListings();
}

async function loadMyListings() {
  if (!window.riftTradeSupabase) {
    myListingsStatus.textContent = 'Add your Supabase URL and anon key to load listings.';
    return;
  }
  myListingsStatus.textContent = 'Loading your listings...';
  const { data: { user } } = await window.riftTradeSupabase.auth.getUser();
  if (!user) {
    myListings = [];
    renderMyListings();
    myListingsCount.textContent = 'Sign in required';
    myListingsStatus.textContent = 'Sign in to see the listings you have posted.';
    myListingsEmpty.hidden = true;
    return;
  }
  let { data, error } = await window.riftTradeSupabase
    .from('listings')
    .select(listingSelect())
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });
  if (error?.message?.includes('listing_cards_1.price')) ({ data, error } = await window.riftTradeSupabase.from('listings').select(listingSelect(false)).eq('seller_id', user.id).order('created_at', { ascending: false }));
  if (error) {
    myListingsStatus.textContent = `Could not load your listings: ${error.message}`;
    return;
  }
  myListings = data || [];
  myListingsStatus.textContent = myListings.length ? 'Manage your listings from their details.' : 'Your listings will appear here once you list a card.';
  renderMyListings();
}

searchInput.addEventListener('input', renderListings);
catalogSearch.addEventListener('input', renderCatalog);
catalogSetFilter.addEventListener('change', renderCatalog);
catalogDomainOptions.addEventListener('change', renderCatalog);
catalogRarityFilter.addEventListener('change', renderCatalog);
catalogTypeFilter.addEventListener('change', renderCatalog);
catalogFilterClear.addEventListener('click', () => {
  catalogSearch.value = '';
  catalogSetFilter.value = '';
  catalogDomainOptions.querySelectorAll('input:checked').forEach((input) => { input.checked = false; });
  catalogRarityFilter.value = '';
  catalogTypeFilter.value = '';
  renderCatalog();
});
catalogGrid.addEventListener('click', (event) => {
  const cardButton = event.target.closest('[data-catalog-card-id]');
  if (cardButton) openCardDialog(cardButton.dataset.catalogCardId);
});
document.querySelector('[data-view="trades"]').addEventListener('click', loadMyListings);
loadCatalog();
loadListings();
loadHomeStats();

function setAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.classList.toggle('is-error', isError);
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';
  const isRecovery = mode === 'recovery';
  authTitle.textContent = isSignup ? 'Create your account' : isForgot ? 'Reset your password' : isRecovery ? 'Choose a new password' : 'Welcome back';
  authIntro.textContent = isSignup ? 'Join the trading network and keep your collection moving.' : isForgot ? 'We will email you a secure password-reset link.' : isRecovery ? 'Choose a new password for your RiftTrade account.' : 'Sign in to manage your trades and listings.';
  nameField.hidden = !isSignup;
  passwordField.hidden = isForgot || isRecovery;
  newPasswordField.hidden = !isRecovery;
  authEmail.parentElement.hidden = isRecovery;
  authPassword.required = isSignup || mode === 'signin';
  authNewPassword.required = isRecovery;
  authSubmit.innerHTML = `${isSignup ? 'Create account' : isForgot ? 'Send reset link' : isRecovery ? 'Update password' : 'Sign in'} <span>→</span>`;
  authLinks.hidden = isRecovery;
  setAuthMessage('');
}

function openAccount() {
  if (accountDialog.open) return;
  accountDialog.showModal();
  authEmail.focus();
}

async function refreshAuthState() {
  if (!window.riftTradeSupabase) return;
  const { data: { session } } = await window.riftTradeSupabase.auth.getSession();
  const user = session?.user;
  signedInPanel.hidden = !user;
  authForm.hidden = Boolean(user);
  authLinks.hidden = Boolean(user);
  if (user) {
    signedInEmail.textContent = user.email || 'your account';
  }
  if (views.find((view) => view.dataset.page === 'trades')?.classList.contains('is-visible')) loadMyListings();
}

profileButton.addEventListener('click', openAccount);
accountClose.addEventListener('click', () => accountDialog.close());
accountDialog.addEventListener('click', (event) => { if (event.target === accountDialog) accountDialog.close(); });
document.querySelectorAll('[data-auth-mode]').forEach((link) => link.addEventListener('click', () => setAuthMode(link.dataset.authMode)));

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.riftTradeSupabase) return setAuthMessage('Add your Supabase URL and anon key first.', true);
  authSubmit.disabled = true;
  setAuthMessage('Working...');
  let result;
  if (authMode === 'signup') {
    result = await window.riftTradeSupabase.auth.signUp({ email: authEmail.value, password: authPassword.value, options: { data: { display_name: authName.value.trim() } } });
  } else if (authMode === 'forgot') {
    result = await window.riftTradeSupabase.auth.resetPasswordForEmail(authEmail.value, { redirectTo: `${window.location.origin}${window.location.pathname}#reset-password` });
  } else if (authMode === 'recovery') {
    result = await window.riftTradeSupabase.auth.updateUser({ password: authNewPassword.value });
  } else {
    result = await window.riftTradeSupabase.auth.signInWithPassword({ email: authEmail.value, password: authPassword.value });
  }
  authSubmit.disabled = false;
  if (result.error) return setAuthMessage(result.error.message, true);
  if (authMode === 'signup') return setAuthMessage('Account created. Check your email if confirmation is enabled.');
  if (authMode === 'forgot') return setAuthMessage('Reset link sent. Check your email.');
  if (authMode === 'recovery') { setAuthMode('signin'); return setAuthMessage('Password updated. You can sign in now.'); }
  await refreshAuthState();
  setAuthMessage('Signed in successfully.');
});

document.querySelector('#sign-out').addEventListener('click', async () => {
  await window.riftTradeSupabase?.auth.signOut();
  await refreshAuthState();
  setAuthMessage('You are signed out.');
});

if (window.riftTradeSupabase) {
  window.riftTradeSupabase.auth.onAuthStateChange(() => refreshAuthState());
  refreshAuthState();
  if (window.location.hash === '#reset-password') {
    setAuthMode('recovery');
    openAccount();
  }
}

const initialView = window.location.hash.slice(1);
showView(views.some((view) => view.dataset.page === initialView) ? initialView : 'home');