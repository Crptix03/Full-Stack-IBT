const textInput = document.querySelector("#input-text");
const summarizeBtn = document.querySelector("#summarize-btn");
const clearBtn = document.querySelector("#clear-btn");
const copyBtn = document.querySelector("#copy-btn");
const resultBox = document.querySelector("#result");
const summaryText = document.querySelector("#summary-text");
const status = document.querySelector("#status");

summarizeBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) {
        status.textContent = "Please enter some text first.";
        return;
    }

    summarizeBtn.disabled = true;
    status.textContent = "Summarizing...";
    resultBox.classList.add("hidden");

    try {
        const response = await puter.ai.chat(
            `Summarize this text in 2-3 sentences: ${text}`
        );
        summaryText.textContent = response;
        resultBox.classList.remove("hidden");
        status.textContent = "";
    } catch (err) {
        console.error("Fetch failed:", err);
        status.textContent = "Something went wrong. Check the console.";
    } finally {
        summarizeBtn.disabled = false;
    }
});
clearBtn.addEventListener("click", () => {
    textInput.value = "";
    resultBox.classList.add("hidden");
    status.textContent = "";
});
copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(summaryText.textContent);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
    } catch (err) {
        console.error("Copy failed:", err);
    }
});