"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import AddToFavBtn from "@/components/products/AddToFavBtn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import EmailSubscription from "@/components/shared/EmailBox";
import PageHeader from "@/components/shared/PageHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleVehicle } from "@/lib/actions";
import { fixImageUrl } from "@/lib/utils";
import type { VehicleImage } from "@/types/vehicles";

const SingleProductPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getSingleVehicle(id!),
    enabled: !!id,
  });

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  console.log({ data });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  const vehicle = data?.data?.data;

  if (!vehicle) {
    return (
      <div className="flex h-[70vh] items-center justify-center font-bold">
        Vehicle Not Found
      </div>
    );
  }

  const title = `${vehicle.maker} ${vehicle.model}`;
  const mappedImages = vehicle.images?.map((img: VehicleImage) => img.download_url).filter((url): url is string => Boolean(url)) || [];
  const images = mappedImages.length > 0 ? mappedImages : [];

  const specs = [
    { label: "Model", value: vehicle.model || "—" },
    { label: "Year", value: vehicle.year || "—" },
    {
      label: "Hours",
      value: vehicle.workingHours ? `${vehicle.workingHours} hr` : "—",
    },
    { label: "Lot Number", value: vehicle.lotNumber || "—" },
    { label: "Size", value: vehicle.vehicleSize || "—" },
    { label: "Inspection", value: vehicle.inspection || "—" },
    { label: "Transmission", value: vehicle.transmission || "—" },
    { label: "Fuel Type", value: vehicle.fuel || "—" },
    { label: "Equipment", value: vehicle.equipment || "—" },
    { label: "Odometer", value: vehicle.odometer || "—" },
    { label: "Color", value: vehicle.color || "—" },
  ];

  return (
    <>
      <PageHeader title={title} />
      <div className="space-y-5 container my-12">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="text-muted-foreground">{vehicle.auctionDay}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3">
                Grade {vehicle.score || "—"}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {vehicle.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {vehicle.holdingDate ? new Date(vehicle.holdingDate).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>

          {/* Favorite + CTA */}
          <div className="flex gap-2">
            <AddToFavBtn vehicle={vehicle} />
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: Carousel */}
          {images.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="text-sm font-semibold text-red-600">Photos</div>
              </CardHeader>

              <CardContent className="pt-0">
                <Carousel
                  setApi={setApi}
                  opts={{ loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {images.map((src: string, i: number) => (
                      <CarouselItem key={src + i}>
                        <div className="relative overflow-hidden rounded-lg border bg-muted aspect-4/3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fixImageUrl(src)}
                            alt={`${title} image ${i + 1}`}
                            className="object-contain absolute inset-0 w-full h-full"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className="flex items-center justify-between mt-4">
                    {/* Dots */}
                    <div className="flex gap-2 py-2">
                      {images?.slice(0, 15).map((_: string, i: number) => {
                        const isActive = current === i;
                        return (
                          <button
                            key={i}
                            className={cn(
                              "h-2 rounded-full transition-all duration-300 border shadow-sm",
                              isActive
                                ? "bg-red-600 w-6 border-red-700"
                                : "bg-gray-200 w-2 hover:bg-gray-300 border-gray-300"
                            )}
                            onClick={() => api?.scrollTo(i)}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <CarouselPrevious className="bg-red-600 border-none text-white size-8! static translate-x-0 translate-y-0" />
                      <CarouselNext className="bg-red-600 border-none text-white size-8! static translate-x-0 translate-y-0" />
                    </div>
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          )}

          {/* Right: Specs + Start price */}
          <div className={cn("space-y-5", images.length === 0 && "lg:col-span-2")}>
            {/* Specs table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="text-sm font-semibold text-red-600">
                  Specifications
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-md border bg-muted/20 overflow-hidden">
                  <div className="grid grid-cols-[120px_1fr]">
                    {specs.map((row, idx) => (
                      <div key={`${row.label}-${idx}`} className="contents">
                        <div className="border-b px-3 py-2 text-xs font-medium bg-muted/40">
                          {row.label}
                        </div>
                        <div className="border-b px-3 py-2 text-xs">
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Start price */}
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Start price</div>
                <div className="mt-1 text-lg font-semibold">
                  {vehicle.startPrice}
                </div>
                <Separator className="my-3" />
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="mt-1 text-sm">{vehicle.status}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-red-600">
              Description / Equipment
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {vehicle.equipment || "No description available."}
            </p>
          </CardContent>
        </Card>
      </div>
      <EmailSubscription />
    </>
  );
};

export default SingleProductPage;
