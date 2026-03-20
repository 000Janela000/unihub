import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

const EMIS_TOKEN_COOKIE = "emis_token";
const MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * POST /api/emis/token
 * Receives the EMIS JWT from the UniHub frontend (which got it from the extension).
 * Stores in httpOnly cookie tied to the user's session.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Validate JWT format (3 dot-separated base64 parts)
    if (token.split(".").length !== 3) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(EMIS_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/**
 * GET /api/emis/token
 * Check if EMIS token exists.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = cookies();
  const token = cookieStore.get(EMIS_TOKEN_COOKIE);

  return NextResponse.json({ connected: !!token });
}

/**
 * DELETE /api/emis/token
 * Remove stored EMIS token.
 */
export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(EMIS_TOKEN_COOKIE);
  return response;
}
