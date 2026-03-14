import { apiRequest } from "./requests";
import type { UsersResponse, UserActionResponse } from "@/types/users";

export const getUsersApi = (page: number = 1, perPage: number = 10, role?: string) => {
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("per_page", String(perPage));
  if (role) query.set("role", role);
  
  return apiRequest<UsersResponse>(`/users?${query.toString()}`, {
    method: "GET",
  });
};

export const activateUserApi = (userId: number) => {
  return apiRequest<UserActionResponse>(`/users/${userId}/activate`, {
    method: "PATCH",
  });
};

export const disableUserApi = (userId: number) => {
  return apiRequest<UserActionResponse>(`/users/${userId}/disable`, {
    method: "PATCH",
  });
};
