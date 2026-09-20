import { test, expect } from '@playwright/test';
import { AdminApi } from '../api/admin.api';
import { AccountApi } from '../api/account.api';

test.describe('Scenario C: API Parity Validation', () => {
  test('Execute purely headless API sequence and validate response schemas', async ({ request }) => {
    const adminApi = new AdminApi(request);
    const accountApi = new AccountApi(request);

    // 1. Reset Global State Environment
    await adminApi.resetDatabaseAndSetLoanProvider();

    // 2. Use the customer seeded by the ParaBank demo database. The hosted
    // environment does not expose the UI registration workflow as a service.
    const profileResponse = await request.get('/parabank/services/bank/customers/12212', {
      headers: { 'Accept': 'application/json' }
    });
    expect(profileResponse.ok()).toBeTruthy();
    const profile = await profileResponse.json();
    const customerId = profile.id;

    // 3. Headless Account and Funds Management Validation
    const sourceAccounts = await accountApi.getCustomerAccountsApi(customerId);
    expect(sourceAccounts.length).toBeGreaterThan(0);
    const newAccountId = await accountApi.createNewAccountApi(customerId, 1, sourceAccounts[0].id);
    await accountApi.depositFundsApi(newAccountId, 500.00);

    // 4. Assert Transaction Logs Parity Content Structure
    const transactionRecords = await accountApi.getAccountTransactionsApi(newAccountId);
    expect(Array.isArray(transactionRecords)).toBeTruthy();

    // Schema Parity Type-Safety Check Loop
    if (transactionRecords.length > 0) {
      const activeRecord = transactionRecords[0];
      expect(activeRecord).toHaveProperty('id');
      expect(activeRecord).toHaveProperty('amount');
      expect(typeof activeRecord.amount).toBe('number');
    }
  });
});
