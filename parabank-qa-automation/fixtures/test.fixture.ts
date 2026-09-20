import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { AccountsPage } from '../pages/accounts.page';
import { LoanPage } from '../pages/loan.page';
import { TransactionsPage } from '../pages/transactions.page';
import { AdminApi } from '../api/admin.api';
import { CustomerApi } from '../api/customer.api';
import { AccountApi } from '../api/account.api';
import { LoginPage } from '../pages/login.page';

type MyFixtures = {
  registerPage: RegisterPage;
  accountsPage: AccountsPage;
  loanPage: LoanPage;
  transactionsPage: TransactionsPage;
  adminApi: AdminApi;
  customerApi: CustomerApi;
  accountApi: AccountApi;
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },
  loanPage: async ({ page }, use) => {
    await use(new LoanPage(page));
  },
  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },
  adminApi: async ({ request }, use) => {
    await use(new AdminApi(request));
  },
  customerApi: async ({ request }, use) => {
    await use(new CustomerApi(request));
  },
  accountApi: async ({ request }, use) => {
    await use(new AccountApi(request));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
