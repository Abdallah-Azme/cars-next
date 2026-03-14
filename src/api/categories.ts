import type { CategoriesSResponse } from "@/types/categories";
import { apiRequest } from "./requests";

export type CategoriesFilterParams = {
  page?: number;
};

export const getCategoriesApi = (params?: CategoriesFilterParams) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiRequest<CategoriesSResponse>(`/categories${qs ? `?${qs}` : ""}`, {
    method: "get",
  });
};