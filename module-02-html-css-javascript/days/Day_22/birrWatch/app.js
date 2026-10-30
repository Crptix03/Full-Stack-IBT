const state = {
  rates: { USD: 0.0177, KES: 2.29 },
  watchlist: [],
  currency: "USD"
};

const STORAGE_KEY = "etb-converter-state";


const statusEl = document.querySelector("#status");
const convertForm = document.querySelector("#convert-form");
const amountInput = document.querySelector("#amount");
const resultEl = document.querySelector("#result");
const watchCurrencySelect = document.querySelector("#watch-currency");
const addWatchBtn = document.querySelector("#add-watch-btn");
const watchlistEl = document.querySelector("#watchlist");
const watchlistEmptyEl = document.querySelector("#watchlist-empty");

function render() {
  const select = document.querySelector("#currency");
  const codes = Object.keys(state.rates);

  select.innerHTML = codes
    .map((c) => `<option>${c}</option>`)
    .join("");

  if (codes.includes(state.currency)) {
    select.value = state.currency;
  }

  watchCurrencySelect.innerHTML = codes
    .map((c) => `<option>${c}</option>`)
    .join("");

  renderWatchlist();
}

function renderWatchlist() {
  watchlistEl.innerHTML = "";

  if (state.watchlist.length === 0) {
    watchlistEmptyEl.classList.remove("hidden");
    return;
  }
  watchlistEmptyEl.classList.add("hidden");

  state.watchlist.forEach((code) => {
    const rate = state.rates[code];
    const rateText = rate ? `1 ETB = ${rate} ${code}` : code;

    const li = document.createElement("li");
    li.dataset.c = code;
    li.innerHTML = `<span>${rateText}</span><button class="remove-btn" data-c="${code}">✕</button>`;
    watchlistEl.appendChild(li);
  });
}

async function loadRates() {
  statusEl.textContent = "Loading rates...";
  statusEl.classList.remove("error");

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/ETB");

    if (!res.ok) {
      throw new Error(`Failed to load rates (status ${res.status})`);
    }

    const data = await res.json();

    if (!data.rates) {
      throw new Error("Unexpected response format from rates API.");
    }

    state.rates = data.rates;
    statusEl.textContent = "Rates loaded.";
    statusEl.classList.remove("error");
    render();
  } catch (error) {
    statusEl.textContent = "Could not load exchange rates. Please try again later.";
    statusEl.classList.add("error");
  }
}

convertForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const raw = amountInput.value.trim();
  const amount = Number(raw);
  const currency = document.querySelector("#currency").value;

  if (raw === "" || !Number.isFinite(amount) || amount <= 0) {
    resultEl.textContent = "Please enter a valid amount greater than 0.";
    resultEl.classList.add("error");
    return;
  }

  const rate = state.rates[currency];
  if (!rate) {
    resultEl.textContent = "Rate not available for that currency.";
    resultEl.classList.add("error");
    return;
  }

  state.currency = currency;
  save();

  const converted = amount * rate;
  resultEl.textContent = `${amount} ETB = ${converted.toFixed(4)} ${currency}`;
  resultEl.classList.remove("error");
});

addWatchBtn.addEventListener("click", () => {
  const code = watchCurrencySelect.value;
  if (!code || state.watchlist.includes(code)) return;

  state.watchlist.push(code);
  renderWatchlist();
  save();
});

watchlistEl.addEventListener("click", (e) => {
  const target = e.target.closest("[data-c]");
  if (!target) return;

  state.watchlist = state.watchlist.filter((c) => c !== target.dataset.c);
  renderWatchlist();
  save();
});
function save() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ watchlist: state.watchlist, currency: state.currency })
    );
  } catch (error) {
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.watchlist)) state.watchlist = saved.watchlist;
    if (typeof saved.currency === "string") state.currency = saved.currency;
  } catch (error) {
  }
}

function init() {
  render();
  load();
  render();
  loadRates();
}

init();