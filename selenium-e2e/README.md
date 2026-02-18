# Selenium E2E Tests for CareerHub (Vite + React + Node/Express)

This starter uses **selenium-webdriver + Mocha + Chai** and Chrome in headless mode.

## Prerequisites
- Node.js 18+
- Chrome installed
- Your app running locally (Vite dev server + backend API). Default base URL: `http://localhost:5173`

## Setup
```bash
cd selenium-e2e
cp .env.example .env         # edit BASE_URL and paths if needed
npm install
```

## Run tests
```bash
npm test
```

> If your login requires a seeded user, set `TEST_EMAIL` and `TEST_PASSWORD` in `.env`.

## Customizing selectors
These tests use the following **existing selectors** discovered in your code:
- Login inputs: `input[placeholder="Email"]`, `input[placeholder="Password"]`
- Jobs filters: `input[placeholder="Search by role or keyword"]`, `input[placeholder="Search by location (e.g. Remote, NYC)"]`
- Applications page: buttons with text **"View Details"**, dialog label **"Description"**, shadcn `SelectItem` options **Saved, Applied, Offer, Rejected**, and `input[type="datetime-local"]` for scheduling.
- ATS Scoring: visible **"Browse files"** button with underlying `input[type="file"]`.

For **more robust tests**, consider adding `data-testid` attributes to key elements, e.g.:
```jsx
<input data-testid="login-email" ... />
<button data-testid="view-details">View Details</button>
```

## Notes
- If a page has no data (e.g., empty applications list), tests may skip.
- For cross-browser, consider Selenium Grid or GitHub Actions matrix runs.
