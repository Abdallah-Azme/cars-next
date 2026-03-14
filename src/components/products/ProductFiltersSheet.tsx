import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger
} from "@/components/ui/sheet";
import { ProductFilters } from "./ProductFilter";
import type { FiltersData } from "@/types/vehicles";
import type { VehicleFilterParams } from "@/lib/actions";

export function ProductFiltersSheet({
  filters,
  onFilterChange,
}: {
  filters: FiltersData;
  onFilterChange: (params: VehicleFilterParams) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full  bg-red-600 text-white">
          Filters
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="overflow-auto">
        <SheetHeader>
          <SheetDescription asChild>
            <div className="mt-6">
              <ProductFilters filters={filters} onFilterChange={onFilterChange} />
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
