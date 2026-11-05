import { expect, type Page } from '@playwright/test';
import type { SalesApiEnv } from './salesApiFlow.types';

export const defaultSalesEventId = '11111111-1111-1111-1111-111111111111';

export function readSalesApiEnv(): SalesApiEnv {
  return {
    salesEventId: process.env.SALES_EVENT_ID || defaultSalesEventId,
    supportApiKey: process.env.SALES_SUPPORT_API_KEY,
  };
}

export async function signInWithDemoAccount(page: Page) {
  await page.goto('/login');
  await page.getByRole('combobox', { name: /^(idioma|language)$/i }).selectOption('pt-BR');
  await page.getByRole('button', { name: 'Entrar no painel', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: /visão operacional dos eventos de vendas/i })
  ).toBeVisible();
}

export async function loadLocalSalesApi(page: Page, env: SalesApiEnv) {
  if (!env.supportApiKey) {
    throw new Error('SALES_SUPPORT_API_KEY is required to load the local Sales API.');
  }

  await signInWithDemoAccount(page);
  await page.getByRole('link', { name: 'Configuração', exact: true }).click();
  await page.getByLabel('Evento de vendas', { exact: true }).fill(env.salesEventId);
  await page.getByLabel('Chave da API', { exact: true }).fill(env.supportApiKey);
  await page.getByRole('button', { name: /carregar api/i }).click();

  await expect(page.getByText('API do Sales', { exact: true })).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByText('Dados carregados da API do Sales.', { exact: true })
  ).toBeVisible();
}

export async function clearApiKeyField(page: Page) {
  await page.getByLabel('Chave da API', { exact: true }).fill('');
  await expect(page.getByLabel('Chave da API', { exact: true })).toHaveValue('');
}

export async function expectNoPageHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}
