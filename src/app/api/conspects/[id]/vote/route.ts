import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { conspects, votes, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * POST /api/conspects/[id]/vote — upvote or downvote
 * Body: { value: 1 | -1 | 0 } — 0 removes the vote
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { value } = await request.json();

    if (![1, -1, 0].includes(value)) {
      return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });
    }

    // Ensure user exists
    await db
      .insert(users)
      .values({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        image: session.user.image,
      })
      .onConflictDoNothing();

    // Get existing vote
    const [existing] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, session.user.id), eq(votes.conspectId, params.id)))
      .limit(1);

    if (value === 0) {
      // Remove vote
      if (existing) {
        await db.delete(votes).where(eq(votes.id, existing.id));
        // Update counts
        if (existing.value === 1) {
          await db.update(conspects).set({ upvotes: sql`${conspects.upvotes} - 1` }).where(eq(conspects.id, params.id));
        } else {
          await db.update(conspects).set({ downvotes: sql`${conspects.downvotes} - 1` }).where(eq(conspects.id, params.id));
        }
      }
    } else if (existing) {
      // Update existing vote
      if (existing.value !== value) {
        await db.update(votes).set({ value }).where(eq(votes.id, existing.id));
        if (value === 1) {
          await db.update(conspects).set({
            upvotes: sql`${conspects.upvotes} + 1`,
            downvotes: sql`${conspects.downvotes} - 1`,
          }).where(eq(conspects.id, params.id));
        } else {
          await db.update(conspects).set({
            upvotes: sql`${conspects.upvotes} - 1`,
            downvotes: sql`${conspects.downvotes} + 1`,
          }).where(eq(conspects.id, params.id));
        }
      }
    } else {
      // New vote
      await db.insert(votes).values({
        userId: session.user.id,
        conspectId: params.id,
        value,
      });
      if (value === 1) {
        await db.update(conspects).set({ upvotes: sql`${conspects.upvotes} + 1` }).where(eq(conspects.id, params.id));
      } else {
        await db.update(conspects).set({ downvotes: sql`${conspects.downvotes} + 1` }).where(eq(conspects.id, params.id));
      }
    }

    // Return updated counts
    const [updated] = await db
      .select({ upvotes: conspects.upvotes, downvotes: conspects.downvotes })
      .from(conspects)
      .where(eq(conspects.id, params.id))
      .limit(1);

    return NextResponse.json({ ...updated, userVote: value });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
