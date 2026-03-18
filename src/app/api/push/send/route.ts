import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const SUBSCRIPTIONS_PATH = path.join(process.cwd(), 'data', 'subscriptions.json');

interface SubscriptionRecord {
  subscription: {
    endpoint: string;
    keys?: { p256dh: string; auth: string };
  };
  group?: string;
  timings?: string[];
  createdAt: string;
}

/** Timing windows in milliseconds */
const TIMING_MAP: Record<string, number> = {
  '1w': 7 * 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '2h': 2 * 60 * 60 * 1000,
};

/** The hourly cron window: match if the exam is within +-30 minutes of a timing */
const CRON_WINDOW = 30 * 60 * 1000;

async function readSubscriptions(): Promise<SubscriptionRecord[]> {
  try {
    const data = await readFile(SUBSCRIPTIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubscriptions(records: SubscriptionRecord[]): Promise<void> {
  await writeFile(SUBSCRIPTIONS_PATH, JSON.stringify(records, null, 2), 'utf-8');
}

/**
 * POST /api/push/send
 *
 * Cron-triggered endpoint that checks exam dates against subscriber
 * notification windows and sends push notifications via web-push.
 *
 * Protected by CRON_SECRET header.
 */
export async function POST(request: Request) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Dynamically import web-push to avoid issues if not installed
    let webpush: typeof import('web-push');
    try {
      webpush = await import('web-push');
    } catch {
      return NextResponse.json(
        { error: 'web-push library not available' },
        { status: 500 }
      );
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT ?? 'mailto:admin@unischedule.app';

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: 'VAPID keys not configured' },
        { status: 500 }
      );
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // Fetch current exam data
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    const examResponse = await fetch(`${baseUrl}/api/sheets/exams`);
    const examData = await examResponse.json();
    const exams: Array<{ subject: string; date: string; startTime: string }> =
      examData.exams ?? [];

    if (exams.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No exams found' });
    }

    const now = Date.now();
    const records = await readSubscriptions();
    const invalidIndices: number[] = [];
    let sent = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const timings = record.timings ?? ['1d', '2h'];

      // Find exams that match any of this subscriber's timing windows
      for (const exam of exams) {
        const examTime = new Date(`${exam.date}T${exam.startTime}`).getTime();
        if (isNaN(examTime)) continue;

        const timeUntil = examTime - now;
        if (timeUntil < 0) continue;

        for (const timing of timings) {
          const window = TIMING_MAP[timing];
          if (!window) continue;

          // Check if we're within the cron window of this timing
          if (Math.abs(timeUntil - window) <= CRON_WINDOW) {
            const timingLabel = timing === '1w' ? '1 week' :
              timing === '3d' ? '3 days' :
              timing === '1d' ? '1 day' : '2 hours';

            const payload = JSON.stringify({
              title: `${exam.subject}`,
              body: `Exam in ${timingLabel} - ${exam.date} at ${exam.startTime}`,
              url: '/exams',
            });

            try {
              await webpush.sendNotification(
                record.subscription as any,
                payload
              );
              sent++;
            } catch (error: any) {
              // 410 Gone or 404 means the subscription is expired/invalid
              if (error?.statusCode === 410 || error?.statusCode === 404) {
                invalidIndices.push(i);
              } else {
                console.warn(
                  `Failed to send push to ${record.subscription.endpoint}:`,
                  error
                );
              }
            }

            // Only send one notification per subscription per cron run
            break;
          }
        }
      }
    }

    // Remove invalid subscriptions
    if (invalidIndices.length > 0) {
      const validRecords = records.filter(
        (_, index) => !invalidIndices.includes(index)
      );
      await writeSubscriptions(validRecords);
    }

    return NextResponse.json({
      sent,
      removed: invalidIndices.length,
      total: records.length,
    });
  } catch (error) {
    console.error('Error in /api/push/send:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
