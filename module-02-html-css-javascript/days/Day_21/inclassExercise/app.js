const SIGNUPS_KEY = "signups";
const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const errorEl = document.getElementById("error");
const countEl = document.getElementById("count");

// Ethiopian mobile numbers: 09xxxxxxxx / 07xxxxxxxx or +2519xxxxxxxx / +2517xxxxxxxx
const ETHIO_PHONE_REGEX = /^(?:\+251|0)[97]\d{8}$/;

function loadSignups() {
try {
    const raw = localStorage.getItem(SIGNUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
} catch (err) {
    console.error(
    "Could not load signups from localStorage (corrupt data?):",
    err,
    );
    return [];
}
}

function saveSignups(list) {
try {
    localStorage.setItem(SIGNUPS_KEY, JSON.stringify(list));
} catch (err) {
    console.error("Could not save signups to localStorage:", err);
}
}

function updateCount() {
const signups = loadSignups();
countEl.textContent = `${signups.length} ${signups.length === 1 ? "person has" : "people have"} signed up.`;
}

form.addEventListener("submit", (e) => {
e.preventDefault();
errorEl.textContent = "";

const name = nameInput.value.trim();
const phone = phoneInput.value.trim();

if (name.length < 2) {
    errorEl.textContent = "Name must be at least 2 characters.";
    return;
}

if (!ETHIO_PHONE_REGEX.test(phone)) {
    errorEl.textContent =
    "Enter a valid Ethiopian phone number, e.g. 0912345678 or +251912345678.";
    return;
}

const signups = loadSignups();
signups.push({ name, phone });
saveSignups(signups);

form.reset();
updateCount();
});

updateCount();