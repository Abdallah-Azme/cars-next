import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { VehicleData, Pagination } from "@/types/vehicles";

export type ByTypeResult = {
  vehicles: VehicleData[];
  pagination: Pagination | null;
};

export function useProductsByType(params: {
  type: string | undefined;
  model?: string;
  page: number;
  perPage: number;
  enabled: boolean;
}) {
  return useQuery<ByTypeResult>({
    queryKey: ["byType", params.type, params.model, params.page, params.perPage],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.type) q.set("type", params.type);
      if (params.model) q.set("model", params.model);
      q.set("page", String(params.page));
      q.set("per_page", String(params.perPage));

      const res = await fetch(`/api/by-model-type?${q.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const payload = json?.data;
      return {
        vehicles: Array.isArray(payload?.data) ? payload.data : [],
        pagination: payload?.meta ?? null,
      };
    },
    enabled: params.enabled && !!params.type,
    placeholderData: keepPreviousData,
  });
}
