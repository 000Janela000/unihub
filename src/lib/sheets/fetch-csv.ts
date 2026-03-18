/**
 * Fetches raw CSV data from a published Google Sheet tab.
 *
 * @param sheetId - The Google Sheets document ID
 * @param gid - The sheet tab GID (numeric identifier)
 * @returns The raw CSV string
 * @throws On non-200 responses or network errors
 */
export async function fetchSheetCSV(
  sheetId: string,
  gid: string | number
): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sheet CSV (gid=${gid}): HTTP ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}
