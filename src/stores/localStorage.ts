// localStorage.ts
export function safeGet(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key) !== '' ? window.localStorage.getItem(key) : null;
  }
  return null;
}

export function safePut(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}
