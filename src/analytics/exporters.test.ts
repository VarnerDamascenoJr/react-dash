import { buildExportFileName, serializeCsv } from './exporters';

describe('analytics exporters', () => {
  it('serializes CSV rows with escaped values', () => {
    expect(
      serializeCsv([
        {
          amountCents: 10000,
          eventType: 'sale.created',
          note: 'line, with comma',
        },
        {
          amountCents: 0,
          eventType: 'email.sent',
          note: 'quote "inside"',
        },
      ])
    ).toBe(
      'amountCents,eventType,note\n10000,sale.created,"line, with comma"\n0,email.sent,"quote ""inside"""\n'
    );
  });

  it('returns an empty CSV string for empty rows', () => {
    expect(serializeCsv([])).toBe('');
  });

  it('builds deterministic export file names from generatedAt', () => {
    expect(buildExportFileName('2026-09-22T12:00:00Z', 'events', 'csv')).toBe(
      'sales-events-2026-09-22-events.csv'
    );
  });
});
