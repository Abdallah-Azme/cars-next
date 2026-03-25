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
 * GET /api/by-model-type
 * Proxies model+type cascading filter requests to the Laravel backend.
 * Returns data already normalized into VehicleSResponse shape.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  const headers = await getAuthHeaders();

  try {
    const res = await fetch(
      `${BASE_URL}/by-model-type${qs ? `?${qs}` : ""}`,
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
