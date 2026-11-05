import { vi } from 'vitest';
import { readStoredJson, readStoredValue, writeStoredJson, writeStoredValue } from './storage';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('stores strings and structured preferences without changing their values', () => {
  expect(writeStoredValue('language', 'en-US')).toBe(true);
  expect(readStoredValue('language')).toBe('en-US');
  const settings = { baseUrl: '/sales', limit: 50 };
  expect(writeStoredJson('settings', settings)).toBe(true);
  expect(readStoredJson('settings')).toEqual(settings);
});

test('treats missing or malformed saved JSON as unavailable', () => {
  expect(readStoredValue('missing')).toBeNull();
  expect(readStoredJson('missing')).toBeNull();
  localStorage.setItem('settings', 'invalid json');
  expect(readStoredJson('settings')).toBeNull();
});

test('keeps preferences usable when browser storage is blocked', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
  expect(readStoredValue('language')).toBeNull();
  expect(readStoredJson('settings')).toBeNull();
  expect(writeStoredValue('language', 'en-US')).toBe(false);
  expect(writeStoredJson('settings', { limit: 50 })).toBe(false);
});

test('leaves saved data intact when a value cannot be serialized', () => {
  const settings: Record<string, unknown> = {};
  settings.self = settings;
  localStorage.setItem('settings', '{"limit":50}');
  expect(writeStoredJson('settings', settings)).toBe(false);
  expect(writeStoredJson('settings', undefined)).toBe(false);
  expect(readStoredJson('settings')).toEqual({ limit: 50 });
});
