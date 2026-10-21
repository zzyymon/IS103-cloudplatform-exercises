const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const categoryInput = document.getElementById("expense-category");
const totalDisplay = document.getElementById("total");
const expenseList = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");
const clearButton = document.getElementById("clear-button");
let expenses = [];
try {
    const saved = JSON.parse(localStorage.getItem("is103-expenses"));
    if (Array.isArray(saved)) {
        expenses = saved.filter(item =>
            item &&
            typeof item.name === "string" &&
            typeof item.amount === "number" &&
            Number.isFinite(item.amount) &&
            item.amount > 0 &&
            typeof item.category === "string" &&
            typeof item.id === "string"
        );
    }
} catch {
    expenses = [];
}
const peso = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
});
function saveExpenses() {
    localStorage.setItem("is103-expenses", JSON.stringify(expenses));
}
function renderExpenses() {
    expenseList.replaceChildren();
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    totalDisplay.textContent = peso.format(total);
    emptyMessage.hidden = expenses.length > 0;
    clearButton.hidden = expenses.length === 0;
    expenses.forEach(item => {
        const li = document.createElement("li");
        li.className = "expense-item";
        const info = document.createElement("div");
        info.className = "expense-info";
        const name = document.createElement("strong");
        name.textContent = item.name;
        const category = document.createElement("small");
        category.textContent = item.category;
        info.append(name, category);
        const right = document.createElement("div");
        right.className = "expense-right";
        const amount = document.createElement("div");
        amount.className = "expense-amount";
        amount.textContent = peso.format(item.amount);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-button";
        remove.textContent = "Delete";
        remove.setAttribute("aria-label", `Delete ${item.name}`);
        remove.addEventListener("click", () => {
            expenses = expenses.filter(expense => expense.id !== item.id);
            saveExpenses();
            renderExpenses();
        });
        right.append(amount, remove);
        li.append(info, right);
        expenseList.append(li);
    });
}
form.addEventListener("submit", event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a name and a valid amount greater than zero.");
        return;
    }
    expenses.unshift({
        id: crypto.randomUUID(),
        name,
        amount,
        category
    });
    saveExpenses();
    renderExpenses();
    form.reset();
    nameInput.focus();
});
clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all expenses?")) {
        expenses = [];
        saveExpenses();
        renderExpenses();
    }
});
renderExpenses();