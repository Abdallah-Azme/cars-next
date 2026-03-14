"use client";

import { getFilters, getVehicles, type VehicleFilterParams } from "@/lib/actions";
import { defaultFilters } from "@/types/vehicles";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PaginationControls } from "./Pagination";
import { ProductFilters } from "./ProductFilter";
import { ProductFiltersSheet } from "./ProductFiltersSheet";
import { ProductsGrid } from "./ProductsGrid";

export function ProductSection() {
  const [filterParams, setFilterParams] = useState<VehicleFilterParams>({});
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["vehicles", filterParams, page],
    queryFn: () => getVehicles({ ...filterParams, page }),
  });
  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: getFilters,
  });

  const vehicles = data?.data?.data?.vehicles ?? [];
  const pagination = data?.data?.data?.pagination;
  const filters = filtersData?.data?.data ?? defaultFilters;

  // Reset to page 1 whenever filters change
  const handleFilterChange = (params: VehicleFilterParams) => {
    setFilterParams(params);
    setPage(1);
  };

  return (
    <section className="container py-20">
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

          {vehicles?.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No Vehicles Found
            </div>
          ) : (
            <ProductsGrid vehicles={vehicles} />
          )}

          {/* Pagination */}
          {pagination && (
            <PaginationControls
              pagination={pagination}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </section>
  );
}

