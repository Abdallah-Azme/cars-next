import type { VehicleData } from "@/types/vehicles";
import { ProductCard } from "./ProductCard";

export function ProductsGrid({
  isFavorite = false,
  vehicles,
}: {
  isFavorite?: boolean;
  vehicles: VehicleData[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
      {vehicles?.map((vehicle, i) => (
        <ProductCard key={i} isFavorite={isFavorite} vehicle={vehicle} />
      ))}
    </div>
  );
}
