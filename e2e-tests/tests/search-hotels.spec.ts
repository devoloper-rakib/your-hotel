import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

test.beforeEach(async ({ page }) => {
	await page.goto(UI_URL);

	// get the sign in button
	await page.getByRole('link', { name: 'Sign In' }).click();

	await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

	await page.locator('[name=email]').fill('test@gmail.com');
	await page.locator('[name=password]').fill('123456');

	await page.getByRole('button', { name: 'Login' }).click();

	await expect(
		page.getByText('User has been signed In successfully'),
	).toBeVisible();
});

test('should show hotel search results', async ({ page }) => {
	await page.goto(UI_URL);

	await page.getByPlaceholder('Where are you going?').fill('dhaka');
	await page.getByRole('button', { name: 'Search' }).click();
	await expect(page.getByText('Hotels found in dhaka')).toBeVisible();
	await expect(page.getByText('dhaka hotel')).toBeVisible();
});

test('should show hotel detail', async ({ page }) => {
	await page.goto(UI_URL);

	await page.getByPlaceholder('Where are you going?').fill('dhaka');
	await page.getByRole('button', { name: 'Search' }).click();

	await page.getByText('dhaka hotel').click();
	await expect(page).toHaveURL(/details/);
	await expect(page.getByRole('button', { name: 'Book Now' })).toBeVisible();
});

test('should book hotel', async ({ page }) => {
	await page.goto(UI_URL);

	await page.getByPlaceholder('Where are you going?').fill('dhaka');

	const date = new Date();
	date.setDate(date.getDate() + 3);
	const formattedDate = date.toISOString().split('T')[0];
	await page.getByPlaceholder('Check-Out Date').fill(formattedDate);

	await page.getByRole('button', { name: 'Search' }).click();

	await page.getByText('dhaka hotel').click();

	await page.getByRole('button', { name: 'Book Now' }).click();

	await expect(page.getByText('Total Cost :$600.00')).toBeVisible();

	const stripeFrame = page.frameLocator('iframe').first();
	await stripeFrame
		.locator('[placeholder="Card number"]')
		.fill('424242424242424242');
	await stripeFrame.locator("[placeholder='MM / YY']").fill('42/42');
	await stripeFrame.locator("[placeholder='CVC']").fill('424');
	await stripeFrame.locator("[placeholder='ZIP']").fill('42424242');

	await page.getByRole('button', { name: 'Confirm Booking' }).click();
	await expect(page.getByText('Booking Created Successfully!')).toBeVisible({
		timeout: 10000,
	});

	// Point : from here it will test my booking page is working or not ?
	await page.getByRole('link', { name: 'My Bookings' }).click();
	await expect(page.getByText('dhaka hotel')).toBeVisible();
});
