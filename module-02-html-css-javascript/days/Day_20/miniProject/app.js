const out = document.querySelector("#facts");
const form = document.querySelector("#search-form");
const input = document.querySelector("#country-input");

function renderRow(container, label, value) {
    const row = document.createElement("div");
    row.className = "fact-row";

    const labelEl = document.createElement("span");
    labelEl.className = "fact-label";
    labelEl.textContent = label;

    const leader = document.createElement("span");
    leader.className = "fact-leader";

    const valueEl = document.createElement("span");
    valueEl.className = "fact-value";
    valueEl.textContent = value;

    row.append(labelEl, leader, valueEl);
    container.append(row);
}

async function showCountry(name) {
    out.className = "loading";
    out.textContent = "Loading…";

    try {
        const res = await fetch(`https://api.restcountries.com/countries/v5?q=${encodeURIComponent(name)}`, {
            headers: {
                'Authorization': 'Bearer rc_live_28e55b6fa6e44d88acfe27164c9dc12f'
            }
        });

        if (!res.ok) {
            if (res.status === 403) {
                throw new Error("403 Forbidden: Invalid or expired API Key.");
            }
            throw new Error(`Error ${res.status}: Country not found`);
        }

        const json = await res.json();

        if (!json.data || !json.data.objects || json.data.objects.length === 0) {
            throw new Error("No country data found.");
        }

        const c = json.data.objects[0];

        const displayName = (c.name && (c.name.common || c.name)) || name;
        const capitalName = c.capitals && c.capitals[0] ? c.capitals[0].name : "N/A";
        const population = c.population ? c.population.toLocaleString() : "N/A";
        const currencyNames = c.currencies ? c.currencies.map((cur) => cur.name).join(", ") : "N/A";

        out.className = "";
        out.innerHTML = "";

        const card = document.createElement("div");
        card.className = "fact-card";

        const h2 = document.createElement("h2");
        h2.textContent = displayName;

        const hr = document.createElement("hr");

        card.append(h2, hr);
        renderRow(card, "Capital", capitalName);
        renderRow(card, "Population", population);
        renderRow(card, "Region", c.region || "N/A");
        renderRow(card, "Currencies", currencyNames);

        out.append(card);

    } catch (err) {
        out.className = "error";
        out.textContent = err.message;
        console.error(err);
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    showCountry(name);
});

showCountry("Ethiopia");