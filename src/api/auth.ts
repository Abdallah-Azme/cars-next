/**
 * Legacy auth API (kept for type compatibility, not called at runtime).
 * All actual auth calls now go through src/lib/actions.ts (Server Actions).
 */
import type { ChangePasswordResponse, LoginResponse, RegisterResponse, UpdateProfileResponse } from "@/types/auth";
import { apiRequest } from "./requests";

// Inline types to avoid circular imports with client components
type LoginFormValues = { email: string; password: string };
type RegisterFormValues = { name: string; email: string; password: string; password_confirmation: string };
type ChangePasswordFormValues = { current_password: string; password: string; password_confirmation: string };

export const registerApi = (data: RegisterFormValues) =>
  apiRequest<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginApi = (data: LoginFormValues) =>
  apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutApi = () =>
  apiRequest<LoginResponse>("/logout", {
    method: "POST",
  });

export const getProfileApi = () =>
  apiRequest<UpdateProfileResponse>("/profile", {
    method: "GET",
  });

export const updateProfileApi = (data: FormData) =>
  apiRequest<UpdateProfileResponse>("/profile", {
    method: "POST",
    body: data,
  });

export const changePasswordApi = (data: ChangePasswordFormValues) =>
  apiRequest<ChangePasswordResponse>("/profile/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
