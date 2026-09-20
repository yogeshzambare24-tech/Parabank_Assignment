import { expect, test } from '../fixtures/test.fixture';
import { AdminApi } from '../api/admin.api';
import { AccountsPage } from '../pages/accounts.page';
import { RegisterPage } from '../pages/register.page';
import { TransactionsPage } from '../pages/transactions.page';
import { createUniqueUser } from '../utils/test-data';

test.describe('Scenario B: Transaction Aggregation & Currency Parsing', () => {
  test('Process multiple automated value transactions and assert mathematical accuracy', async ({ page, request }) => {
    const adminApi = new AdminApi(request);
    const accountsPage = new AccountsPage(page);
    const registerPage = new RegisterPage(page);
    const transactionsPage = new TransactionsPage(page);

    await adminApi.resetDatabaseAndSetLoanProvider();
    await registerPage.registerUser(createUniqueUser().username);
    const [sourceAccount, referenceTarget] = [
      (await accountsPage.getAccountIds())[0],
      await accountsPage.openNewAccount()
    ];

    await transactionsPage.transferFunds(sourceAccount, referenceTarget, '150.00');
    await transactionsPage.transferFunds(sourceAccount, referenceTarget, '25.50');
    await transactionsPage.transferFunds(sourceAccount, referenceTarget, '8.99');

    const calculatedExpected = Math.round((150.00 + 25.50 + 8.99) * 100) / 100;
    const computedActual = await transactionsPage.getParsedTransactionsTotal(
      sourceAccount,
      'debit',
      'Funds Transfer Sent',
      [150, 25.5, 8.99]
    );
    
    expect(computedActual).toBe(calculatedExpected);
  });
});
