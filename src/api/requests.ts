/**
 * Legacy API request utility (kept for backward compatibility with unused api/ files).
 * All actual API calls now go through src/lib/actions.ts (Server Actions).
 */

export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

// Next.js uses process.env, not import.meta.env (which is Vite-only)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.LARAVEL_API_URL || "";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Language": "en",
        ...(options?.headers || {}),
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || "Something went wrong",
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch {
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
}
