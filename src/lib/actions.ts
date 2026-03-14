"use server";

export async function getCategories() {
  const res = await fetch(`${process.env.LARAVEL_API_URL}/categories`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

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
  const url = `${process.env.LARAVEL_API_URL}/vehicles${qs ? `?${qs}` : ""}`;
  
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch vehicles");
  }
  return res.json();
}

export async function getFilters() {
  const res = await fetch(`${process.env.LARAVEL_API_URL}/vehicles/filters`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch filters");
  }
  return res.json();
}

export async function getSingleVehicle(id: string) {
  const res = await fetch(`${process.env.LARAVEL_API_URL}/vehicles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch vehicle");
  }
  return res.json();
}
