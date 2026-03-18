export const STORAGE_KEYS = {
  USER_GROUP: 'unischedule_group',
  LANGUAGE: 'unischedule_lang',
  THEME: 'unischedule_theme',
  EXAM_CACHE: 'unischedule_exams',
  LECTURE_DATA: 'unischedule_lectures',
  EXAM_SEAT_PREFIX: 'unischedule_seat_',
} as const;

/**
 * Retrieves a JSON-parsed value from localStorage.
 * Returns the fallback if the key doesn't exist, parsing fails,
 * or when running on the server (SSR).
 */
export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Stores a value in localStorage as JSON.
 * No-op during SSR.
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage might be full or disabled; silently ignore
  }
}

/**
 * Removes a key from localStorage.
 * No-op during SSR.
 */
export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}
