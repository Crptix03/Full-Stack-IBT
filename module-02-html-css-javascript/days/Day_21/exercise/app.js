// 1) Generic localStorage array helpers
function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    console.error(`Could not save "${key}" to localStorage:`, err);
  }
}

function loadList(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Could not load "${key}" from localStorage (corrupt data?):`, err);
    return [];
  }
}

// 2) Theme toggle
const THEME_KEY = 'preferredTheme';
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeBtn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (err) {
    console.error('Could not read theme from localStorage:', err);
    return 'light';
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Could not save theme to localStorage:', err);
  }
}

let currentTheme = loadTheme();
applyTheme(currentTheme);

themeBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  saveTheme(currentTheme);
});

// 3) Language toggle
const LANG_KEY = 'preferredLang';
const langBtn = document.getElementById('lang-toggle');

const strings = {
  en: {
    pageTitle: 'Toggle + Signup Demo',
    toggleHeading: 'Preferences',
    toggleNote: 'Your choice is remembered next time you open this page.',
    signupHeading: 'Sign Up',
    nameLabel: 'Full name',
    phoneLabel: 'Phone number'
  },
  am: {
    pageTitle: 'ማብሪያ + ምዝገባ',
    toggleHeading: 'ምርጫዎች',
    toggleNote: 'ምርጫዎ ገጹን ደግመው ሲከፍቱ ይታወሳል።',
    signupHeading: 'ይመዝገቡ',
    nameLabel: 'ሙሉ ስም',
    phoneLabel: 'ስልክ ቁጥር'
  }
};

function applyLang(lang) {
  const t = strings[lang];
  document.getElementById('page-title').textContent = t.pageTitle;
  document.getElementById('toggle-heading').textContent = t.toggleHeading;
  document.getElementById('toggle-note').textContent = t.toggleNote;
  document.getElementById('signup-heading').textContent = t.signupHeading;
  document.querySelector('label[for="name"]').textContent = t.nameLabel;
  document.querySelector('label[for="phone"]').textContent = t.phoneLabel;
}

function loadLang() {
  try {
    return localStorage.getItem(LANG_KEY) || 'en';
  } catch (err) {
    console.error('Could not read language from localStorage:', err);
    return 'en';
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (err) {
    console.error('Could not save language to localStorage:', err);
  }
}

let currentLang = loadLang();
applyLang(currentLang);

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'am' : 'en';
  applyLang(currentLang);
  saveLang(currentLang);
});

// 4) Signup form
const SIGNUPS_KEY = 'signups';
const form = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const errorEl = document.getElementById('error');
const countEl = document.getElementById('count');

const ETHIO_PHONE_REGEX = /^(?:\+251|0)[97]\d{8}$/;

function updateCount() {
  const signups = loadList(SIGNUPS_KEY);
  countEl.textContent = `${signups.length} ${signups.length === 1 ? 'person has' : 'people have'} signed up.`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (name.length < 2) {
    errorEl.textContent = 'Name must be at least 2 characters.';
    return;
  }
  if (!ETHIO_PHONE_REGEX.test(phone)) {
    errorEl.textContent = 'Enter a valid Ethiopian phone number, e.g. 0912345678 or +251912345678.';
    return;
  }

  const signups = loadList(SIGNUPS_KEY);
  signups.push({ name, phone });
  saveList(SIGNUPS_KEY, signups);

  form.reset();
  updateCount();
});

updateCount();