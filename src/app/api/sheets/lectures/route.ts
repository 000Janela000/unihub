import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Upload lectures via Settings page (CSV/XLSX supported)',
  });
}
