import { NextResponse } from 'next/server';

/**
 * GET /api/sheets/lectures
 *
 * Endpoint for the protected lecture schedule.
 * Currently returns a helpful error message since Google authentication
 * is not yet configured. Once a service account or admin OAuth is set up,
 * this will fetch the actual lecture data.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'auth_required',
      message:
        'Lecture schedule requires Google authentication. Use manual upload in Settings.',
      setupInstructions:
        'Create a Google Cloud Service Account and share the sheet with it.',
    },
    { status: 401 }
  );
}
