import { createAnalyticsFormatters } from './formatters';

test('formats numbers and percentages by locale while preserving BRL amounts', () => {
  const pt = createAnalyticsFormatters('pt-BR');
  const en = createAnalyticsFormatters('en-US');
  expect(pt.formatInteger(1234)).toBe('1.234');
  expect(en.formatInteger(1234)).toBe('1,234');
  expect(pt.formatCurrency(123456)).toBe('R$\u00a01.234,56');
  expect(en.formatCurrency(123456)).toBe('R$1,234.56');
  expect(pt.formatPercent(0.123)).toBe('12,3%');
  expect(en.formatPercent(0.123)).toBe('12.3%');
  expect(pt.formatSeconds(null)).toBe('-');
  expect(en.formatSeconds(1.5)).toContain('1.5');
});

test('formats dates by locale without changing the timestamp', () => {
  const pt = createAnalyticsFormatters('pt-BR');
  const en = createAnalyticsFormatters('en-US');
  const date = new Date(2026, 9, 17, 13, 45).toISOString();
  expect(pt.formatDateTime(date)).toContain('17/10/2026');
  expect(en.formatDateTime(date)).toContain('10/17/26');
  expect(pt.formatShortTime(date)).toBe('13:45');
  expect(en.formatShortTime(date)).toBe('01:45 PM');
  expect(pt.formatDateTime('')).toBe('-');
});
