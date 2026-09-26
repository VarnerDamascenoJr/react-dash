import { expect, type Page, test } from '@playwright/test';

test('loads the protected analytics dashboard with fixture data', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Email')).toHaveValue('admin@reactdash.dev');

  await page.getByRole('button', { name: /enter dashboard/i }).click();

  await expect(page).toHaveURL('/');
  await expect(
    page.getByRole('heading', { name: /coleta operacional pronta para analise/i })
  ).toBeVisible();
  await expect(page.getByText('Fixture local', { exact: true })).toBeVisible();
  await expect(page.getByText('Eventos coletados')).toBeVisible();
  await expect(page.getByText('Vendas concluidas')).toBeVisible();
  await expect(page.getByRole('button', { name: /json bruto/i })).toBeEnabled();
  await expect(page.getByRole('button', { name: /csv eventos/i })).toBeEnabled();
  await expectNoPageHorizontalOverflow(page);
});

async function expectNoPageHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}
