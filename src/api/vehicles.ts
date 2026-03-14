import type { FiltersResponse, SingleVehicleResponse, VehicleSResponse } from "@/types/vehicles";
import { apiRequest } from "./requests";

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

export const getVehiclesApi = (params?: VehicleFilterParams) => {
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
  return apiRequest<VehicleSResponse>(`/vehicles${qs ? `?${qs}` : ""}`, {
    method: "get",
  });
};
export const getFiltersApi = () =>
  apiRequest<FiltersResponse>("/vehicles/filters", {
    method: "get",
  });
export const getSingleVehicleApi = (id: string) =>
  apiRequest<SingleVehicleResponse>(`/vehicles/${id}`, {
    method: "get",
  });