import type { AddToFavResponse, FavResponse } from "@/types/favorites";
import { apiRequest } from "./requests";

export const addToFavApi = (id: number) =>
  apiRequest<AddToFavResponse>(`/favorites/${id}`, {
    method: "POST",
  });
export const removeFromFavApi = (id: number) =>
  apiRequest<AddToFavResponse>(`/favorites/${id}`, {
    method: "DELETE",
  });
export const getFavApi = () =>
  apiRequest<FavResponse>(`/favorites`, {
    method: "GET",
  });