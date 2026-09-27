import { expect, type Page, test } from '@playwright/test';

test('switches dashboard theme from navbar and sidebar controls', async ({
  page,
}) => {
  await page.goto('/login');
  await signInWithDemoAccount(page);
  await expectDashboard(page);

  await expectAppTheme(page, 'light');

  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expectAppTheme(page, 'dark');

  await page.getByRole('button', { name: 'Light' }).click();
  await expectAppTheme(page, 'light');

  await page.getByRole('button', { name: 'Dark' }).click();
  await expectAppTheme(page, 'dark');
});

async function signInWithDemoAccount(page: Page) {
  await page.getByRole('button', { name: /enter dashboard/i }).click();
}

async function expectDashboard(page: Page) {
  await expect(
    page.getByRole('heading', { name: /coleta operacional pronta para analise/i })
  ).toBeVisible();
}

async function expectAppTheme(page: Page, theme: 'dark' | 'light') {
  const app = page.locator('.app');

  if (theme === 'dark') {
    await expect(app).toHaveClass(/(^|\s)dark(\s|$)/);
    return;
  }

  await expect(app).not.toHaveClass(/(^|\s)dark(\s|$)/);
}
