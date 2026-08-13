// 1. USD -> ETB rate
async function getRate() {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    return data.rates.ETB;
}

document.querySelector("#btn1").addEventListener("click", async () => {
    const out = document.querySelector("#out1");
    out.textContent = "Loading...";
    try {
        const rate = await getRate();
        out.textContent = `1 USD = ${rate} ETB`;
    } catch (err) {
        out.textContent = "Failed to load rate.";
        console.error(err);
    }
});

// 2. .then chain rewritten as async/await
async function loadPosts() {
    const out = document.querySelector("#out2");
    out.innerHTML = "";
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        data.forEach((post) => {
            const li = document.createElement("li");
            li.textContent = post.title;
            out.append(li);
        });
    } catch (err) {
        out.textContent = "Failed to load posts.";
        console.error(err);
    }
}

document.querySelector("#btn2").addEventListener("click", loadPosts);

// 3. Wrong URL vs real 404
document.querySelector("#btn3a").addEventListener("click", async () => {
    const out = document.querySelector("#out3");
    out.textContent = "Fetching bad URL...";
    try {
        const response = await fetch("https://this-domain-does-not-exist-xyz.com/data");
        const data = await response.json();
        out.textContent = JSON.stringify(data);
    } catch (err) {
        out.textContent = `Caught error (bad URL / network failure): ${err.message}`;
        console.error(err);
    }
});

document.querySelector("#btn3b").addEventListener("click", async () => {
    const out = document.querySelector("#out3");
    out.textContent = "Fetching real 404...";
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/99999");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        out.textContent = JSON.stringify(data);
    } catch (err) {
        out.textContent = `Caught error (thanks to res.ok check): ${err.message}`;
        console.error(err);
    }
});


// 4. Promise.all for first 2 items in parallel
async function loadDetails() {
    const out = document.querySelector("#out4");
    out.innerHTML = "";
    try {
        const listResponse = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=2");
        if (!listResponse.ok) throw new Error(`HTTP error: ${listResponse.status}`);
        const list = await listResponse.json();

        const detailPromises = list.map((item) =>
            fetch(`https://jsonplaceholder.typicode.com/posts/${item.id}/comments?_limit=1`)
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                    return res.json();
                })
        );

        const details = await Promise.all(detailPromises);

        details.forEach((commentList, i) => {
            const li = document.createElement("li");
            li.textContent = `Post ${list[i].id} first comment: ${commentList[0]?.name ?? "none"}`;
            out.append(li);
        });
    } catch (err) {
        out.textContent = "Failed to load details.";
        console.error(err);
    }
}

document.querySelector("#btn4").addEventListener("click", loadDetails);

// 5. Loading / data / error states
async function loadWithStates() {
    const out = document.querySelector("#out5");
    out.textContent = "Loading...";
    out.className = "out loading";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        out.textContent = data.title;
        out.className = "out";
    } catch (err) {
        out.textContent = "Something went wrong. Check your connection and try again.";
        out.className = "out error";
        console.error(err);
    }
}

document.querySelector("#btn5").addEventListener("click", loadWithStates);