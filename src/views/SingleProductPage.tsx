"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import AddToFavBtn from "@/components/products/AddToFavBtn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Mail,
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
import { useCurrency } from "@/hooks/useCurrency";

const SingleProductPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const locale = useLocale();
  const t = useTranslations("Vehicle");
  const ts = useTranslations("Vehicle.single");
  const isRtl = locale === "ar";
  const { formatPrice } = useCurrency();

  const settings = useSettingsStore((state) => state.settings);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error("Failed to fetch vehicle");
      return res.json();
    },
    enabled: !!id,
  });

  console.log({ data });

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [zoomApi, setZoomApi] = React.useState<CarouselApi>();
  const [zoomCurrent, setZoomCurrent] = React.useState(0);

  const vehicle = data?.data;

  const handleWhatsAppContact = () => {
    const contact = settings?.whatsapp || settings?.phone;
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const message = isRtl
      ? `مرحباً، أنا مهتم بـ ${vehicle?.maker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id}). هل يمكنك تزويدي بمزيد من التفاصيل؟\n${currentUrl}`
      : `Hello, I'm interested in the ${vehicle?.maker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id}). Could you provide more details?\n${currentUrl}`;
    const finalUrl = formatWhatsAppUrl(contact, message);
    if (finalUrl) window.open(finalUrl, "_blank");
  };

  // mailto URL is now handled directly in the button for better compatibility

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  React.useEffect(() => {
    if (!zoomApi) return;

    setZoomCurrent(zoomApi.selectedScrollSnap());

    zoomApi.on("select", () => {
      setZoomCurrent(zoomApi.selectedScrollSnap());
    });
  }, [zoomApi]);

  React.useEffect(() => {
    if (isZoomOpen && zoomApi) {
      zoomApi.scrollTo(current, true);
    }
  }, [isZoomOpen, zoomApi, current]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          <p className="text-muted-foreground animate-pulse font-medium">
            {ts("loading")}
          </p>
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

  const title =
    `${vehicle.maker || ""} ${vehicle.model || ""}`.trim() ||
    vehicle.carMaker ||
    "Vehicle";
  const mappedImages =
    vehicle.images
      ?.map((img: VehicleImage) => img.download_url)
      .filter((url): url is string => Boolean(url)) || [];
  const images = mappedImages.length > 0 ? mappedImages : [];
  const rawStatus = vehicle.status || "";
  const lowerStatus = rawStatus.toLowerCase();
  const localizedStatus =
    lowerStatus === "sold"
      ? t("status.sold")
      : lowerStatus.includes("not sold")
        ? t("status.notSold")
        : rawStatus;

  const specs = [
    { label: ts("labels.model"), value: vehicle.model || "—" },
    { label: t("labels.year"), value: vehicle.year || "—" },
    {
      label: t("labels.hours"),
      value: vehicle.workingHours
        ? `${vehicle.workingHours} ${isRtl ? "ساعة" : "hr"}`
        : "—",
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
      <div className={`space-y-5 container my-12 text-start`}>
        {/* Header */}
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`}
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="text-muted-foreground">{vehicle.auctionDay}</div>
            <div className={`flex items-center gap-2`}>
              <Badge variant="secondary" className="rounded-full px-3">
                {ts("grade")} {vehicle.score || "—"}
              </Badge>
              <Badge
                variant="outline"
                className="font-normal cursor-pointer hover:bg-muted transition-colors"
                onClick={handleWhatsAppContact}
              >
                {localizedStatus}
              </Badge>
              <span
                className="text-xs text-muted-foreground cursor-pointer hover:underline underline-offset-4"
                onClick={handleWhatsAppContact}
              >
                {vehicle.holdingDate
                  ? new Date(vehicle.holdingDate).toLocaleDateString(locale)
                  : "—"}
              </span>
            </div>
          </div>

          {/* Favorite + CTA */}
          <div className="flex flex-wrap items-center gap-2">
            {settings?.whatsapp || settings?.phone ? (
              <Button
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 transition-all active:scale-95 shadow-sm"
              >
                <MessageCircle className="size-4" />
                {t("contact.whatsapp")}
              </Button>
            ) : (
              <Button disabled variant="outline" className="gap-2 opacity-50">
                <MessageCircle className="size-4" />
                {t("contact.unavailable")}
              </Button>
            )}

            {settings?.email && (
              <Button
                variant="outline"
                className="gap-2 transition-all active:scale-95 shadow-sm border-gray-300 hover:bg-gray-100"
                asChild
              >
                <a
                  href={`mailto:${settings.email.trim()}?subject=${encodeURIComponent(isRtl ? `استفسار حول ${vehicle?.maker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id})` : `Inquiry about ${vehicle?.maker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id})`)}&body=${encodeURIComponent((isRtl ? `مرحباً، أنا مهتم بهذه المعدة:\n` : `Hello, I am interested in this machine:\n`) + (typeof window !== "undefined" ? window.location.href : ""))}`}
                >
                  <Mail className="size-4" />
                  {t("contact.email")}
                </a>
              </Button>
            )}

            <AddToFavBtn vehicle={vehicle} />
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: Carousel */}
          {images.length > 0 && (
            <Card className={isRtl ? "order-last lg:order-0" : ""}>
              <CardHeader className="pb-3 text-start">
                <div className="text-sm font-semibold text-red-600">
                  {ts("photos")}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Carousel
                  setApi={setApi}
                  opts={{ loop: true, direction: isRtl ? "rtl" : "ltr" }}
                  className="w-full"
                >
                  <CarouselContent>
                    {images.map((src: string, i: number) => (
                      <CarouselItem key={src + i}>
                        <div
                          className="relative overflow-hidden rounded-lg border bg-muted aspect-4/3 cursor-pointer group"
                          onClick={() => {
                            api?.scrollTo(i, true);
                            setIsZoomOpen(true);
                          }}
                        >
                          <Image
                            src={fixImageUrl(src)}
                            alt={`${title} image ${i + 1}`}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority={i === 0}
                          />
                          <div className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="size-5 text-white" />
                          </div>

                          {/* Logo Overlay */}
                          <div className="absolute bottom-4 end-4 z-10 select-none pointer-events-none opacity-80 transition-opacity hover:opacity-100">
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

                  <div className={`flex items-center justify-between mt-4`}>
                    {/* Dots */}
                    <div className={`flex gap-2 py-2`}>
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

                    <div className={`flex items-center gap-2`}>
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
                  <div className="grid grid-cols-[120px_1fr]">
                    {specs.map((row, idx) => (
                      <div key={`${row.label}-${idx}`} className="contents">
                        <div className="border-b px-3 py-2 text-xs font-medium bg-muted/40 text-start">
                          {row.label}
                        </div>
                        <div className="border-b px-3 py-2 text-xs text-end">
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Start price */}
            <Card
              className="cursor-pointer hover:border-red-200 transition-colors group"
              onClick={handleWhatsAppContact}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">
                      {rawStatus.toLowerCase() === "sold"
                        ? t("status.soldPrice")
                        : t("status.startPrice")}
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-lg font-black flex items-center gap-1",
                        rawStatus.toLowerCase() === "sold"
                          ? "text-green-600"
                          : "text-blue-600",
                      )}
                    >
                      {(() => {
                        const price =
                          rawStatus.toLowerCase() === "sold"
                            ? vehicle.soldPrice ||
                              vehicle.startPrice ||
                              vehicle.translatedData?.startPrice
                            : vehicle.startPrice ||
                              vehicle.translatedData?.startPrice;

                        if (!price) return <span>{t("status.tbd")}</span>;

                        return <>{formatPrice(price)}</>;
                      })()}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="size-4 text-green-600" />
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {ts("status")}
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {localizedStatus}
                    </div>
                  </div>
                  {vehicle.holdingDate && (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {t("status.acceptanceEnds")}
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {new Date(vehicle.holdingDate).toLocaleDateString(
                          locale,
                        )}
                      </div>
                    </div>
                  )}
                </div>
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

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent
          className="w-screen h-dvh max-w-none sm:max-w-none p-0 border-none bg-black/95 rounded-none"
          showCloseButton={false}
        >
          <div className="absolute top-4 start-4 z-50 flex items-center gap-2">
            <AddToFavBtn vehicle={vehicle} />
          </div>
          <div className="absolute top-4 end-4 z-50">
            <button
              onClick={() => setIsZoomOpen(false)}
              aria-label="Close zoom"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center justify-center backdrop-blur-md border border-white/10"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex h-full w-full items-center justify-center p-0 md:p-8 relative">
            <Carousel
              setApi={setZoomApi}
              opts={{ loop: true, direction: isRtl ? "rtl" : "ltr" }}
              className="w-full h-full max-w-[100vw] mx-auto"
            >
              <CarouselContent className="h-full">
                {images.map((src: string, i: number) => (
                  <CarouselItem
                    key={`zoom-${src}-${i}`}
                    className="h-dvh flex items-center justify-center"
                  >
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.5}
                      maxScale={6}
                      centerZoomedOut={true}
                    >
                      {({ zoomIn, zoomOut, resetTransform }) => (
                        <div className="relative w-full h-[95vh] flex flex-col">
                          <TransformComponent
                            wrapperStyle={{ width: "100%", height: "100%" }}
                            contentStyle={{ width: "100%", height: "100%" }}
                          >
                            <div className="relative w-full h-full flex items-center justify-center">
                              <Image
                                src={fixImageUrl(src)}
                                alt={`${title} zoomed ${i + 1}`}
                                fill
                                className="object-contain select-none cursor-grab active:cursor-grabbing"
                                sizes="100vw"
                                priority
                                draggable={false}
                              />
                            </div>
                          </TransformComponent>

                          {/* Visual UX Controls */}
                          <div className="absolute bottom-[25%] end-4 z-50 flex flex-col gap-2 bg-black/50 p-2 rounded-xl backdrop-blur-md border border-white/10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                zoomIn();
                              }}
                              aria-label="Zoom in"
                              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <ZoomIn className="size-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                zoomOut();
                              }}
                              aria-label="Zoom out"
                              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <ZoomOut className="size-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                resetTransform();
                              }}
                              aria-label="Reset zoom"
                              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <RotateCcw className="size-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </TransformWrapper>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 md:left-10 bg-white/20 hover:bg-white/40 border-none text-white size-10 md:size-12 shadow-md flex" />
              <CarouselNext className="right-4 md:right-10 bg-white/20 hover:bg-white/40 border-none text-white size-10 md:size-12 shadow-md flex" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm z-50">
                {zoomCurrent + 1} / {images.length}
              </div>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>

      <EmailSubscription />
    </>
  );
};

export default SingleProductPage;
