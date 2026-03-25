"use client";

import {
  type VehicleFilterParams,
} from "@/lib/actions";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "./Pagination";
import { ProductFilters } from "./ProductFilter";
import { ProductFiltersSheet } from "./ProductFiltersSheet";
import { ProductsGrid } from "./ProductsGrid";
import { HorizontalFilterRow } from "./HorizontalFilters";
import { getParentCategories, getChildCategories, type ParentCategory, type ChildCategory } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

/** Build the query string for the /api/vehicles route */
function buildVehicleQS(params: VehicleFilterParams, page: number, perPage: number, childCategoryIds: number[]) {
  const q = new URLSearchParams();
  if (childCategoryIds.length > 0) {
    childCategoryIds.forEach((id) => q.append("child_category_id[]", String(id)));
  }
  params.selectedModels?.forEach((v) => q.append("selection_model", v));
  params.selectedTypes?.forEach((v) => q.append("vehicle_type", v));
  params.sizes?.forEach((v) => q.append("vehicle_size", v));
  params.results?.forEach((v) => q.append("result[]", v));
  if (params.yearFrom) q.set("year_min", params.yearFrom);
  if (params.yearTo) q.set("year_max", params.yearTo);
  if (params.hourFrom) q.set("working_hours_min", params.hourFrom);
  if (params.hourTo) q.set("working_hours_max", params.hourTo);
  if (params.scoreFrom) q.set("score", params.scoreFrom);
  if (params.holdingDate) q.set("holding_date", params.holdingDate);
  q.set("page", String(page));
  q.set("per_page", String(perPage));
  return q.toString();
}

export function ProductSection() {
  return (
    <Suspense fallback={<div className="container py-10">Loading machines...</div>}>
      <ProductSectionContent />
    </Suspense>
  );
}

function ProductSectionContent() {
  const [filterParams, setFilterParams] = useState<VehicleFilterParams>({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const searchParams = useSearchParams();
  const initialParentId = searchParams.get("parentId") ? Number(searchParams.get("parentId")) : undefined;
  const initialChildId = searchParams.get("childId") ? Number(searchParams.get("childId")) : undefined;

  // Category State
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>(initialParentId);
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>(initialChildId ? [initialChildId] : []);

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

  const { data, isPending, isPlaceholderData, error } = useQuery({
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
    enabled: !!selectedParentId && selectedChildIds.length > 0, // Don't fetch until a sub-category is selected
    placeholderData: keepPreviousData,
  });

  // Robust data extraction
  let vehicles: import("@/types/vehicles").VehicleData[] = [];
  let pagination = null;

  if (data) {
    type ResponseData = {
      data?: { vehicles: import("@/types/vehicles").VehicleData[]; pagination?: any };
      vehicles?: import("@/types/vehicles").VehicleData[];
      pagination?: any;
      meta?: any;
    };
    const laravelRes = (data as { data?: ResponseData }).data || (data as ResponseData);

    if (laravelRes.data?.vehicles && Array.isArray(laravelRes.data.vehicles)) {
      vehicles = laravelRes.data.vehicles;
      pagination = laravelRes.data.pagination || (data as ResponseData).pagination;
    } else if (Array.isArray(laravelRes.data)) {
      vehicles = laravelRes.data as unknown as import("@/types/vehicles").VehicleData[];
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
    const cat = parentCategories.find(p => p.name === name);
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
    const cat = childCategories.find(c => c.name === name);
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
    <section className="container py-10">
      {/* Top bar */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className=" flex flex-col gap-2 ">
          <h2 className="text-4xl md:text-5xl font-bold text-red-600">
            Featured Machines
          </h2>
          <p className=" text-gray-400">
            Browse our wide range of heavy machinery solutions.
          </p>
        </div>

        <div className="md:hidden">
          <ProductFiltersSheet
            onFilterChange={handleFilterChange}
            controlledParams={{
              selectedParentId,
              selectedChildIds,
              ...filterParams
            }}
            exclude={["parentCategory", "subCategory"]}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <HorizontalFilterRow
          title="Category"
          items={parentCategories.map(p => p.name)}
          selectedItems={parentCategories.filter(p => p.id === selectedParentId).map(p => p.name)}
          onToggle={handleParentSelect}
        />
        {selectedParentId !== undefined && (
          <HorizontalFilterRow
            title="Sub-Category"
            items={childCategories.map(c => c.name)}
            selectedItems={childCategories.filter(c => selectedChildIds.includes(c.id)).map(c => c.name)}
            onToggle={handleChildSelect}
          />
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-30 rounded-lg border p-4">
            <ProductFilters
              onFilterChange={handleFilterChange}
              controlledParams={{
                selectedParentId,
                selectedChildIds,
                ...filterParams
              }}
              exclude={["parentCategory", "subCategory"]}
            />
          </div>
        </aside>

        {/* Products */}
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {vehicles?.length}
            </span>{" "}
            products
          </div>

          <div className={isPlaceholderData ? "opacity-50 transition-opacity" : "transition-opacity"}>
            {selectedChildIds.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-bounce">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">Please Select a Sub-Category</h3>
                  <p className="text-gray-500 max-w-sm">Choose a specific machine type from the rows above to start browsing our inventory.</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500 py-10 text-center">
                Error loading products: {(error as Error).message}
              </div>
            ) : vehicles?.length === 0 && !isPending ? (
              <div className="text-sm text-muted-foreground py-10 text-center">
                No Vehicles Found
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
          {pagination && (
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
