const out = document.querySelector("#facts");
const form = document.querySelector("#search-form");
const input = document.querySelector("#country-input");

function render(container, label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    p.append(strong, value);
    container.append(p);
}

async function showCountry(name) {
    out.textContent = "Loading...";
    try {
        // Fetch using async/await syntax and dynamic search query
        const res = await fetch(`https://api.restcountries.com/countries/v5?q=${encodeURIComponent(name)}`, {
            headers: {
                'Authorization': 'Bearer rc_live_28e55b6fa6e44d88acfe27164c9dc12f'
            }
        });

        // Check response status
        if (!res.ok) {
            if (res.status === 403) {
                throw new Error("403 Forbidden: Invalid or expired API Key.");
            }
            throw new Error(`Error ${res.status}: Country not found`);
        }

        const json = await res.json();
        
        // Check if matching country objects exist
        if (!json.data || !json.data.objects || json.data.objects.length === 0) {
            throw new Error("No country data found.");
        }

        const c = json.data.objects[0];

        out.innerHTML = "";
        
        // Capital
        const capitalName = c.capitals && c.capitals[0] ? c.capitals[0].name : "N/A";
        render(out, "Capital", capitalName);

        // Population
        const population = c.population ? c.population.toLocaleString() : "N/A";
        render(out, "Population", population);

        // Region
        render(out, "Region", c.region || "N/A");

        // Currencies
        const currencyNames = c.currencies ? c.currencies.map((cur) => cur.name).join(", ") : "N/A";
        render(out, "Currencies", currencyNames);

    } catch (err) {
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

// Initial search
showCountry("ethiopia");