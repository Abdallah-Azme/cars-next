import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/admin/ui/card";
import { Separator } from "@/components/admin/ui/separator";
import Link from "next/link";
import type { VehicleData } from "@/types/vehicles";
import FallbackImage from "@/components/shared/FallbackImage";

type Props = {
  vehicle: VehicleData;
};

export function ProductCard({ vehicle }: Props) {
  const specs = [
    { label: "Model", value: vehicle.model || "-" },
    { label: "Year", value: vehicle.year || "-" },
    { label: "Hours", value: vehicle.workingHours || "-" },
    { label: "Chassis ID", value: vehicle.chassisId || "-" },
    { label: "Fuel Type", value: vehicle.fuel || "-" },
    { label: "Score", value: vehicle.score || "-" },
  ];

  return (
    <Link href={`/admin/products/${vehicle.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="px-4 py-2">
          {/* Top row: title + grade */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className=" font-semibold tracking-wide">
                {vehicle.carMaker} {vehicle.model}
              </div>
              <div className="text-sm text-muted-foreground">{vehicle.auctionDay} {new Date(vehicle.holdingDate).toLocaleDateString()}</div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full size-9 text-base flex items-center justify-center">
                {vehicle.score || "-"}
              </Badge>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Middle: image + specs table */}
          <div className="flex flex-col gap-4">
            {/* Image */}
            <div className="relative overflow-hidden rounded-md border bg-muted aspect-4/3">
              <FallbackImage
                src={vehicle.images?.[0]?.image_url}
                alt={vehicle.model || "vehicle"}
                fill
                className="object-cover"
              />
            </div>
            {/* Specs */}
            <div className="rounded-md border bg-muted/20 overflow-hidden">
              <div className="grid grid-cols-[110px_1fr]">
                {specs.map((row, idx) => (
                  <div key={`${row.label}-${idx}`} className="contents">
                    <div className="border-b px-3 py-2 text-xs font-medium bg-muted/60">
                      {row.label}
                    </div>
                    <div className="border-b px-3 py-2 text-xs">{row.value}</div>
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
                {Number(vehicle.startPrice).toLocaleString()} Yen
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 ">
              <Badge variant="outline" className="font-normal capitalize">
                {vehicle.status}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {new Date(vehicle.holdingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
