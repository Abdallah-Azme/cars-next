// components/products/product-card-ui.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VehicleData } from "@/types/vehicles";
import Link from "next/link";
import AddToFavBtn from "./AddToFavBtn";
import { fixImageUrl, cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Props = {
  isFavorite?: boolean;
  vehicle: VehicleData;
};

export function ProductCard({ vehicle }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const images = vehicle?.images?.filter(img => img.download_url) || [];
  
  const lastHistory = vehicle?.statusHistory && vehicle.statusHistory.length > 0 
    ? vehicle.statusHistory[vehicle.statusHistory.length - 1] 
    : null;
  const lastResult = lastHistory?.result || "No Status";

  React.useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    
    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api]);

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
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">{vehicle?.auctionDay}</span>
              {lastHistory && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-tighter",
                  lastResult.includes("Sold") ? "bg-green-100 text-green-700" :
                  lastResult.includes("Yet") ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                )}>
                  {lastResult}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AddToFavBtn vehicle={vehicle} />
          </div>
        </div>

        <Separator className="my-3" />

        {/* Middle: specs table + image */}
        <div className="flex flex-col gap-4">
          {/* Image */}
          {/* Carousel */}
          {images.length > 0 && (
            <div className="relative group">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index}>
                      <Link
                        href={`/products/${vehicle?.id}`}
                        className="relative block overflow-hidden rounded-md border bg-muted aspect-4/3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fixImageUrl(img.download_url) || ""}
                          alt={vehicle?.carMaker || "vehicle"}
                          className="object-cover w-full h-full hover:scale-105 transition-all duration-300"
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Dots Indicator */}
              {images.length > 1 && (
                <div 
                  className="z-9999!"
                  style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}
                >
                  <div 
                    className="bg-black! shadow-2xl!"
                    style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      alignItems: 'center', 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      border: '2px solid white',
                      pointerEvents: 'auto'
                    }}
                  >
                    {Array.from({ length: Math.min(images.length, 10) }).map((_, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          api?.scrollTo(i);
                        }}
                        style={{
                          height: '10px',
                          width: current === i ? '24px' : '10px',
                          backgroundColor: current === i ? '#DC2626' : 'white',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
      <CardFooter className=" border-t bg-muted/5">
        <div className="flex w-full flex-col gap-2  ">
          {(lastResult.toLowerCase().includes("sold") || lastResult.toLowerCase().includes("yet")) ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {lastResult.toLowerCase().includes("sold") ? "Selling Price" : "Start Price"}
              </div>
              <div
                className={cn(
                  "text-sm font-black px-2 py-0.5 rounded",
                  lastResult.toLowerCase().includes("sold") ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                )}
              >
                {lastResult.toLowerCase().includes("sold") 
                  ? (vehicle.soldPrice || vehicle.startPrice || vehicle.translatedData?.startPrice || "TBD") 
                  : (vehicle.startPrice || vehicle.translatedData?.startPrice || "TBD")}
              </div>
            </div>
          ) : (
            <div className="h-10 invisible" /> /* Empty div to maintain spacing */
          )}

          <div className="text-[10px] text-muted-foreground flex items-center justify-between border-t border-dashed pt-2 mt-1">
            <span className="flex items-center gap-1 font-medium italic">
              Acceptance Ends:
            </span>
            <span className="font-bold text-neutral-700">
              {vehicle?.acceptancePeriod
                ? new Date(vehicle.acceptancePeriod).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

