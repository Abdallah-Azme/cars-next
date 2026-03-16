// components/products/product-card-ui.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VehicleData } from "@/types/vehicles";
import Link from "next/link";
import AddToFavBtn from "./AddToFavBtn";
import FallbackImage from "../shared/FallbackImage";
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
            <div className="text-sm text-muted-foreground">
              {vehicle?.auctionDay}
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
                        <FallbackImage
                          src={img.download_url || ""}
                          alt={vehicle?.carMaker || "vehicle"}
                          fill
                          className="object-cover hover:scale-105 transition-all duration-300"
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Dots Indicator */}
              {images.length > 1 && (
                <div 
                  className="z-[9999]!"
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
      <CardFooter className=" border-t">
        <div className="flex w-full flex-col gap-2  ">
          <div className="text-xs text-muted-foreground">
            {vehicle?.startPrice ? 'Start price' : 'Sold price'}
            <span className="ml-2 text-sm font-semibold text-foreground">
              {vehicle?.startPrice || vehicle?.soldPrice || '-'}
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

