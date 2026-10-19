import { serializeCsv } from './csv';

describe('CSV serialization', () => {
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

});
