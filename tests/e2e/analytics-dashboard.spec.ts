import { expect, type Page, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import fixture from '../../src/analytics/fixtures/sales-analytics-export.v1.json';

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

  await page.getByRole('link', { name: 'Eventos' }).click();
  await expect(page).toHaveURL(/#events$/);
  await expect(
    page.getByRole('heading', { name: /tabela analitica/i })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Funil' }).click();
  await expect(page).toHaveURL(/#funnel$/);
  await expect(
    page.getByRole('heading', { name: /conversao com incerteza/i })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Configuracao' }).click();
  await expect(page).toHaveURL(/#settings$/);
  await expect(page.getByLabel('Configurar fonte de dados')).toBeVisible();

  await expectNoPageHorizontalOverflow(page);
});

test('loads API data and downloads the active JSON, CSVs and charts', async ({ page }) => {
  const apiDocument = {
    ...fixture,
    generatedAt: '2026-10-17T12:00:00Z',
    source: { ...fixture.source, service: 'sales-refactor-test' },
    events: fixture.events.map((event) => ({ ...event, saleId: 'active-api-sale' })),
  };
  await page.route('**/analytics/export?**', async (route) => {
    const request = route.request();
    expect(request.headers()['x-api-key']).toBe('session-only-key');
    expect(new URL(request.url()).searchParams.get('limit')).toBe('50');
    await route.fulfill({ json: apiDocument });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: /enter dashboard/i }).click();
  await page.getByRole('link', { name: 'Configuracao' }).click();
  await page.getByLabel('API key', { exact: true }).fill('session-only-key');
  await page.getByLabel('Limite', { exact: true }).fill('50');
  await page.getByRole('button', { name: 'Carregar API', exact: true }).click();

  await expect(page.getByText('API local', { exact: true })).toBeVisible();
  await expect(page.getByText(/sales-refactor-test - gerado em/)).toBeVisible();
  await page.getByRole('link', { name: 'Exportacoes' }).click();

  const json = await downloadFile(page, /json bruto/i);
  expect(json.name).toBe('sales-events-2026-10-17-export.json');
  expect(JSON.parse(json.content.toString())).toEqual(apiDocument);
  const events = await downloadFile(page, /csv eventos/i);
  expect(events.name).toBe('sales-events-2026-10-17-events.csv');
  expect(events.content.toString()).toContain('active-api-sale');
  const windows = await downloadFile(page, /csv janelas/i);
  expect(windows.name).toBe('sales-events-2026-10-17-windows.csv');
  expect(windows.content.toString()).toContain('windowSize,windowStart');

  for (const [button, suffix] of [
    [/png janelas/i, 'events-chart'],
    [/png tipos/i, 'event-types-chart'],
  ] as const) {
    const png = await downloadFile(page, button);
    expect(png.name).toBe(`sales-events-2026-10-17-${suffix}.png`);
    expect(png.content.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  }
});

test('shows API fallback and preserves non-secret filters after reloading', async ({ page }) => {
  await page.route('**/analytics/export?**', (route) =>
    route.fulfill({ status: 403, json: {} })
  );
  await page.goto('/login');
  await page.getByRole('button', { name: /enter dashboard/i }).click();
  await page.getByRole('link', { name: 'Configuracao' }).click();
  await page.getByLabel('Sales event', { exact: true }).fill('saved-event');
  await page.getByLabel('API key', { exact: true }).fill('session-only-key');
  await page.getByRole('button', { name: 'Carregar API', exact: true }).click();

  await expect(page.getByText('Fixture local', { exact: true })).toBeVisible();
  await expect(page.getByText('A API key nao possui permissao para o export analitico.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Carregar API', exact: true })).toBeEnabled();
  await page.reload();
  await expect(page.getByLabel('Sales event', { exact: true })).toHaveValue('saved-event');
  await expect(page.getByLabel('API key', { exact: true })).toHaveValue('');
});

async function downloadFile(page: Page, button: RegExp) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: button }).click();
  const download = await pending;
  const path = await download.path();
  if (!path) throw new Error('Download did not produce a local file.');
  return { name: download.suggestedFilename(), content: await readFile(path) };
}

async function expectNoPageHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}
