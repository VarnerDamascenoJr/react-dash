export function formatInteger(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  }).format(cents / 100);
}

export function formatDateTime(value: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatShortTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
    style: 'percent',
  }).format(value);
}

export function formatSeconds(value: number | null) {
  if (value === null) {
    return '-';
  }

  return `${formatInteger(value)}s`;
}
