import { Page, Locator, expect } from '@playwright/test';

export class CreateRequestPage {
  readonly page: Page;

  // Navigation / Tabs / Buttons
  readonly newRequestLink: Locator;
  readonly continueButton: Locator;
  readonly carriersTab: Locator;
  readonly reviewTab: Locator;
  readonly sendRequestButton: Locator;

  // Pickup
  readonly pickupTypePickupPointRadio: Locator;
  readonly pickupEarliestDateInput: Locator;
  readonly pickupLatestDateInput: Locator;
  readonly pickupCityInput: Locator;
  readonly pickupCountryCombobox: Locator;

  // Delivery
  readonly deliveryLatestDateInput: Locator;
  readonly deliveryCityInput: Locator;
  readonly deliveryCountryCombobox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newRequestLink = page.getByRole('link', { name: '+ New request' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.carriersTab = page.getByRole('tab', { name: 'Carriers' });
    this.reviewTab = page.getByRole('tab', { name: 'Review' });
    this.sendRequestButton = page.getByRole('button', { name: /send\s+request/i });
    this.pickupTypePickupPointRadio = page.getByRole('radio', { name: 'Pickup point' }).first();
    this.pickupEarliestDateInput = page.locator('[data-test-id="dp-input"]').first();
    this.pickupLatestDateInput = page.locator('[data-test-id="dp-input"]').nth(1);
    this.pickupCityInput = page.locator('[id="waypoints[0].city"]');
    this.pickupCountryCombobox = page.locator('[id="waypoints[0].country"]');
    this.deliveryLatestDateInput = page.locator('[data-test-id="dp-input"]').nth(3);
    this.deliveryCityInput = page.locator('[id="waypoints[1].city"]');
    this.deliveryCountryCombobox = page.locator('[id="waypoints[1].country"]').or(page.getByRole('combobox', { name: 'Country*' })
    );
  }

  // Navigation helpers
  async goToNewRequest(): Promise<void> {
    await this.newRequestLink.click();
  }

  async goToCarriers(): Promise<void> {
    await this.carriersTab.click();
  }

  async goToReview(): Promise<void> {
    await this.reviewTab.click();
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async sendRequest(): Promise<void> {
    await this.sendRequestButton.click();
  }

  async selectPickupTypePickupPoint(): Promise<void> {
    await this.pickupTypePickupPointRadio.check();
  }

  async setPickupWindow(earliestDateTime: string, latestDateTime: string): Promise<void> {
    const generatedTime = earliestDateTime;
    await this.pickupEarliestDateInput.fill(generatedTime);
    await this.pickupLatestDateInput.fill(latestDateTime);
    await expect(this.pickupEarliestDateInput).toHaveValue(generatedTime);
    await expect(this.pickupLatestDateInput).toHaveValue(latestDateTime);
  }

  async fillPickupCity(city: string): Promise<void> {
    await this.pickupCityInput.fill(city);
  }

  async selectPickupCountry(country: string): Promise<void> {
    await this.pickupCountryCombobox.click();
    await this.page.getByRole('option', { name: country }).click();
  }

  async setDeliveryLatestDate(latestDateTime: string): Promise<void> {
    await this.deliveryLatestDateInput.fill(latestDateTime);
    await expect(this.deliveryLatestDateInput).toHaveValue(latestDateTime);
  }

  async fillDeliveryCity(city: string): Promise<void> {
    await this.deliveryCityInput.fill(city);
  }

  async selectDeliveryCountry(country: string): Promise<void> {
    await this.deliveryCountryCombobox.click();
    await this.page.getByRole('option', { name: country }).click();
  }

  async selectDemoCarrier(): Promise<void> {
    const carrierId = process.env.CARRIER_ID || '6746';
    await this.page.locator(`[id="${carrierId}"]`).check();
  }

  async getFirstRequestIdOnList(): Promise<string> {
    const idLocator = this.page.locator('span.fs-5.fw-bold').first();
    await expect(idLocator).toBeVisible();
    const content = await idLocator.textContent();
    return (content || '').trim();
  }
}
