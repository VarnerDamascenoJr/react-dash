import { vi } from 'vitest';
import { downloadBlob, downloadCsv, downloadJson } from './download';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('downloads a named blob and releases its DOM element and object URL', () => {
  const blob = new Blob(['content']);
  const createObjectURL = vi.fn(() => 'blob:download');
  const revokeObjectURL = vi.fn();
  vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
  let clickedName = '';
  let clickedUrl = '';
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
    clickedName = this.download;
    clickedUrl = this.href;
    expect(this.isConnected).toBe(true);
  });

  downloadBlob('report.csv', blob);

  expect(clickedName).toBe('report.csv');
  expect(clickedUrl).toBe('blob:download');
  expect(createObjectURL).toHaveBeenCalledWith(blob);
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:download');
  expect(document.querySelector('a[download]')).toBeNull();
});

test('keeps JSON and CSV content and MIME types independent from analytics', async () => {
  const blobs: Blob[] = [];
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn((blob: Blob) => { blobs.push(blob); return 'blob:download'; }),
    revokeObjectURL: vi.fn(),
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

  downloadJson('record.json', { name: 'Demo' });
  downloadCsv('records.csv', [{ name: 'Demo, one', total: 2 }]);

  const readText = (blob: Blob) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsText(blob);
  });
  expect(blobs.map((blob) => blob.type)).toEqual([
    'application/json;charset=utf-8', 'text/csv;charset=utf-8',
  ]);
  expect(await readText(blobs[0])).toBe('{\n  "name": "Demo"\n}\n');
  expect(await readText(blobs[1])).toBe('name,total\n"Demo, one",2\n');
});
