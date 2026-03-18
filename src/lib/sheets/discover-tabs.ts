export interface SheetTab {
  name: string;
  gid: number;
}

/**
 * Known GIDs for the exam schedule sheet.
 * Discovered from agruni.edu.ge website links and manual inspection.
 * Each tab represents one exam day.
 *
 * To discover new GIDs: fetch the htmlview page and extract gid= params.
 * For now, we use a curated list that covers the current semester.
 */
const KNOWN_EXAM_GIDS: SheetTab[] = [
  { gid: 0, name: 'exam-day-1' },
  { gid: 1541591185, name: 'exam-day-2' },
  { gid: 821181706, name: 'exam-day-3' },
];

/**
 * Returns the known sheet tabs for the exam schedule.
 * Verifies each tab is accessible with a lightweight probe.
 */
export async function discoverSheetTabs(sheetId: string): Promise<SheetTab[]> {
  const results = await Promise.all(
    KNOWN_EXAM_GIDS.map(async (tab) => {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${tab.gid}&range=A1`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        return res.ok ? tab : null;
      } catch {
        return null;
      }
    })
  );

  const accessible = results.filter((t): t is SheetTab => t !== null);
  return accessible.length > 0 ? accessible : [KNOWN_EXAM_GIDS[0]];
}

/**
 * Discovers ALL GIDs from a sheet by fetching the htmlview page.
 * Use this to update KNOWN_EXAM_GIDS when a new semester starts.
 * Not used in normal operation due to performance cost.
 */
export async function discoverAllGids(sheetId: string): Promise<number[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/${sheetId}/htmlview`,
      { signal: controller.signal, redirect: 'follow' }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];

    const html = await res.text();
    const gids = new Set<number>();
    let match: RegExpExecArray | null;
    const re = /gid=(\d+)/g;
    while ((match = re.exec(html)) !== null) {
      gids.add(parseInt(match[1], 10));
    }
    return Array.from(gids).sort((a, b) => a - b);
  } catch {
    return [];
  }
}
