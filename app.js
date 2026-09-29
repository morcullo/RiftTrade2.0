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
const openListingButton = document.querySelector('#open-listing');
const listingDialog = document.querySelector('#listing-dialog');
const listingClose = document.querySelector('#listing-close');
const listingForm = document.querySelector('#listing-form');
const listingCardSearch = document.querySelector('#listing-card-search');
const listingCardInput = document.querySelector('#listing-card');
const listingCardResults = document.querySelector('#listing-card-results');
const listingCardSelected = document.querySelector('#listing-card-selected');
const listingMessage = document.querySelector('#listing-message');
const listingSubmit = document.querySelector('#listing-submit');
const listingName = document.querySelector('#listing-name');
const listingType = document.querySelector('#listing-type');
const listingPrice = document.querySelector('#listing-price');
const listingCondition = document.querySelector('#listing-condition');
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
const cardDialog = document.querySelector('#card-dialog');
const cardDialogClose = document.querySelector('#card-close');
const cardDialogArt = document.querySelector('#card-dialog-art');
const cardDialogTitle = document.querySelector('#card-dialog-title');
const cardDialogSet = document.querySelector('#card-dialog-set');
const cardDialogStats = document.querySelector('#card-dialog-stats');
const cardDialogAbility = document.querySelector('#card-dialog-ability');
const cardDialogTags = document.querySelector('#card-dialog-tags');

let cards = [];
let listings = [];
let authMode = 'signin';

function getCardImageUrl(card) {
  if (card.image_url && /^https?:\/\//i.test(card.image_url)) return card.image_url;
  const imageName = String(card.image_path || card.image_file || '')
    .replace(/^card-images\//, '')
    .replace(/^\//, '');
  if (!imageName || !window.riftTradeSupabase) return '';
  return window.riftTradeSupabase.storage.from('card-images').getPublicUrl(imageName).data.publicUrl;
}

function renderListings() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = listings.filter((listing) => {
    const card = listing.listing_cards?.[0]?.card || {};
    const searchable = [listing.title, listing.description, card.name, card.set_name, card.code, listing.seller?.display_name].filter(Boolean).join(' ').toLowerCase();
    return searchable.includes(query);
  });
  marketGrid.innerHTML = matches.map((listing) => {
    const card = listing.listing_cards?.[0]?.card || {};
    const imageUrl = getCardImageUrl(card);
    const listingCards = listing.listing_cards || [];
    const seller = listing.seller?.display_name || listing.seller?.username || 'RiftTrade member';
    const listingMeta = [listing.listing_type === 'sale' ? 'For sale' : listing.listing_type === 'trade_or_sale' ? 'Trade or sale' : 'For trade', listingCards[0]?.condition?.replaceAll('_', ' '), listingCards[0]?.language].filter(Boolean).join(' · ');
    const price = listing.price !== null && listing.price !== undefined ? `${listing.currency || 'USD'} ${Number(listing.price).toFixed(2)}` : 'Make an offer';
    return `<article class="listing" data-search="${escapeHtml(listing.title)}">
      <div class="card-art${imageUrl ? ' has-image' : ''}">
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" loading="lazy" />` : `<span>${escapeHtml(card.name || listing.title)}</span>`}
        ${renderCardBadges(card)}
      </div>
      <div class="listing-copy"><div><strong>${escapeHtml(listing.title)}</strong><span>${escapeHtml(card.name || 'Riftbound card')} · ${escapeHtml(listingMeta)}</span><small>By ${escapeHtml(seller)}${listingCards.length > 1 ? ` · ${listingCards.length} cards` : ''}</small></div><b>${escapeHtml(price)}</b></div>
      <button class="trade-button" data-card-id="${escapeHtml(card.id || '')}" type="button">View card <span>→</span></button>
    </article>`;
  }).join('');
  emptyMessage.hidden = matches.length !== 0;
  marketGrid.querySelectorAll('[data-card-id]').forEach((button) => button.addEventListener('click', () => openCardDialog(button.dataset.cardId)));
}

function renderHeroCards() {
  const imageCards = cards.filter((card) => card.is_signed && getCardImageUrl(card));
  if (imageCards.length < 2) return;
  const firstIndex = Math.floor(Math.random() * imageCards.length);
  let secondIndex = Math.floor(Math.random() * imageCards.length);
  while (secondIndex === firstIndex) secondIndex = Math.floor(Math.random() * imageCards.length);
  const heroCards = [imageCards[firstIndex], imageCards[secondIndex]];
  const [backCard, frontCard] = heroCards;
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

function openCardDialog(cardId) {
  const card = cards.find((item) => item.id === cardId);
  if (!card) return;
  const imageUrl = getCardImageUrl(card);
  cardDialogTitle.textContent = card.name;
  cardDialogSet.textContent = [card.set_name || card.set_code, card.collector_number].filter(Boolean).join(' · ') || 'Riftbound catalog';
  cardDialogArt.className = `card-dialog-art${imageUrl ? ' has-image' : ''}`;
  cardDialogArt.innerHTML = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" />` : `<span>${escapeHtml(card.name)}</span>`;
  const stats = [['Rarity', card.rarity], ['Type', card.type], ['Cost', card.cost], ['Might', card.might], ['Power', card.power], ['Domains', Array.isArray(card.domains) ? card.domains.join(', ') : card.domains]];
  cardDialogStats.innerHTML = stats.filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  cardDialogAbility.textContent = card.ability_text || 'No ability text listed.';
  cardDialogTags.textContent = Array.isArray(card.tags) && card.tags.length ? `Tags: ${card.tags.join(', ')}` : '';
  cardDialog.showModal();
}

cardDialogClose.addEventListener('click', () => cardDialog.close());
cardDialog.addEventListener('click', (event) => { if (event.target === cardDialog) cardDialog.close(); });

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
  setListingMessage('');
  listingDialog.showModal();
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
  const { data: listing, error: listingError } = await window.riftTradeSupabase
    .from('listings')
    .insert({ seller_id: user.id, title: listingName.value.trim(), description: listingDescription.value.trim() || null, listing_type: listingType.value, price: listingPrice.value ? Number(listingPrice.value) : null })
    .select('id')
    .single();
  if (listingError) {
    listingSubmit.disabled = false;
    return setListingMessage(listingError.message, true);
  }
  const { error: cardError } = await window.riftTradeSupabase
    .from('listing_cards')
    .insert({ listing_id: listing.id, card_id: listingCardInput.value, quantity: 1, condition: listingCondition.value, language: listingLanguage.value.trim(), notes: listingDescription.value.trim() || null });
  if (cardError) {
    await window.riftTradeSupabase.from('listings').delete().eq('id', listing.id);
    listingSubmit.disabled = false;
    return setListingMessage(cardError.message, true);
  }
  listingForm.reset();
  populateListingCards();
  listingLanguage.value = 'English';
  listingSubmit.disabled = false;
  listingDialog.close();
  await loadListings();
});

function renderListingCardResults() {
  const query = listingCardSearch.value.trim().toLowerCase();
  const matches = cards.filter((card) => [card.name, card.code, card.public_code, card.set_name, card.set_code].filter(Boolean).join(' ').toLowerCase().includes(query)).slice(0, 12);
  listingCardResults.innerHTML = matches.map((card) => `<button class="listing-card-option" type="button" data-listing-card-id="${escapeHtml(card.id)}"><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(card.code || card.public_code || card.id)}${card.set_name ? ` · ${escapeHtml(card.set_name)}` : ''}</span></button>`).join('');
  listingCardResults.hidden = matches.length === 0;
}

function populateListingCards() {
  listingCardSearch.value = '';
  listingCardInput.value = '';
  listingCardSelected.textContent = '';
  listingCardSearch.setCustomValidity('Choose a card from the search results.');
}

listingCardSearch.addEventListener('input', () => {
  listingCardInput.value = '';
  listingCardSelected.textContent = '';
  listingCardSearch.setCustomValidity('Choose a card from the search results.');
  renderListingCardResults();
});
listingCardSearch.addEventListener('focus', renderListingCardResults);
listingCardResults.addEventListener('click', (event) => {
  const option = event.target.closest('[data-listing-card-id]');
  if (!option) return;
  const card = cards.find((item) => item.id === option.dataset.listingCardId);
  if (!card) return;
  listingCardInput.value = card.id;
  listingCardSearch.value = card.name;
  listingCardSelected.textContent = `${card.name} · ${card.code || card.public_code || card.id}`;
  listingCardSearch.setCustomValidity('');
  listingCardResults.hidden = true;
});

async function loadCatalog() {
  if (!window.riftTradeSupabase) {
    marketStatus.textContent = 'Add your Supabase URL and anon key to load listings.';
    return;
  }
  const { data, error } = await window.riftTradeSupabase
    .from('cards')
    .select('id, name, code, public_code, set_code, set_name, collector_number, rarity, type, cost, might, power, domains, tags, ability_text, image_file, image_path, image_url, is_overnumbered, is_signed')
    .order('name');
  if (error) {
    marketStatus.textContent = `Could not load cards: ${error.message}`;
    return;
  }
  cards = data || [];
  populateListingCards();
  renderHeroCards();
}

async function loadListings() {
  if (!window.riftTradeSupabase) return;
  const { data, error } = await window.riftTradeSupabase
    .from('listings')
    .select('id, title, description, listing_type, price, currency, seller_id, created_at, seller:profiles(display_name, username), listing_cards(quantity, condition, language, notes, card:cards(id, name, code, public_code, set_code, set_name, collector_number, rarity, type, cost, might, power, domains, tags, ability_text, image_file, image_path, image_url, is_overnumbered, is_signed))')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) {
    marketStatus.textContent = `Could not load listings: ${error.message}`;
    return;
  }
  listings = data || [];
  marketStatus.textContent = listings.length ? `${listings.length} active listings` : 'No active listings yet. Be the first to list a card.';
  renderListings();
}

searchInput.addEventListener('input', renderListings);
loadCatalog();
loadListings();

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