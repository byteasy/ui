// localStorage.ts
export function safeGet(key: string): string | null {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key)
    if(value !== null && value !== undefined && value !== '') {
      return value
    }
    return null
  }
  return null;
}

export function safePut(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}
