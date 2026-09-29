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
    if (viewName === 'home') {
      loadHomeStats();
      if (!cards.length) loadCatalog();
    }
  else if (viewName === 'marketplace') loadListings();
  else if (viewName === 'catalog') loadCatalog();
  else if (viewName === 'trades') loadMyListings();
  else if (viewName === 'inbox') inboxLoadPromise = loadInbox();
}

navItems.forEach((item) => item.addEventListener('click', () => showView(item.dataset.view)));
document.querySelectorAll('[data-go]').forEach((item) => item.addEventListener('click', () => showView(item.dataset.go)));

const searchInput = document.querySelector('#card-search');
const marketGrid = document.querySelector('#market-grid');
const marketStatus = document.querySelector('#market-status');
const emptyMessage = document.querySelector('#market-empty');
const marketFilterButton = document.querySelector('#market-filter-button');
const marketFilterPanel = document.querySelector('#market-filter-panel');
const marketTypeFilter = document.querySelector('#market-type-filter');
const marketMinPrice = document.querySelector('#market-min-price');
const marketMaxPrice = document.querySelector('#market-max-price');
const marketFilterClear = document.querySelector('#market-filter-clear');
const catalogSearch = document.querySelector('#catalog-search');
const catalogGrid = document.querySelector('#catalog-grid');
const catalogCount = document.querySelector('#catalog-count');
const catalogStatus = document.querySelector('#catalog-status');
const catalogEmpty = document.querySelector('#catalog-empty');
const catalogFilterButton = document.querySelector('#catalog-filter-button');
const catalogFilterPanel = document.querySelector('#catalog-filter-panel');
const catalogPagination = document.querySelector('#catalog-pagination');
const catalogPrevious = document.querySelector('#catalog-previous');
const catalogNext = document.querySelector('#catalog-next');
const catalogPageStatus = document.querySelector('#catalog-page-status');
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
const listingTypeOptions = document.querySelectorAll('[data-listing-type]');
const listingDescription = document.querySelector('#listing-description');
const accountDialog = document.querySelector('#account-dialog');
const profileButton = document.querySelector('#profile-button');
const profileButtonAvatar = document.querySelector('#profile-button-avatar');
const profileMenu = document.querySelector('#profile-menu');
const profileMenuView = document.querySelector('#profile-menu-view');
const profileMenuSignOut = document.querySelector('#profile-menu-sign-out');
const accountClose = document.querySelector('#account-close');
const authForm = document.querySelector('#auth-form');
const authLinks = document.querySelector('#auth-links');
const authModeToggle = authLinks.querySelector('button[data-auth-mode="signup"]');
const authMessage = document.querySelector('#auth-message');
const authTitle = document.querySelector('#account-title');
const authIntro = document.querySelector('#account-intro');
const authSubmit = document.querySelector('#auth-submit');
const discordAuthButton = document.querySelector('#discord-auth');
const passwordField = document.querySelector('#password-field');
const newPasswordField = document.querySelector('#new-password-field');
const nameField = document.querySelector('#name-field');
const signedInPanel = document.querySelector('#signed-in-panel');
const signedInName = document.querySelector('#signed-in-name');
const signedInEmail = document.querySelector('#signed-in-email');
const discordNameForm = document.querySelector('#discord-name-form');
const discordName = document.querySelector('#discord-name');
const discordNameSubmit = document.querySelector('#discord-name-submit');
const profileDialog = document.querySelector('#profile-dialog');
const profileClose = document.querySelector('#profile-close');
const profileTitle = document.querySelector('#profile-title');
const profileAvatarButton = document.querySelector('#profile-avatar-button');
const profileAvatar = document.querySelector('#profile-avatar');
const profileAvatarStatic = document.querySelector('#profile-avatar-static');
const profileAvatarInput = document.querySelector('#profile-avatar-input');
const profileDisplayName = document.querySelector('#profile-display-name');
const profileEmail = document.querySelector('#profile-email');
const profileMemberSince = document.querySelector('#profile-member-since');
const profileDiscordField = document.querySelector('#profile-discord-field');
const profileDiscordLink = document.querySelector('#profile-discord-link');
const profileEditButton = document.querySelector('#profile-edit');
const profileMessageButton = document.querySelector('#profile-message');
const profileEditDialog = document.querySelector('#profile-edit-dialog');
const profileEditClose = document.querySelector('#profile-edit-close');
const profileEditForm = document.querySelector('#profile-edit-form');
const profileEditName = document.querySelector('#profile-edit-name');
const profileEditSubmit = document.querySelector('#profile-edit-submit');
const profileEditMessage = document.querySelector('#profile-edit-message');
const profileListingCount = document.querySelector('#profile-listing-count');
const profileListingsStatus = document.querySelector('#profile-listings-status');
const profileListingsGrid = document.querySelector('#profile-listings');
const inboxUnreadCount = document.querySelector('#inbox-unread-count');
const inboxLayout = document.querySelector('#inbox-layout');
const inboxStatus = document.querySelector('#inbox-status');
const inboxSignInButton = document.querySelector('#inbox-sign-in');
const inboxRecipientForm = document.querySelector('#inbox-recipient-form');
const inboxRecipientSearch = document.querySelector('#inbox-recipient-search');
const inboxRecipientResults = document.querySelector('#inbox-recipient-results');
const inboxConversationFilter = document.querySelector('#inbox-conversation-filter');
const inboxConversationList = document.querySelector('#inbox-conversation-list');
const inboxEmptyState = document.querySelector('#inbox-empty-state');
const inboxActive = document.querySelector('#inbox-active');
const inboxPeerAvatar = document.querySelector('#inbox-peer-avatar');
const inboxPeerProfile = document.querySelector('#inbox-peer-profile');
const inboxBack = document.querySelector('#inbox-back');
const inboxThread = document.querySelector('#inbox-thread');
const inboxTyping = document.querySelector('#inbox-typing');
const inboxTypingLabel = document.querySelector('#inbox-typing-label');
const inboxMessageStatus = document.querySelector('#inbox-message-status');
const inboxMessageForm = document.querySelector('#inbox-message-form');
const inboxMessageInput = document.querySelector('#inbox-message-input');
const inboxSend = document.querySelector('#inbox-send');
const inboxNewMessage = document.querySelector('#inbox-new-message');
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
const cardDialogTcgplayer = document.querySelector('#card-dialog-tcgplayer');
const listingDetailsDialog = document.querySelector('#listing-details-dialog');
const listingDetailsClose = document.querySelector('#listing-details-close');
const listingDetailsTitle = document.querySelector('#listing-details-title');
const listingDetailsStatus = document.querySelector('#listing-details-status');
const listingDetailsSeller = document.querySelector('#listing-details-seller');
const listingDetailsMeta = document.querySelector('#listing-details-meta');
const listingDetailsDescription = document.querySelector('#listing-details-description');
const listingDetailsCards = document.querySelector('#listing-details-cards');
const listingDetailsActions = document.querySelector('#listing-details-actions');
const listingDetailsContact = document.querySelector('#listing-details-contact');
const listingMessageButton = document.querySelector('#listing-contact-message');
const listingEditButton = document.querySelector('#listing-edit');
const listingPendingButton = document.querySelector('#listing-pending');
const listingSoldButton = document.querySelector('#listing-sold');
const listingDeleteButton = document.querySelector('#listing-delete');
const listingDialogTitle = document.querySelector('#listing-title');
const myListingsGrid = document.querySelector('#my-listings-grid');
const myListingsCount = document.querySelector('#my-listings-count');
const myListingsStatus = document.querySelector('#my-listings-status');
const myListingsEmpty = document.querySelector('#my-listings-empty');
const myListingsFilter = document.querySelector('#my-listings-filter');
let editingListingId = null;

let cards = [];
let catalogLoadPromise = null;
let listings = [];
let myListings = [];
let profileListings = [];
let signedInUser = null;
let authStateReady = false;
let inboxConversations = [];
let activeConversationId = null;
let inboxSharedListings = [];
let inboxRealtimeChannel = null;
let inboxRealtimeConversationId = null;
let inboxTypingTimer = null;
let inboxTypingConversationId = null;
let inboxLoadPromise = null;
let inboxRecipientSearchTimer = null;
let catalogPage = 0;
const catalogPageSize = 25;
let selectedListingCardIds = [];
let selectedListingCardQuantities = {};
let selectedListingCardConditions = {};
let selectedListingCardPrices = {};
let selectedListingCardLanguages = {};
let selectedListingCardFoils = {};
let authMode = 'signin';
const discordOnboardingStorageKey = 'riftTradeDiscordOnboarding';
const displayNameMinLength = 2;
const displayNameMaxLength = 40;

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

function renderListingCarouselTiles(listing, page, query) {
  const listingCards = listing.listing_cards || [];
  const pageSize = 4;
  const matchingCardIndex = query ? listingCards.findIndex(({ card }) => card && scoreCardSearchMatch(card, query) > 0) : -1;
  return listingCards.slice(page * pageSize, (page + 1) * pageSize).map(({ card, quantity }, visibleCardIndex) => {
    const listingImageUrl = getCardImageUrl(card || {});
    const quantityBadge = Number(quantity) > 1 ? `<span class="listing-card-quantity-badge">X${Math.max(Number(quantity) || 1, 1)}</span>` : '';
    const isSearchMatch = matchingCardIndex === page * pageSize + visibleCardIndex;
    return `<span class="listing-card-tile${isSearchMatch ? ' is-search-match' : ''}">${listingImageUrl ? `<img src="${escapeHtml(listingImageUrl)}" alt="${escapeHtml(card?.name || 'Riftbound card')} card art" loading="lazy" />` : `<span>${escapeHtml(card?.name || 'Riftbound card')}</span>`}${quantityBadge}</span>`;
  }).join('');
}

function changeListingCarouselPage(listing, page, container = marketGrid, query = searchInput.value.trim().toLowerCase()) {
  const pageSize = 4;
  const listingCards = listing.listing_cards || [];
  const totalPages = Math.ceil(listingCards.length / pageSize);
  listing.activeCardIndex = page * pageSize;
  const article = [...container.querySelectorAll('.listing')].find((item) => item.dataset.listingId === String(listing.id));
  const artwork = article?.querySelector('.card-art.is-carousel');
  if (!artwork) return;
  artwork.querySelectorAll('.listing-card-tile').forEach((tile) => tile.remove());
  artwork.insertAdjacentHTML('afterbegin', renderListingCarouselTiles(listing, page, query));
  const count = artwork.querySelector('.listing-image-count');
  if (count) count.textContent = `${page + 1} / ${totalPages}`;
}

function renderMarketplaceListingCard(listing, query = '', includeStatus = false) {
  const listingCards = listing.listing_cards || [];
  const isGrid = listingCards.length > 1 && listingCards.length <= 4;
  const isCarousel = listingCards.length > 4;
  const pageSize = 4;
  const totalPages = Math.ceil(listingCards.length / pageSize);
  const matchingCardIndex = query ? listingCards.findIndex(({ card }) => card && scoreCardSearchMatch(card, query) > 0) : -1;
  const activePage = isCarousel
    ? matchingCardIndex >= 0
      ? Math.floor(matchingCardIndex / pageSize)
      : Math.min(Math.floor(Number(listing.activeCardIndex || 0) / pageSize), totalPages - 1)
    : 0;
  if (isCarousel && matchingCardIndex >= 0) listing.activeCardIndex = activePage * pageSize;
  const visibleCards = isCarousel ? listingCards.slice(activePage * pageSize, (activePage + 1) * pageSize) : listingCards;
  const card = listingCards[0]?.card || {};
  const imageUrl = getCardImageUrl(card);
  const seller = listing.seller?.display_name || listing.seller?.username || 'RiftTrade member';
  const cardArt = isCarousel
    ? renderListingCarouselTiles(listing, activePage, query)
    : isGrid
      ? visibleCards.map(({ card: listingCard, quantity }, visibleCardIndex) => {
        const listingImageUrl = getCardImageUrl(listingCard || {});
        const quantityBadge = Number(quantity) > 1 ? `<span class="listing-card-quantity-badge">X${Math.max(Number(quantity) || 1, 1)}</span>` : '';
        const isSearchMatch = matchingCardIndex === activePage * pageSize + visibleCardIndex;
        return `<span class="listing-card-tile${isSearchMatch ? ' is-search-match' : ''}">${listingImageUrl ? `<img src="${escapeHtml(listingImageUrl)}" alt="${escapeHtml(listingCard?.name || 'Riftbound card')} card art" loading="lazy" />` : `<span>${escapeHtml(listingCard?.name || 'Riftbound card')}</span>`}${quantityBadge}</span>`;
      }).join('')
      : imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" loading="lazy" />` : `<span>${escapeHtml(card.name || listing.title)}</span>`;
  const singleQuantity = Math.max(Number(listingCards[0]?.quantity) || 1, 1);
  const singleQuantityBadge = !isGrid && !isCarousel && singleQuantity > 1 ? `<span class="listing-card-quantity-badge">X${singleQuantity}</span>` : '';
  const carouselControls = isCarousel ? `<button class="listing-image-button listing-image-prev" data-listing-id="${escapeHtml(listing.id)}" data-direction="-1" type="button" aria-label="Previous card page">←</button><span class="listing-image-count">${activePage + 1} / ${totalPages}</span><button class="listing-image-button listing-image-next" data-listing-id="${escapeHtml(listing.id)}" data-direction="1" type="button" aria-label="Next card page">→</button>` : '';
  const statusClass = listing.status === 'active' ? 'status-active' : listing.status === 'completed' ? 'status-sold' : 'status-pending';
  const showStatusOverlay = includeStatus && ['paused', 'completed'].includes(listing.status);
  const statusOverlay = showStatusOverlay ? `<div class="profile-listing-status-overlay"><span class="my-listing-status ${statusClass}">${escapeHtml(listingStatusLabel(listing.status))}</span></div>` : '';
  return `<article class="listing${showStatusOverlay ? ' profile-listing-inactive' : ''}" data-listing-id="${escapeHtml(listing.id)}" data-search="${escapeHtml(listing.title)}" tabindex="0" role="button" aria-label="Open listing ${escapeHtml(listing.title)}">
    <div class="card-art${isGrid || isCarousel ? ` multi-card-art${listingCards.length === 2 ? ' two-card-art' : ''}` : imageUrl ? ' has-image' : ''}${isCarousel ? ' is-carousel' : ''}${!isGrid && !isCarousel && matchingCardIndex === 0 ? ' is-search-match' : ''}">
      ${cardArt}
      ${isGrid || isCarousel ? '' : renderCardBadges(card)}${singleQuantityBadge}${carouselControls}
      ${statusOverlay}
    </div>
    <div class="listing-copy"><div class="listing-summary"><strong>${escapeHtml(listing.title)}</strong><b>${escapeHtml(listingPriceLabel(listing))}</b></div><div class="listing-poster"><span>By <button class="profile-link" data-profile-id="${escapeHtml(listing.seller_id)}" type="button">${escapeHtml(seller)}</button></span><span class="listing-type-indicator type-${listingTypeClass(listing.listing_type)}">${escapeHtml(listingTypeLabel(listing.listing_type))}</span></div></div>
  </article>`;
}

function bindMarketplaceListingCards(container, sourceListings, query = '') {
  const sourceById = new Map(sourceListings.map((listing) => [String(listing.id), listing]));
  container.querySelectorAll('.listing').forEach((article) => {
    const openListing = () => {
      openListingDetails(article.dataset.listingId);
    };
    article.addEventListener('click', (event) => {
      if (container.dataset.swipedAt && Date.now() - Number(container.dataset.swipedAt) < 800) return;
      if (event.target.closest('.listing-image-button, .profile-link')) return;
      openListing();
    });
    article.addEventListener('keydown', (event) => {
      if (event.target.closest('.listing-image-button, .profile-link')) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openListing();
    });
  });
  container.querySelectorAll('.profile-link').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    openProfileDialog(button.dataset.profileId);
  }));
  container.querySelectorAll('.listing-image-button').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const listing = sourceById.get(String(button.dataset.listingId));
    if (!listing) return;
    const pageSize = 4;
    const totalPages = Math.ceil((listing.listing_cards || []).length / pageSize);
    const currentPage = Math.floor(Number(listing.activeCardIndex || 0) / pageSize);
    const nextPage = (currentPage + Number(button.dataset.direction) + totalPages) % totalPages;
    changeListingCarouselPage(listing, nextPage, container, query);
  }));
  container.querySelectorAll('.card-art.is-carousel').forEach((artwork) => {
    let touchStart = null;
    artwork.addEventListener('touchstart', (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    artwork.addEventListener('touchend', (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const horizontalDistance = touch.clientX - touchStart.x;
      const verticalDistance = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(horizontalDistance) < 40 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return;
      const article = artwork.closest('.listing');
      const listing = sourceById.get(String(article?.dataset.listingId));
      if (!listing) return;
      container.dataset.swipedAt = String(Date.now());
      const pageSize = 4;
      const totalPages = Math.ceil((listing.listing_cards || []).length / pageSize);
      const currentPage = Math.floor(Number(listing.activeCardIndex || 0) / pageSize);
      const direction = horizontalDistance < 0 ? 1 : -1;
      const nextPage = (currentPage + direction + totalPages) % totalPages;
      changeListingCarouselPage(listing, nextPage, container, query);
    }, { passive: true });
  });
}

function renderListings() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedListingType = marketTypeFilter.value;
  const minimumPrice = Number(marketMinPrice.value);
  const maximumPrice = Number(marketMaxPrice.value);
  const hasMinimumPrice = Number.isFinite(minimumPrice) && marketMinPrice.value !== '';
  const hasMaximumPrice = Number.isFinite(maximumPrice) && marketMaxPrice.value !== '';
  marketFilterButton.classList.toggle('is-active', Boolean(selectedListingType || hasMinimumPrice || hasMaximumPrice));
  const matches = listings.filter((listing) => {
    const listingCards = listing.listing_cards || [];
    const searchable = [listing.title, listing.description, listing.seller?.display_name, ...listingCards.flatMap(({ card }) => [card?.name, card?.set_name, card?.code])].filter(Boolean).join(' ').toLowerCase();
    const prices = listingCards.map(({ price }) => Number(price)).filter(Number.isFinite);
    const lowestPrice = prices.length ? Math.min(...prices) : Number(listing.price);
    const highestPrice = prices.length ? Math.max(...prices) : Number(listing.price);
    const matchesPrice = (!hasMinimumPrice && !hasMaximumPrice)
      || (Number.isFinite(lowestPrice) && Number.isFinite(highestPrice)
        && (!hasMinimumPrice || highestPrice >= minimumPrice)
        && (!hasMaximumPrice || lowestPrice <= maximumPrice));
    const matchesType = !selectedListingType
      || listing.listing_type === selectedListingType
      || (listing.listing_type === 'trade_or_sale' && ['sale', 'trade'].includes(selectedListingType));
    return searchable.includes(query) && matchesType && matchesPrice;
  });
  marketGrid.innerHTML = matches.map((listing) => renderMarketplaceListingCard(listing, query)).join('');
  emptyMessage.hidden = matches.length !== 0;
  bindMarketplaceListingCards(marketGrid, matches, query);
}

function renderCatalog() {
  const query = normalizeCardSearch(catalogSearch.value);
  const selectedSet = catalogSetFilter.value;
  const selectedDomains = [...catalogDomainOptions.querySelectorAll('input:checked')].map((input) => input.value);
  const selectedRarity = catalogRarityFilter.value;
  const selectedType = catalogTypeFilter.value;
  const activeFilterCount = [selectedSet, selectedRarity, selectedType].filter(Boolean).length + selectedDomains.length;
  catalogFilterButton.classList.toggle('is-active', activeFilterCount > 0);
  const matches = cards.filter((card) => {
    if (selectedSet && card.set_name !== selectedSet) return false;
    if (selectedRarity && card.rarity !== selectedRarity) return false;
    if (selectedType && card.type !== selectedType) return false;
    if (selectedDomains.length && !selectedDomains.every((domain) => cardDomains(card).includes(domain))) return false;
    return !query || scoreCardSearchMatch(card, query) > 0;
  });
  const pageCount = Math.ceil(matches.length / catalogPageSize);
  catalogPage = Math.min(catalogPage, Math.max(pageCount - 1, 0));
  const visibleCards = matches.slice(catalogPage * catalogPageSize, (catalogPage + 1) * catalogPageSize);
  catalogGrid.innerHTML = visibleCards.map((card) => {
    const imageUrl = getCardImageUrl(card);
    const details = [card.code || card.public_code, card.set_name, card.rarity].filter(Boolean).join(' · ');
    return `<button class="catalog-card" data-catalog-card-id="${escapeHtml(card.id)}" type="button" aria-label="View details for ${escapeHtml(card.name)}"><div class="catalog-card-art${imageUrl ? ' has-image' : ''}">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" loading="lazy" />` : `<span>${escapeHtml(card.name)}</span>`}${renderCardBadges(card)}</div><span class="catalog-card-copy"><strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(details || 'Riftbound card')}</small></span></button>`;
  }).join('');
  catalogCount.textContent = `${matches.length} / ${cards.length} cards`;
  catalogStatus.textContent = query || activeFilterCount ? `Showing ${matches.length} matching card${matches.length === 1 ? '' : 's'}.` : `${cards.length} cards in the catalog.`;
  catalogEmpty.hidden = matches.length !== 0;
  catalogPagination.hidden = pageCount <= 1;
  catalogPageStatus.textContent = pageCount ? `Page ${catalogPage + 1} of ${pageCount}` : '';
  catalogPrevious.disabled = catalogPage === 0;
  catalogNext.disabled = catalogPage >= pageCount - 1;
}

function renderCatalogFromFirstPage() {
  catalogPage = 0;
  renderCatalog();
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

function listingTypeLabel(listingType) {
  return { sale: 'For sale', trade_or_sale: 'Trade or sale', buy: 'Buying' }[listingType] || 'For trade';
}
function listingTypeClass(listingType) {
  return { sale: 'sale', trade_or_sale: 'trade-or-sale', buy: 'buy' }[listingType] || 'trade';
}
function listingCardCount(listingCards) {
  return listingCards.reduce((total, { quantity }) => total + Math.max(Number(quantity) || 1, 1), 0);
}

function renderListingPreviews(listingCards, previewLimit = 2) {
  const previews = listingCards.slice(0, previewLimit).map(({ card }) => {
    const imageUrl = getCardImageUrl(card || {});
    return imageUrl
      ? `<span class="my-listing-preview-card"><img src="${escapeHtml(imageUrl)}" alt="" loading="lazy" /></span>`
      : `<span class="my-listing-preview-card my-listing-preview-placeholder" aria-hidden="true">${escapeHtml((card?.name || '?').slice(0, 1))}</span>`;
  }).join('');
  const remainingCards = listingCardCount(listingCards.slice(previewLimit));
  return `${previews}${remainingCards > 0 ? `<span class="my-listing-preview-more">+${remainingCards}</span>` : ''}`;
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
  const visibleListings = myListings.filter((listing) => !myListingsFilter.value || listing.status === myListingsFilter.value);
  myListingsGrid.innerHTML = visibleListings.map((listing) => {
    const listingCards = listing.listing_cards || [];
    const cardNames = listingCards.map(({ card, quantity }) => `${quantity > 1 ? `${quantity}× ` : ''}${card?.name || 'Riftbound card'}`).join(', ');
    const cardPreviews = renderListingPreviews(listingCards);
    const listingType = listingTypeLabel(listing.listing_type);
    const price = listingPriceLabel(listing);
    const cardCount = listingCardCount(listingCards);
    const status = listingStatusLabel(listing.status);
    const statusClass = listing.status === 'active' ? 'status-active' : listing.status === 'completed' ? 'status-sold' : 'status-pending';
    return `<article class="my-listing-row"><span class="my-listing-status ${statusClass}">${escapeHtml(status)}</span><div class="my-listing-preview" aria-hidden="true">${cardPreviews}</div><div class="my-listing-main"><strong>${escapeHtml(listing.title)}</strong><span>${escapeHtml(cardNames || 'No cards attached')}</span><small>${escapeHtml([listingType, price, `${cardCount} card${cardCount === 1 ? '' : 's'}`].join(' · '))}</small></div><div class="my-listing-actions"><button class="my-listing-action my-listing-view" data-listing-id="${escapeHtml(listing.id)}" type="button">View</button><button class="my-listing-action my-listing-edit" data-listing-id="${escapeHtml(listing.id)}" type="button">Edit</button><button class="my-listing-action my-listing-delete" data-listing-id="${escapeHtml(listing.id)}" type="button">Delete</button></div></article>`;
  }).join('');
  myListingsCount.textContent = `${myListings.length} listing${myListings.length === 1 ? '' : 's'}`;
  myListingsEmpty.hidden = visibleListings.length !== 0;
  myListingsEmpty.textContent = myListings.length && !visibleListings.length ? 'No listings with this status.' : 'You have not listed any cards yet.';
  myListingsGrid.querySelectorAll('.my-listing-view').forEach((button) => button.addEventListener('click', () => openListingDetails(button.dataset.listingId)));
  myListingsGrid.querySelectorAll('.my-listing-edit').forEach((button) => button.addEventListener('click', () => {
    const listing = myListings.find((item) => item.id === button.dataset.listingId);
    if (listing) openListingForm(listing);
  }));
  myListingsGrid.querySelectorAll('.my-listing-delete').forEach((button) => button.addEventListener('click', async () => {
    const listing = myListings.find((item) => item.id === button.dataset.listingId);
    if (!listing || !window.riftTradeSupabase || !window.confirm(`Delete "${listing.title}"?`)) return;
    const { error } = await window.riftTradeSupabase.from('listings').delete().eq('id', listing.id);
    if (error) {
      myListingsStatus.hidden = false;
      myListingsStatus.textContent = `Could not delete listing: ${error.message}`;
      return;
    }
    await Promise.all([loadListings(), loadMyListings()]);
  }));
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

async function openCardDialog(cardId) {
  if (!cards.length) await loadCatalog();
  const card = cards.find((item) => item.id === cardId);
  if (!card) return;
  cardDialogMarketplace.dataset.cardName = card.name;
  const imageUrl = getCardImageUrl(card);
  cardDialogTitle.textContent = card.name;
  cardDialogBadges.innerHTML = renderCardBadges(card);
  cardDialogSet.textContent = [card.set_name || card.set_code, card.public_code].filter(Boolean).join(' · ') || 'Riftbound catalog';
  const tcgplayerUrl = new URL('https://www.tcgplayer.com/search/riftbound/product');
  tcgplayerUrl.searchParams.set('productLineName', 'riftbound');
  tcgplayerUrl.searchParams.set('q', card.public_code || card.code || '');
  tcgplayerUrl.searchParams.set('view', 'grid');
  cardDialogTcgplayer.href = tcgplayerUrl.toString();
  cardDialogArt.className = `card-dialog-art${imageUrl ? ' has-image' : ''}`;
  cardDialogArt.innerHTML = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" />` : `<span>${escapeHtml(card.name)}</span>`;
  const stats = [['Rarity', card.rarity], ['Type', card.type], ['Cost', card.cost], ['Might', card.might], ['Power', card.power], ['Domains', Array.isArray(card.domains) ? card.domains.join(', ') : card.domains]];
  cardDialogStats.innerHTML = stats.filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  cardDialogAbility.textContent = card.ability_text || 'No ability text listed.';
  cardDialogTags.textContent = Array.isArray(card.tags) && card.tags.length ? `Tags: ${card.tags.join(', ')}` : '';
  cardDialog.showModal();
}

function openListingDetails(listingId) {
  const listing = listings.find((item) => item.id === listingId) || myListings.find((item) => item.id === listingId) || profileListings.find((item) => item.id === listingId) || inboxSharedListings.find((item) => item.id === listingId);
  if (!listing) return;
  listingDetailsDialog.dataset.listingId = listing.id;
  listingDetailsDialog.dataset.listingStatus = listing.status;
  const listingCards = listing.listing_cards || [];
  const seller = listing.seller?.display_name || listing.seller?.username || 'RiftTrade member';
  const listingType = listingTypeLabel(listing.listing_type);
  const price = listingPriceLabel(listing);
  const cardCount = listingCardCount(listingCards);
  listingDetailsTitle.textContent = listing.title;
  listingDetailsStatus.textContent = listingStatusLabel(listing.status);
  const statusClass = listing.status === 'active' ? 'status-active' : listing.status === 'completed' ? 'status-sold' : 'status-pending';
  listingDetailsStatus.className = `my-listing-status ${statusClass}`;
  listingDetailsSeller.innerHTML = `Listed by <button class="profile-link" data-profile-id="${escapeHtml(listing.seller_id)}" type="button">${escapeHtml(seller)}</button>`;
  listingDetailsSeller.querySelector('.profile-link').addEventListener('click', () => openProfileDialog(listing.seller_id));
  listingDetailsMeta.textContent = [listingType, price, `${cardCount} card${cardCount === 1 ? '' : 's'}`].join(' · ');
  listingDetailsDescription.textContent = listing.description || 'No description provided.';
  listingDetailsActions.hidden = true;
  listingDetailsContact.hidden = true;
  listingDetailsCards.innerHTML = listingCards.map(({ card, quantity, condition, language, foil, price }) => {
    const imageUrl = getCardImageUrl(card || {});
    const conditionLabel = condition ? condition.replaceAll('_', ' ').replace(/^./, (character) => character.toUpperCase()) : '';
    const foilLabel = ['common', 'uncommon'].includes(String(card?.rarity || '').toLowerCase()) && foil ? foil === 'foil' ? 'Foil' : 'Non-foil' : '';
    return `<button class="listing-details-card" data-card-id="${escapeHtml(card?.id || '')}" type="button"><span class="listing-details-card-art${imageUrl ? ' has-image' : ''}">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" />` : `<span>${escapeHtml(card?.name || 'Riftbound card')}</span>`}</span><span class="listing-details-card-copy"><span class="listing-details-card-title"><strong>${escapeHtml(card?.name || 'Riftbound card')}</strong>${renderCardBadges(card || {})}</span><span>${escapeHtml([card?.public_code, conditionLabel, language, foilLabel].filter(Boolean).join(' · '))}</span>${price !== null && price !== undefined ? `<small>${escapeHtml(`${formatDollar(price)} each`)}</small>` : ''}</span><span class="listing-details-quantity">× ${escapeHtml(quantity || 1)}</span></button>`;
  }).join('');
  listingDetailsCards.querySelectorAll('[data-card-id]').forEach((button) => button.addEventListener('click', () => openCardDialog(button.dataset.cardId)));
  window.riftTradeSupabase?.auth.getUser().then(({ data: { user } }) => {
    const isOwner = Boolean(user && user.id === listing.seller_id);
    const canChangeStatus = ['active', 'paused'].includes(listing.status);
    const isSold = listing.status === 'completed';
    listingDetailsActions.hidden = !isOwner;
    listingDetailsContact.hidden = isOwner;
    listingPendingButton.hidden = !canChangeStatus;
    listingPendingButton.textContent = listing.status === 'paused' ? 'Remove pending' : 'Mark pending';
    listingSoldButton.hidden = !canChangeStatus && !isSold;
    listingSoldButton.textContent = isSold ? 'Remove sold' : 'Mark sold';
  });
  listingDetailsDialog.showModal();
}

async function openProfileDialog(profileId) {
  if (!profileId || !window.riftTradeSupabase) return;
  const requestedProfileId = String(profileId);
  profileDialog.dataset.profileId = requestedProfileId;
  profileTitle.textContent = 'Loading profile...';
  profileDisplayName.textContent = '';
  profileEditButton.hidden = true;
  profileMessageButton.hidden = true;
  profileMessageButton.dataset.profileId = '';
  profileEmail.textContent = '';
  profileEmail.removeAttribute('href');
  profileDiscordField.hidden = true;
  profileDiscordLink.removeAttribute('href');
  profileListingCount.textContent = '';
  profileListingsStatus.textContent = 'Loading listings...';
  profileListingsGrid.innerHTML = '';
  profileListings = [];
  profileDialog.showModal();

  const profileRequest = (async () => {
    let fields = ['id', 'display_name', 'username', 'email', 'discord_id', 'avatar_url', 'created_at'];
    let emailColumnMissing = false;
    let discordColumnMissing = false;
    let result;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      result = await window.riftTradeSupabase.from('profiles').select(fields.join(', ')).eq('id', requestedProfileId).maybeSingle();
      if (!result.error) break;
      if (result.error.message.includes('profiles.email') && !emailColumnMissing) {
        emailColumnMissing = true;
        fields = fields.filter((field) => field !== 'email');
      } else if (result.error.message.includes('profiles.discord_id') && !discordColumnMissing) {
        discordColumnMissing = true;
        fields = fields.filter((field) => field !== 'discord_id');
      } else {
        break;
      }
    }
    return { ...result, emailColumnMissing, discordColumnMissing };
  })();
  const [profileResult, listingResult] = await Promise.all([
    profileRequest,
    window.riftTradeSupabase.from('listings').select(listingSelect()).eq('seller_id', requestedProfileId).order('created_at', { ascending: false }),
  ]);
  if (profileDialog.dataset.profileId !== requestedProfileId) return;
  if (profileResult.error || !profileResult.data) {
    profileTitle.textContent = 'Profile unavailable';
    profileListingsStatus.textContent = profileResult.error?.message || 'This profile could not be found.';
    return;
  }

  const profile = profileResult.data;
  const displayName = profile.display_name || profile.username || 'RiftTrade member';
  profileTitle.textContent = displayName;
  renderProfileAvatar(displayName, profile.avatar_url);
  profileAvatarButton.hidden = !signedInUser || signedInUser.id !== profile.id;
  profileAvatarStatic.hidden = Boolean(signedInUser && signedInUser.id === profile.id);
  profileDisplayName.textContent = displayName;
  profileEditButton.hidden = !signedInUser || signedInUser.id !== profile.id;
  profileMessageButton.hidden = !signedInUser || signedInUser.id === profile.id;
  profileMessageButton.dataset.profileId = profile.id;
  profileEmail.textContent = profile.email || (profileResult.emailColumnMissing ? 'Run the profile email migration to enable email display.' : 'Email not provided.');
  profileMemberSince.textContent = profile.created_at ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(profile.created_at)) : 'Unknown';
  if (profile.email) profileEmail.href = `mailto:${profile.email}`;
  const discordId = String(profile.discord_id || '');
  if (/^\d{17,20}$/.test(discordId)) {
    profileDiscordLink.href = `https://discord.com/users/${discordId}`;
    profileDiscordField.hidden = false;
  }
  if (listingResult.error) {
    profileListingCount.textContent = '';
    profileListingsStatus.textContent = `Could not load listings: ${listingResult.error.message}`;
    return;
  }

  profileListings = listingResult.data || [];
  profileListingCount.textContent = `${profileListings.length} listing${profileListings.length === 1 ? '' : 's'}`;
  profileListingsStatus.textContent = profileListings.length ? '' : 'No visible listings.';
  profileListingsGrid.innerHTML = profileListings.map((listing) => renderMarketplaceListingCard(listing, '', true)).join('');
  bindMarketplaceListingCards(profileListingsGrid, profileListings);
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
listingMessageButton.addEventListener('click', () => {
  const listing = listings.find((item) => item.id === listingDetailsDialog.dataset.listingId)
    || myListings.find((item) => item.id === listingDetailsDialog.dataset.listingId)
    || profileListings.find((item) => item.id === listingDetailsDialog.dataset.listingId)
    || inboxSharedListings.find((item) => item.id === listingDetailsDialog.dataset.listingId);
  if (!listing) return;
  listingDetailsDialog.close();
  startDirectConversation(listing.seller_id, listing.id);
});
profileClose.addEventListener('click', () => profileDialog.close());
profileDialog.addEventListener('click', (event) => { if (event.target === profileDialog) profileDialog.close(); });
profileAvatarButton.addEventListener('click', () => profileAvatarInput.click());
profileAvatarInput.addEventListener('change', async () => {
  const file = profileAvatarInput.files?.[0];
  if (!file || !signedInUser) return;
  profileAvatarInput.value = '';
  if (!file.type.startsWith('image/')) return;
  if (file.size > 8 * 1024 * 1024) return;
  profileAvatarButton.disabled = true;
  profileListingsStatus.hidden = false;
  profileListingsStatus.textContent = 'Uploading profile photo...';
  const extension = file.type.split('/')[1].replace('jpeg', 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
  const path = `${signedInUser.id}/avatar.${extension}`;
  const { error: uploadError } = await window.riftTradeSupabase.storage.from('profile-images').upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) {
    profileAvatarButton.disabled = false;
    profileListingsStatus.textContent = `Could not upload photo: ${uploadError.message}`;
    return;
  }
  const { data: publicUrlData } = window.riftTradeSupabase.storage.from('profile-images').getPublicUrl(path);
  const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;
  const { error: profileError } = await window.riftTradeSupabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', signedInUser.id);
  profileAvatarButton.disabled = false;
  if (profileError) {
    profileListingsStatus.textContent = `Could not save photo: ${profileError.message}`;
    return;
  }
  renderProfileAvatar(profileDisplayName.textContent.trim(), avatarUrl);
  renderProfileButton(profileDisplayName.textContent.trim(), avatarUrl);
  profileListingsStatus.textContent = profileListings.length ? '' : 'No visible listings.';
  profileListingsStatus.hidden = profileListings.length > 0;
  await refreshInboxConversations();
});
profileEditClose.addEventListener('click', () => profileEditDialog.close());
profileEditDialog.addEventListener('click', (event) => { if (event.target === profileEditDialog) profileEditDialog.close(); });
profileEditButton.addEventListener('click', () => {
  if (!signedInUser || profileDialog.dataset.profileId !== signedInUser.id) return;
  profileEditName.value = profileDisplayName.textContent.trim();
  profileEditMessage.textContent = '';
  profileEditMessage.classList.remove('is-error');
  profileEditDialog.showModal();
  requestAnimationFrame(() => profileEditName.focus());
});
profileEditForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const displayName = profileEditName.value.trim();
  const currentName = profileDisplayName.textContent.trim();
  const validationError = validateDisplayName(displayName, currentName);
  if (validationError) {
    profileEditMessage.textContent = validationError;
    profileEditMessage.classList.add('is-error');
    profileEditName.focus();
    return;
  }
  if (!window.riftTradeSupabase) {
    profileEditMessage.textContent = 'Add your Supabase URL and anon key first.';
    profileEditMessage.classList.add('is-error');
    return;
  }
  profileEditSubmit.disabled = true;
  profileEditMessage.textContent = 'Checking display name...';
  profileEditMessage.classList.remove('is-error');
  const { data: { user }, error: userError } = await window.riftTradeSupabase.auth.getUser();
  if (userError || !user) {
    profileEditSubmit.disabled = false;
    profileEditMessage.textContent = userError?.message || 'Your session has expired. Sign in again.';
    profileEditMessage.classList.add('is-error');
    return;
  }
  if (user.id !== profileDialog.dataset.profileId) {
    profileEditSubmit.disabled = false;
    profileEditMessage.textContent = 'You can only edit your own display name.';
    profileEditMessage.classList.add('is-error');
    return;
  }
  const { data: existingProfile, error: profileLookupError } = await findProfileByDisplayName(displayName);
  if (profileLookupError) {
    profileEditSubmit.disabled = false;
    profileEditMessage.textContent = profileLookupError.message;
    profileEditMessage.classList.add('is-error');
    return;
  }
  if (existingProfile && existingProfile.id !== user.id) {
    profileEditSubmit.disabled = false;
    profileEditMessage.textContent = 'That display name is already in use. Choose another.';
    profileEditMessage.classList.add('is-error');
    profileEditName.focus();
    return;
  }
  profileEditMessage.textContent = 'Saving display name...';
  const { data: updatedProfile, error: updateError } = await window.riftTradeSupabase.from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id)
    .select('id, display_name')
    .maybeSingle();
  profileEditSubmit.disabled = false;
  if (updateError) {
    profileEditMessage.textContent = isDisplayNameConflictError(updateError) ? 'That display name is already in use. Choose another.' : updateError.message;
    profileEditMessage.classList.add('is-error');
    return;
  }
  if (!updatedProfile) {
    profileEditMessage.textContent = 'Your display name could not be updated. Try again.';
    profileEditMessage.classList.add('is-error');
    return;
  }
  profileTitle.textContent = displayName;
  profileDisplayName.textContent = displayName;
  signedInName.textContent = displayName;
  signedInName.dataset.profileId = user.id;
  profileEditDialog.close();
});
profileMessageButton.addEventListener('click', () => {
  const recipientId = profileMessageButton.dataset.profileId;
  profileDialog.close();
  startDirectConversation(recipientId);
});
signedInName.addEventListener('click', () => openProfileDialog(signedInName.dataset.profileId));

function openListingForm(listing = null) {
  editingListingId = listing?.id || null;
  listingDialogTitle.textContent = listing ? 'Edit listing' : 'Create a listing';
  listingSubmit.innerHTML = listing ? 'Save changes <span>→</span>' : 'Create listing <span>→</span>';
  if (listing) {
    listingName.value = listing.title || '';
    listingType.value = listing.listing_type || 'trade';
    updateListingTypeOptions();
    listingDescription.value = listing.description || '';
    selectedListingCardQuantities = Object.fromEntries((listing.listing_cards || []).filter(({ card }) => card?.id).map(({ card, quantity }) => [card.id, Math.max(Number(quantity) || 1, 1)]));
    selectedListingCardConditions = Object.fromEntries((listing.listing_cards || []).filter(({ card }) => card?.id).map(({ card, condition }) => [card.id, condition || 'near_mint']));
    selectedListingCardPrices = Object.fromEntries((listing.listing_cards || []).filter(({ card, price }) => card?.id && price !== null && price !== undefined).map(({ card, price }) => [card.id, price]));
    selectedListingCardLanguages = Object.fromEntries((listing.listing_cards || []).filter(({ card }) => card?.id).map(({ card, language }) => [card.id, language || 'English']));
    selectedListingCardFoils = Object.fromEntries((listing.listing_cards || []).filter(({ card }) => card?.id).map(({ card, foil }) => [card.id, foil || 'non_foil']));
    selectedListingCardIds = Object.keys(selectedListingCardQuantities);
    listingCardSearch.value = '';
    renderSelectedListingCards();
  } else {
    listingForm.reset();
    listingType.value = 'trade';
    updateListingTypeOptions();
    populateListingCards();
  }
  listingMessage.textContent = '';
  listingDialog.showModal();
}

function updateListingTypeOptions() {
  listingTypeOptions.forEach((option) => option.classList.toggle('is-active', option.dataset.listingType === listingType.value));
}

async function updateListingStatus(status) {
  const listingId = listingDetailsDialog.dataset.listingId;
  if (!listingId || !window.riftTradeSupabase) return;
  const { error } = await window.riftTradeSupabase.from('listings').update({ status }).eq('id', listingId);
  if (error) return setListingMessage(error.message, true);
  listingDetailsDialog.close();
  await Promise.all([loadListings(), loadMyListings()]);
}

listingEditButton.addEventListener('click', () => {
  const listing = listings.find((item) => item.id === listingDetailsDialog.dataset.listingId);
  if (!listing) return;
  listingDetailsDialog.close();
  openListingForm(listing);
});
listingPendingButton.addEventListener('click', () => updateListingStatus(listingDetailsDialog.dataset.listingStatus === 'paused' ? 'active' : 'paused'));
listingSoldButton.addEventListener('click', () => updateListingStatus(listingDetailsDialog.dataset.listingStatus === 'completed' ? 'active' : 'completed'));
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
  await loadCatalog();
  openListingForm();
});
listingClose.addEventListener('click', () => listingDialog.close());
listingDialog.addEventListener('click', (event) => { if (event.target === listingDialog) listingDialog.close(); });
listingTypeOptions.forEach((option) => option.addEventListener('click', () => {
  listingType.value = option.dataset.listingType;
  updateListingTypeOptions();
}));

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
    .insert(selectedListingCardIds.map((cardId) => ({ listing_id: listing.id, card_id: cardId, quantity: selectedListingCardQuantities[cardId] || 1, condition: selectedListingCardConditions[cardId] || 'near_mint', price: selectedListingCardPrices[cardId] === '' ? null : Number(selectedListingCardPrices[cardId]) || null, language: (selectedListingCardLanguages[cardId] || 'English').trim(), foil: selectedListingCardFoils[cardId] || 'non_foil', notes: listingDescription.value.trim() || null })));
  if (cardError) {
    if (!editingListingId) await window.riftTradeSupabase.from('listings').delete().eq('id', listing.id);
    listingSubmit.disabled = false;
    return setListingMessage(cardError.message, true);
  }
  listingForm.reset();
  populateListingCards();
  listingType.value = 'trade';
  updateListingTypeOptions();
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
  query = normalizeCardSearch(query);
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
  selectedListingCardLanguages = {};
  selectedListingCardFoils = {};
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
    selectedListingCardLanguages[card.id] = 'English';
    selectedListingCardFoils[card.id] = 'non_foil';
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
      const language = selectedListingCardLanguages[card.id] || 'English';
      const foilSelector = ['common', 'uncommon'].includes(String(card.rarity || '').toLowerCase()) ? `<span class="listing-card-foil" role="group" aria-label="Finish for ${escapeHtml(card.name)}"><button type="button" data-listing-card-foil="${escapeHtml(card.id)}" data-foil-value="non_foil" aria-pressed="${selectedListingCardFoils[card.id] !== 'foil'}">Non-foil</button><button type="button" data-listing-card-foil="${escapeHtml(card.id)}" data-foil-value="foil" aria-pressed="${selectedListingCardFoils[card.id] === 'foil'}">Foil</button></span>` : '';
        return `<span class="listing-card-selected-item">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" />` : ''}<span class="listing-card-selected-name">${escapeHtml(card.name)}${badge ? `<small class="listing-card-option-badge ${badge === 'Signature' ? 'is-signature' : ''}">${badge}</small>` : ''}${foilSelector}</span><button class="listing-card-remove" type="button" data-remove-listing-card="${escapeHtml(card.id)}" aria-label="Remove ${escapeHtml(card.name)}">×</button><span class="listing-card-selected-fields"><label class="listing-card-quantity">Qty<input type="number" min="1" max="999" step="1" value="${selectedListingCardQuantities[card.id] || 1}" data-listing-card-quantity="${escapeHtml(card.id)}" aria-label="Quantity for ${escapeHtml(card.name)}" /></label><label class="listing-card-condition">Condition<select data-listing-card-condition="${escapeHtml(card.id)}" aria-label="Condition for ${escapeHtml(card.name)}"><option value="near_mint"${condition === 'near_mint' ? ' selected' : ''}>Near mint</option><option value="lightly_played"${condition === 'lightly_played' ? ' selected' : ''}>Lightly played</option><option value="moderately_played"${condition === 'moderately_played' ? ' selected' : ''}>Moderately played</option><option value="heavily_played"${condition === 'heavily_played' ? ' selected' : ''}>Heavily played</option><option value="damaged"${condition === 'damaged' ? ' selected' : ''}>Damaged</option></select></label><label class="listing-card-language">Language<input type="text" value="${escapeHtml(language)}" data-listing-card-language="${escapeHtml(card.id)}" aria-label="Language for ${escapeHtml(card.name)}" /></label><label class="listing-card-price">Price<input type="number" min="0" step="0.01" value="${escapeHtml(price)}" data-listing-card-price="${escapeHtml(card.id)}" aria-label="Price for ${escapeHtml(card.name)}" /></label></span></span>`;
  }).join('');
  listingCardSearch.setCustomValidity(selectedListingCardIds.length ? '' : 'Choose at least one card from the search results.');
}

listingCardSelected.addEventListener('click', (event) => {
  const foilButton = event.target.closest('[data-listing-card-foil]');
  if (foilButton) {
    selectedListingCardFoils[foilButton.dataset.listingCardFoil] = foilButton.dataset.foilValue;
    renderSelectedListingCards();
    return;
  }
  const removeButton = event.target.closest('[data-remove-listing-card]');
  if (!removeButton) return;
  selectedListingCardIds = selectedListingCardIds.filter((cardId) => cardId !== removeButton.dataset.removeListingCard);
    delete selectedListingCardQuantities[removeButton.dataset.removeListingCard];
    delete selectedListingCardConditions[removeButton.dataset.removeListingCard];
    delete selectedListingCardPrices[removeButton.dataset.removeListingCard];
    delete selectedListingCardLanguages[removeButton.dataset.removeListingCard];
    delete selectedListingCardFoils[removeButton.dataset.removeListingCard];
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
  const languageInput = event.target.closest('[data-listing-card-language]');
  if (languageInput) selectedListingCardLanguages[languageInput.dataset.listingCardLanguage] = languageInput.value;
  const foilSelect = event.target.closest('[data-listing-card-foil]');
  if (foilSelect) selectedListingCardFoils[foilSelect.dataset.listingCardFoil] = foilSelect.value;
});

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.listing-card-picker')) listingCardResults.hidden = true;
});

async function fetchCatalog() {
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

function loadCatalog() {
  if (!catalogLoadPromise) catalogLoadPromise = fetchCatalog();
  return catalogLoadPromise;
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

function listingSelect(includeCardPrice = true, includeCardFoil = true) {
  const listingCardFields = [includeCardPrice ? 'price' : '', 'language', includeCardFoil ? 'foil' : '', 'notes'].filter(Boolean).join(', ');
  return `id, title, description, listing_type, price, currency, status, seller_id, created_at, seller:profiles(display_name, username), listing_cards(quantity, condition, ${listingCardFields}, card:cards(id, name, code, public_code, set_code, set_name, collector_number, rarity, type, cost, might, power, domains, tags, ability_text, image_file, image_path, image_url, is_overnumbered, is_signed))`;
}

async function loadListings() {
  if (!window.riftTradeSupabase) return;
  let { data, error } = await window.riftTradeSupabase
    .from('listings')
    .select(listingSelect())
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error?.message?.includes('listing_cards_1.price') || error?.message?.includes('listing_cards_1.foil')) ({ data, error } = await window.riftTradeSupabase.from('listings').select(listingSelect(!error.message.includes('listing_cards_1.price'), !error.message.includes('listing_cards_1.foil'))).eq('status', 'active').order('created_at', { ascending: false }));
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
  myListingsStatus.hidden = false;
  const { data: { user } } = await window.riftTradeSupabase.auth.getUser();
  if (!user) {
    myListings = [];
    renderMyListings();
    myListingsCount.textContent = 'Sign in required';
    myListingsStatus.textContent = '';
    myListingsEmpty.hidden = true;
    myListingsStatus.hidden = true;
    return;
  }
  let { data, error } = await window.riftTradeSupabase
    .from('listings')
    .select(listingSelect())
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });
  if (error?.message?.includes('listing_cards_1.price') || error?.message?.includes('listing_cards_1.foil')) ({ data, error } = await window.riftTradeSupabase.from('listings').select(listingSelect(!error.message.includes('listing_cards_1.price'), !error.message.includes('listing_cards_1.foil'))).eq('seller_id', user.id).order('created_at', { ascending: false }));
  if (error) {
    myListingsStatus.textContent = `Could not load your listings: ${error.message}`;
    return;
  }
  myListings = data || [];
  myListingsStatus.textContent = '';
  myListingsStatus.hidden = true;
  renderMyListings();
}

function inboxInitials(name) {
  return String(name || 'RiftTrade member').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'RT';
}

function avatarMarkup(name, avatarUrl, className = 'inbox-avatar') {
  const safeUrl = String(avatarUrl || '');
  return `<span class="${className}">${safeUrl ? `<img src="${escapeHtml(safeUrl)}" alt="" loading="lazy" />` : escapeHtml(inboxInitials(name))}</span>`;
}

function renderProfileAvatar(name, avatarUrl) {
  const content = avatarUrl ? `<img src="${escapeHtml(avatarUrl)}" alt="" />` : escapeHtml(inboxInitials(name));
  profileAvatar.innerHTML = content;
  profileAvatarStatic.innerHTML = content;
}

function renderProfileButton(name, avatarUrl) {
  profileButtonAvatar.innerHTML = avatarUrl
    ? `<img src="${escapeHtml(avatarUrl)}" alt="" />`
    : `<svg class="profile-glyph" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 20c.7-3.4 3-5.2 6.5-5.2s5.8 1.8 6.5 5.2"></path></svg>`;
}

function inboxTimeLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
  if (date.getFullYear() === now.getFullYear()) return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(date);
}

function updateInboxUnreadBadge() {
  const unread = inboxConversations.reduce((total, conversation) => total + Number(conversation.unread_count || 0), 0);
  inboxUnreadCount.textContent = `${unread} unread`;
  document.querySelectorAll('.nav-link-inbox b').forEach((badge) => {
    badge.textContent = String(unread);
    badge.hidden = unread === 0;
  });
}

function renderInboxConversations() {
  const query = inboxConversationFilter.value.trim().toLowerCase();
  const visibleConversations = inboxConversations.filter((conversation) => `${conversation.peer_display_name || ''} ${conversation.last_message_body || ''}`.toLowerCase().includes(query));
  inboxConversationList.innerHTML = visibleConversations.map((conversation) => {
    const peerName = conversation.peer_display_name || 'RiftTrade member';
    const unread = Number(conversation.unread_count || 0);
    const preview = conversation.last_message_body || 'Start a conversation';
    return `<button class="inbox-conversation${String(conversation.conversation_id) === String(activeConversationId) ? ' is-active' : ''}${unread ? ' has-unread' : ''}" data-inbox-conversation-id="${escapeHtml(conversation.conversation_id)}" type="button" aria-current="${String(conversation.conversation_id) === String(activeConversationId) ? 'true' : 'false'}">${avatarMarkup(peerName, conversation.peer_avatar_url)}<span class="inbox-conversation-copy"><strong>${escapeHtml(peerName)}</strong><small>${escapeHtml(preview.length > 76 ? `${preview.slice(0, 73)}...` : preview)}</small></span><span class="inbox-conversation-meta"><time>${escapeHtml(inboxTimeLabel(conversation.last_message_at))}</time>${unread ? `<b>${unread > 99 ? '99+' : unread}</b>` : ''}</span></button>`;
  }).join('');
  updateInboxUnreadBadge();
}

async function refreshInboxConversations() {
  const { data, error } = await window.riftTradeSupabase.rpc('list_direct_conversations');
  if (error) {
    inboxStatus.hidden = false;
    inboxStatus.textContent = `Could not load messages: ${error.message}. Run the direct messaging migration in Supabase.`;
    return false;
  }
  inboxConversations = data || [];
  renderInboxConversations();
  inboxStatus.textContent = inboxConversations.length ? '' : 'No conversations yet.';
  inboxStatus.hidden = inboxConversations.length > 0;
  return true;
}

function closeInboxRealtime() {
  if (inboxRealtimeChannel && window.riftTradeSupabase) window.riftTradeSupabase.removeChannel(inboxRealtimeChannel);
  inboxRealtimeChannel = null;
  inboxRealtimeConversationId = null;
  clearTimeout(inboxTypingTimer);
  inboxTypingTimer = null;
  inboxTypingConversationId = null;
  inboxTyping.hidden = true;
}

function setInboxTyping(isTyping) {
  if (!inboxRealtimeChannel || !inboxTypingConversationId) return;
  inboxRealtimeChannel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: inboxUser?.id, is_typing: isTyping },
  });
}

function showInboxTyping(name) {
  inboxTypingLabel.textContent = `${name || 'Member'} is typing...`;
  inboxTyping.hidden = false;
}

function watchInboxConversation(conversationId) {
  if (inboxRealtimeConversationId === String(conversationId)) return;
  closeInboxRealtime();
  inboxRealtimeConversationId = String(conversationId);
  inboxTypingConversationId = String(conversationId);
  inboxRealtimeChannel = window.riftTradeSupabase.channel(`direct-messages-${conversationId}`)
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload?.user_id === inboxUser?.id || String(activeConversationId) !== String(conversationId)) return;
      if (payload?.is_typing) showInboxTyping(inboxPeerProfile.textContent);
      else inboxTyping.hidden = true;
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'direct_messages', filter: `conversation_id=eq.${conversationId}` }, async () => {
      if (String(activeConversationId) === String(conversationId)) await openInboxConversation(conversationId, false);
      await refreshInboxConversations();
    })
    .subscribe();
}

function renderInboxSharedListing(listing) {
  if (!listing) return '';
  const firstCard = listing.listing_cards?.[0]?.card || {};
  const imageUrl = getCardImageUrl(firstCard);
  const cardCount = listingCardCount(listing.listing_cards || []);
  return `<button class="inbox-shared-listing" data-shared-listing-id="${escapeHtml(listing.id)}" type="button"><span class="inbox-shared-listing-art">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" loading="lazy" />` : escapeHtml(firstCard.name || 'Riftbound')}</span><span class="inbox-shared-listing-copy"><small>Shared listing</small><strong>${escapeHtml(listing.title)}</strong><span>${escapeHtml([listingTypeLabel(listing.listing_type), listingPriceLabel(listing), `${cardCount} card${cardCount === 1 ? '' : 's'}`].join(' · '))}</span></span><span class="inbox-shared-listing-arrow" aria-hidden="true">↗</span></button>`;
}

function renderInboxMessages(messages) {
  inboxThread.innerHTML = messages.map((message) => {
    const isMine = message.sender_id === inboxUser.id;
    const readState = isMine ? `<small class="inbox-message-read">${message.read_at ? 'Seen' : 'Sent'}</small>` : '';
    const sharedListing = message.shared_listing ? renderInboxSharedListing(message.shared_listing) : '';
    return `<article class="inbox-message${isMine ? ' is-mine' : ''}"><div class="inbox-message-bubble">${message.body ? `<p>${escapeHtml(message.body).replaceAll('\n', '<br>')}</p>` : ''}${sharedListing}<footer><time>${escapeHtml(inboxTimeLabel(message.created_at))}</time>${readState}</footer></div></article>`;
  }).join('');
  inboxSharedListings = messages.map((message) => message.shared_listing).filter(Boolean);
  inboxThread.querySelectorAll('[data-shared-listing-id]').forEach((button) => button.addEventListener('click', () => {
    const listing = inboxSharedListings.find((item) => String(item.id) === String(button.dataset.sharedListingId));
    if (listing) openListingDetails(listing.id);
  }));
  inboxThread.scrollTop = inboxThread.scrollHeight;
}

async function openInboxConversation(conversationId, markAsRead = true) {
  const conversation = inboxConversations.find((item) => String(item.conversation_id) === String(conversationId));
  if (!conversation) return;
  activeConversationId = conversation.conversation_id;
  inboxLayout.classList.add('is-conversation-open');
  inboxEmptyState.hidden = true;
  inboxActive.hidden = false;
  inboxPeerProfile.textContent = conversation.peer_display_name || 'RiftTrade member';
  inboxPeerAvatar.innerHTML = avatarMarkup(conversation.peer_display_name, conversation.peer_avatar_url, 'inbox-peer-avatar').replace(/^<span[^>]*>|<\/span>$/g, '');
  inboxPeerProfile.dataset.profileId = conversation.peer_id;
  inboxTyping.hidden = true;
  inboxMessageStatus.textContent = '';
  inboxThread.innerHTML = '<p class="inbox-thread-loading">Loading messages...</p>';
  renderInboxConversations();

  const { data, error } = await window.riftTradeSupabase.from('direct_messages')
    .select(`id, conversation_id, sender_id, body, created_at, read_at, shared_listing:listings!direct_messages_shared_listing_id_fkey(id, title, description, listing_type, price, currency, status, seller_id, created_at, seller:profiles(display_name, username), listing_cards(quantity, condition, language, card:cards(id, name, image_file, image_path, image_url)))`)
    .eq('conversation_id', conversation.conversation_id)
    .order('created_at', { ascending: false })
    .limit(100);
  if (String(activeConversationId) !== String(conversationId)) return;
  if (error) {
    inboxThread.innerHTML = '';
    inboxMessageStatus.textContent = `Could not load messages: ${error.message}. Run the direct messaging migration in Supabase.`;
    return;
  }

  const messages = (data || []).reverse();
  renderInboxMessages(messages);
  watchInboxConversation(conversation.conversation_id);
  if (markAsRead) {
    const { error: readError } = await window.riftTradeSupabase.rpc('mark_direct_conversation_read', { target_conversation_id: conversation.conversation_id });
    if (readError) inboxMessageStatus.textContent = readError.message;
    else {
      const readAt = new Date().toISOString();
      messages.forEach((message) => { if (message.sender_id !== inboxUser.id) message.read_at = readAt; });
      renderInboxMessages(messages);
      await refreshInboxConversations();
    }
  }
}

async function loadInbox() {
  if (!window.riftTradeSupabase) {
    inboxStatus.hidden = false;
    inboxStatus.textContent = 'Add your Supabase URL and anon key to use direct messages.';
    inboxSignInButton.hidden = false;
    return;
  }
  inboxStatus.hidden = false;
  inboxStatus.textContent = 'Loading conversations...';
  const { data: { user }, error } = await window.riftTradeSupabase.auth.getUser();
  if (error) {
    inboxStatus.textContent = error.message === 'Auth session missing!' ? 'Log in to see messages' : error.message;
    inboxSignInButton.hidden = false;
    return;
  }
  inboxUser = user || null;
  signedInUser = user || null;
  if (!user) {
    closeInboxRealtime();
    inboxConversations = [];
    activeConversationId = null;
    inboxThread.innerHTML = '';
    inboxMessageStatus.textContent = '';
    inboxPeerProfile.textContent = '';
    inboxPeerProfile.removeAttribute('data-profile-id');
    inboxRecipientResults.innerHTML = '';
    inboxRecipientResults.hidden = true;
    inboxRecipientForm.hidden = true;
    inboxConversationFilter.hidden = true;
    inboxSignInButton.hidden = false;
    inboxActive.hidden = true;
    inboxEmptyState.hidden = false;
    inboxLayout.classList.remove('is-conversation-open');
    inboxStatus.textContent = 'Sign in to access your messages.';
    renderInboxConversations();
    return;
  }

  inboxRecipientForm.hidden = false;
  inboxConversationFilter.hidden = false;
  inboxSignInButton.hidden = true;
  const canLoad = await refreshInboxConversations();
  if (!canLoad) return;
  if (activeConversationId && inboxConversations.some((item) => String(item.conversation_id) === String(activeConversationId))) {
    await openInboxConversation(activeConversationId, false);
  } else {
    activeConversationId = null;
    inboxActive.hidden = true;
    inboxEmptyState.hidden = false;
    inboxLayout.classList.remove('is-conversation-open');
  }
}

async function searchInboxRecipients() {
  const query = inboxRecipientSearch.value.trim();
  const searchId = (searchInboxRecipients.requestId || 0) + 1;
  searchInboxRecipients.requestId = searchId;
  if (!inboxUser || query.length < 2) {
    inboxRecipientResults.hidden = true;
    inboxRecipientResults.innerHTML = '';
    return;
  }
  const pattern = query.replace(/[\\%_]/g, '\\$&');
  const { data, error } = await window.riftTradeSupabase.from('profiles')
    .select('id, display_name, username, avatar_url')
    .neq('id', inboxUser.id)
    .ilike('display_name', `%${pattern}%`)
    .limit(8);
  if (searchId !== searchInboxRecipients.requestId) return;
  if (error) {
    inboxRecipientResults.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    inboxRecipientResults.hidden = false;
    return;
  }
  const matches = data || [];
  inboxRecipientResults.innerHTML = matches.length ? matches.map((profile) => {
    const name = profile.display_name || profile.username || 'RiftTrade member';
    return `<button type="button" role="option" data-inbox-recipient-id="${escapeHtml(profile.id)}">${avatarMarkup(name, profile.avatar_url)}<span>${escapeHtml(name)}</span></button>`;
  }).join('') : '<p>No members found.</p>';
  inboxRecipientResults.hidden = false;
}

async function startDirectConversation(recipientId, sharedListingId = null) {
  if (!window.riftTradeSupabase) return;
  const { data: { user } } = await window.riftTradeSupabase.auth.getUser();
  if (!user) return openAccount();
  if (user.id === recipientId) return;
  signedInUser = inboxUser = user;
  const { data: conversationId, error } = await window.riftTradeSupabase.rpc('get_or_create_direct_conversation', { target_user_id: recipientId });
  if (error) {
    inboxStatus.hidden = false;
    inboxStatus.textContent = error.message;
    if (!views.find((view) => view.dataset.page === 'inbox')?.classList.contains('is-visible')) showView('inbox');
    return;
  }
  inboxRecipientSearch.value = '';
  inboxRecipientResults.hidden = true;
  activeConversationId = null;
  if (!views.find((view) => view.dataset.page === 'inbox')?.classList.contains('is-visible')) showView('inbox');
  else inboxLoadPromise = loadInbox();
  await inboxLoadPromise;
  await refreshInboxConversations();
  await openInboxConversation(conversationId);
  if (sharedListingId) {
    const { error: shareError } = await window.riftTradeSupabase.from('direct_messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: "I'm interested in this listing.",
      shared_listing_id: sharedListingId,
    });
    if (shareError) {
      inboxMessageStatus.textContent = `Could not share listing: ${shareError.message}`;
      return;
    }
    await Promise.all([openInboxConversation(conversationId, false), refreshInboxConversations()]);
  }
}

inboxNewMessage.addEventListener('click', () => {
  inboxRecipientSearch.value = '';
  inboxRecipientResults.hidden = true;
  inboxRecipientSearch.focus();
});
inboxSignInButton.addEventListener('click', openAccount);
inboxRecipientForm.addEventListener('submit', (event) => event.preventDefault());
inboxRecipientSearch.addEventListener('input', () => {
  clearTimeout(inboxRecipientSearchTimer);
  inboxRecipientSearchTimer = setTimeout(searchInboxRecipients, 180);
});
inboxRecipientResults.addEventListener('click', (event) => {
  const result = event.target.closest('[data-inbox-recipient-id]');
  if (result) startDirectConversation(result.dataset.inboxRecipientId);
});
inboxConversationFilter.addEventListener('input', renderInboxConversations);
inboxConversationList.addEventListener('click', (event) => {
  const conversation = event.target.closest('[data-inbox-conversation-id]');
  if (conversation) openInboxConversation(conversation.dataset.inboxConversationId);
});
inboxPeerProfile.addEventListener('click', () => openProfileDialog(inboxPeerProfile.dataset.profileId));
inboxBack.addEventListener('click', () => {
  activeConversationId = null;
  closeInboxRealtime();
  inboxActive.hidden = true;
  inboxEmptyState.hidden = false;
  inboxLayout.classList.remove('is-conversation-open');
  renderInboxConversations();
});
inboxMessageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = inboxMessageInput.value.trim();
  if (!body || !activeConversationId || !inboxUser || !window.riftTradeSupabase) return;
  clearTimeout(inboxTypingTimer);
  setInboxTyping(false);
  inboxSend.disabled = true;
  inboxMessageStatus.textContent = 'Sending...';
  const { error } = await window.riftTradeSupabase.from('direct_messages').insert({
    conversation_id: activeConversationId,
    sender_id: inboxUser.id,
    body,
  });
  inboxSend.disabled = false;
  if (error) {
    inboxMessageStatus.textContent = `Could not send message: ${error.message}`;
    return;
  }
  inboxMessageInput.value = '';
  inboxMessageStatus.textContent = '';
  await Promise.all([openInboxConversation(activeConversationId, false), refreshInboxConversations()]);
  inboxMessageInput.focus();
});
inboxMessageInput.addEventListener('input', () => {
  if (!activeConversationId || !inboxUser) return;
  clearTimeout(inboxTypingTimer);
  setInboxTyping(true);
  inboxTypingTimer = setTimeout(() => {
    setInboxTyping(false);
    inboxTypingTimer = null;
  }, 900);
});
inboxMessageInput.addEventListener('blur', () => {
  clearTimeout(inboxTypingTimer);
  inboxTypingTimer = null;
  setInboxTyping(false);
});
inboxMessageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    inboxMessageForm.requestSubmit();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.inbox-recipient-form')) inboxRecipientResults.hidden = true;
});

searchInput.addEventListener('input', renderListings);
myListingsFilter.addEventListener('change', renderMyListings);
marketFilterButton.addEventListener('click', () => {
  marketFilterPanel.hidden = !marketFilterPanel.hidden;
  marketFilterButton.setAttribute('aria-expanded', String(!marketFilterPanel.hidden));
});
marketTypeFilter.addEventListener('change', renderListings);
marketMinPrice.addEventListener('input', renderListings);
marketMaxPrice.addEventListener('input', renderListings);
marketFilterClear.addEventListener('click', () => {
  marketTypeFilter.value = '';
  marketMinPrice.value = '';
  marketMaxPrice.value = '';
  renderListings();
});
catalogSearch.addEventListener('input', renderCatalogFromFirstPage);
catalogSetFilter.addEventListener('change', renderCatalogFromFirstPage);
catalogDomainOptions.addEventListener('change', renderCatalogFromFirstPage);
catalogRarityFilter.addEventListener('change', renderCatalogFromFirstPage);
catalogTypeFilter.addEventListener('change', renderCatalogFromFirstPage);
catalogFilterClear.addEventListener('click', () => {
  catalogSearch.value = '';
  catalogSetFilter.value = '';
  catalogDomainOptions.querySelectorAll('input:checked').forEach((input) => { input.checked = false; });
  catalogRarityFilter.value = '';
  catalogTypeFilter.value = '';
  renderCatalogFromFirstPage();
});
catalogPrevious.addEventListener('click', () => {
  if (catalogPage === 0) return;
  catalogPage -= 1;
  renderCatalog();
});
catalogNext.addEventListener('click', () => {
  catalogPage += 1;
  renderCatalog();
});
catalogFilterButton.addEventListener('click', () => {
  catalogFilterPanel.hidden = !catalogFilterPanel.hidden;
  catalogFilterButton.setAttribute('aria-expanded', String(!catalogFilterPanel.hidden));
});
catalogGrid.addEventListener('click', (event) => {
  const cardButton = event.target.closest('[data-catalog-card-id]');
  if (cardButton) openCardDialog(cardButton.dataset.catalogCardId);
});
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
  discordAuthButton.hidden = isForgot || isRecovery;
  authEmail.parentElement.hidden = isRecovery;
  authPassword.required = isSignup || mode === 'signin';
  authNewPassword.required = isRecovery;
  authSubmit.innerHTML = `${isSignup ? 'Create account' : isForgot ? 'Send reset link' : isRecovery ? 'Update password' : 'Sign in'} <span>→</span>`;
  authLinks.hidden = isRecovery;
  authModeToggle.dataset.authMode = isSignup ? 'signin' : 'signup';
  authModeToggle.textContent = isSignup ? 'Sign in with existing account' : 'Create an account';
  setAuthMessage('');
}

async function findProfileByDisplayName(displayName) {
  const pattern = displayName.replace(/[\\%_]/g, '\\$&');
  return window.riftTradeSupabase.from('profiles').select('id').ilike('display_name', pattern).limit(1).maybeSingle();
}

function validateDisplayName(displayName, currentName = '') {
  if (!displayName) return 'Enter a display name.';
  if (displayName.length < displayNameMinLength) return `Display name must be at least ${displayNameMinLength} characters.`;
  if (displayName.length > displayNameMaxLength) return `Display name must be ${displayNameMaxLength} characters or fewer.`;
  if (/[\u0000-\u001F\u007F]/.test(displayName)) return 'Display name contains invalid characters.';
  if (displayName === currentName) return 'Enter a different display name.';
  return '';
}

function isDisplayNameConflictError(error) {
  return error?.code === '23505' || /display.?name|profiles_display_name_unique_idx/i.test(error?.message || '');
}

async function openAccount() {
  if (accountDialog.open) return;
  accountDialog.showModal();
  await refreshAuthState();
  if (!authForm.hidden) authEmail.focus();
}

async function refreshAuthState() {
  if (!window.riftTradeSupabase) return;
  const { data: { session } } = await window.riftTradeSupabase.auth.getSession();
  const user = session?.user;
  signedInUser = user || null;
  authStateReady = true;
  if (!user) renderProfileButton('RiftTrade member', '');
  if (!user) closeProfileMenu();
  signedInPanel.hidden = !user;
  discordNameForm.hidden = true;
  authForm.hidden = Boolean(user);
  authLinks.hidden = Boolean(user);
  authIntro.hidden = Boolean(user);
  if (user) {
    const { data: profile } = await window.riftTradeSupabase.from('profiles').select('display_name, avatar_url').eq('id', user.id).maybeSingle();
    const profileDisplayName = profile?.display_name?.trim() || '';
    renderProfileButton(profileDisplayName || user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || 'RiftTrade member', profile?.avatar_url);
    const discordProvider = user.app_metadata?.provider === 'discord' || user.app_metadata?.providers?.includes('discord');
    const discordOnboardingRequested = localStorage.getItem(discordOnboardingStorageKey) === '1';
    const needsDiscordDisplayName = discordProvider && discordOnboardingRequested && (!profileDisplayName || profileDisplayName === user.email?.trim());
    if (needsDiscordDisplayName) {
      signedInPanel.hidden = true;
      discordNameForm.hidden = false;
      discordName.value = user.user_metadata?.full_name || user.user_metadata?.name || '';
      setAuthMessage('Choose your RiftTrade display name.');
      if (!accountDialog.open) accountDialog.showModal();
      requestAnimationFrame(() => discordName.focus());
    } else {
      if (discordOnboardingRequested) localStorage.removeItem(discordOnboardingStorageKey);
      signedInName.textContent = profileDisplayName || user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || 'RiftTrade member';
    }
    signedInName.dataset.profileId = user.id;
    signedInEmail.textContent = user.email || 'your account';
  }
  if (views.find((view) => view.dataset.page === 'trades')?.classList.contains('is-visible')) loadMyListings();
  inboxLoadPromise = loadInbox();
}

function closeProfileMenu(restoreFocus = false) {
  profileMenu.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) profileButton.focus();
}

profileButton.addEventListener('click', async () => {
  if (!window.riftTradeSupabase) return openAccount();
  if (!authStateReady) await refreshAuthState();
  if (!signedInUser) {
    closeProfileMenu();
    openAccount();
    return;
  }
  const shouldOpen = profileMenu.hidden;
  profileMenu.hidden = !shouldOpen;
  profileButton.setAttribute('aria-expanded', String(shouldOpen));
  if (shouldOpen) profileMenuView.focus();
});
profileMenuView.addEventListener('click', () => {
  const profileId = signedInUser?.id;
  closeProfileMenu();
  if (profileId) openProfileDialog(profileId);
});
profileMenuSignOut.addEventListener('click', () => {
  closeProfileMenu();
  openAccount();
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.profile-menu-wrap')) closeProfileMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !profileMenu.hidden) closeProfileMenu(true);
});
accountClose.addEventListener('click', () => accountDialog.close());
accountDialog.addEventListener('click', (event) => { if (event.target === accountDialog) accountDialog.close(); });
document.querySelectorAll('[data-auth-mode]').forEach((link) => link.addEventListener('click', () => setAuthMode(link.dataset.authMode)));

discordNameForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const displayName = discordName.value.trim();
  if (!displayName) return setAuthMessage('Enter a display name.', true);
  if (!window.riftTradeSupabase) return setAuthMessage('Add your Supabase URL and anon key first.', true);
  discordNameSubmit.disabled = true;
  setAuthMessage('Saving your display name...');
  const { data: existingProfile, error: profileLookupError } = await findProfileByDisplayName(displayName);
  if (profileLookupError) {
    discordNameSubmit.disabled = false;
    return setAuthMessage(profileLookupError.message, true);
  }
  const { data: { user } } = await window.riftTradeSupabase.auth.getUser();
  if (!user) {
    discordNameSubmit.disabled = false;
    discordNameForm.hidden = true;
    return setAuthMessage('Your Discord session has expired. Sign in again.', true);
  }
  if (existingProfile && existingProfile.id !== user.id) {
    discordNameSubmit.disabled = false;
    discordName.focus();
    return setAuthMessage('That display name is already in use. Choose another.', true);
  }
  const { error } = await window.riftTradeSupabase.from('profiles').update({ display_name: displayName }).eq('id', user.id);
  discordNameSubmit.disabled = false;
  if (error) return setAuthMessage(error.message, true);
  localStorage.removeItem(discordOnboardingStorageKey);
  discordNameForm.hidden = true;
  signedInPanel.hidden = false;
  signedInName.textContent = displayName;
  signedInName.dataset.profileId = user.id;
  signedInEmail.textContent = user.email || 'your account';
  setAuthMessage('Display name saved. Welcome to RiftTrade.');
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.riftTradeSupabase) return setAuthMessage('Add your Supabase URL and anon key first.', true);
  authSubmit.disabled = true;
  setAuthMessage('Working...');
  let result;
  if (authMode === 'signup') {
    const displayName = authName.value.trim();
    if (!displayName) {
      authSubmit.disabled = false;
      return setAuthMessage('Enter a display name.', true);
    }
    const { data: existingProfile, error: profileLookupError } = await findProfileByDisplayName(displayName);
    if (profileLookupError) {
      authSubmit.disabled = false;
      return setAuthMessage(profileLookupError.message, true);
    }
    if (existingProfile) {
      authSubmit.disabled = false;
      authName.focus();
      return setAuthMessage('That display name is already in use. Choose another.', true);
    }
    result = await window.riftTradeSupabase.auth.signUp({ email: authEmail.value, password: authPassword.value, options: { data: { display_name: displayName } } });
  } else if (authMode === 'forgot') {
    result = await window.riftTradeSupabase.auth.resetPasswordForEmail(authEmail.value, { redirectTo: `${window.location.origin}${window.location.pathname}#reset-password` });
  } else if (authMode === 'recovery') {
    result = await window.riftTradeSupabase.auth.updateUser({ password: authNewPassword.value });
  } else {
    result = await window.riftTradeSupabase.auth.signInWithPassword({ email: authEmail.value, password: authPassword.value });
  }
  authSubmit.disabled = false;
  if (result.error) {
    if (authMode === 'signup' && result.error.message.includes('Database error saving new user')) {
      const { data: conflictingProfile } = await findProfileByDisplayName(authName.value.trim());
      if (conflictingProfile) return setAuthMessage('That display name is already in use. Choose another.', true);
    }
    return setAuthMessage(result.error.message, true);
  }
  if (authMode === 'signup') return setAuthMessage('Account created. Check your email if confirmation is enabled.');
  if (authMode === 'forgot') return setAuthMessage('Reset link sent. Check your email.');
  if (authMode === 'recovery') { setAuthMode('signin'); return setAuthMessage('Password updated. You can sign in now.'); }
  await refreshAuthState();
  setAuthMessage('Signed in successfully.');
});

discordAuthButton.addEventListener('click', async () => {
  if (!window.riftTradeSupabase) return setAuthMessage('Add your Supabase URL and anon key first.', true);
  discordAuthButton.disabled = true;
  localStorage.setItem(discordOnboardingStorageKey, '1');
  setAuthMessage('Redirecting to Discord...');
  const { error } = await window.riftTradeSupabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: `${window.location.origin}${window.location.pathname}${window.location.search}` },
  });
  discordAuthButton.disabled = false;
  if (error) {
    localStorage.removeItem(discordOnboardingStorageKey);
    setAuthMessage(error.message, true);
  }
});

document.querySelector('#sign-out').addEventListener('click', async () => {
  if (!window.confirm('Are you sure you want to sign out?')) return;
  await window.riftTradeSupabase?.auth.signOut();
  await refreshAuthState();
  setAuthMessage('You are signed out.');
});

const oauthCallbackHash = /(?:^#|&)access_token=|(?:^#|&)code=|(?:^#|&)error=/.test(window.location.hash);

if (window.riftTradeSupabase) {
  window.riftTradeSupabase.auth.onAuthStateChange(() => refreshAuthState());
  refreshAuthState();
  if (window.location.hash === '#reset-password') {
    setAuthMode('recovery');
    openAccount();
  }
}

const initialView = window.location.hash.slice(1);
if (oauthCallbackHash) {
  views.forEach((view) => {
    const isHome = view.dataset.page === 'home';
    view.hidden = !isHome;
    view.classList.toggle('is-visible', isHome);
  });
  navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.view === 'home'));
  window.riftTradeSupabase?.auth.getSession().finally(() => history.replaceState(null, '', '#home'));
} else {
  showView(views.some((view) => view.dataset.page === initialView) ? initialView : 'home');
}