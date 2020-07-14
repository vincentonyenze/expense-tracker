// ===== DOM elements =====
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const formError = document.getElementById("form-error");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const transactionList = document.getElementById("transaction-list");
const emptyState = document.getElementById("empty-state");
const emptyMessage = document.getElementById("empty-message");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const balanceEl = document.getElementById("balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const toolbar = document.getElementById("toolbar");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");
const sortSelect = document.getElementById("sort");

// ===== State =====
let transactions = [];
let editingId = null; // id of the transaction being edited, or null when adding
let filters = {
  search: "",
  type: "all",
  category: "all",
  sort: "date-desc",
};

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

// ===== Storage =====
const STORAGE_KEY = "expense-tracker:transactions";

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Could not load saved transactions:", error);
    return [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Could not save transactions:", error);
  }
}

// ===== Transactions =====
function getFormData() {
  return {
    description: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value,
  };
}

function addTransaction(data) {
  transactions.push({ id: Date.now(), ...data });
  saveTransactions();
}

function updateTransaction(id, data) {
  transactions = transactions.map((transaction) =>
    transaction.id === id ? { ...transaction, ...data } : transaction
  );
  saveTransactions();
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveTransactions();
}

// Compare functions for sort(): negative = a first, positive = b first.
// Ties on date fall back to id, so newer entries on the same day come first.
const sorters = {
  "date-desc": (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  "date-asc": (a, b) => a.date.localeCompare(b.date) || a.id - b.id,
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc": (a, b) => a.amount - b.amount,
};

function getVisibleTransactions() {
  const filtered = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(filters.search);
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;
    return matchesSearch && matchesType && matchesCategory;
  });

  // sort() changes the array it's called on. filter() already returned
  // a new array, so this won't reorder the saved `transactions`.
  return filtered.sort(sorters[filters.sort]);
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
  item.classList.toggle("is-editing", transaction.id === editingId);
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

  const actions = document.createElement("div");
  actions.className = "transaction-item__actions";
  actions.append(
    createActionButton("edit", "Edit", `Edit ${transaction.description}`),
    createActionButton("delete", "Delete", `Delete ${transaction.description}`)
  );

  const side = document.createElement("div");
  side.className = "transaction-item__side";
  side.append(amount, actions);

  item.append(details, side);
  return item;
}

function createActionButton(action, text, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn-action btn-action--${action}`;
  button.dataset.action = action;
  button.textContent = text;
  button.setAttribute("aria-label", label);
  return button;
}

function renderTransactions() {
  const visibleTransactions = getVisibleTransactions();
  const items = visibleTransactions.map(createTransactionElement);
  transactionList.replaceChildren(...items);

  const hasTransactions = transactions.length > 0;
  emptyState.hidden = visibleTransactions.length > 0;
  emptyMessage.textContent = hasTransactions
    ? "No transactions match your search or filters."
    : "No transactions yet. Add your first one above.";
  // Only offer "Clear filters" when the filters are what's hiding everything
  clearFiltersBtn.hidden = !hasTransactions;
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

// ===== Validation =====
const MAX_DESCRIPTION_LENGTH = 50;

function validateTransaction(transaction) {
  if (!transaction.description) {
    return { input: descriptionInput, message: "Please enter a description." };
  }
  if (transaction.description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      input: descriptionInput,
      message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
    };
  }
  if (!Number.isFinite(transaction.amount) || transaction.amount <= 0) {
    return { input: amountInput, message: "Please enter an amount greater than 0." };
  }
  if (!transaction.category) {
    return { input: categoryInput, message: "Please select a category." };
  }
  if (!transaction.date) {
    return { input: dateInput, message: "Please choose a date." };
  }
  return null;
}

function showError(error) {
  formError.textContent = error.message;
  error.input.setAttribute("aria-invalid", "true");
  error.input.focus();
}

function clearError() {
  formError.textContent = "";
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((input) => input.removeAttribute("aria-invalid"));
}

// ===== Form =====
function resetForm() {
  form.reset();
  dateInput.value = getTodayDate();
}

function startEditing(id) {
  const transaction = transactions.find((item) => item.id === id);
  if (!transaction) return;

  editingId = id;
  descriptionInput.value = transaction.description;
  amountInput.value = transaction.amount;
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;

  formTitle.textContent = "Edit transaction";
  submitBtn.textContent = "Save changes";
  cancelBtn.hidden = false;

  clearError();
  render();
  descriptionInput.focus();
}

function stopEditing() {
  editingId = null;
  formTitle.textContent = "Add transaction";
  submitBtn.textContent = "Add transaction";
  cancelBtn.hidden = true;

  clearError();
  resetForm();
}

function handleSubmit(event) {
  event.preventDefault();
  clearError();

  const data = getFormData();
  const error = validateTransaction(data);
  if (error) {
    showError(error);
    return;
  }

  if (editingId === null) {
    addTransaction(data);
  } else {
    updateTransaction(editingId, data);
  }

  stopEditing();
  render();
}

function handleCancel() {
  stopEditing();
  render();
}

// ===== Filters =====
function populateCategoryFilter() {
  // Reuse the form's categories so the list only lives in one place
  const options = [...categoryInput.options]
    .filter((option) => option.value)
    .map((option) => new Option(option.textContent, option.value));
  filterCategory.append(...options);
}

function handleFiltersChange() {
  filters = {
    search: searchInput.value.trim().toLowerCase(),
    type: filterType.value,
    category: filterCategory.value,
    sort: sortSelect.value,
  };
  renderTransactions();
}

function clearFilters() {
  // Sorting isn't a filter, so it stays as the user chose
  searchInput.value = "";
  filterType.value = "all";
  filterCategory.value = "all";
  handleFiltersChange();
}

// ===== List actions =====
function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = button.closest(".transaction-item");
  const id = Number(item.dataset.id);

  if (button.dataset.action === "edit") {
    startEditing(id);
  }

  if (button.dataset.action === "delete") {
    deleteTransaction(id);
    // Don't keep editing a transaction that no longer exists
    if (id === editingId) stopEditing();
    render();
  }
}

// ===== Init =====
form.addEventListener("submit", handleSubmit);
form.addEventListener("input", clearError);
cancelBtn.addEventListener("click", handleCancel);
transactionList.addEventListener("click", handleListClick);
toolbar.addEventListener("input", handleFiltersChange);
clearFiltersBtn.addEventListener("click", clearFilters);
transactions = loadTransactions();
populateCategoryFilter();
dateInput.value = getTodayDate();
render();
