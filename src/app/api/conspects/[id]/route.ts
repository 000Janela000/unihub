import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { conspects, users, votes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/conspects/[id] — get a single conspect with vote info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [result] = await db
      .select({
        id: conspects.id,
        title: conspects.title,
        subject: conspects.subject,
        description: conspects.description,
        fileUrl: conspects.fileUrl,
        fileName: conspects.fileName,
        fileType: conspects.fileType,
        fileSize: conspects.fileSize,
        upvotes: conspects.upvotes,
        downvotes: conspects.downvotes,
        downloads: conspects.downloads,
        faculty: conspects.faculty,
        semester: conspects.semester,
        createdAt: conspects.createdAt,
        authorId: conspects.authorId,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(conspects)
      .leftJoin(users, eq(conspects.authorId, users.id))
      .where(eq(conspects.id, params.id))
      .limit(1);

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get user's vote if exists
    let userVote = 0;
    if (session.user.id) {
      const [vote] = await db
        .select({ value: votes.value })
        .from(votes)
        .where(and(eq(votes.userId, session.user.id), eq(votes.conspectId, params.id)))
        .limit(1);
      if (vote) userVote = vote.value;
    }

    return NextResponse.json({ ...result, userVote });
  } catch (err) {
    console.error("Failed to fetch conspect:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

/**
 * DELETE /api/conspects/[id] — delete own conspect
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [existing] = await db
      .select({ authorId: conspects.authorId })
      .from(conspects)
      .where(eq(conspects.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(conspects).where(eq(conspects.id, params.id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete conspect:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
