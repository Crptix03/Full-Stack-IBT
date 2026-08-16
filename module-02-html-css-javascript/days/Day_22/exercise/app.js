// --- Step 1: state object ---
const state = {
  rates: {},       // { USD: 0.0177, KES: 2.29, ... }
  watchlist: [],    // array of currency codes, e.g. ['USD', 'KES']
  loading: false,
  error: null
};

// DOM references
const statusEl = document.getElementById('status');
const convertForm = document.getElementById('convert-form');
const amountInput = document.getElementById('amount-input');
const fromSelect = document.getElementById('from-select');
const toSelect = document.getElementById('to-select');
const resultEl = document.getElementById('result');

const watchCurrencySelect = document.getElementById('watch-currency-select');
const addWatchBtn = document.getElementById('add-watch-btn');
const watchlistEl = document.getElementById('watchlist');

const STORAGE_KEY = 'currency-watchlist';

// --- Step 2: render() against state.rates (fake or real) ---
function render() {
  const codes = Object.keys(state.rates);

  // Fill from/to/watch dropdowns from state.rates
  [fromSelect, toSelect, watchCurrencySelect].forEach((select) => {
    const previousValue = select.value;
    select.innerHTML = '';
    codes.forEach((code) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = code;
      select.appendChild(opt);
    });
    if (codes.includes(previousValue)) {
      select.value = previousValue;
    }
  });

  renderWatchlist();
}

function renderStatus() {
  if (state.loading) {
    statusEl.textContent = 'Loading rates...';
    statusEl.classList.remove('error');
  } else if (state.error) {
    statusEl.textContent = state.error;
    statusEl.classList.add('error');
  } else {
    statusEl.textContent = 'Rates loaded.';
    statusEl.classList.remove('error');
  }
}

// --- Step 3: loadRates() replaces fake data with live fetch ---
async function loadRates() {
  state.loading = true;
  state.error = null;
  renderStatus();

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');

    if (!res.ok) {
      throw new Error(`Failed to load rates (status ${res.status})`);
    }

    const data = await res.json();

    if (!data.rates) {
      throw new Error('Unexpected response format from rates API.');
    }

    state.rates = data.rates;
    state.loading = false;
    renderStatus();
    render();
  } catch (error) {
    console.error(error);
    state.loading = false;
    state.error = error.message || 'Could not load exchange rates.';
    renderStatus();
  }
}

// --- Step 4: wire the convert form ---
convertForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = Number(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!Number.isFinite(amount) || amount <= 0) {
    resultEl.textContent = 'Please enter a valid amount.';
    return;
  }

  const fromRate = state.rates[from];
  const toRate = state.rates[to];

  if (!fromRate || !toRate) {
    resultEl.textContent = 'Rates not available for that currency yet.';
    return;
  }

  // Rates are relative to USD base: convert amount -> USD -> target
  const amountInUSD = amount / fromRate;
  const converted = amountInUSD * toRate;

  resultEl.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
});

// --- Step 5: watchlist (add button + delegated remove) ---
addWatchBtn.addEventListener('click', () => {
  const code = watchCurrencySelect.value;
  if (!code) return;

  if (state.watchlist.includes(code)) {
    return; // guard against duplicates
  }

  state.watchlist.push(code);
  renderWatchlist();
  save();
});

function renderWatchlist() {
  watchlistEl.innerHTML = '';

  state.watchlist.forEach((code) => {
    const li = document.createElement('li');
    li.dataset.c = code;

    const rate = state.rates[code];
    const rateText = rate ? `1 USD = ${rate} ${code}` : code;

    const label = document.createElement('span');
    label.textContent = rateText;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.dataset.c = code;

    li.appendChild(label);
    li.appendChild(removeBtn);
    watchlistEl.appendChild(li);
  });
}

// Delegated click listener to remove a row by its data-c
watchlistEl.addEventListener('click', (e) => {
  const target = e.target.closest('[data-c]');
  if (!target) return;

  const code = target.dataset.c;
  state.watchlist = state.watchlist.filter((c) => c !== code);
  renderWatchlist();
  save();
});

// --- Step 6: save() / load() with localStorage ---
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.watchlist));
  } catch (error) {
    console.error('Failed to save watchlist:', error);
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state.watchlist = JSON.parse(raw);
    }
  } catch (error) {
    console.error('Failed to load watchlist:', error);
  }
}

// --- Init ---
function init() {
  // Step 2: fake hard-coded rates so the dropdown fills before touching the network
  state.rates = { USD: 1, KES: 129.5, EUR: 0.92, GBP: 0.79 };
  render();

  // Step 6: restore saved watchlist
  load();
  renderWatchlist();

  // Step 3: replace fake data with live rates
  loadRates();
}

init();