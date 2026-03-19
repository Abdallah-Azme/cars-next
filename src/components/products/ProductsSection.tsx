"use client";

import {
  getFilters,
  getVehicles,
  getProductsByModelAndType,
  type VehicleFilterParams,
} from "@/lib/actions";
import { defaultFilters } from "@/types/vehicles";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "./Pagination";
import { ProductFilters } from "./ProductFilter";
import { ProductFiltersSheet } from "./ProductFiltersSheet";
import { ProductsGrid } from "./ProductsGrid";

export function ProductSection() {
  const [filterParams, setFilterParams] = useState<VehicleFilterParams>({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isPending, isPlaceholderData } = useQuery({
    queryKey: ["vehicles", filterParams, page, perPage],
    queryFn: () => {
      if (filterParams.cascadingModel) {
        return getProductsByModelAndType({
          model: filterParams.cascadingModel,
          // Only pass type if it's a real string — undefined would be serialized as "$undefined" by Next.js
          ...(filterParams.cascadingType ? { type: filterParams.cascadingType } : {}),
          page,
          per_page: perPage,
        });
      }
      return getVehicles({ ...filterParams, page, per_page: perPage });
    },
    placeholderData: keepPreviousData,
  });
  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: getFilters,
  });

  const vehicles = data?.data?.data?.vehicles ?? [];
  const pagination = data?.data?.data?.pagination;
  const filters = filtersData?.data?.data ?? defaultFilters;

  const handleFilterChange = (params: VehicleFilterParams) => {
    setFilterParams(params);
    setPage(1);
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
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-30 rounded-lg border p-4">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
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
            {vehicles?.length === 0 && !isPending ? (
              <div className="text-sm text-muted-foreground">
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
