/**
 * Maps Georgian month names to their zero-indexed month number.
 */
export const GEORGIAN_MONTHS: Record<string, number> = {
  იანვარი: 0,
  თებერვალი: 1,
  მარტი: 2,
  აპრილი: 3,
  მაისი: 4,
  ივნისი: 5,
  ივლისი: 6,
  აგვისტო: 7,
  სექტემბერი: 8,
  ოქტომბერი: 9,
  ნოემბერი: 10,
  დეკემბერი: 11,
};

/**
 * Maps zero-indexed month number to Georgian month name.
 */
export const GEORGIAN_MONTH_NAMES: Record<number, string> = {
  0: 'იანვარი',
  1: 'თებერვალი',
  2: 'მარტი',
  3: 'აპრილი',
  4: 'მაისი',
  5: 'ივნისი',
  6: 'ივლისი',
  7: 'აგვისტო',
  8: 'სექტემბერი',
  9: 'ოქტომბერი',
  10: 'ნოემბერი',
  11: 'დეკემბერი',
};

/**
 * Georgian day names, Monday (index 0) through Sunday (index 6).
 */
export const GEORGIAN_DAYS: string[] = [
  'ორშაბათი',
  'სამშაბათი',
  'ოთხშაბათი',
  'ხუთშაბათი',
  'პარასკევი',
  'შაბათი',
  'კვირა',
];

/**
 * Parses a tab name like "20 მარტი" into a Date object.
 * If year is not provided, infers from academic year context:
 *   - Sep-Dec -> current academic year start
 *   - Jan-Aug -> academic year start + 1
 */
export function parseTabDate(tabName: string, year?: number): Date | null {
  if (!tabName || typeof tabName !== 'string') return null;

  const trimmed = tabName.trim();

  // Match pattern: "DD monthName" e.g. "20 მარტი"
  const match = trimmed.match(/^(\d{1,2})\s+(.+)$/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const monthName = match[2].trim();

  const monthIndex = GEORGIAN_MONTHS[monthName];
  if (monthIndex === undefined) return null;

  let resolvedYear: number;
  if (year !== undefined) {
    resolvedYear = year;
  } else {
    // Infer year from current academic year context
    const now = new Date();
    const currentYear = now.getFullYear();
    const sep15 = new Date(currentYear, 8, 15);
    const academicYearStart = now < sep15 ? currentYear - 1 : currentYear;

    // Sep-Dec belong to the academic year start year
    // Jan-Aug belong to the next calendar year
    if (monthIndex >= 8) {
      // Sep (8) through Dec (11)
      resolvedYear = academicYearStart;
    } else {
      // Jan (0) through Aug (7)
      resolvedYear = academicYearStart + 1;
    }
  }

  const date = new Date(resolvedYear, monthIndex, day);

  // Validate the date is real (e.g. not Feb 30)
  if (
    date.getFullYear() !== resolvedYear ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Formats a Date as "DD monthName, YYYY" in Georgian.
 * e.g. "20 მარტი, 2026"
 */
export function formatGeorgianDate(date: Date): string {
  const day = date.getDate();
  const monthName = GEORGIAN_MONTH_NAMES[date.getMonth()] || '';
  const year = date.getFullYear();
  return `${day} ${monthName}, ${year}`;
}

/**
 * Formats a date as a relative string.
 *
 * Georgian (ka): "დღეს", "ხვალ", "3 დღეში"
 * English (en): "Today", "Tomorrow", "In 3 days"
 *
 * For past dates:
 * Georgian: "გუშინ", "2 დღის წინ"
 * English: "Yesterday", "2 days ago"
 */
export function formatRelativeDate(date: Date, lang: 'ka' | 'en'): string {
  const now = new Date();

  // Normalize both dates to midnight for day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (lang === 'ka') {
    if (diffDays === 0) return 'დღეს';
    if (diffDays === 1) return 'ხვალ';
    if (diffDays === -1) return 'გუშინ';
    if (diffDays > 1) return `${diffDays} დღეში`;
    if (diffDays < -1) return `${Math.abs(diffDays)} დღის წინ`;
  }

  if (lang === 'en') {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  }

  // Fallback (should not reach here)
  return formatGeorgianDate(date);
}
