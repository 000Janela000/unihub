import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

const EMIS_BASE = "https://emis.campus.edu.ge";
const EMIS_TOKEN_COOKIE = "emis_token";

// Allowed EMIS endpoints (whitelist to prevent abuse)
const ALLOWED_ENDPOINTS = [
  // Profile & student data
  "/student/students/getDetails",
  "/student/chancellery/getUserInfo",
  "/student/registration/getStudentData",
  "/student/registration/getRegistrationBooks",
  "/student/registration/getProgram",
  "/student/registration/groupOption",
  // Grades & results
  "/student/result/get",
  "/student/card",
  "/student/getCardDetails",
  "/student/tables/getAcTables",
  // Program & registration
  "/student/arch/getProgram",
  "/student/program/get",
  "/student/arch/getStudentData",
  "/student/arch/getMyChoosdBooks",
  "/student/arch/getChooseBooks",
  "/student/arch/getRecoveryBooks",
  // Billing & finance
  "/student/billing/getActiveYearList",
  "/student/billing/getDetails",
  "/student/billing/getStudentGrants",
  "/student/billing/getStudentEvents",
  // Dashboard
  "/student/dashboardInfo",
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

    // Strip query params for whitelist check, but keep full path for request
    const basePath = endpoint.split("?")[0].replace(/\/$/, "");
    if (!ALLOWED_ENDPOINTS.some((allowed) => basePath.startsWith(allowed))) {
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
