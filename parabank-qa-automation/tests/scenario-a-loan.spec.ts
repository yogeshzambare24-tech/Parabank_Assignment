import { expect, test } from '../fixtures/test.fixture';
import { AdminApi } from '../api/admin.api';
import { AccountsPage } from '../pages/accounts.page';
import { LoanPage } from '../pages/loan.page';
import { RegisterPage } from '../pages/register.page';
import { createUniqueUser } from '../utils/test-data';

test.describe('Scenario A: Global State and Loan Orchestration', () => {
  test('registers a user, opens an account, and verifies an approved loan balance', async ({
    page,
    request
  }) => {
    await new AdminApi(request).resetDatabaseAndSetLoanProvider();

    const credentials = createUniqueUser();
    const registerPage = new RegisterPage(page);
    const accountsPage = new AccountsPage(page);
    const loanPage = new LoanPage(page);

    await registerPage.registerUser(credentials.username);
    await expect(page.locator('a[href*="overview.htm"]')).toBeVisible();

    const sourceAccountId = (await accountsPage.getAccountIds())[0];
    const newAccountId = await accountsPage.openNewAccount();
    expect(newAccountId).not.toBe(sourceAccountId);

    const loanAmount = '1000';
    const downPayment = '100';
    const loanAccountId = await loanPage.applyForLoan(loanAmount, downPayment, newAccountId);
    expect(loanAccountId).toMatch(/^\d+$/);

    await expect.poll(() => accountsPage.getAccountBalance(loanAccountId)).toBe(1000);
  });
});
