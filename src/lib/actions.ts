"use server";

import { cookies } from "next/headers";

import type { SettingsResponse } from "@/types/settings";
import type { CategoriesSResponse } from "@/types/categories";
import type { VehicleSResponse, FiltersResponse, SingleVehicleResponse } from "@/types/vehicles";
import type { FavResponse, AddToFavResponse } from "@/types/favorites";
import type { LoginResponse, RegisterResponse, UpdateProfileResponse, ChangePasswordResponse, User } from "@/types/auth";

const BASE_URL = process.env.LARAVEL_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

export async function fetchFromLaravel<T>(endpoint: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  
  // If body is FormData, don't set Content-Type
  if (options.body instanceof FormData) {
    const restHeaders: Record<string, string> = { ...headers };
    delete restHeaders["Content-Type"];
    options.headers = { ...restHeaders, ...options.headers };
  } else {
    options.headers = { ...headers, ...options.headers };
  }


  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data: data as T,
    error: !response.ok ? (data?.message || "Something went wrong") : undefined,
  };
}

// Settings
export async function getSettings() {
  return fetchFromLaravel<SettingsResponse>("/settings", { method: "GET" });
}

// Categories
export async function getCategories() {
  return fetchFromLaravel<CategoriesSResponse>("/categories", { method: "GET", cache: "no-store" });
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
};

export async function getVehicles(params?: VehicleFilterParams) {
  const query = new URLSearchParams();
  if (params?.makers?.length) params.makers.forEach((v) => query.append("selection_maker", v));
  if (params?.models?.length) params.models.forEach((v) => query.append("selection_model", v));
  if (params?.types?.length) params.types.forEach((v) => query.append("vehicle_type", v));
  if (params?.sizes?.length) params.sizes.forEach((v) => query.append("vehicle_size", v));
  if (params?.yearFrom) query.set("year_min", params.yearFrom);
  if (params?.yearTo) query.set("year_max", params.yearTo);
  if (params?.hourFrom) query.set("working_hours_min", params.hourFrom);
  if (params?.hourTo) query.set("working_hours_max", params.hourTo);
  if (params?.scoreFrom) query.set("score", params.scoreFrom);
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.holdingDate) query.set("holding_date", params.holdingDate);
  
  const qs = query.toString();
  return fetchFromLaravel<VehicleSResponse>(`/vehicles${qs ? `?${qs}` : ""}`, { method: "GET", cache: "no-store" });
}

export async function getFilters() {
  return fetchFromLaravel<FiltersResponse>("/vehicles/filters", { method: "GET", cache: "no-store" });
}

export async function getSingleVehicle(id: string) {
  return fetchFromLaravel<SingleVehicleResponse>(`/vehicles/${id}`, { method: "GET", cache: "no-store" });
}

// Favorites
export async function getFavorites() {
  return fetchFromLaravel<FavResponse>("/favorites", { method: "GET", cache: "no-store" });
}

export async function addToFav(id: number) {
  return fetchFromLaravel<AddToFavResponse>(`/favorites/${id}`, { method: "POST" });
}

export async function removeFromFav(id: number) {
  return fetchFromLaravel<AddToFavResponse>(`/favorites/${id}`, { method: "DELETE" });
}

// Auth
export async function login(formData: Record<string, string>) {
  const res = await fetchFromLaravel<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (res.ok && res.data?.data?.accessToken) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", res.data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return res;
}

export async function register(formData: Record<string, string>) {
  return fetchFromLaravel<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function logout() {
  const res = await fetchFromLaravel<{ message: string }>("/logout", { method: "POST" });
  if (res.ok) {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
  }
  return res;
}

export async function getProfile() {
  return fetchFromLaravel<{ success: boolean; data: { user: User } }>("/profile", { method: "GET", cache: "no-store" });
}

export async function updateProfile(formData: FormData) {
  return fetchFromLaravel<UpdateProfileResponse>("/profile", {
    method: "POST",
    body: formData,
  });
}

export async function changePassword(formData: Record<string, string>) {
  return fetchFromLaravel<ChangePasswordResponse>("/profile/password", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

// Newsletter
export async function subscribeNewsletter(email: string) {
  return fetchFromLaravel<{ message: string }>("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}


