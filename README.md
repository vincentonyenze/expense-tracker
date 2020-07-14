# Expense Tracker

A responsive web app for tracking income and expenses, built with plain HTML, CSS and JavaScript. No frameworks or libraries.

This is **Project 3** in my beginner-to-expert web development roadmap.

<!-- Add a screenshot: save one as screenshot.png in this folder and uncomment the line below -->
<!-- ![Expense Tracker screenshot](screenshot.png) -->

## Features

- Add income and expense transactions with a description, amount, category and date
- See your total income, total expenses and balance update automatically (the balance turns red when negative)
- Edit and delete transactions
- Data is saved in the browser with `localStorage`, so it survives a page refresh
- Search transactions by description
- Filter by type (income or expense) and by category
- Sort by date (newest or oldest) or by amount (highest or lowest)
- Form validation with clear error messages
- Helpful empty states, with a "Clear filters" shortcut when filters hide everything
- Responsive layout for desktop, tablet and phone

## Built with

- HTML5 (semantic elements, accessible labels, ARIA attributes)
- CSS3 (custom properties, Grid, Flexbox, media queries, BEM naming)
- Vanilla JavaScript (ES6+)

## What I learned

- **Array methods:** `map()`, `filter()`, `reduce()`, `find()` and `sort()`
- **CRUD operations:** creating, reading, updating and deleting data
- **State and rendering:** keeping one source of truth (`transactions`) and re-rendering the UI from it
- **Derived state:** calculating totals and the visible list instead of storing them
- **Immutability:** updating and deleting by creating new arrays instead of changing the old one
- **DOM manipulation:** building elements with `createElement` and `textContent` (safe from HTML injection)
- **Event delegation:** one listener on a parent element handles events from many children
- **Form validation:** guard clauses, error messages and `aria-invalid`
- **localStorage:** saving and loading with `JSON.stringify` / `JSON.parse`, including handling corrupted data
- **Responsive design:** media queries and `auto-fit` grids

## How to run

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Open `index.html` in your browser.

No installation or build step is needed.

## Project structure

```
expense-tracker/
├── index.html   # Page structure
├── style.css    # Styles and responsive layout
├── script.js    # App logic: state, rendering, events, storage
└── README.md
```

## Possible improvements

- Charts showing spending by category
- Monthly view and date range filters
- Export transactions to CSV
- Choose a currency
- Dark mode
- Rebuild in React (planned for a later project in my roadmap)
