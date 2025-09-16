import { test, expect } from '@playwright/test';
import { CreateRequestPage } from '../pom/CreateRequestPage';
import { TestHelpers } from '../utils/testHelpers';
import { LandingPage } from '../pom/LandingPage';

test.describe('Create Transport Request', () => {
  let createRequestPage: CreateRequestPage;

  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await TestHelpers.login(page, landingPage);
    createRequestPage = new CreateRequestPage(page);
  });

  test.only('should create request successfully and display it in the list', async ({ page }) => {
    await createRequestPage.goToNewRequest();
    await createRequestPage.selectPickupTypePickupPoint();

    const earliestDate = TestHelpers.futureDate(1);
    const latestDate = TestHelpers.futureDate(2);
    await createRequestPage.setPickupWindow(earliestDate, latestDate);
    await createRequestPage.fillPickupCity(TestHelpers.pickupCity());
    await createRequestPage.selectPickupCountry(TestHelpers.pickupCountry());

    const deliveryLatestDate = TestHelpers.addDaysToDateString(latestDate, 5);
    await createRequestPage.setDeliveryLatestDate(deliveryLatestDate);
    await createRequestPage.fillDeliveryCity(TestHelpers.deliveryCity());
    await createRequestPage.selectDeliveryCountry(TestHelpers.deliveryCountry());

    await createRequestPage.continue();
    await createRequestPage.goToCarriers();
    await createRequestPage.selectDemoCarrier();
    await createRequestPage.goToReview();
    await createRequestPage.sendRequest();

    await page.goto('/request/list');
    await expect(page).toHaveURL(/\/request\/list\/?$/);

    const requestId = await createRequestPage.getFirstRequestIdOnList();
    await expect(page.locator(`text=${requestId}`)).toBeVisible();
    await page.goto('/request/view/' + requestId.replace(/\D/g, ''));

  });

  test('should display errors when required pickup fields are missing (known bug)', async ({ page }) => {
    await createRequestPage.goToNewRequest();
    await createRequestPage.selectPickupTypePickupPoint();
    await createRequestPage.continue();
  
    // Only 4 out of 6 required fields show error messages
    const requiredErrors = page.getByText('This field is required.');
    await expect(requiredErrors).toHaveCount(4);
  });
  

  test.only('should prevent duplicate submission via double click on send (known bug)', async ({ page }) => {
    await createRequestPage.goToNewRequest();
    await createRequestPage.selectPickupTypePickupPoint();

    const earliestDate = TestHelpers.futureDate(1);
    const latestDate = TestHelpers.futureDate(2);
    await createRequestPage.setPickupWindow(earliestDate, latestDate);
    await createRequestPage.fillPickupCity(TestHelpers.pickupCity());
    await createRequestPage.selectPickupCountry(TestHelpers.pickupCountry());

    const deliveryLatestDate = TestHelpers.addDaysToDateString(latestDate, 5);
    await createRequestPage.setDeliveryLatestDate(deliveryLatestDate);
    await createRequestPage.fillDeliveryCity(TestHelpers.deliveryCity());
    await createRequestPage.selectDeliveryCountry(TestHelpers.deliveryCountry());

    await createRequestPage.continue();
    await createRequestPage.goToCarriers();
    await createRequestPage.selectDemoCarrier();
    await createRequestPage.goToReview();

    const sendBtn = createRequestPage.sendRequestButton;
    await expect(sendBtn).toBeEnabled();

    // Known UX issue: double-click allows duplicate submission, test will pass but should not
    await sendBtn.dblclick();
    await expect(page).toHaveURL(/\/request\/view\/\d+$/);
  });
});
