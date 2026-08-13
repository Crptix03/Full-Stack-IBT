const form = document.querySelector("#add-form");
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const list = document.querySelector("#list");
const totalEl = document.querySelector("#total");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = name.value.trim();
    const p = Number(price.value);
    if (!n || !p) return;
    addRow(n, p);
    form.reset();
    updateTotal();
});
list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    if (e.target.matches(".del")) {
        li.remove();
        updateTotal();
    } else {
        li.classList.toggle("bought");
    }
});
function addRow(n, p) {
    const li = document.createElement("li");
    li.dataset.price = p;
    const span = document.createElement("span");
    span.textContent =  `${n} - ETB ${p.toFixed(2)}`;
    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.classList.add("del");
    li.append(span, delBtn);
    list.append(li);
}

function updateTotal() {
    const items = [...list.querySelectorAll("li:not(.bought)")];
    const total = items.reduce((sum, li) => sum + Number(li.dataset.price), 0);
    totalEl.textContent = total.toFixed(2);
}