import * as XLSX from 'xlsx';
import type { Lecture } from '@/types';

/**
 * Georgian day name to dayOfWeek number mapping.
 */
const DAY_MAP: Record<string, number> = {
  'ორშაბათი': 1,
  'სამშაბათი': 2,
  'ოთხშაბათი': 3,
  'ხუთშაბათი': 4,
  'პარასკევი': 5,
  'შაბათი': 6,
  'კვირა': 7,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
  'sunday': 7,
  'mon': 1,
  'tue': 2,
  'wed': 3,
  'thu': 4,
  'fri': 5,
  'sat': 6,
  'sun': 7,
};

/**
 * Simple hash for generating deterministic IDs.
 */
function hashId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Checks whether a string looks like a time value (HH:MM).
 */
function isTimeLike(value: string): boolean {
  return /^\d{1,2}:\d{2}/.test(value.trim());
}

/**
 * Parses a time range string like "10:00-12:00" or a single time "10:00".
 */
function parseTimeRange(timeStr: string): { startTime: string; endTime: string } | null {
  const trimmed = timeStr.trim();

  const rangeMatch = trimmed.match(
    /^(\d{1,2}:\d{2})\s*[-\u2013]\s*(\d{1,2}:\d{2})$/
  );
  if (rangeMatch) {
    return {
      startTime: padTime(rangeMatch[1]),
      endTime: padTime(rangeMatch[2]),
    };
  }

  const singleMatch = trimmed.match(/^(\d{1,2}:\d{2})$/);
  if (singleMatch) {
    const [hours, minutes] = singleMatch[1].split(':').map(Number);
    const endHours = hours + 1;
    return {
      startTime: padTime(singleMatch[1]),
      endTime: `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    };
  }

  return null;
}

function padTime(t: string): string {
  const [h, m] = t.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
}

/**
 * Attempts to detect the day of week from a string.
 */
function detectDay(value: string): number | null {
  const lower = value.trim().toLowerCase();
  for (const [key, dayNum] of Object.entries(DAY_MAP)) {
    if (lower === key || lower.includes(key)) {
      return dayNum;
    }
  }
  return null;
}

/**
 * Classifies a lecture type from subject text.
 */
function detectLectureType(text: string): Lecture['type'] {
  const lower = text.toLowerCase();
  if (lower.includes('სემინარ') || lower.includes('seminar')) return 'seminar';
  if (lower.includes('ლაბ') || lower.includes('lab')) return 'lab';
  if (lower.includes('ლექც') || lower.includes('lecture')) return 'lecture';
  return 'unknown';
}

/**
 * Parses a lecture schedule file (CSV or XLSX) into an array of Lecture objects.
 *
 * Supports two layout strategies:
 * 1. Row-based: Each row contains [day, time, subject, lecturer, room, group]
 * 2. Grid-based: Days as column headers, time slots as rows, cells contain lecture info
 *
 * Falls back to a simple row-based parse if the grid layout cannot be detected.
 */
export function parseLectureFile(file: ArrayBuffer, fileName: string): Lecture[] {
  const ext = fileName.toLowerCase().split('.').pop();

  let workbook: XLSX.WorkBook;

  if (ext === 'csv') {
    const text = new TextDecoder('utf-8').decode(file);
    workbook = XLSX.read(text, { type: 'string' });
  } else {
    workbook = XLSX.read(file, { type: 'array' });
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const sheet = workbook.Sheets[sheetName];
  const rows: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  if (!rows || rows.length === 0) return [];

  // Strategy 1: Try grid-based parse (days as columns)
  const gridResult = tryGridParse(rows);
  if (gridResult.length > 0) return gridResult;

  // Strategy 2: Try row-based parse
  const rowResult = tryRowParse(rows);
  if (rowResult.length > 0) return rowResult;

  return [];
}

/**
 * Grid-based parse: looks for day names in the header row and time patterns
 * in the first column.
 */
function tryGridParse(rows: string[][]): Lecture[] {
  if (rows.length < 2) return [];

  // Find the header row with day names
  let headerRowIdx = -1;
  const dayColumns: { col: number; dayOfWeek: number }[] = [];

  for (let r = 0; r < Math.min(5, rows.length); r++) {
    const row = rows[r];
    const found: { col: number; dayOfWeek: number }[] = [];
    for (let c = 0; c < row.length; c++) {
      const day = detectDay(String(row[c]));
      if (day !== null) {
        found.push({ col: c, dayOfWeek: day });
      }
    }
    if (found.length >= 3) {
      headerRowIdx = r;
      dayColumns.push(...found);
      break;
    }
  }

  if (headerRowIdx === -1 || dayColumns.length === 0) return [];

  const lectures: Lecture[] = [];
  let currentTime: { startTime: string; endTime: string } | null = null;

  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    // Check if first cell has a time
    const firstCell = String(row[0] || '').trim();
    if (isTimeLike(firstCell)) {
      const parsed = parseTimeRange(firstCell);
      if (parsed) currentTime = parsed;
    }

    if (!currentTime) continue;

    for (const { col, dayOfWeek } of dayColumns) {
      const cellValue = String(row[col] || '').trim();
      if (!cellValue) continue;

      const { subject, lecturer, room, group } = parseCellContent(cellValue);
      if (!subject) continue;

      const id = hashId(`${dayOfWeek}-${currentTime.startTime}-${subject}`);

      lectures.push({
        id,
        dayOfWeek,
        startTime: currentTime.startTime,
        endTime: currentTime.endTime,
        subject,
        lecturer,
        room,
        type: detectLectureType(subject),
        group,
      });
    }
  }

  return lectures;
}

/**
 * Row-based parse: each row is [day, time, subject, lecturer, room, group]
 * or a similar order. Tries to auto-detect column meaning.
 */
function tryRowParse(rows: string[][]): Lecture[] {
  if (rows.length < 2) return [];

  // Try to detect which column is which
  const header = rows[0].map((h) => String(h).toLowerCase().trim());

  let dayCol = -1;
  let timeCol = -1;
  let subjectCol = -1;
  let lecturerCol = -1;
  let roomCol = -1;
  let groupCol = -1;

  for (let i = 0; i < header.length; i++) {
    const h = header[i];
    if (detectDay(h) !== null || h.includes('დღე') || h.includes('day')) {
      dayCol = i;
    } else if (h.includes('დრო') || h.includes('time') || h.includes('საათ')) {
      timeCol = i;
    } else if (h.includes('საგან') || h.includes('subject') || h.includes('course') || h.includes('სასწ')) {
      subjectCol = i;
    } else if (h.includes('ლექტორ') || h.includes('lecturer') || h.includes('მასწ') || h.includes('instructor')) {
      lecturerCol = i;
    } else if (h.includes('ოთახ') || h.includes('room') || h.includes('აუდიტ') || h.includes('hall')) {
      roomCol = i;
    } else if (h.includes('ჯგუფ') || h.includes('group')) {
      groupCol = i;
    }
  }

  // If we couldn't detect columns from header, try positional
  const hasHeader = dayCol >= 0 || timeCol >= 0 || subjectCol >= 0;
  const startRow = hasHeader ? 1 : 0;

  if (!hasHeader) {
    // Assume positional: day, time, subject, lecturer, room, group
    dayCol = 0;
    timeCol = 1;
    subjectCol = 2;
    lecturerCol = 3;
    roomCol = 4;
    groupCol = 5;
  }

  const lectures: Lecture[] = [];
  let lastDay: number | null = null;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.every((c) => !String(c).trim())) continue;

    // Day
    let dayOfWeek: number | null = null;
    if (dayCol >= 0 && row[dayCol]) {
      dayOfWeek = detectDay(String(row[dayCol]));
    }
    if (dayOfWeek === null) dayOfWeek = lastDay;
    if (dayOfWeek !== null) lastDay = dayOfWeek;
    if (dayOfWeek === null) continue;

    // Time
    const timeStr = timeCol >= 0 ? String(row[timeCol] || '').trim() : '';
    if (!isTimeLike(timeStr)) continue;
    const time = parseTimeRange(timeStr);
    if (!time) continue;

    // Subject
    const subject = subjectCol >= 0 ? String(row[subjectCol] || '').trim() : '';
    if (!subject) continue;

    // Lecturer
    const lecturer = lecturerCol >= 0 ? String(row[lecturerCol] || '').trim() : '';

    // Room
    const room = roomCol >= 0 ? String(row[roomCol] || '').trim() : '';

    // Group
    const group = groupCol >= 0 ? String(row[groupCol] || '').trim() : '';

    const id = hashId(`${dayOfWeek}-${time.startTime}-${subject}-${group}`);

    lectures.push({
      id,
      dayOfWeek,
      startTime: time.startTime,
      endTime: time.endTime,
      subject,
      lecturer,
      room,
      type: detectLectureType(subject),
      group,
    });
  }

  return lectures;
}

/**
 * Parses the content of a single grid cell that may contain
 * subject, lecturer, room info separated by newlines or delimiters.
 */
function parseCellContent(cell: string): {
  subject: string;
  lecturer: string;
  room: string;
  group: string;
} {
  // Split by newline, semicolon, or pipe
  const parts = cell
    .split(/[\n;|]/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return { subject: '', lecturer: '', room: '', group: '' };
  }

  const subject = parts[0] || '';
  let lecturer = '';
  let room = '';
  let group = '';

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    // Room patterns: starts with number, or contains "aud", "ოთახ", "#"
    if (/^\d/.test(part) || /aud|ოთახ|#|room/i.test(part)) {
      room = part;
    } else if (/^\w{2,4}\d{2}-\d{2}$/.test(part)) {
      // Group code pattern like "chem24-01"
      group = part;
    } else if (!lecturer) {
      lecturer = part;
    }
  }

  return { subject, lecturer, room, group };
}
