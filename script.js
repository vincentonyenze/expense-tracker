// ===== DOM elements =====
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

// ===== State =====
let transactions = [];

// ===== Helpers =====
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

// ===== Form =====
function resetForm() {
  form.reset();
  dateInput.value = getTodayDate();
}

function handleSubmit(event) {
  event.preventDefault();

  const transaction = createTransaction();
  addTransaction(transaction);
  console.log(transactions);

  resetForm();
}

// ===== Init =====
form.addEventListener("submit", handleSubmit);
dateInput.value = getTodayDate();
