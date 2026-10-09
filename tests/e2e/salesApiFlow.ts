import { expect, type Page } from '@playwright/test';

export const defaultSalesEventId = '11111111-1111-1111-1111-111111111111';

export interface SalesApiEnv {
  salesEventId: string;
  supportApiKey?: string;
}

export function readSalesApiEnv(): SalesApiEnv {
  return {
    salesEventId: process.env.SALES_EVENT_ID || defaultSalesEventId,
    supportApiKey: process.env.SALES_SUPPORT_API_KEY,
  };
}

export async function signInWithDemoAccount(page: Page) {
  await page.goto('/');
  if (/\/login$/.test(page.url())) {
    await page.getByRole('button', { name: /enter dashboard/i }).click();
  }
  await expect(
    page.getByRole('heading', { name: /coleta operacional pronta para analise/i })
  ).toBeVisible();
}

export async function loadLocalSalesApi(page: Page, env: SalesApiEnv) {
  if (!env.supportApiKey) {
    throw new Error('SALES_SUPPORT_API_KEY is required to load the local Sales API.');
  }

  await signInWithDemoAccount(page);
  await page.getByLabel('Sales event').fill(env.salesEventId);
  await page.getByLabel('API key').fill(env.supportApiKey);
  await page.getByRole('button', { name: /carregar api/i }).click();

  await expect(page.getByText('API local', { exact: true })).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByText('Dados carregados da API local do Sales.')
  ).toBeVisible();
}

export async function clearApiKeyField(page: Page) {
  await page.getByLabel('API key').fill('');
  await expect(page.getByLabel('API key')).toHaveValue('');
}

export async function expectNoPageHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}
