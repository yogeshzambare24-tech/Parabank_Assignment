import { Page, expect } from '@playwright/test';
import { parseCurrency, roundCurrency } from '../utils/currency';

export class TransactionsPage {
  constructor(private page: Page) {}

  async transferFunds(fromAccount: string, toAccount: string, amount: string) {
    await this.page.click('a[href*="transfer.htm"]');
    await this.page.fill('input#amount', amount);
    
    await expect(this.page.locator('select#fromAccountId')).toBeVisible();
    await this.page.selectOption('select#fromAccountId', fromAccount);
    await this.page.selectOption('select#toAccountId', toAccount);
    
    await this.page.click('input[value="Transfer"]');
    await expect(this.page.locator('#showResult h1')).toHaveText('Transfer Complete!');
  }

  async getParsedTransactionsTotal(
    accountId: string,
    column: 'debit' | 'credit' = 'debit',
    transactionDescription?: string,
    expectedAmounts?: number[]
  ): Promise<number> {
    await this.page.click('a[href*="findtrans.htm"]');
    await this.page.selectOption('select#accountId', accountId);
    const visibleInputs = this.page.locator('input:visible');
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 1);
    const formatDate = (date: Date) =>
      `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
    await visibleInputs.nth(2).fill(formatDate(startDate));
    await visibleInputs.nth(3).fill(formatDate(endDate));
    await this.page.getByRole('button', { name: 'Find Transactions' }).nth(2).click();

    const rows = this.page.locator('#transactionTable tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    const count = await rows.count();
    if (count === 0) {
      throw new Error(`No transactions were returned for account ${accountId}.`);
    }
    
    let total = 0;
    const remainingExpectedAmounts = expectedAmounts ? [...expectedAmounts] : undefined;
    for (let i = 0; i < count; i++) {
      if (transactionDescription) {
        const description = await rows.nth(i).locator('td').nth(1).innerText();
        if (!description.includes(transactionDescription)) {
          continue;
        }
      }
      const columnIndex = column === 'debit' ? 2 : 3;
      const amountText = await rows.nth(i).locator('td').nth(columnIndex).textContent();
      if (amountText?.trim()) {
        const amount = parseCurrency(amountText);
        if (remainingExpectedAmounts) {
          const matchingAmountIndex = remainingExpectedAmounts.findIndex(expected => expected === amount);
          if (matchingAmountIndex === -1) {
            continue;
          }
          remainingExpectedAmounts.splice(matchingAmountIndex, 1);
        }
        total = roundCurrency(total + amount);
      }
    }
    if (remainingExpectedAmounts?.length) {
      throw new Error(`Expected transaction amounts were not found: ${remainingExpectedAmounts.join(', ')}`);
    }
    return total;
  }
}
