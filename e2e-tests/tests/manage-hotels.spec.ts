import { test, expect } from '@playwright/test';
import path from 'path';

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

test('should allow user to add a hotel', async ({ page }) => {
	await page.goto(`${UI_URL}/add-hotel`);

	await page.locator("[name ='name']").fill('Test hotel ');
	await page.locator("[name ='city']").fill('Test City');
	await page.locator("[name ='country']").fill('Test Country');
	await page
		.locator("[name ='description']")
		.fill('This is a description fot the Test hotel');
	await page.locator('[name ="pricePerNight"]').fill('100');

	await page.selectOption("select[name='starRating']", '3');

	await page.getByText('Cabin').click();

	await page.getByLabel('Free Wifi').check();
	await page.getByLabel('Family Rooms').check();
	await page.getByLabel('Non-Smoking Room').check();

	await page.locator('[name="adultCount"]').fill('4');
	await page.locator('[name="childCount"]').fill('1');

	await page.setInputFiles('[name="imageFiles"]', [
		path.join(__dirname, 'files', '1.jpg'),
		path.join(__dirname, 'files', '2.png'),
		// path.join(__dirname, 'files', '3.png'),
		// path.join(__dirname, 'files', '4.png'),
		// path.join(__dirname, 'files', '5.png'),
		// path.join(__dirname, 'files', '6.png'),
	]);

	await page.getByRole('button', { name: 'Add Hotel' }).click();

	await expect(page.getByText('Hotel added successfully')).toBeVisible();
});
