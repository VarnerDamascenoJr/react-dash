import { expect, type Page, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import fixture from '../../src/analytics/fixtures/sales-analytics-export.v1.json';

test('loads the protected analytics dashboard with fixture data', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('E-mail')).toHaveValue('admin@reactdash.dev');

  await page.getByRole('button', { name: /entrar no painel/i }).click();

  await expect(page).toHaveURL('/');
  await expect(
    page.getByRole('heading', { name: /visão operacional dos eventos de vendas/i })
  ).toBeVisible();
  await expect(page.getByText('Dados de demonstração', { exact: true })).toBeVisible();
  await expect(page.getByText('Eventos coletados')).toBeVisible();
  await expect(page.getByText('Vendas concluídas')).toBeVisible();
  await expect(page.getByRole('button', { name: /json completo/i })).toBeEnabled();
  await expect(page.getByRole('button', { name: /csv de eventos/i })).toBeEnabled();

  await page.getByRole('link', { name: 'Eventos' }).click();
  await expect(page).toHaveURL(/#events$/);
  await expect(
    page.getByRole('heading', { name: /tabela analítica/i })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Funil' }).click();
  await expect(page).toHaveURL(/#funnel$/);
  await expect(
    page.getByRole('heading', { name: /conversão com incerteza/i })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Configuração' }).click();
  await expect(page).toHaveURL(/#settings$/);
  await expect(page.getByLabel('Configurar fonte de dados')).toBeVisible();

  await expectNoPageHorizontalOverflow(page);
});

test('loads API data and downloads the active JSON, CSVs and charts', async ({ page }) => {
  const timestamps = [
    '2026-10-17T10:00:00Z',
    '2026-10-17T12:00:00+02:00',
    '2026-10-17T11:30:00Z',
    '2026-10-17T10:30:00+02:00',
  ];
  const apiDocument = {
    ...fixture,
    generatedAt: '2026-10-17T12:00:00Z',
    source: { ...fixture.source, service: 'sales-refactor-test' },
    events: fixture.events.map((event, index) => ({
      ...event, saleId: 'active-api-sale', occurredAt: timestamps[index],
    })),
  };
  await page.route('**/analytics/export?**', async (route) => {
    const request = route.request();
    expect(request.headers()['x-api-key']).toBe('session-only-key');
    expect(new URL(request.url()).searchParams.get('limit')).toBe('50');
    await route.fulfill({ json: apiDocument });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: /entrar no painel/i }).click();
  await page.getByRole('link', { name: 'Configuração' }).click();
  await page.getByLabel('Chave da API', { exact: true }).fill('session-only-key');
  await page.getByLabel('Limite', { exact: true }).fill('50');
  await page.getByRole('button', { name: 'Carregar API', exact: true }).click();

  await expect(page.getByText('API do Sales', { exact: true })).toBeVisible();
  await expect(page.getByText(/sales-refactor-test — gerado em/)).toBeVisible();
  await page.getByRole('link', { name: 'Eventos' }).click();
  const grid = page.getByRole('grid');
  const eventCells = grid.locator('[role="cell"][data-field="eventType"]');
  await expect(eventCells).toHaveText([
    'email.sent', 'sale.created', 'payment.processed', 'checkin.completed',
  ]);
  const dateHeader = grid.getByRole('columnheader', { name: /data e hora/i });
  await expect(dateHeader).toHaveAttribute('aria-sort', 'descending');
  await dateHeader.click();
  await dateHeader.click();
  await expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');
  await expect(eventCells).toHaveText([
    'checkin.completed', 'sale.created', 'payment.processed', 'email.sent',
  ]);
  await page.getByRole('link', { name: 'Exportações' }).click();

  const json = await downloadFile(page, /json completo/i);
  expect(json.name).toBe('sales-events-2026-10-17-export.json');
  expect(JSON.parse(json.content.toString())).toEqual(apiDocument);
  const events = await downloadFile(page, /csv de eventos/i);
  expect(events.name).toBe('sales-events-2026-10-17-events.csv');
  expect(events.content.toString()).toContain('active-api-sale');
  expect(events.content.toString().trim().split('\n').slice(1).map((line) => line.split(',')[0]))
    .toEqual(timestamps);
  const windows = await downloadFile(page, /csv de janelas/i);
  expect(windows.name).toBe('sales-events-2026-10-17-windows.csv');
  expect(windows.content.toString()).toContain('windowSize,windowStart');

  for (const [button, suffix] of [
    [/png de janelas/i, 'events-chart'],
    [/png de tipos de evento/i, 'event-types-chart'],
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
  await page.getByRole('button', { name: /entrar no painel/i }).click();
  await page.getByRole('link', { name: 'Configuração' }).click();
  await page.getByLabel('Evento de vendas', { exact: true }).fill('saved-event');
  await page.getByLabel('Chave da API', { exact: true }).fill('session-only-key');
  await page.getByRole('button', { name: 'Carregar API', exact: true }).click();

  await expect(page.getByText('Dados de demonstração', { exact: true })).toBeVisible();
  await expect(page.getByText('A chave da API não tem permissão para consultar esses dados. Exibindo dados de demonstração.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Carregar API', exact: true })).toBeEnabled();
  await page.reload();
  await expect(page.getByLabel('Evento de vendas', { exact: true })).toHaveValue('saved-event');
  await expect(page.getByLabel('Chave da API', { exact: true })).toHaveValue('');
});

test('falls back to demo data when the API returns an empty successful response', async ({ page }) => {
  let requests = 0;
  await page.route('**/analytics/export?**', (route) => {
    requests += 1;
    return requests === 1
      ? route.fulfill({ json: { ...fixture, source: { ...fixture.source, service: 'live-api-test' } } })
      : route.fulfill({ status: 200, contentType: 'application/json', body: '' });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: /entrar no painel/i }).click();
  await page.getByRole('link', { name: 'Configuração' }).click();
  await page.getByLabel('Chave da API', { exact: true }).fill('session-only-key');
  const loadButton = page.getByRole('button', { name: 'Carregar API', exact: true });
  await loadButton.click();
  await expect(page.getByText('API do Sales', { exact: true })).toBeVisible();
  await expect(page.getByText(/live-api-test — gerado em/)).toBeVisible();

  await loadButton.click();
  await expect(page.getByText('Dados de demonstração', { exact: true })).toBeVisible();
  await expect(page.getByText('A API retornou uma resposta vazia. Exibindo dados de demonstração.')).toBeVisible();
  await expect(page.getByText(/live-api-test — gerado em/)).toHaveCount(0);
  await expect(loadButton).toBeEnabled();
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
