import { buildExportFileName, downloadChartPng } from './exporters';

describe('analytics exporters', () => {
  it('builds deterministic export file names from generatedAt', () => {
    expect(buildExportFileName('2026-09-22T12:00:00Z', 'events', 'csv')).toBe(
      'sales-events-2026-09-22-events.csv'
    );
  });

  it('exposes a translatable code when the chart is unavailable', async () => {
    await expect(downloadChartPng('chart.png', null)).rejects.toMatchObject({
      name: 'AnalyticsExportError',
      code: 'chartUnavailable',
    });
  });
});
