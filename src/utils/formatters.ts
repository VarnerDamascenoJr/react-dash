function createFormatters(locale: string) {
  const integer = new Intl.NumberFormat(locale);
  const currency = new Intl.NumberFormat(locale, { currency: 'BRL', style: 'currency' });
  const dateTime = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' });
  const shortTime = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
  const percent = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, style: 'percent' });
  const seconds = new Intl.NumberFormat(locale, { style: 'unit', unit: 'second', unitDisplay: 'short' });

  return {
    formatInteger: (value: number) => integer.format(value),
    formatCurrency: (cents: number) => currency.format(cents / 100),
    formatDateTime: (value: string) => value ? dateTime.format(new Date(value)) : '-',
    formatShortTime: (value: string) => shortTime.format(new Date(value)),
    formatPercent: (value: number) => percent.format(value),
    formatSeconds: (value: number | null) => value === null ? '-' : seconds.format(value),
  };
}

const formattersByLocale = new Map<string, ReturnType<typeof createFormatters>>();

export function getFormatters(locale: string) {
  let formatters = formattersByLocale.get(locale);
  if (!formatters) {
    formatters = createFormatters(locale);
    formattersByLocale.set(locale, formatters);
  }
  return formatters;
}
