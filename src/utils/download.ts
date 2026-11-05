import { serializeCsv } from './csv';

export function downloadJson(fileName: string, value: unknown) {
  downloadBlob(
    fileName,
    new Blob([`${JSON.stringify(value, null, 2)}\n`], {
      type: 'application/json;charset=utf-8',
    })
  );
}

export function downloadCsv<T extends object>(fileName: string, rows: T[]) {
  downloadBlob(
    fileName,
    new Blob([serializeCsv(rows)], { type: 'text/csv;charset=utf-8' })
  );
}

export function downloadBlob(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
