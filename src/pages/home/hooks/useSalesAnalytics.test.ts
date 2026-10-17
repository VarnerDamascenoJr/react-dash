import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { localSalesAnalyticsFixture } from '../../../analytics';
import { salesAnalyticsSettingsStorageKey } from '../../../config/salesApi';
import { homeCopy } from '../copy';
import { useSalesAnalytics } from './useSalesAnalytics';

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

test('starts with the fixture without requesting the API', () => {
  const fetcher = vi.fn();
  vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(() => useSalesAnalytics());

  expect(result.current.document).toBe(localSalesAnalyticsFixture);
  expect(result.current.source).toBe('fixture');
  expect(result.current.loadMessage).toBe(homeCopy.loadStatus.fixture);
  expect(result.current.isLoading).toBe(false);
  expect(fetcher).not.toHaveBeenCalled();
});

test('restores and merges settings while keeping the API key out of storage', () => {
  localStorage.setItem(
    salesAnalyticsSettingsStorageKey,
    JSON.stringify({ baseUrl: '/sales', limit: 50 })
  );
  const { result, unmount } = renderHook(() => useSalesAnalytics());
  expect(result.current.settings.baseUrl).toBe('/sales');
  expect(result.current.settings.limit).toBe(50);

  act(() => {
    result.current.updateSettings({ salesEventId: 'event-2' });
    result.current.updateSettings({ start: '2026-09-01T00:00:00Z' });
    result.current.setApiKey('session-only-key');
  });

  const saved = JSON.parse(localStorage.getItem(salesAnalyticsSettingsStorageKey)!);
  expect(saved).toEqual(result.current.settings);
  expect(saved).toMatchObject({
    baseUrl: '/sales',
    limit: 50,
    salesEventId: 'event-2',
    start: '2026-09-01T00:00:00Z',
  });
  expect(JSON.stringify(saved)).not.toContain('session-only-key');
  unmount();

  const remounted = renderHook(() => useSalesAnalytics());
  expect(remounted.result.current.settings).toEqual(saved);
  expect(remounted.result.current.apiKey).toBe('');
});

test('loads the API using current settings and exposes loading until completion', async () => {
  const apiDocument = {
    ...localSalesAnalyticsFixture,
    generatedAt: '2026-10-17T12:00:00Z',
  };
  let respond!: (response: Response) => void;
  const fetcher = vi.fn(() => new Promise<Response>((resolve) => { respond = resolve; }));
  vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(() => useSalesAnalytics());

  act(() => {
    result.current.updateSettings({
      baseUrl: '/sales',
      salesEventId: 'event-2',
      start: '2026-10-01T00:00:00Z',
      end: '2026-10-17T00:00:00Z',
      limit: 50,
    });
    result.current.setApiKey('session-only-key');
  });

  let loading!: Promise<void>;
  act(() => { loading = result.current.loadApi(); });
  expect(result.current.isLoading).toBe(true);
  expect(result.current.document).toBe(localSalesAnalyticsFixture);
  const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
  const requested = new URL(url, window.location.origin);
  expect(requested.pathname).toBe('/sales/analytics/export');
  expect(Object.fromEntries(requested.searchParams)).toEqual({
    salesEventId: 'event-2',
    start: '2026-10-01T00:00:00Z',
    end: '2026-10-17T00:00:00Z',
    limit: '50',
  });
  expect((init.headers as Headers).get('X-API-Key')).toBe('session-only-key');

  await act(async () => {
    respond(new Response(JSON.stringify(apiDocument), { status: 200 }));
    await loading;
  });

  expect(result.current.isLoading).toBe(false);
  expect(result.current.document).toEqual(apiDocument);
  expect(result.current.source).toBe('api');
  expect(result.current.loadMessage).toBe(homeCopy.loadStatus.api);
});

test('returns to the fixture with a readable error after an API failure', async () => {
  const fetcher = vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify(localSalesAnalyticsFixture)))
    .mockResolvedValueOnce(new Response('{}', { status: 403 }));
  vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(() => useSalesAnalytics());

  await act(async () => { await result.current.loadApi(); });
  expect(result.current.source).toBe('api');
  await act(async () => { await result.current.loadApi(); });

  expect(result.current.source).toBe('fixture');
  expect(result.current.document).toBe(localSalesAnalyticsFixture);
  expect(result.current.loadMessage).toMatch(/nao possui permissao/i);
  expect(result.current.isLoading).toBe(false);
});
