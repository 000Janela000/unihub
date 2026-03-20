import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

const EMIS_BASE = "https://emis.campus.edu.ge";
const EMIS_TOKEN_COOKIE = "emis_token";

// Allowed EMIS endpoints (whitelist to prevent abuse)
const ALLOWED_ENDPOINTS = [
  "/student/students/getDetails",
  "/student/result/get",
  "/student/registration/getStudentData",
  "/student/registration/getRegistrationBooks",
  "/student/registration/getProgram",
  "/student/tables/getAcTables",
  "/student/arch/getProgram",
  "/student/chancellery/getUserInfo",
];

/**
 * POST /api/emis/proxy
 * Proxies requests to EMIS API using the stored token.
 * Body: { endpoint: string, method?: "GET"|"POST", body?: object }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(EMIS_TOKEN_COOKIE);
  if (!tokenCookie?.value) {
    return NextResponse.json(
      { error: "EMIS not connected. Install the Chrome Extension." },
      { status: 403 }
    );
  }

  try {
    const { endpoint, method = "POST", body } = await request.json();

    if (!endpoint || typeof endpoint !== "string") {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
      return NextResponse.json({ error: "Endpoint not allowed" }, { status: 403 });
    }

    const emisUrl = `${EMIS_BASE}${endpoint}`;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
        "Content-Type": "application/json",
      },
    };

    if (method === "POST" && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const emisResponse = await fetch(emisUrl, fetchOptions);

    if (!emisResponse.ok) {
      // Token might be expired
      if (emisResponse.status === 401) {
        return NextResponse.json(
          { error: "EMIS token expired. Visit emis.campus.edu.ge to refresh." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `EMIS returned ${emisResponse.status}` },
        { status: emisResponse.status }
      );
    }

    const data = await emisResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
