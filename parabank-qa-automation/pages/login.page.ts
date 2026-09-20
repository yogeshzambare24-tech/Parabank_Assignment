import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('/');
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[value="Log In"]');
    await expect(this.page.locator('a[href*="overview.htm"]')).toBeVisible();
  }
}