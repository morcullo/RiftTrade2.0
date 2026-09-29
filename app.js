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
const cardDialog = document.querySelector('#card-dialog');
const cardDialogClose = document.querySelector('#card-close');
const cardDialogArt = document.querySelector('#card-dialog-art');
const cardDialogTitle = document.querySelector('#card-dialog-title');
const cardDialogSet = document.querySelector('#card-dialog-set');
const cardDialogStats = document.querySelector('#card-dialog-stats');
const cardDialogAbility = document.querySelector('#card-dialog-ability');
const cardDialogTags = document.querySelector('#card-dialog-tags');

let cards = [];
let authMode = 'signin';

function getCardImageUrl(card) {
  if (card.image_url && /^https?:\/\//i.test(card.image_url)) return card.image_url;
  const imageName = String(card.image_path || card.image_file || '')
    .replace(/^card-images\//, '')
    .replace(/^\//, '');
  if (!imageName || !window.riftTradeSupabase) return '';
  return window.riftTradeSupabase.storage.from('card-images').getPublicUrl(imageName).data.publicUrl;
}

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = cards.filter((card) => {
    const searchable = [card.name, card.set_name, card.set_code, card.type, card.rarity, card.ability_text].filter(Boolean).join(' ').toLowerCase();
    return searchable.includes(query);
  });
  marketGrid.innerHTML = matches.map((card) => {
    const imageUrl = getCardImageUrl(card);
    return `<article class="listing" data-search="${escapeHtml(card.name)}">
      <div class="card-art${imageUrl ? ' has-image' : ''}">
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)} card art" loading="lazy" />` : `<span>${escapeHtml(card.name)}</span>`}
      </div>
      <div class="listing-copy"><div><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(card.set_name || card.set_code || 'Riftbound catalog')}</span></div><b>Catalog</b></div>
      <button class="trade-button" data-card-id="${escapeHtml(card.id)}" type="button">View card <span>→</span></button>
    </article>`;
  }).join('');
  emptyMessage.hidden = matches.length !== 0;
  marketGrid.querySelectorAll('[data-card-id]').forEach((button) => button.addEventListener('click', () => openCardDialog(button.dataset.cardId)));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
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

async function loadCards() {
  if (!window.riftTradeSupabase) {
    marketStatus.textContent = 'Add your Supabase URL and anon key to load the card catalog.';
    return;
  }
  const { data, error } = await window.riftTradeSupabase
    .from('cards')
    .select('id, name, set_code, set_name, collector_number, rarity, type, cost, might, power, domains, tags, ability_text, image_file, image_path, image_url')
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