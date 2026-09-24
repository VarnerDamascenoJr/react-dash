export type CsvPrimitive = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvPrimitive>;

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

export async function downloadChartPng(
  fileName: string,
  container: HTMLElement | null
) {
  const svg = container?.querySelector('svg');
  if (!svg) {
    throw new Error('Grafico indisponivel para exportacao PNG.');
  }

  const svgText = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgText], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    const width = Math.max(svg.clientWidth, svg.viewBox.baseVal.width, 1);
    const height = Math.max(svg.clientHeight, svg.viewBox.baseVal.height, 1);
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas indisponivel para exportacao PNG.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const pngBlob = await canvasToBlob(canvas);
    downloadBlob(fileName, pngBlob);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function buildExportFileName(
  generatedAt: string,
  suffix: string,
  extension: string
) {
  const date = generatedAt ? generatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
  return `sales-events-${date}-${suffix}.${extension}`;
}

function downloadBlob(fileName: string, blob: Blob) {
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

function escapeCsvCell(value: CsvPrimitive) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Nao foi possivel renderizar o PNG.'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error('Nao foi possivel gerar o PNG.'));
    }, 'image/png');
  });
}
