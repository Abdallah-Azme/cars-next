"use client";

import { type VehicleFilterParams } from "@/lib/actions";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useProductsByType } from "@/hooks/use-products-by-type";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginationControls } from "./Pagination";
import { ProductFilters } from "./ProductFilter";
import { ProductFiltersSheet } from "./ProductFiltersSheet";
import { ProductsGrid } from "./ProductsGrid";
import { HorizontalFilterRow } from "./HorizontalFilters";
import {
  getParentCategories,
  getChildCategories,
  type ParentCategory,
  type ChildCategory,
} from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";

/** Build the query string for the /api/vehicles route */
function buildVehicleQS(
  params: VehicleFilterParams,
  page: number,
  perPage: number,
  childCategoryIds: number[],
) {
  const q = new URLSearchParams();
  if (params.lotNumber) {
    q.set("lot_number", params.lotNumber);
    // If lot number is searched, typically we want to ignore other filters
    // to search globally, but we still respect pagination.
  } else {
    // Deduplicate child category IDs
    const uniqueChildIds = Array.from(new Set(childCategoryIds));
    if (uniqueChildIds.length > 0) {
      uniqueChildIds.forEach((id) =>
        q.append("child_category_id[]", String(id)),
      );
    }
    params.selectedModels?.forEach((v) => q.append("selection_model[]", v));
    params.selectedTypes?.forEach((v) => q.append("vehicle_type[]", v));
    params.sizes?.forEach((v) => q.append("vehicle_size[]", v));
    params.results?.forEach((v) => q.append("result[]", v));
    if (params.yearFrom) q.set("year_min", params.yearFrom);
    if (params.yearTo) q.set("year_max", params.yearTo);
    if (params.hourFrom) q.set("working_hours_min", params.hourFrom);
    if (params.hourTo) q.set("working_hours_max", params.hourTo);
    if (params.scoreFrom) q.set("score", params.scoreFrom);
    if (params.holdingDate) q.set("holding_date", params.holdingDate);
  }
  q.set("page", String(page));
  q.set("per_page", String(perPage));
  return q.toString();
}

export function ProductSection() {
  const t = useTranslations("Vehicle.inventory");
  return (
    <Suspense
      fallback={<div className="container py-10 text-center">{t("loading")}</div>}
    >
      <ProductSectionContent />
    </Suspense>
  );
}

function ProductSectionContent() {
  const [filterParams, setFilterParams] = useState<VehicleFilterParams>({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const t = useTranslations("Vehicle.inventory");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const activeType = filterParams.selectedTypes?.[0];
  const isByTypeMode = !!activeType;
  const searchParams = useSearchParams();
  const initialParentId = searchParams.get("parentId")
    ? Number(searchParams.get("parentId"))
    : undefined;
  const initialChildId = searchParams.get("childId")
    ? Number(searchParams.get("childId"))
    : undefined;

  // Category State
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>(
    initialParentId,
  );
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>(
    initialChildId ? [initialChildId] : [],
  );

  useEffect(() => {
    if (initialParentId) setSelectedParentId(initialParentId);
    if (initialChildId) setSelectedChildIds([initialChildId]);
  }, [initialParentId, initialChildId]);

  const { data: parentData } = useQuery({
    queryKey: ["parentCategories"],
    queryFn: getParentCategories,
  });

  const { data: childData } = useQuery({
    queryKey: ["childCategories", selectedParentId],
    queryFn: () => getChildCategories(selectedParentId!),
    enabled: !!selectedParentId,
  });

  const parentCategories: ParentCategory[] = parentData?.data?.data ?? [];
  const childCategories: ChildCategory[] = childData?.data?.data ?? [];

  const hasResultsFilter = (filterParams.results?.length ?? 0) > 0;
  const hasActiveSearch = !!filterParams.lotNumber;

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", filterParams, page, perPage, selectedChildIds],
    queryFn: async () => {
      try {
        const url = `/api/vehicles?${buildVehicleQS(filterParams, page, perPage, selectedChildIds)}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${res.status}`);
        }
        return await res.json();
      } catch (err) {
        console.error("Fetch error in ProductsSection:", err);
        throw err;
      }
    },
    // Fire when: type mode is off AND (a sub-category is selected OR a result filter is active OR a lot number is searched)
    enabled: !isByTypeMode && (hasResultsFilter || hasActiveSearch || (!!selectedParentId && selectedChildIds.length > 0)),
    placeholderData: keepPreviousData,
  });

  const byTypeQuery = useProductsByType({
    type: activeType,
    model: filterParams.selectedModels?.[0],
    page,
    perPage,
    enabled: isByTypeMode,
  });

  const isPending = isByTypeMode ? byTypeQuery.isPending : vehiclesQuery.isPending;
  const isPlaceholderData = isByTypeMode ? byTypeQuery.isPlaceholderData : vehiclesQuery.isPlaceholderData;
  const error = isByTypeMode ? byTypeQuery.error : vehiclesQuery.error;
  const data = vehiclesQuery.data;

  // Robust data extraction
  let vehicles: import("@/types/vehicles").VehicleData[] = [];
  let pagination = null;

  if (isByTypeMode) {
    vehicles = byTypeQuery.data?.vehicles ?? [];
    pagination = byTypeQuery.data?.pagination ?? null;
  } else if (data) {
    type ResponseData = {
      data?: {
        vehicles: import("@/types/vehicles").VehicleData[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pagination?: any;
      };
      vehicles?: import("@/types/vehicles").VehicleData[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pagination?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meta?: any;
    };
    const laravelRes =
      (data as { data?: ResponseData }).data || (data as ResponseData);

    if (laravelRes.data?.vehicles && Array.isArray(laravelRes.data.vehicles)) {
      vehicles = laravelRes.data.vehicles;
      pagination =
        laravelRes.data.pagination || (data as ResponseData).pagination;
    } else if (Array.isArray(laravelRes.data)) {
      vehicles =
        laravelRes.data as unknown as import("@/types/vehicles").VehicleData[];
      pagination = laravelRes.meta || laravelRes.pagination;
    } else if (Array.isArray(laravelRes.vehicles)) {
      vehicles = laravelRes.vehicles;
      pagination = laravelRes.pagination;
    }

    if (vehicles.length === 0 && Array.isArray(laravelRes)) {
      vehicles = laravelRes;
    }
  }

  const handleFilterChange = (params: VehicleFilterParams) => {
    setFilterParams((prev) => {
      if (Object.keys(params).length === 0) {
        // Reset case
        setSelectedParentId(undefined);
        setSelectedChildIds([]);
        return {};
      }
      return { ...prev, ...params };
    });
    setPage(1);
  };

  const handleParentSelect = (name: string, checked: boolean) => {
    const cat = parentCategories.find((p) => p.name === name);
    if (!cat) return;

    if (checked) {
      setSelectedParentId(cat.id);
      setSelectedChildIds([]);
    } else {
      setSelectedParentId(undefined);
      setSelectedChildIds([]);
    }
    // Also clear models/types when category changes
    handleFilterChange({ selectedModels: [], selectedTypes: [] });
  };

  const handleChildSelect = (name: string, checked: boolean) => {
    const cat = childCategories.find((c) => c.name === name);
    if (!cat) return;

    if (checked) {
      setSelectedChildIds((prev) => [...prev, cat.id]);
    } else {
      setSelectedChildIds((prev) => prev.filter((id) => id !== cat.id));
    }
    // Also clear models/types when sub-category changes
    handleFilterChange({ selectedModels: [], selectedTypes: [] });
  };


  return (
    <section className="container py-10" dir={isRtl ? "rtl" : "ltr"}>
      {/* Top bar */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className=" flex flex-col gap-2 ">
          <h2 className="text-4xl md:text-5xl font-bold text-red-600">
            {t("header")}
          </h2>
          <p className=" text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="md:hidden">
          <ProductFiltersSheet
            onFilterChange={handleFilterChange}
            controlledParams={{
              selectedParentId,
              selectedChildIds,
              ...filterParams,
            }}
            exclude={["parentCategory", "subCategory"]}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <HorizontalFilterRow
          title={t("filter.category")}
          items={parentCategories.map((p) => ({
            name: p.name,
            image: p.image,
          }))}
          selectedItems={parentCategories
            .filter((p) => p.id === selectedParentId)
            .map((p) => p.name)}
          onToggle={handleParentSelect}
        />
        {selectedParentId !== undefined && (
          <HorizontalFilterRow
            title={t("filter.subCategory")}
            variant="grid"
            items={childCategories.map((c) => ({
              name: c.name,
              image: c.image,
            }))}
            selectedItems={childCategories
              .filter((c) => selectedChildIds.includes(c.id))
              .map((c) => c.name)}
            onToggle={handleChildSelect}
          />
        )}

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-30 rounded-lg border p-4 bg-background">
            <ScrollArea className="h-[calc(100vh-160px)] pr-4">
              <ProductFilters
                onFilterChange={handleFilterChange}
                controlledParams={{
                  selectedParentId,
                  selectedChildIds,
                  ...filterParams,
                }}
                exclude={["parentCategory", "subCategory"]}
              />
            </ScrollArea>
          </div>
        </aside>

        {/* Products */}
        <div className="space-y-4">
          {(selectedChildIds.length > 0 || isByTypeMode || hasResultsFilter || hasActiveSearch) && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>{t("showing")}</span>
              <span className="font-medium text-foreground">
                {pagination?.total ?? vehicles?.length ?? 0}
              </span>
              <span>{t("products")}</span>
            </div>
          )}

          <div
            className={
              isPlaceholderData
                ? "opacity-50 transition-opacity"
                : "transition-opacity"
            }
          >
            {selectedChildIds.length === 0 && !isByTypeMode && !hasResultsFilter && !hasActiveSearch ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-bounce">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">
                    {t("selectSub")}
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    {t("selectSubDesc")}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500 py-10 text-center">
                Error loading products: {(error as Error).message}
              </div>
            ) : vehicles?.length === 0 && !isPending ? (
              <div className="text-sm text-muted-foreground py-10 text-center">
                {t("noFound")}
              </div>
            ) : isPending ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[400px] w-full" />
                ))}
              </div>
            ) : (
              <ProductsGrid vehicles={vehicles} />
            )}
          </div>

          {/* Pagination */}
          {(selectedChildIds.length > 0 || isByTypeMode || hasResultsFilter || hasActiveSearch) && pagination && pagination.last_page > 1 && (
            <PaginationControls
              pagination={pagination}
              onPageChange={setPage}
              onPerPageChange={(val) => {
                setPerPage(val);
                setPage(1);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
