import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.LARAVEL_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * GET /api/vehicles
 * Proxies filter params to the Laravel backend.
 * Replaces the Server Action for client-side useQuery usage so that arrays
 * and undefined values are not mangled by the Next.js flight serializer.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Forward all query params directly to Laravel
  const qs = searchParams.toString();
  const headers = await getAuthHeaders();

  try {
    const res = await fetch(
      `${BASE_URL}/vehicles${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => null);
    return NextResponse.json(
      { ok: res.ok, status: res.status, data },
      { status: res.status }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json(
      { ok: false, status: 500, data: null, error: message },
      { status: 500 }
    );
  }
}
