import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import {
  buildEventCsvRows,
  buildWindowCsvRows,
  localSalesAnalyticsFixture,
} from '../../../analytics';
import { downloadChartPng, downloadCsv, downloadJson } from '../../../analytics/exporters';
import { homeCopy } from '../copy';
import { useAnalyticsExports } from './useAnalyticsExports';

vi.mock('../../../analytics/exporters', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../../analytics/exporters')>(),
  downloadJson: vi.fn(),
  downloadCsv: vi.fn(),
  downloadChartPng: vi.fn(),
}));

afterEach(() => { vi.resetAllMocks(); });

test('exports JSON and both CSVs from the active document after a reload', () => {
  const { result, rerender } = renderHook(
    (document) => useAnalyticsExports(document),
    { initialProps: localSalesAnalyticsFixture }
  );
  act(() => { result.current.exportJson(); });
  expect(downloadJson).toHaveBeenLastCalledWith(
    expect.any(String), localSalesAnalyticsFixture
  );
  const updated = {
    ...localSalesAnalyticsFixture,
    generatedAt: '2026-10-17T12:00:00Z',
    events: localSalesAnalyticsFixture.events.slice(0, 1),
    windows: localSalesAnalyticsFixture.windows.slice(0, 1),
  };
  rerender(updated);

  act(() => { result.current.exportJson(); });
  expect(downloadJson).toHaveBeenLastCalledWith(
    'sales-events-2026-10-17-export.json', updated
  );
  expect(result.current.exportMessage).toBe(homeCopy.exportStatus.json);
  act(() => { result.current.exportEventsCsv(); });
  expect(downloadCsv).toHaveBeenLastCalledWith(
    'sales-events-2026-10-17-events.csv', buildEventCsvRows(updated)
  );
  expect(result.current.exportMessage).toBe(homeCopy.exportStatus.csvEvents);
  act(() => { result.current.exportWindowsCsv(); });
  expect(downloadCsv).toHaveBeenLastCalledWith(
    'sales-events-2026-10-17-windows.csv', buildWindowCsvRows(updated)
  );
  expect(result.current.exportMessage).toBe(homeCopy.exportStatus.csvWindows);
});

test('exports each PNG using its mounted chart container', async () => {
  const { result } = renderHook(() => useAnalyticsExports(localSalesAnalyticsFixture));
  // Assign refs as React does when the chart containers mount.
  const events = window.document.createElement('div');
  const eventTypes = window.document.createElement('div');
  Object.assign(result.current.eventsChartRef, { current: events });
  Object.assign(result.current.eventTypesChartRef, { current: eventTypes });

  await act(async () => { await result.current.exportWindowsPng(); });
  expect(downloadChartPng).toHaveBeenLastCalledWith(
    expect.stringMatching(/-events-chart\.png$/), events
  );
  await act(async () => { await result.current.exportEventTypesPng(); });
  expect(downloadChartPng).toHaveBeenLastCalledWith(
    expect.stringMatching(/-event-types-chart\.png$/), eventTypes
  );
  expect(result.current.exportMessage).toBe(homeCopy.exportStatus.png);
});

test('reports PNG failures without claiming a successful export', async () => {
  vi.mocked(downloadChartPng).mockRejectedValueOnce(new Error('Grafico indisponivel.'));
  const { result } = renderHook(() => useAnalyticsExports(localSalesAnalyticsFixture));
  await act(async () => { await result.current.exportWindowsPng(); });
  expect(result.current.exportMessage).toBe('Grafico indisponivel.');
});
