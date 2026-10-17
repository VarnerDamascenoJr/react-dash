import { expect, test } from '@playwright/test';
import fixture from '../../src/analytics/fixtures/sales-analytics-export.v1.json';

test('switches login language, translates an existing error and restores the selection', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await page.getByLabel('Senha', { exact: true }).fill('invalid-password');
  await page.getByRole('button', { name: 'Entrar no painel', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Use a conta de demonstração para acessar o painel.');

  await page.getByRole('combobox', { name: 'Idioma', exact: true }).selectOption('en-US');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.getByRole('alert')).toHaveText('Use the demo account to access the dashboard.');
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Language', exact: true })).toHaveValue('en-US');
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Enter dashboard', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Operational overview of sales events.' })).toBeVisible();
  await expect(page.getByText('Demo data', { exact: true })).toBeVisible();
});

test('changes API feedback, dates, numbers and grid controls without reloading data', async ({ page }) => {
  let requests = 0;
  await page.route('**/analytics/export?**', async (route) => {
    requests += 1;
    await route.fulfill({ json: {
      ...fixture,
      generatedAt: '2026-10-17T12:00:00Z',
      summary: { ...fixture.summary, eventCount: 1234 },
    } });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar no painel', exact: true }).click();
  await page.getByRole('link', { name: 'Configuração', exact: true }).click();
  await page.getByLabel('Chave da API', { exact: true }).fill('session-only-key');
  await page.getByLabel('Limite', { exact: true }).fill('50');
  await page.getByRole('button', { name: 'Carregar API', exact: true }).click();
  await expect(page.getByText('Dados carregados da API do Sales.', { exact: true })).toBeVisible();
  await expect(page.getByText('1.234', { exact: true })).toBeVisible();

  await page.getByRole('combobox', { name: 'Idioma', exact: true }).selectOption('en-US');
  await expect(page.getByText('Data loaded from the Sales API.', { exact: true })).toBeVisible();
  await expect(page.getByText('1,234', { exact: true })).toBeVisible();
  await expect(page.getByText(/generated at 10\/17\/26/)).toBeVisible();
  await expect(page.locator('.kpiCard').filter({ hasText: 'Observed revenue' }))
    .toContainText('R$100.00');
  await expect(page.getByLabel('API key', { exact: true })).toHaveValue('session-only-key');
  await expect(page.getByLabel('Limit', { exact: true })).toHaveValue('50');
  await page.getByRole('link', { name: 'Events', exact: true }).click();
  await expect(page.getByRole('columnheader', { name: 'Date and time', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to next page', exact: true })).toBeVisible();

  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('pt-BR');
  await expect(page.getByText(/gerado em 17\/10\/2026/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ir para a próxima página', exact: true })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Data e hora', exact: true })).toBeVisible();
  expect(requests).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('translates fallback and existing export feedback while leaving downloaded data unchanged', async ({ page }) => {
  let requests = 0;
  await page.route('**/analytics/export?**', async (route) => {
    requests += 1;
    await route.fulfill({ status: 403, json: { error: 'Server diagnostic' } });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar no painel', exact: true }).click();
  await page.getByRole('link', { name: 'Configuração', exact: true }).click();
  await page.getByRole('button', { name: 'Carregar API', exact: true }).click();
  await expect(page.getByText(/A chave da API não tem permissão/)).toBeVisible();
  await page.getByRole('combobox', { name: 'Idioma', exact: true }).selectOption('en-US');
  await expect(page.getByText(/The API key does not have permission.*Showing demo data/)).toBeVisible();
  await page.getByRole('link', { name: 'Exports', exact: true }).click();
  const pendingDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Full JSON', exact: true }).click();
  const download = await pendingDownload;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  expect(JSON.parse(Buffer.concat(chunks).toString())).toEqual(fixture);
  await expect(page.getByText('Full document exported as JSON.', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('pt-BR');
  await expect(page.getByText('Documento completo exportado em JSON.', { exact: true })).toBeVisible();
  expect(requests).toBe(1);
});
