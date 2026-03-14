// components/products/product-card-ui.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VehicleData } from "@/types/vehicles";
import Link from "next/link";
import RemoveFromFavBtn from "./RemoveFromFavBtn";
import FallbackImage from "../shared/FallbackImage";

type Props = {
  vehicle: VehicleData;
};

export function FavCard({ vehicle }: Props) {
  const labels = [
    { label: "Vehicle Type", value: vehicle?.vehicleType },
    { label: "Chassis Id", value: vehicle?.chassisId },
    { label: "Hours", value: vehicle?.workingHours },
    { label: "Score", value: vehicle?.score },
    { label: "Year", value: vehicle?.year },
    { label: "Fuel", value: vehicle?.fuel },
    { label: "Size", value: vehicle?.vehicleSize },
    { label: "Inspection", value: vehicle?.inspection },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-2">
        {/* Top row: date + grade + favorite */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className=" font-semibold tracking-wide">
              {vehicle?.carMaker || "-"} {vehicle?.model || "-"}
            </div>
            <div className="text-sm text-muted-foreground">
              {vehicle?.auctionDay}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RemoveFromFavBtn id={vehicle?.id} />
          </div>
        </div>

        <Separator className="my-3" />

        {/* Middle: specs table + image */}
        <div className="flex flex-col gap-4">
          {/* Image */}
          <Link
            href={`/products/${vehicle?.id}`}
            className="relative overflow-hidden rounded-md border bg-muted aspect-4/3"
          >
            <FallbackImage
              src={vehicle?.images?.[0]?.image_url}
              alt={vehicle?.carMaker || "vehicle"}
              fill
              className="object-cover hover:scale-105 transition-all duration-300"
            />
          </Link>
          {/* Specs */}
          <div className="rounded-md border bg-muted/20 overflow-hidden">
            <div className="grid grid-cols-[110px_1fr]">
              {labels.map((row, idx) => (
                <div key={`${row.label}-${idx}`} className="contents">
                  <div className="border-b px-3 py-2 text-xs font-medium bg-muted/60">
                    {row.label}
                  </div>
                  <div className="border-b px-3 py-2 text-xs">
                    {row.value || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className=" border-t">
        <div className="flex w-full flex-col gap-2  ">
          <div className="text-xs text-muted-foreground">
            Start price
            <span className="ml-2 text-sm font-semibold text-foreground">
              {vehicle?.startPrice}
            </span>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <p>Acceptance Period:</p>
            <p className="font-semibold text-primary">
              {vehicle?.acceptancePeriod ? new Date(vehicle.acceptancePeriod).toLocaleDateString() : "-"}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

