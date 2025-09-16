import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly companyNameInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly emailInput: Locator;
  readonly checkboxInput: Locator;
  readonly submitButton: Locator;
  readonly passwordInput: Locator;
  readonly submitLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#name');
    this.companyNameInput = page.locator('#company');
    this.phoneNumberInput = page.locator('#phoneNumber');
    this.emailInput = page.locator('#email');
    this.checkboxInput = page.getByRole('checkbox', { name: 'I agree with Terms and'});
    this.submitButton = page.getByRole('button', { name: 'Register'});
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.submitLoginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/register');
  }

  async fillNameInput(name: string): Promise<this> {
    await this.nameInput.fill(name);
    return this;
  }

  async fillCompanyNameInput(companyName: string): Promise<this> {
    await this.companyNameInput.fill(companyName);
    return this;
  }

  async fillPhoneNumberInput(phoneNumber: string): Promise<this> {
    await this.phoneNumberInput.fill(phoneNumber);
    return this;
  }

  async fillEmailInput(email: string): Promise<this> {
    await this.emailInput.fill(email);
    return this;
  }

  async acceptTerms(): Promise<this> {
    await this.checkboxInput.check();
    return this;
  }

  async submitForm(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  async waitUntilLoaded(): Promise<void> {
    await this.page.waitForURL(/\/register\/?$/);
    await this.nameInput.waitFor({ state: 'visible' });
    await this.companyNameInput.waitFor({ state: 'visible' });
  }

  async fillPasswordInput(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  };

}
