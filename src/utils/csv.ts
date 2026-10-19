import type { CsvPrimitive } from './csv.types';

export function serializeCsv<T extends object>(rows: T[]) {
  if (rows.length === 0) {
    return '';
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) =>
      headers
        .map((header) =>
          escapeCsvCell((row as Record<string, CsvPrimitive>)[header])
        )
        .join(',')
    ),
  ];

  return `${lines.join('\n')}\n`;
}

function escapeCsvCell(value: CsvPrimitive) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
