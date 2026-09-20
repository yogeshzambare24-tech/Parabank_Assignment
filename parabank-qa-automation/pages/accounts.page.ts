import { Page, expect } from '@playwright/test';

export class AccountsPage {
  constructor(private page: Page) {}

  async openNewAccount(): Promise<string> {
    await this.page.click('a[href*="openaccount.htm"]');
    await this.page.locator('select#type').selectOption('0');
    
    // Explicit dynamic visibility check to eliminate thread sleeps
    const fromAccountDropdown = this.page.locator('select#fromAccountId');
    await expect(fromAccountDropdown).toBeVisible();
    await expect(fromAccountDropdown.locator('option')).not.toHaveCount(0, { timeout: 15000 });
    await this.page.locator('input[value="Open New Account"]').click({ force: true });
    const newAccountId = this.page.locator('#newAccountId');
    try {
      await expect(newAccountId).toHaveText(/^\d+$/, { timeout: 15000 });
    } catch (error) {
      const body = await this.page.locator('body').innerText();
      throw new Error(`Account opening did not complete. Page state:\n${body}`);
    }
    const accountNumber = await newAccountId.textContent();
    if (!accountNumber?.trim()) {
      throw new Error('The newly opened account did not have an account number.');
    }
    return accountNumber.trim();
  }

  async getAccountBalance(accountId: string): Promise<number> {
    await this.page.goto(`/parabank/activity.htm?id=${accountId}`);
    await expect(this.page.locator('body')).toContainText(/\$[0-9,]+\.[0-9]{2}/, { timeout: 15000 });
    const body = await this.page.locator('body').innerText();
    const match = body.match(/Balance:\s*\$([0-9,]+(?:\.[0-9]{2})?)/);
    if (!match) {
      throw new Error(`No balance was displayed for account ${accountId}.`);
    }
    return Number(match[1].replace(/,/g, ''));
  }

  async getAccountIds(): Promise<string[]> {
    await this.page.goto('/parabank/overview.htm');
    const links = this.page.locator('table a[href*="activity.htm?id="]');
    await expect(links.first()).toBeVisible({ timeout: 15000 });
    const count = await links.count();
    if (count === 0) {
      throw new Error('No customer accounts were displayed.');
    }
    return Promise.all(
      Array.from({ length: count }, async (_, index) => (await links.nth(index).textContent())?.trim() || '')
    );
  }
}
