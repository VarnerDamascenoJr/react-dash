import { vi } from 'vitest';
import {
  defaultSalesAnalyticsSettings,
  loadSalesAnalyticsSettings,
  salesAnalyticsSettingsStorageKey,
  saveSalesAnalyticsSettings,
} from './salesApi';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test.each(['null', '[]', '"invalid"', '{', '{"limit":0,"baseUrl":42}'])(
  'restores defaults for malformed saved settings: %s', (saved) => {
    localStorage.setItem(salesAnalyticsSettingsStorageKey, saved);
    expect(loadSalesAnalyticsSettings('demo-event'))
      .toEqual(defaultSalesAnalyticsSettings('demo-event'));
  }
);

test('keeps settings available in memory when storage is blocked', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
  const settings = defaultSalesAnalyticsSettings('demo-event');
  expect(loadSalesAnalyticsSettings('demo-event')).toEqual(settings);
  expect(() => saveSalesAnalyticsSettings(settings)).not.toThrow();
});
