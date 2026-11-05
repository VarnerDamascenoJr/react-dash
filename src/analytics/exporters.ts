import type { AnalyticsExportErrorCode } from './analytics.types';
import { downloadBlob } from '../utils/download';

export class AnalyticsExportError extends Error {
  constructor(
    public code: AnalyticsExportErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'AnalyticsExportError';
  }
}

export async function downloadChartPng(
  fileName: string,
  container: HTMLElement | null
) {
  const svg = container?.querySelector('svg');
  if (!svg) {
    throw new AnalyticsExportError('chartUnavailable', 'Grafico indisponivel para exportacao PNG.');
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
      throw new AnalyticsExportError('canvasUnavailable', 'Canvas indisponivel para exportacao PNG.');
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

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new AnalyticsExportError('imageFailed', 'Nao foi possivel renderizar o PNG.'));
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
      reject(new AnalyticsExportError('pngFailed', 'Nao foi possivel gerar o PNG.'));
    }, 'image/png');
  });
}
