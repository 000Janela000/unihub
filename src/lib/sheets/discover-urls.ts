export interface DiscoveredSheets {
  examSheetId: string | null;
  examGids: number[];
  lectureSheetId: string | null;
}

const AGRUNI_CALENDAR_URL =
  'https://agruni.edu.ge/ge/students/bachelor/?bachelor=academical-calendar';

const SHEET_URL_PATTERN =
  /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\/edit[^"]*gid=(\d+)/g;

/**
 * Scrapes agruni.edu.ge for current Google Sheets URLs containing
 * exam and lecture schedule data.
 *
 * Fetches the academic calendar page and parses HTML for Google Sheets links.
 */
export async function discoverSheetUrls(): Promise<DiscoveredSheets> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(AGRUNI_CALENDAR_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agruni.edu.ge: HTTP ${response.status}`);
    }

    const html = await response.text();

    const result: DiscoveredSheets = {
      examSheetId: null,
      examGids: [],
      lectureSheetId: null,
    };

    const seen = new Map<string, Set<number>>();
    let match: RegExpExecArray | null;

    while ((match = SHEET_URL_PATTERN.exec(html)) !== null) {
      const sheetId = match[1];
      const gid = parseInt(match[2], 10);

      if (!seen.has(sheetId)) {
        seen.set(sheetId, new Set());
      }
      seen.get(sheetId)!.add(gid);
    }

    // Heuristic: the sheet with the most tabs is likely the exam sheet.
    // If only one sheet is found, treat it as the exam sheet.
    let maxTabs = 0;
    seen.forEach((gids, sheetId) => {
      if (gids.size > maxTabs) {
        maxTabs = gids.size;
        result.examSheetId = sheetId;
        result.examGids = Array.from(gids).sort((a, b) => a - b);
      }
    });

    // If there's a second distinct sheet, treat it as the lecture sheet
    seen.forEach((_, sheetId) => {
      if (sheetId !== result.examSheetId && !result.lectureSheetId) {
        result.lectureSheetId = sheetId;
      }
    });

    return result;
  } finally {
    clearTimeout(timeout);
  }
}
