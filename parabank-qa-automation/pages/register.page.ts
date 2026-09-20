import { expect, Page } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async registerUser(username: string) {
    await this.page.goto('/parabank/register.htm');
    await this.page.fill('input[id="customer.firstName"]', 'Automation');
    await this.page.fill('input[id="customer.lastName"]', 'Engineer');
    await this.page.fill('input[id="customer.address.street"]', '123 QA Lane');
    await this.page.fill('input[id="customer.address.city"]', 'TechCity');
    await this.page.fill('input[id="customer.address.state"]', 'MH');
    await this.page.fill('input[id="customer.address.zipCode"]', '411001');
    await this.page.fill('input[id="customer.phoneNumber"]', '1234567890');
    await this.page.fill('input[id="customer.ssn"]', '999-99-9999');
    
    await this.page.fill('input[id="customer.username"]', username);
    await this.page.fill('input[id="customer.password"]', 'Password123');
    await this.page.fill('input[id="repeatedPassword"]', 'Password123');
    
    await this.page.click('input[value="Register"]');
    await expect(this.page.locator('a[href*="overview.htm"]')).toBeVisible();
  }
}
