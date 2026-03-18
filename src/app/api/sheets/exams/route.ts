import { NextResponse } from 'next/server';
import { getCached, setCached } from '@/lib/sheets/cache';
import { discoverSheetTabs } from '@/lib/sheets/discover-tabs';
import { fetchSheetCSV } from '@/lib/sheets/fetch-csv';
import { parseExamCSV } from '@/lib/sheets/parse-exams';
import { doesGroupMatchExam } from '@/lib/group-decoder';
import type { Exam } from '@/types';

const CACHE_KEY = 'all-exams';

/**
 * GET /api/sheets/exams?group=chem24-01&university=agruni
 *
 * Fetches, parses, and caches all exam data from the Google Sheets document.
 * Optionally filters by group code and/or university.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupFilter = searchParams.get('group');
    const universityFilter = searchParams.get('university') as
      | 'agruni'
      | 'freeuni'
      | null;

    // Check cache first
    let allExams = getCached<Exam[]>(CACHE_KEY);

    if (!allExams) {
      const sheetId = process.env.EXAM_SHEET_ID;

      if (!sheetId) {
        return NextResponse.json(
          { error: 'EXAM_SHEET_ID environment variable is not configured' },
          { status: 500 }
        );
      }

      // Discover all tabs in the sheet
      const tabs = await discoverSheetTabs(sheetId);

      if (tabs.length === 0) {
        return NextResponse.json(
          { error: 'No sheet tabs found. The sheet may be inaccessible.' },
          { status: 502 }
        );
      }

      // Fetch CSV for each tab in parallel
      const csvResults = await Promise.all(
        tabs.map(async (tab) => {
          try {
            const csv = await fetchSheetCSV(sheetId, tab.gid);
            return { tab, csv };
          } catch (error) {
            console.warn(
              `Failed to fetch CSV for tab "${tab.name}" (gid=${tab.gid}):`,
              error
            );
            return { tab, csv: null };
          }
        })
      );

      // Parse each CSV into exams
      allExams = [];
      for (const { tab, csv } of csvResults) {
        if (!csv) continue;
        try {
          const exams = parseExamCSV(csv, tab.name);
          allExams.push(...exams);
        } catch (error) {
          console.warn(
            `Failed to parse exams for tab "${tab.name}":`,
            error
          );
        }
      }

      // Sort by date and time
      allExams.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      // Cache the combined result
      setCached(CACHE_KEY, allExams);
    }

    // Apply filters
    let filtered = allExams;

    if (universityFilter) {
      filtered = filtered.filter(
        (exam) => exam.university === universityFilter
      );
    }

    if (groupFilter) {
      filtered = filtered.filter((exam) =>
        doesGroupMatchExam(groupFilter, exam.groups)
      );
    }

    return NextResponse.json(
      { exams: filtered, total: filtered.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/sheets/exams:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
