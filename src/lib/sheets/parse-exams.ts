import Papa from 'papaparse';
import type { Exam } from '@/types';
import { ExamType } from '@/types';
import { parseExamType } from '@/lib/exam-types';
import { parseTabDate } from '@/lib/georgian-dates';

/**
 * Simple hash function to generate deterministic IDs.
 */
function hashId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Checks if a string looks like a time value (e.g., "10:00" or "10:00-11:00").
 */
function isTimeLike(value: string): boolean {
  return /^\d{1,2}:\d{2}/.test(value.trim());
}

/**
 * Parses a time range string like "10:00-11:00" into start and end times.
 */
function parseTimeRange(timeStr: string): {
  startTime: string;
  endTime: string;
} | null {
  const trimmed = timeStr.trim();

  // Match "HH:MM-HH:MM" or "HH:MM - HH:MM"
  const rangeMatch = trimmed.match(
    /^(\d{1,2}:\d{2})\s*[-\u2013]\s*(\d{1,2}:\d{2})$/
  );
  if (rangeMatch) {
    return { startTime: rangeMatch[1], endTime: rangeMatch[2] };
  }

  // If only a single time is provided, assume 1-hour duration
  const singleMatch = trimmed.match(/^(\d{1,2}:\d{2})$/);
  if (singleMatch) {
    const [hours, minutes] = singleMatch[1].split(':').map(Number);
    const endHours = hours + 1;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { startTime: singleMatch[1], endTime };
  }

  return null;
}

/**
 * Maps a university name from the sheet to a normalized key.
 */
function normalizeUniversity(raw: string): 'agruni' | 'freeuni' {
  const lower = raw.trim().toLowerCase();
  if (lower.includes('freeuni') || lower.includes('free')) return 'freeuni';
  return 'agruni';
}

/**
 * Parses a CSV string from an exam sheet tab into an array of Exam objects.
 *
 * Expected column order:
 *   [time, subject, lecturer, groups, university, studentCount, sum]
 *
 * @param csvText - Raw CSV text
 * @param tabName - The sheet tab name (used to derive the exam date)
 * @param year - Optional year override for date parsing
 */
export function parseExamCSV(
  csvText: string,
  tabName: string,
  year?: number
): Exam[] {
  const parsed = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  if (!parsed.data || parsed.data.length === 0) {
    return [];
  }

  const examDate = parseTabDate(tabName, year);
  const dateStr = examDate
    ? examDate.toISOString().split('T')[0]
    : '';

  const exams: Exam[] = [];

  for (const row of parsed.data) {
    // Skip rows that are too short
    if (!row || row.length < 4) continue;

    const [timeCell, subjectCell, lecturerCell, groupsCell, universityCell, studentCountCell] = row;

    // Skip header rows or rows where the first cell doesn't look like a time
    if (!timeCell || !isTimeLike(timeCell)) continue;

    // Skip rows without a subject
    if (!subjectCell || !subjectCell.trim()) continue;

    // Parse time range
    const timeRange = parseTimeRange(timeCell);
    if (!timeRange) continue;

    // Parse subject and exam type
    const { type: examType, label: examTypeLabel, cleanName: subjectClean } =
      parseExamType(subjectCell.trim());

    // Parse lecturers (comma-separated)
    const lecturers = lecturerCell
      ? lecturerCell
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean)
      : [];

    // Parse groups (comma-separated)
    const groups = groupsCell
      ? groupsCell
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean)
      : [];

    // Parse university
    const university = universityCell
      ? normalizeUniversity(universityCell)
      : 'agruni';

    // Parse student count
    const studentCount = studentCountCell
      ? parseInt(studentCountCell.trim(), 10) || 0
      : 0;

    // Generate deterministic ID
    const id = hashId(
      `${dateStr}-${timeRange.startTime}-${subjectCell.trim()}`
    );

    exams.push({
      id,
      date: dateStr,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      subject: subjectCell.trim(),
      subjectClean,
      examType: examType || ExamType.Unknown,
      examTypeLabel,
      lecturers,
      groups,
      university,
      studentCount,
      tabName,
    });
  }

  return exams;
}
