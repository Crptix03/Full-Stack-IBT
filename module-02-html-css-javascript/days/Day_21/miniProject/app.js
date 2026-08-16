const PHONE = /^(?:\+251|0)9\d{8}$/;

function validate(name, phone) {
  console.log('validating:', JSON.stringify(name), name.trim().length);
  if (name.trim().length < 2) return "Enter your full name.";
  if (!PHONE.test(phone)) return "Enter a valid phone.";
  return "";
}

const SIGNUPS_KEY = 'signups';

function loadSignups() {
  try {
    const raw = localStorage.getItem(SIGNUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Could not load signups from localStorage (corrupt data?):', err);
    return [];
  }
}

function saveSignups(list) {
  try {
    localStorage.setItem(SIGNUPS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Could not save signups to localStorage:', err);
  }
}

const form = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const errorEl = document.getElementById('error');
const countEl = document.getElementById('count');

function updateCount() {
  const signups = loadSignups();
  countEl.textContent = `${signups.length} ${signups.length === 1 ? 'person has' : 'people have'} signed up.`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorMsg = validate(name, phone);
  if (errorMsg) {
    errorEl.textContent = errorMsg;
    return;
  }

  const signups = loadSignups();
  signups.push({ name, phone });
  saveSignups(signups);

  form.reset();
  updateCount();
});

updateCount();