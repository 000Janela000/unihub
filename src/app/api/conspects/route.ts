import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conspects, users, votes } from "@/lib/db/schema";
import { desc, eq, ilike, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * GET /api/conspects — list conspects with optional filters
 * Query params: subject, faculty, semester, search, page, limit
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const faculty = searchParams.get("faculty") || "";
  const semester = searchParams.get("semester") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    if (search) {
      conditions.push(
        sql`(${conspects.title} ILIKE ${`%${search}%`} OR ${conspects.subject} ILIKE ${`%${search}%`})`
      );
    }
    if (faculty) conditions.push(eq(conspects.faculty, faculty));
    if (semester) conditions.push(eq(conspects.semester, parseInt(semester)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        id: conspects.id,
        title: conspects.title,
        subject: conspects.subject,
        description: conspects.description,
        fileName: conspects.fileName,
        fileType: conspects.fileType,
        fileSize: conspects.fileSize,
        upvotes: conspects.upvotes,
        downvotes: conspects.downvotes,
        downloads: conspects.downloads,
        faculty: conspects.faculty,
        semester: conspects.semester,
        createdAt: conspects.createdAt,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(conspects)
      .leftJoin(users, eq(conspects.authorId, users.id))
      .where(where)
      .orderBy(desc(conspects.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ conspects: results, page, limit });
  } catch (err) {
    console.error("Failed to fetch conspects:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

/**
 * POST /api/conspects — create a new conspect
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subject, description, fileUrl, fileName, fileSize, fileType, faculty, semester } = body;

    if (!title || !subject || !fileUrl || !fileName || !fileSize || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure user exists in DB
    await db
      .insert(users)
      .values({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        image: session.user.image,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { name: session.user.name, image: session.user.image },
      });

    const [result] = await db
      .insert(conspects)
      .values({
        title,
        subject,
        description: description || null,
        fileUrl,
        fileName,
        fileSize,
        fileType,
        authorId: session.user.id,
        faculty: faculty || null,
        semester: semester ? parseInt(semester) : null,
      })
      .returning();

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Failed to create conspect:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
