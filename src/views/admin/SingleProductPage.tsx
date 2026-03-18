"use client";

import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/admin/ui/card";
import { Separator } from "@/components/admin/ui/separator";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleVehicle } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { cn, fixImageUrl } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/admin/ui/carousel";
import { SingleVehicleResponse } from "@/types/vehicles";
import * as React from "react";

export default function SingleProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const { data, isLoading } = useQuery<SingleVehicleResponse>({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const res = await getSingleVehicle(id!);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    enabled: !!id,
  });

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

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  const vehicle = data?.data;

  if (!vehicle) {
    return (
      <div className="flex h-[70vh] items-center justify-center font-bold">
        Vehicle Not Found
      </div>
    );
  }

  const title = `${vehicle.carMaker} ${vehicle.model}`;
  const mappedImages = vehicle.images?.map((img) => img.download_url).filter((url): url is string => Boolean(url)) || [];
  const images = mappedImages.length > 0 ? mappedImages : [];
  
  const specs = [
    { label: "Model", value: vehicle.model || "—" },
    { label: "Maker", value: vehicle.carMaker || "—" },
    { label: "Year", value: vehicle.year || "—" },
    { label: "Hours", value: vehicle.workingHours || "—" },
    { label: "Chassis ID", value: vehicle.chassisId || "—" },
    { label: "Fuel Type", value: vehicle.fuel || "—" },
    { label: "Score", value: vehicle.score || "—" },
    { label: "Status", value: vehicle.status || "—" },
    { label: "Ref", value: vehicle.lotNumber || "—" },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-700">{title}</h1>
        <div className="flex items-center gap-2">
           <Badge variant="secondary" className="text-lg px-4 py-1">
            Score: {vehicle.score || "—"}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {vehicle.status}
          </Badge>
        </div>
      </div>

      <div className={cn("grid grid-cols-1 gap-8", images.length > 0 ? "lg:grid-cols-2" : "max-w-3xl mx-auto")}>
        {/* Images Section */}
        {images.length > 0 && (
          <div className="space-y-4">
            <Card className="overflow-hidden border-2 shadow-sm">
              <CardContent className="p-0">
                <Carousel setApi={setApi} className="w-full">
                  <CarouselContent>
                    {images.map((src, i) => (
                      <CarouselItem key={`${src}-${i}`}>
                        <div className="relative overflow-hidden rounded-lg border bg-muted h-[400px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fixImageUrl(src)}
                            alt={`${title} - image ${i + 1}`}
                            className="object-cover w-full h-full absolute inset-0"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Dots Indicator */}
                  {images.length > 1 && (
                    <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
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

                  {images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((src, i) => (
                <div
                  key={`thumb-${i}`}
                  className="relative aspect-video rounded-md overflow-hidden border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fixImageUrl(src)}
                    alt={`${title} thumb ${i + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-3 border-b">
              <h2 className="text-xl font-semibold">Specifications</h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0">
                {specs.map((item, idx) => (
                  <div key={item.label} className={`flex justify-between items-center p-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-muted/5'} hover:bg-red-50 transition-colors`}>
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-red-100">
            <CardHeader className="bg-red-50 pb-3 border-b border-red-100">
              <h2 className="text-xl font-semibold text-red-900">Pricing Information</h2>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground font-medium">Start Price</span>
                <span className="text-2xl font-bold text-red-600">
                  {Number(vehicle.startPrice).toLocaleString()} Yen
                </span>
              </div>
              <Separator className="bg-red-100" />
              <div className="rounded-lg bg-red-50/50 p-4 border border-red-100 italic text-sm text-red-800">
                Auction date: {vehicle.auctionDay} {vehicle.holdingDate ? new Date(vehicle.holdingDate).toLocaleDateString() : ""}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
