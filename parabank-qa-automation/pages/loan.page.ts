import { Page, expect } from '@playwright/test';

export class LoanPage {
  constructor(private page: Page) {}

  async applyForLoan(amount: string, downPayment: string, fromAccountId: string) {
    await this.page.click('a[href*="requestloan.htm"]');
    await this.page.fill('input#amount', amount);
    await this.page.fill('input#downPayment', downPayment);
    await this.page.selectOption('select#fromAccountId', fromAccountId);
    await this.page.click('input[value="Apply Now"]');
    
    await expect(this.page.locator('#loanStatus')).toHaveText('Approved');
    const loanAccountId = await this.page.locator('#newAccountId').textContent();
    return loanAccountId?.trim() || '';
  }
}
