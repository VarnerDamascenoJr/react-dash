import { expect, type Page, test } from '@playwright/test';
import {
  clearApiKeyField,
  expectNoPageHorizontalOverflow,
  loadLocalSalesApi,
  readSalesApiEnv,
} from './salesApiFlow';

test('loads analytics from the local Sales API', async ({ page }) => {
  const env = readSalesApiEnv();
  test.skip(
    !env.supportApiKey,
    'Set SALES_SUPPORT_API_KEY to validate the integrated local Sales API flow.'
  );

  await loadLocalSalesApi(page, env);
  await clearApiKeyField(page);

  await expectKpiValue(page, 'Eventos coletados');
  await expectKpiValue(page, 'Vendas concluidas');
  await expectKpiValue(page, 'Tickets emitidos');
  await expectKpiValue(page, 'Check-ins');

  await page.getByRole('link', { name: 'Eventos' }).click();
  await expect(page).toHaveURL(/#events$/);
  await expect(
    page.getByRole('heading', { name: /tabela analitica/i })
  ).toBeVisible();
  await expect(page.getByRole('grid')).toBeVisible();

  await page.getByRole('link', { name: 'Funil' }).click();
  await expect(page).toHaveURL(/#funnel$/);
  await expect(
    page.getByRole('heading', { name: /conversao com incerteza/i })
  ).toBeVisible();

  await expectNoPageHorizontalOverflow(page);
});

async function expectKpiValue(page: Page, label: string) {
  const card = page.locator('.kpiCard').filter({ hasText: label });
  await expect(card).toBeVisible();
  await expect(card.locator('strong')).toHaveText(/\d/);
}
