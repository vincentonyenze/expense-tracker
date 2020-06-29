// ===== DOM elements =====
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transaction-list");
const emptyState = document.getElementById("empty-state");
const balanceEl = document.getElementById("balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");

// ===== State =====
let transactions = [];

// ===== Helpers =====
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

function formatDate(dateString) {
  // Build the date from its parts so it stays in local time
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ===== Transactions =====
function createTransaction() {
  return {
    id: Date.now(),
    description: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value,
  };
}

function addTransaction(transaction) {
  transactions.push(transaction);
}

function calculateTotal(type) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

// ===== Rendering =====
function createTransactionElement(transaction) {
  const item = document.createElement("li");
  item.className = `transaction-item transaction-item--${transaction.type}`;
  item.dataset.id = transaction.id;

  const details = document.createElement("div");

  const description = document.createElement("p");
  description.className = "transaction-item__description";
  description.textContent = transaction.description;

  const meta = document.createElement("p");
  meta.className = "transaction-item__meta";
  meta.textContent = `${capitalize(transaction.category)} · ${formatDate(transaction.date)}`;

  details.append(description, meta);

  const amount = document.createElement("p");
  amount.className = "transaction-item__amount";
  const sign = transaction.type === "income" ? "+" : "-";
  amount.textContent = `${sign}${formatCurrency(transaction.amount)}`;

  item.append(details, amount);
  return item;
}

function renderTransactions() {
  const items = transactions.map(createTransactionElement);
  transactionList.replaceChildren(...items);
  emptyState.hidden = transactions.length > 0;
}

function renderSummary() {
  const income = calculateTotal("income");
  const expense = calculateTotal("expense");
  const balance = income - expense;

  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(balance);
  balanceEl.classList.toggle("is-negative", balance < 0);
}

function render() {
  renderTransactions();
  renderSummary();
}

// ===== Form =====
function resetForm() {
  form.reset();
  dateInput.value = getTodayDate();
}

function handleSubmit(event) {
  event.preventDefault();

  const transaction = createTransaction();
  addTransaction(transaction);
  render();

  resetForm();
}

// ===== Init =====
form.addEventListener("submit", handleSubmit);
dateInput.value = getTodayDate();
render();
