import { expect, type Page, test } from '@playwright/test';
import fixture from '../../src/analytics/fixtures/sales-analytics-export.v1.json';
import {
  clearApiKeyField,
  expectNoPageHorizontalOverflow,
  loadLocalSalesApi,
  readSalesApiEnv,
} from './salesApiFlow';

// Real API keys must not be retained in network traces or videos.
test.use({ trace: 'off', video: 'off' });

test('loads API data through the evidence flow without persisting the key', async ({ page }) => {
  const env = { salesEventId: 'evidence-flow-event', supportApiKey: 'evidence-flow-test-key' };
  const apiDocument = {
    ...fixture,
    source: { ...fixture.source, service: 'sales-evidence-regression' },
  };
  await page.route('**/analytics/export?**', async (route) => {
    expect(route.request().headers()['x-api-key']).toBe(env.supportApiKey);
    expect(new URL(route.request().url()).searchParams.get('salesEventId')).toBe(env.salesEventId);
    await route.fulfill({ json: apiDocument });
  });

  await loadLocalSalesApi(page, env);
  await expect(page.getByText(/sales-evidence-regression — gerado em/)).toBeVisible();
  const preferences = await page.evaluate(() => JSON.stringify(window.localStorage));
  expect(preferences).not.toContain(env.supportApiKey);
  await clearApiKeyField(page);
  await page.reload();
  await expect(page.getByLabel('Evento de vendas', { exact: true })).toHaveValue(env.salesEventId);
  await expect(page.getByLabel('Chave da API', { exact: true })).toHaveValue('');
});

test('loads analytics from the local Sales API', async ({ page }) => {
  const env = readSalesApiEnv();
  test.skip(
    !env.supportApiKey,
    'Set SALES_SUPPORT_API_KEY to validate the integrated local Sales API flow.'
  );

  await loadLocalSalesApi(page, env);
  await clearApiKeyField(page);

  await expectKpiValue(page, 'Eventos coletados');
  await expectKpiValue(page, 'Vendas concluídas');
  await expectKpiValue(page, 'Ingressos emitidos');
  await expectKpiValue(page, 'Check-ins');

  await page.getByRole('link', { name: 'Eventos' }).click();
  await expect(page).toHaveURL(/#events$/);
  await expect(
    page.getByRole('heading', { name: /tabela analítica/i })
  ).toBeVisible();
  await expect(page.getByRole('grid')).toBeVisible();

  await page.getByRole('link', { name: 'Funil' }).click();
  await expect(page).toHaveURL(/#funnel$/);
  await expect(
    page.getByRole('heading', { name: /conversão com incerteza/i })
  ).toBeVisible();

  await expectNoPageHorizontalOverflow(page);
});

async function expectKpiValue(page: Page, label: string) {
  const card = page.locator('.kpiCard').filter({ hasText: label });
  await expect(card).toBeVisible();
  await expect(card.locator('strong')).toHaveText(/\d/);
}
