export function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (_error) {
    return null;
  }
}

export function writeStoredValue(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (_error) {
    return false;
  }
}

export function readStoredJson(key: string): unknown {
  const value = readStoredValue(key);
  if (value === null) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch (_error) {
    return null;
  }
}

export function writeStoredJson(key: string, value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);
    return serialized !== undefined && writeStoredValue(key, serialized);
  } catch (_error) {
    return false;
  }
}
