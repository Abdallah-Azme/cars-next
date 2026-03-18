"use client";

import * as React from "react";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/admin/ui/card";
import { Separator } from "@/components/admin/ui/separator";
import Link from "next/link";
import type { VehicleData } from "@/types/vehicles";
import { fixImageUrl } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/admin/ui/carousel";

type Props = {
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

  const specs = [
    { label: "Model", value: vehicle.model || "-" },
    { label: "Year", value: vehicle.year || "-" },
    { label: "Hours", value: vehicle.workingHours || "-" },
    { label: "Chassis ID", value: vehicle.chassisId || "-" },
    { label: "Fuel Type", value: vehicle.fuel || "-" },
    { label: "Score", value: vehicle.score || "-" },
  ];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="px-4 py-2">
        {/* Top row: title + grade */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className=" font-semibold tracking-wide">
              {vehicle.carMaker} {vehicle.model}
            </div>
            <div className="text-sm text-muted-foreground">{vehicle.auctionDay} {vehicle.holdingDate ? new Date(vehicle.holdingDate).toLocaleDateString() : ""}</div>
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
          {/* Carousel */}
          {images.length > 0 ? (
            <div className="relative group">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index}>
                      <Link
                        href={`/admin/products/${vehicle.id}`}
                        className="relative block overflow-hidden rounded-md border bg-muted aspect-4/3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fixImageUrl(img.download_url) || ""}
                          alt={vehicle.model || "vehicle"}
                          className="object-cover w-full h-full absolute inset-0"
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Dots Indicator */}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '6px', 
                    alignItems: 'center', 
                    padding: '6px 12px', 
                    borderRadius: '999px', 
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    pointerEvents: 'auto'
                  }}>
                    {Array.from({ length: Math.min(images.length, 10) }).map((_, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          api?.scrollTo(i);
                        }}
                        style={{
                          height: '8px',
                          width: current === i ? '24px' : '8px',
                          backgroundColor: current === i ? '#EF4444' : 'rgba(255,255,255,0.6)',
                          borderRadius: '999px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/admin/products/${vehicle.id}`}>
              <div className="relative overflow-hidden rounded-md border bg-muted aspect-4/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero.jpg"
                  alt={vehicle.model || "vehicle"}
                  className="object-cover w-full h-full absolute inset-0"
                />
              </div>
            </Link>
          )}

          {/* Specs */}
          <Link href={`/admin/products/${vehicle.id}`} className="block">
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
          </Link>
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
              {vehicle.holdingDate ? new Date(vehicle.holdingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
