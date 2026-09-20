​Architectural Decision Record (DECISIONS.md)
​Decision 1: State Contention in a Shared Public Sandbox
​Context & Challenge: ParaBank is a shared public sandbox environment. Running automated tests simultaneously across multiple CI workers causes race conditions, colliding usernames, and unexpected state changes if one worker triggers a global database reset during another worker's test run.
​Architecture Solution:
​Dynamic Unique Data: Hardcoded credentials are strictly avoided. Each test creates an isolated, randomized test user using dynamic timestamps (createUniqueUser) to eliminate username collisions.
​Controlled State Priming: Database resets and loan provider configurations (AdminApi.resetDatabaseAndSetLoanProvider()) are invoked programmatically via backend REST endpoints before UI interactions begin, ensuring a clean slate without interfering with isolated run credentials.
​Decision 2: Currency Handling & Floating-Point Precision
​Context & Challenge: JavaScript and TypeScript use IEEE 754 floating-point arithmetic. Direct operations like 150.00 + 25.50 + 8.99 produce precision drift (e.g., 184.48999999999998), causing false assertion failures against displayed account balances.
​Architecture Solution:
​Transaction strings extracted from DOM tables are cleaned of currency symbols ($, ,) and parsed to floats.
​Monetary values are converted to base integer units (cents) by multiplying by 100.
​Calculations apply Math.round((sum) * 100) / 100 before asserting against account balances, guaranteeing exact decimal accuracy and matching expected sums.
​Decision 3: Design Patterns & Separation of Concerns (UI vs. API)
​Context & Challenge: Mixing direct browser manipulations with pre-test setup and data seeding creates slow, brittle test suites prone to transient UI failures.
​Architecture Solution:
​API Layer (/api): Manages deterministic test setup, teardown, and database management (AdminApi, CustomerApi, AccountApi) using Playwright's APIRequestContext.
​Page Object Model (/pages): Encapsulates DOM element locators and genuine user interactions (LoanPage, RegisterPage, TransactionsPage), ensuring UI changes do not impact test specs directly.
​Hybrid Orchestration: Preconditions and data seeding run via fast API requests, while user simulations (applying for loans, submitting transfers) run via the browser. Dynamic polling (expect.poll()) is applied to handle asynchronous backend persistence without hardcoded sleep delays.
​Custom Reporter Design
​The custom reporter (CustomReporter) generates custom-report.html following a modern glassmorphism UI style:
​Visual Theme: Semi-transparent frosted cards with background backdrop blur (backdrop-filter: blur(...)).
​Branding Accent: Primary accent color strictly set to #F48031 for active tabs, borders, and status cards.
​Metrics: Displays overall run duration, execution status, pass/fail ratios, and detailed assertion error tracess