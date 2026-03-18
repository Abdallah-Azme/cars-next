import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy route: /api/img?url=<encoded-image-url>
 * Fetches the image server-side (no Referer → bypasses hotlink protection).
 * Accepts only egyjapco.tech URLs (the IP-based URLs must be pre-converted to the domain elsewhere).
 */
export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("url");
  if (!imageUrl) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  // Only allow proxying from the trusted domain
  if (!imageUrl.startsWith("https://egyjapco.tech/")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const response = await fetch(imageUrl, {
      // No Referer header by default in Node.js fetch → bypasses hotlink protection
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/*",
      },
      // Disable SSL certificate verification not possible in Edge Runtime,
      // but since we're using the domain (not IP), SSL should work fine.
    });

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[img-proxy] fetch failed:", err);
    return new NextResponse("Proxy error", { status: 500 });
  }
}
