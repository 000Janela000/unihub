import { NextResponse } from 'next/server';
import { getCached, setCached } from '@/lib/sheets/cache';
import {
  discoverSheetUrls,
  type DiscoveredSheets,
} from '@/lib/sheets/discover-urls';

const CACHE_KEY = 'discovered-sheets';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * GET /api/discover
 *
 * Scrapes agruni.edu.ge for current Google Sheets URLs and caches
 * the result for 24 hours.
 */
export async function GET() {
  try {
    let discovered = getCached<DiscoveredSheets>(CACHE_KEY);

    if (!discovered) {
      discovered = await discoverSheetUrls();
      setCached(CACHE_KEY, discovered, CACHE_TTL);
    }

    return NextResponse.json(discovered, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error in /api/discover:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
