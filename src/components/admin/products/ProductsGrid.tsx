import { ProductCard } from "./ProductCard";
import type { VehicleData } from "@/types/vehicles";

export function ProductsGrid({ vehicles }: { vehicles: VehicleData[] }) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center py-10 text-muted-foreground">
        No auction products found for this date.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
      {vehicles.map((vehicle) => (
        <ProductCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
