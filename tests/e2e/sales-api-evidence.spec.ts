import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  clearApiKeyField,
  loadLocalSalesApi,
  readSalesApiEnv,
} from './salesApiFlow';

const outputDir =
  process.env.EVIDENCE_OUTPUT_DIR || 'evidence/sales-api-dashboard';

test.use({ trace: 'off', video: 'off' });

test('captures local Sales API dashboard evidence @evidence', async ({ page }) => {
  test.setTimeout(60_000);
  const env = readSalesApiEnv();
  if (!env.supportApiKey) {
    throw new Error('SALES_SUPPORT_API_KEY is required for evidence capture.');
  }

  await mkdir(outputDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  const apiResponse = page.waitForResponse((response) =>
    response.url().includes('/analytics/export?') && response.request().method() === 'GET'
  );
  await loadLocalSalesApi(page, env);
  const apiDocument = await (await apiResponse).json();
  await clearApiKeyField(page);

  await page.getByRole('link', { name: 'Exportações' }).click();
  const json = await captureDownload(page, /json completo/i, 'export.json');
  expect(JSON.parse(json.toString())).toEqual(apiDocument);
  const events = await captureDownload(page, /csv de eventos/i, 'events.csv');
  expect(events.toString()).toContain('saleId');
  const windows = await captureDownload(page, /csv de janelas/i, 'windows.csv');
  expect(windows.toString()).toContain('windowSize,windowStart');
  for (const [button, fileName] of [
    [/png de janelas/i, 'windows-chart.png'],
    [/png de tipos de evento/i, 'event-types-chart.png'],
  ] as const) {
    const png = await captureDownload(page, button, fileName);
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  }

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

async function captureDownload(page: Page, button: RegExp, fileName: string) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: button }).click();
  const download = await pending;
  const filePath = evidencePath(fileName);
  await download.saveAs(filePath);
  await expectNonEmptyFile(filePath);
  return readFile(filePath);
}

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
