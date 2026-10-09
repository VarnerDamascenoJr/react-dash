import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  clearApiKeyField,
  loadLocalSalesApi,
  readSalesApiEnv,
} from './salesApiFlow';

const outputDir =
  process.env.EVIDENCE_OUTPUT_DIR || 'evidence/sales-api-dashboard';

test('captures local Sales API dashboard evidence @evidence', async ({ page }) => {
  const env = readSalesApiEnv();
  if (!env.supportApiKey) {
    throw new Error('SALES_SUPPORT_API_KEY is required for evidence capture.');
  }

  await mkdir(outputDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await loadLocalSalesApi(page, env);
  await clearApiKeyField(page);

  await capturePage(page, 'dashboard-desktop-full.png');

  await page.getByRole('link', { name: 'Eventos' }).click();
  await captureLocator(page.locator('#events'), 'events-table.png');

  await page.getByRole('link', { name: 'Funil' }).click();
  await captureLocator(page.locator('#funnel'), 'funnel.png');

  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await capturePage(page, 'dashboard-dark-full.png');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#overview').scrollIntoViewIfNeeded();
  await capturePage(page, 'dashboard-mobile-full.png');
});

async function capturePage(page: Page, fileName: string) {
  const filePath = evidencePath(fileName);
  await page.screenshot({ fullPage: true, path: filePath });
  await expectNonEmptyFile(filePath);
}

async function captureLocator(locator: Locator, fileName: string) {
  const filePath = evidencePath(fileName);
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({ path: filePath });
  await expectNonEmptyFile(filePath);
}

function evidencePath(fileName: string) {
  return path.join(outputDir, fileName);
}

async function expectNonEmptyFile(filePath: string) {
  const file = await stat(filePath);
  expect(file.size).toBeGreaterThan(0);
}
