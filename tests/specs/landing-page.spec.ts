import { test, expect } from '@playwright/test';
import { LandingPage } from '../pom/LandingPage';
import { TestHelpers } from '../utils/testHelpers';

test.describe('Landing Page Tests', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.waitUntilLoaded();
  });

  test('should register successfully and navigate to request list', async ({ page }) => {
    await TestHelpers.fillAllRequiredFields(landingPage);
    await landingPage.submitForm();
    await expect(page).toHaveURL(/\/request\/list\/?$/);
  });
  
  test('should display validation errors for all required fields when submitting empty form', async ({ page }) => {
    await landingPage.submitForm();
    const form = page.locator('form');

    await expect(form.getByText(/name\s+is\s+required/i).first()).toBeVisible();
    await expect(form.getByText(/company\s*name\s+is\s+required/i).first()).toBeVisible();
    await expect(form.getByText(/phone(\s*number)?\s+is\s+required/i).first()).toBeVisible();
    await expect(form.getByText(/email\s+is\s+required/i).first()).toBeVisible();
    await expect(form.getByText(/agree.*terms/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/register\/?$/);
  });

  test('should display validation error for invalid email format', async ({ page }) => {
    await landingPage.fillEmailInput(TestHelpers.invalidEmail());
    await landingPage.submitForm();
    await expect(page.getByText(/email.*(invalid|not\s+valid)/i)).toBeVisible();
    await expect(page).toHaveURL(/\/register\/?$/);
  });

  test('should clear email error after correction', async ({ page }) => {
    const form = page.locator('form');
    await landingPage.fillEmailInput(TestHelpers.invalidEmail());
    await landingPage.submitForm();
    const emailError = form.getByText(/email.*(invalid|not\s+valid)/i);
    await expect(emailError.first()).toBeVisible();

    await landingPage.fillEmailInput(TestHelpers.generateUniqueEmail());
    await landingPage.submitForm();
    await expect(emailError).toHaveCount(0);
  });

  test('should display validation error for invalid phone number format (known UX issue)', async ({ page }) => {
    await TestHelpers.fillAllRequiredFields(landingPage);
    await landingPage.fillPhoneNumberInput(TestHelpers.invalidPhone());
    await landingPage.submitForm();
    await expect(page.getByText(/phone\s*number.*(invalid|not\s+valid|entered\s+is)/i)).toBeVisible();
    await expect(page).toHaveURL(/\/register\/?$/);
  });

  test('should require terms to be accepted before submit', async ({ page }) => {
    await landingPage.fillNameInput(TestHelpers.randomName());  
    await landingPage.fillCompanyNameInput(TestHelpers.randomCompany());
    await landingPage.fillPhoneNumberInput(TestHelpers.generateSlovakPhoneNumber());
    await landingPage.fillEmailInput(TestHelpers.generateUniqueEmail());
    await landingPage.submitForm();
    const form = page.locator('form');
    await expect(form.getByText(/you\s+must\s+agree.*terms/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/register\/?$/);
  });

  test('should keep submit enabled when form is invalid (known UX issue)', async ({ page }) => {
    const submitBtn = landingPage.submitButton;
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  
    await landingPage.fillNameInput(TestHelpers.randomName());
    await expect(submitBtn).toBeEnabled();
  
    await landingPage.fillCompanyNameInput(TestHelpers.randomCompany());
    await expect(submitBtn).toBeEnabled();
  
    await landingPage.fillPhoneNumberInput(TestHelpers.generateSlovakPhoneNumber());
    await expect(submitBtn).toBeEnabled();
  
    await landingPage.fillEmailInput(TestHelpers.generateUniqueEmail());
    await expect(submitBtn).toBeEnabled();
  
    await landingPage.submitForm();
    const form = page.locator('form');
    await expect(form.getByText(/you\s+must\s+agree.*terms/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/register\/?$/);
  });

  test('should allow submit via double-click (known UX issue)', async ({ page }) => {
    await TestHelpers.fillAllRequiredFields(landingPage);
    await landingPage.submitButton.dblclick();
    await expect(page).toHaveURL(/\/request\/list\/?$/);
  });

});


