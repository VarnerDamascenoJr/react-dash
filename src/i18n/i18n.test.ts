import { createInstance } from 'i18next';
import { vi } from 'vitest';
import i18n from './index';
import { resources } from './resources';
import { languageStorageKey, loadLanguage, saveLanguage } from './preferences';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('both languages provide the same non-empty translation keys', () => {
  function entries(value: object, prefix = ''): Array<[string, string]> {
    return Object.entries(value).flatMap(([key, entry]) =>
      typeof entry === 'string'
        ? [[`${prefix}${key}`, entry] as [string, string]]
        : entries(entry, `${prefix}${key}.`)
    );
  }
  const portuguese = entries(resources['pt-BR']);
  const english = entries(resources['en-US']);
  expect(english.map(([key]) => key).sort()).toEqual(portuguese.map(([key]) => key).sort());
  for (const [, value] of [...portuguese, ...english]) expect(value.trim()).not.toBe('');
});

test('uses Portuguese when a translation is missing in the selected language', async () => {
  const instance = createInstance();
  await instance.init({
    initAsync: false,
    lng: 'en-US',
    defaultNS: 'home',
    fallbackLng: 'pt-BR',
    resources: {
      'pt-BR': resources['pt-BR'],
      'en-US': { home: { header: { source: 'Source' } } },
    },
  });
  expect(instance.t('header.source')).toBe('Source');
  expect(instance.t('header.title')).toBe(resources['pt-BR'].home.header.title);
});

test('interpolates values and selects plural forms in both languages', async () => {
  expect(i18n.t('header.generated', { service: 'Sales', date: '17/10/2026' }))
    .toBe('Sales — gerado em 17/10/2026');
  expect(i18n.t('panels.events.count', { count: 0 })).toBe('Nenhum evento');
  expect(i18n.t('panels.events.count', { count: 1 })).toBe('1 evento');
  expect(i18n.t('panels.events.count', { count: 1200 })).toBe('1.200 eventos');
  await i18n.changeLanguage('en-US');
  expect(i18n.t('panels.events.count', { count: 0 })).toBe('No events');
  expect(i18n.t('panels.events.count', { count: 1 })).toBe('1 event');
  expect(i18n.t('panels.events.count', { count: 1200 })).toBe('1,200 events');
});

test('persists language and updates the document language for assistive technology', async () => {
  await i18n.changeLanguage('en-US');
  expect(document.documentElement.lang).toBe('en-US');
  expect(loadLanguage()).toBe('en-US');
  expect(localStorage.getItem(languageStorageKey)).toBe('en-US');
  localStorage.setItem(languageStorageKey, 'unsupported');
  expect(loadLanguage()).toBe('pt-BR');
});

test('falls back to Portuguese and keeps switching available with blocked storage', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
  expect(loadLanguage()).toBe('pt-BR');
  expect(() => saveLanguage('en-US')).not.toThrow();
  await i18n.changeLanguage('en-US');
  expect(i18n.t('controls.loadApi')).toBe('Load API');
});
