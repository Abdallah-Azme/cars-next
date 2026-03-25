"use server";

import { cookies } from "next/headers";
import type { SettingsResponse } from "@/types/settings";
import type { CategoriesSResponse } from "@/types/categories";
import type {
  VehicleSResponse,
  FiltersResponse,
  SingleVehicleResponse,
} from "@/types/vehicles";
import type { FavResponse } from "@/types/favorites";
import type {
  LoginResponse,
  RegisterResponse,
  UpdateProfileResponse,
  ChangePasswordResponse,
  User,
} from "@/types/auth";
import type { UsersResponse, UserActionResponse } from "@/types/users";

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

export type ActionResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
};

export async function fetchFromLaravel<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ActionResponse<T>> {
  const headers = await getAuthHeaders();

  // If body is FormData, don't set Content-Type
  const finalOptions = { ...options };
  if (finalOptions.body instanceof FormData) {
    const restHeaders: Record<string, string> = { ...headers };
    delete restHeaders["Content-Type"];
    finalOptions.headers = { ...restHeaders, ...finalOptions.headers };
  } else {
    finalOptions.headers = { ...headers, ...finalOptions.headers };
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...finalOptions,
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data: data as T,
      error: !response.ok ? data?.message || "Something went wrong" : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return {
      ok: false,
      status: 500,
      data: null as unknown as T,
      error: message,
    };
  }
}

// Settings
export async function getSettings() {
  return fetchFromLaravel<SettingsResponse>("/settings", { method: "GET" });
}

export async function updateSettings(data: FormData) {
  return fetchFromLaravel<SettingsResponse>("/settings", {
    method: "POST",
    body: data,
  });
}

// Categories
export async function getCategories() {
  return fetchFromLaravel<CategoriesSResponse>("/categories", {
    method: "GET",
    cache: "no-store",
  });
}

// Vehicles
export type VehicleFilterParams = {
  makers?: string[];
  models?: string[];
  types?: string[];
  sizes?: string[];
  yearFrom?: string;
  yearTo?: string;
  hourFrom?: string;
  hourTo?: string;
  scoreFrom?: string;
  scoreTo?: string;
  page?: number;
  holdingDate?: string;
  per_page?: number;
  // New category-based filters
  selectedModels?: string[];  // model names for /filters-by-model
  selectedTypes?: string[];   // types chosen from filters-by-model response
  results?: string[];         // Auction results (Sold, Yet To Be Auctioned)
  [key: string]: string | number | string[] | undefined;
};

export async function getVehicles(params?: VehicleFilterParams) {
  const query = new URLSearchParams();
  if (params?.makers?.length)
    params.makers.forEach((v) => query.append("selection_maker", v));
  if (params?.models?.length)
    params.models.forEach((v) => query.append("selection_model", v));
  if (params?.types?.length)
    params.types.forEach((v) => query.append("vehicle_type", v));
  if (params?.sizes?.length)
    params.sizes.forEach((v) => query.append("vehicle_size", v));
  if (params?.yearFrom) query.set("year_min", params.yearFrom);
  if (params?.yearTo) query.set("year_max", params.yearTo);
  if (params?.hourFrom) query.set("working_hours_min", params.hourFrom);
  if (params?.hourTo) query.set("working_hours_max", params.hourTo);
  if (params?.scoreFrom) query.set("score", params.scoreFrom);
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.holdingDate) query.set("holding_date", params.holdingDate);

  const qs = query.toString();
  return fetchFromLaravel<VehicleSResponse>(`/vehicles${qs ? `?${qs}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function getFilters() {
  return fetchFromLaravel<FiltersResponse>("/vehicles/filters", {
    method: "GET",
    cache: "no-store",
  });
}

export async function getSingleVehicle(id: string) {
  return fetchFromLaravel<SingleVehicleResponse>(`/vehicles/${id}`, {
    method: "GET",
    cache: "no-store",
  });
}

// ── New category hierarchy actions ──────────────────────────────────────────

export type ChildCategory = {
  id: number;
  name: string;
  searchKeywords: string;
};

export type ParentCategory = {
  id: number;
  name: string;
  childrenCount: number;
  children: ChildCategory[];
};

export type ModelItem = {
  id: number;
  name: string;
};

export type FiltersByModelData = {
  models: { title: string; count: number }[];
  types: { title: string; count: number }[];
  sizes: { title: string; count: number }[];
  years: { title: string; count: number }[];
  workingHours: { title: string; count: number }[];
  scores: { title: string; count: number }[];
};

export async function getParentCategories() {
  return fetchFromLaravel<{ success: boolean; message: string; data: ParentCategory[] }>(
    "/parent-categories",
    { method: "GET", cache: "no-store" },
  );
}

export async function getChildCategories(parentId: number) {
  return fetchFromLaravel<{ success: boolean; message: string; data: ChildCategory[] }>(
    `/child-categories?parent_id=${parentId}`,
    { method: "GET", cache: "no-store" },
  );
}

export async function getModelsByChildCategory(childCategoryId: number) {
  return fetchFromLaravel<{ success: boolean; message: string; data: ModelItem[] }>(
    `/models?child_category_id=${childCategoryId}`,
    { method: "GET", cache: "no-store" },
  );
}

export async function getFiltersByModels(models: string[]) {
  const q = new URLSearchParams();
  models.forEach((m) => q.append("model[]", m));
  return fetchFromLaravel<{ success: boolean; message: string; data: FiltersByModelData }>(
    `/filters-by-model?${q.toString()}`,
    { method: "GET", cache: "no-store" },
  );
}

// The /by-model-type endpoint returns a flat shape:
//   { success, message, data: Vehicle[], meta: { current_page, last_page, per_page, total } }
// We normalize it to the standard VehicleSResponse shape:
//   { success, message, data: { vehicles: Vehicle[], pagination: Pagination } }
export async function getProductsByModelAndType(params: {
  model: string;
  type?: string;
  per_page?: number;
  page?: number;
}) {
  const query = new URLSearchParams();
  query.set("model", params.model);
  // Only send type if it is a real non-empty string — avoid "$undefined" from Next.js serialization
  if (params.type && params.type !== "$undefined") {
    query.set("type", params.type);
  }
  if (params.per_page) query.set("per_page", String(params.per_page));
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  const raw = await fetchFromLaravel<{
    success: boolean;
    message: string;
    data: import("@/types/vehicles").VehicleData[];
    meta?: import("@/types/vehicles").Pagination;
  }>(`/by-model-type${qs ? `?${qs}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });

  // Normalize into VehicleSResponse shape so ProductsSection can read it uniformly
  const normalized: import("./actions").ActionResponse<import("@/types/vehicles").VehicleSResponse> = {
    ok: raw.ok,
    status: raw.status,
    error: raw.error,
    data: {
      success: raw.data?.success ?? raw.ok,
      message: raw.data?.message ?? "",
      data: {
        vehicles: raw.data?.data ?? [],
        pagination: raw.data?.meta,
      },
    },
  };
  return normalized;
}

// Favorites
export async function getFavorites() {
  return fetchFromLaravel<FavResponse>("/favorites", {
    method: "GET",
    cache: "no-store",
  });
}

export async function addToFav(vehicleId: number) {
  return fetchFromLaravel<unknown>("/favorites", {
    method: "POST",
    body: JSON.stringify({ vehicle_id: vehicleId }),
  });
}

export async function removeFromFav(vehicleId: number) {
  return fetchFromLaravel<unknown>(`/favorites/${vehicleId}`, {
    method: "DELETE",
  });
}

// Auth
export async function login(data: Record<string, unknown>) {
  const res = await fetchFromLaravel<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok && res.data?.data?.accessToken) {
    // NOTE: `secure: false` is intentional — this server runs on plain HTTP
    // (no SSL/TLS). Setting `secure: true` on an HTTP connection causes
    // browsers to silently refuse to store or send the cookie, which breaks
    // authentication entirely. Update to `true` only if HTTPS is added.
    (await cookies()).set("auth_token", res.data.data.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return res;
}

export async function register(data: Record<string, unknown>) {
  const res = await fetchFromLaravel<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("x", JSON.stringify(res, null, 2));
  return res;
}

export async function verifyEmail(data: { email: string; code: string }) {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("code", data.code);

  return fetchFromLaravel<{ success: boolean; message: string; data: null }>(
    "/verify-email",
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function resendVerification(email: string) {
  const formData = new FormData();
  formData.append("email", email);

  return fetchFromLaravel<{ success: boolean; message: string; data: null }>(
    "/resend-verification",
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function logout() {
  try {
    const res = await fetchFromLaravel<{ message: string }>("/logout", {
      method: "POST",
    });
    return res;
  } catch (err) {
    console.error("Logout fetch failed", err);
    return { ok: false, status: 500, data: { message: "Internal server error" } };
  } finally {
    (await cookies()).delete("auth_token");
  }
}

export async function getProfile() {
  return fetchFromLaravel<{ success: boolean; data: { user: User } }>(
    "/profile",
  );
}

export async function forgotPassword(email: string) {
  const formData = new FormData();
  formData.append("email", email);

  return fetchFromLaravel<{ success: boolean; message: string; data: { reset_code?: number } }>(
    "/forgot-password",
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function verifyResetCode(data: { email: string; code: string }) {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("code", data.code);

  return fetchFromLaravel<{ success: boolean; message: string; data: { token: string } }>(
    "/verify-reset-code",
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function resetPassword(data: Record<string, string>) {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.password_confirmation);

  return fetchFromLaravel<{ success: boolean; message: string; data: null }>(
    "/reset-password",
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function updateProfile(data: FormData) {
  return fetchFromLaravel<UpdateProfileResponse>("/profile", {
    method: "POST",
    body: data,
  });
}

export async function changePassword(data: Record<string, unknown>) {
  return fetchFromLaravel<ChangePasswordResponse>("/profile/password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Newsletter
export async function subscribeNewsletter(email: string) {
  return fetchFromLaravel<{ message: string }>("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Admin Users
export async function getUsers(
  page: number = 1,
  perPage: number = 10,
  role?: string,
) {
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("per_page", String(perPage));
  if (role) query.set("role", role);

  return fetchFromLaravel<UsersResponse>(`/users?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function activateUser(userId: number) {
  return fetchFromLaravel<UserActionResponse>(`/users/${userId}/activate`, {
    method: "PATCH",
  });
}

export async function disableUser(userId: number) {
  return fetchFromLaravel<UserActionResponse>(`/users/${userId}/disable`, {
    method: "PATCH",
  });
}
