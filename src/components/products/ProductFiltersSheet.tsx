import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger
} from "@/components/ui/sheet";
import { ProductFilters } from "./ProductFilter";
import type { VehicleFilterParams } from "@/lib/actions";
import { useTranslations } from "next-intl";

export function ProductFiltersSheet({
  onFilterChange,
  exclude = [],
  controlledParams = {},
}: {
  onFilterChange: (params: VehicleFilterParams) => void;
  exclude?: string[];
  controlledParams?: VehicleFilterParams;
}) {
  const t = useTranslations("Vehicle.inventory.filter");
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full  bg-red-600 text-white">
          {t('title')}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="overflow-auto">
        <SheetHeader>
          <SheetDescription asChild>
            <div className="mt-6">
              <ProductFilters 
                onFilterChange={onFilterChange} 
                exclude={exclude}
                controlledParams={controlledParams}
              />
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
