import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const SUBSCRIPTIONS_PATH = path.join(process.cwd(), 'data', 'subscriptions.json');

interface SubscriptionRecord {
  subscription: PushSubscriptionJSON;
  group?: string;
  timings?: string[];
  createdAt: string;
}

async function readSubscriptions(): Promise<SubscriptionRecord[]> {
  try {
    const data = await readFile(SUBSCRIPTIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubscriptions(records: SubscriptionRecord[]): Promise<void> {
  const dir = path.dirname(SUBSCRIPTIONS_PATH);
  await mkdir(dir, { recursive: true });
  await writeFile(SUBSCRIPTIONS_PATH, JSON.stringify(records, null, 2), 'utf-8');
}

/**
 * POST /api/push/subscribe
 *
 * Receives a push subscription and optional preferences, then
 * appends to data/subscriptions.json.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription, group, timings } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription: missing endpoint' },
        { status: 400 }
      );
    }

    const records = await readSubscriptions();

    // Replace existing subscription with the same endpoint
    const existingIndex = records.findIndex(
      (r) => r.subscription.endpoint === subscription.endpoint
    );

    const record: SubscriptionRecord = {
      subscription,
      group,
      timings: timings ?? ['1d', '2h'],
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }

    await writeSubscriptions(records);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in /api/push/subscribe:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
