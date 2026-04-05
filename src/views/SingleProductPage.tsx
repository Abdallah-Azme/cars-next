"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import AddToFavBtn from "@/components/products/AddToFavBtn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
import { fixImageUrl, formatWhatsAppUrl } from "@/lib/utils";
import type { VehicleImage } from "@/types/vehicles";
import { useLocale, useTranslations } from "next-intl";

const SingleProductPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const locale = useLocale();
  const t = useTranslations("Vehicle");
  const ts = useTranslations("single");
  const isRtl = locale === 'ar';
  
  const settings = useSettingsStore((state) => state.settings);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getSingleVehicle(id!),
    enabled: !!id,
  });

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const vehicle = data?.data?.data;

  const handleWhatsAppContact = () => {
    const contact = settings?.whatsapp || settings?.phone;
    const message = isRtl
      ? `مرحباً، أنا مهتم بـ ${vehicle?.maker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id}). هل يمكنك تزويدي بمزيد من التفاصيل؟`
      : `Hello, I'm interested in the ${vehicle?.maker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id}). Could you provide more details?`;
    const finalUrl = formatWhatsAppUrl(contact, message);
    if (finalUrl) window.open(finalUrl, "_blank");
  };

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          <p className="text-muted-foreground animate-pulse font-medium">{ts("loading")}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-[70vh] items-center justify-center font-bold text-xl">
        {ts("notFound")}
      </div>
    );
  }

  const title = `${vehicle.maker} ${vehicle.model}`;
  const mappedImages =
    vehicle.images
      ?.map((img: VehicleImage) => img.download_url)
      .filter((url): url is string => Boolean(url)) || [];
  const images = mappedImages.length > 0 ? mappedImages : [];

  const rawStatus = vehicle.status || "";
  const localizedStatus = rawStatus.toLowerCase().includes("sold") ? t("status.sold") : rawStatus;

  const specs = [
    { label: ts("labels.model"), value: vehicle.model || "—" },
    { label: t("labels.year"), value: vehicle.year || "—" },
    {
      label: t("labels.hours"),
      value: vehicle.workingHours ? `${vehicle.workingHours} ${isRtl ? 'ساعة' : 'hr'}` : "—",
    },
    { label: ts("labels.transmission"), value: vehicle.transmission || "—" },
    { label: ts("labels.fuelType"), value: vehicle.fuel || "—" },
    { label: ts("labels.equipment"), value: vehicle.equipment || "—" },
    { label: ts("labels.odometer"), value: vehicle.odometer || "—" },
    { label: ts("labels.color"), value: vehicle.color || "—" },
  ];

  return (
    <>
      <PageHeader title={title} />
      <div className={`space-y-5 container my-12 ${isRtl ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="text-muted-foreground">{vehicle.auctionDay}</div>
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Badge variant="secondary" className="rounded-full px-3">
                {ts("grade")} {vehicle.score || "—"}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {localizedStatus}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {vehicle.holdingDate
                  ? new Date(vehicle.holdingDate).toLocaleDateString(locale)
                  : "—"}
              </span>
            </div>
          </div>

          {/* Favorite + CTA */}
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {settings?.whatsapp || settings?.phone ? (
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 transition-all active:scale-95 shadow-sm"
              >
                <MessageCircle className="size-4" />
                {t("contact.whatsapp")}
              </Button>
            ) : (
              <Button 
                disabled
                variant="outline"
                className="gap-2 opacity-50"
              >
                <MessageCircle className="size-4" />
                {t("contact.unavailable")}
              </Button>
            )}
            <AddToFavBtn vehicle={vehicle} />
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: Carousel */}
          {images.length > 0 && (
            <Card className={isRtl ? 'order-last lg:order-0' : ''}>
              <CardHeader className="pb-3 text-start">
                <div className="text-sm font-semibold text-red-600">{ts("photos")}</div>
              </CardHeader>

              <CardContent className="pt-0">
                <Carousel
                  setApi={setApi}
                  opts={{ loop: true, direction: isRtl ? 'rtl' : 'ltr' }}
                  className="w-full"
                >
                  <CarouselContent>
                    {images.map((src: string, i: number) => (
                      <CarouselItem key={src + i}>
                        <div className="relative overflow-hidden rounded-lg border bg-muted aspect-4/3">
                          <Image
                            src={fixImageUrl(src)}
                            alt={`${title} image ${i + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority={i === 0}
                          />

                          {/* Logo Overlay */}
                          <div className={`absolute bottom-4 ${isRtl ? 'left-4' : 'right-4'} z-10 select-none pointer-events-none opacity-80 transition-opacity hover:opacity-100`}>
                            <div className="relative h-12 w-32 md:h-16 md:w-40 overflow-hidden rounded-lg bg-white/40 backdrop-blur-md p-2 shadow-sm border border-white/40">
                              <Image
                                src="/logo.jpeg"
                                alt="Logo"
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className={`flex items-center justify-between mt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    {/* Dots */}
                    <div className={`flex gap-2 py-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      {images?.slice(0, 15).map((_: string, i: number) => {
                        const isActive = current === i;
                        return (
                          <button
                            key={i}
                            className={cn(
                              "h-2 rounded-full transition-all duration-300 border shadow-sm",
                              isActive
                                ? "bg-red-600 w-6 border-red-700"
                                : "bg-gray-200 w-2 hover:bg-gray-300 border-gray-300",
                            )}
                            onClick={() => api?.scrollTo(i)}
                          />
                        );
                      })}
                    </div>

                    <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <CarouselPrevious className="bg-red-600 border-none text-white size-8! static translate-x-0 translate-y-0" />
                      <CarouselNext className="bg-red-600 border-none text-white size-8! static translate-x-0 translate-y-0" />
                    </div>
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          )}

          {/* Right: Specs + Start price */}
          <div
            className={cn("space-y-5", images.length === 0 && "lg:col-span-2")}
          >
            {/* Specs table */}
            <Card>
              <CardHeader className="pb-3 text-start">
                <div className="text-sm font-semibold text-red-600">
                  {ts("specifications")}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-md border bg-muted/20 overflow-hidden">
                  <div className={`grid ${isRtl ? 'grid-cols-[1fr_120px]' : 'grid-cols-[120px_1fr]'}`}>
                    {specs.map((row, idx) => (
                      <div key={`${row.label}-${idx}`} className="contents">
                        <div className={`border-b px-3 py-2 text-xs font-medium bg-muted/40 ${isRtl ? 'order-2 text-right' : 'order-1 text-left'}`}>
                          {row.label}
                        </div>
                        <div className={`border-b px-3 py-2 text-xs ${isRtl ? 'order-1 text-left' : 'order-2 text-right'}`}>
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
                <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">
                  {rawStatus.toLowerCase().includes("sold")
                    ? t("status.soldPrice")
                    : t("status.startPrice")}
                </div>
                <div
                  className={cn(
                    "mt-1 text-lg font-black flex items-center gap-1",
                    isRtl ? 'flex-row-reverse' : '',
                    rawStatus.toLowerCase().includes("sold")
                      ? "text-green-600"
                      : "text-blue-600",
                  )}
                >
                  {(() => {
                    const price = rawStatus.toLowerCase().includes("sold")
                      ? (vehicle.soldPrice || vehicle.startPrice || vehicle.translatedData?.startPrice)
                      : (vehicle.startPrice || vehicle.translatedData?.startPrice);

                    if (!price) return <span>{t("status.tbd")}</span>;

                    return (
                      <>
                        <span className="text-xs font-bold opacity-60 italic tracking-tighter">
                          {t("contact.currency")}
                        </span>
                        {price}
                      </>
                    );
                  })()}
                </div>
                <Separator className="my-3" />
                <div className="text-xs text-muted-foreground">{ts("status")}</div>
                <div className="mt-1 text-sm">{localizedStatus}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardHeader className="text-start">
            <div className="text-sm font-semibold text-red-600">
              {ts("description")}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {vehicle.equipment || ts("noDescription")}
            </p>
          </CardContent>
        </Card>
      </div>
      <EmailSubscription />
    </>
  );
};

export default SingleProductPage;
