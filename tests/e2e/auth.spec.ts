import { expect, type Page, test } from '@playwright/test';

const demoEmail = 'admin@reactdash.dev';
const authStorageKey = 'react-dash.auth.user';

test('keeps users on login when demo credentials are invalid', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Password').fill('not-the-demo-password');
  await page.getByRole('button', { name: /enter dashboard/i }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByText('Use the demo account to access the dashboard.')
  ).toBeVisible();
  await expect(page.getByLabel('Email')).toHaveValue(demoEmail);
});

test('redirects protected routes to login before returning to the dashboard', async ({
  page,
}) => {
  await page.goto('/events');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Email')).toHaveValue(demoEmail);

  await signInWithDemoAccount(page);

  await expect(page).toHaveURL('/');
  await expectDashboard(page);
});

test('redirects authenticated users away from the public login route', async ({
  page,
}) => {
  await page.goto('/login');
  await signInWithDemoAccount(page);
  await expect(page).toHaveURL('/');
  await expectDashboard(page);

  await page.goto('/login');

  await expect(page).toHaveURL('/');
  await expectDashboard(page);
});

test('logs out and clears the persisted demo session', async ({ page }) => {
  await page.goto('/login');
  await signInWithDemoAccount(page);

  await expect(page).toHaveURL('/');
  await expect(await getStoredSession(page)).toContain(demoEmail);

  await page.getByText('Logout', { exact: true }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: /enter dashboard/i })).toBeVisible();
  await expect(await getStoredSession(page)).toBeNull();
});

async function signInWithDemoAccount(page: Page) {
  await page.getByRole('button', { name: /enter dashboard/i }).click();
}

async function expectDashboard(page: Page) {
  await expect(
    page.getByRole('heading', { name: /coleta operacional pronta para analise/i })
  ).toBeVisible();
}

function getStoredSession(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), authStorageKey);
}
