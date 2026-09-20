
# ParaBank QA Automation Framework

This repository contains the end-to-end and API test automation framework for the ParaBank application using Playwright with TypeScript.

## Installation

To install all required dependencies, run:

```bash
npm install

Running Tests
To execute the test suite in headless mode:
npx playwright test

Generating & Viewing Reports
To generate and serve the custom HTML test summary report:
npx playwright show-report


---

### Content for `DECISIONS.md`

```markdown
# Architectural Decision Record (DECISIONS.md)

## 1. State Contention
* **Problem:** ParaBank operates as a shared public sandbox where simultaneous test executions or data resets across multiple CI workers can cause state collisions, duplicate username errors, or unexpected database wiping.
* **Decision:** Dynamic state isolation and programmatic setup are enforced. Each test run dynamically generates unique user credentials using timestamps (`createUniqueUser`) to prevent collisions. Global state resets via `AdminApi.resetDatabaseAndSetLoanProvider()` are handled selectively during pre-conditions so tests remain self-contained without mutating or relying on pre-existing sandbox state.

## 2. Currency Handling
* **Problem:** JavaScript floating-point arithmetic introduces standard precision drift when parsing and summing monetary transaction strings from the UI table (e.g., `150.00 + 25.50 + 8.99`).
* **Decision:** Monetary amounts are parsed into numeric representations, scaled to whole integer cents (multiplying by 100), aggregated using `Math.round()`, and converted back to standard units before asserting against the displayed balance. This eliminates precision discrepancies between DOM-parsed values and expected totals.

## 3. Design Pattern
* **Problem:** Maintaining a clean architectural boundary between low-level REST API interactions and high-level browser UI user journeys.
* **Decision:** A strict Page Object Model (POM) and API Controller separation is used:
  * **API Controllers (`/api`):** Manage deterministic setup, teardown, and direct data generation (admin resets, customer seeding, account queries).
  * **Page Objects (`/pages`):** Encapsulate user simulation, UI actions, and locator strategies (loan requests, transaction history, funds transfers).
  * **Boundary Line:** Spec files orchestrate test flows where API calls handle state priming, while Page Objects simulate authentic user behavior and validate the visual DOM state.