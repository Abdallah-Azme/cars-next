// components/products/product-card-ui.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VehicleData } from "@/types/vehicles";
import { Link } from "@/i18n/routing";
import AddToFavBtn from "./AddToFavBtn";
import { fixImageUrl, cn, formatWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings";
import { MessageCircle, ZoomIn, ZoomOut, RotateCcw, X, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/hooks/useCurrency";
type Props = {
  isFavorite?: boolean;
  vehicle: VehicleData;
};

export function ProductCard({ vehicle }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [zoomApi, setZoomApi] = React.useState<CarouselApi>();
  const [zoomCurrent, setZoomCurrent] = React.useState(0);

  // Stable refs so sync effect doesn't need them in dep array
  const apiRef = React.useRef<CarouselApi>(undefined);
  const zoomApiRef = React.useRef<CarouselApi>(undefined);
  const currentRef = React.useRef(0);

  // Keep refs in sync
  React.useEffect(() => { apiRef.current = api; }, [api]);
  React.useEffect(() => { zoomApiRef.current = zoomApi; }, [zoomApi]);

  const locale = useLocale();
  const t = useTranslations("Vehicle");
  const isRtl = locale === 'ar';
  const { formatPrice } = useCurrency();

  const images = vehicle?.images?.filter(img => img.download_url) || [];
  
  const lastHistory = vehicle?.statusHistory && vehicle.statusHistory.length > 0 
    ? vehicle.statusHistory[vehicle.statusHistory.length - 1] 
    : null;
  const rawResult = lastHistory?.result || "";
  
  // Localize the result if it's a known status
  const lastResult = React.useMemo(() => {
    const lower = rawResult.toLowerCase();
    if (lower === "sold") return t("status.sold");
    if (lower.includes("not sold")) return t("status.notSold");
    return rawResult;
  }, [rawResult, t]);

  React.useEffect(() => {
    if (!api) return;
    const updateCurrent = () => {
      const snap = api.selectedScrollSnap();
      setCurrent(snap);
      currentRef.current = snap;
    };
    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api]);

  React.useEffect(() => {
    if (!zoomApi) return;
    const updateZoomCurrent = () => setZoomCurrent(zoomApi.selectedScrollSnap());
    updateZoomCurrent();
    zoomApi.on("select", updateZoomCurrent);
    zoomApi.on("reInit", updateZoomCurrent);
    return () => {
      zoomApi.off("select", updateZoomCurrent);
      zoomApi.off("reInit", updateZoomCurrent);
    };
  }, [zoomApi]);

  // Sync zoom carousel to the same image when dialog opens
  React.useEffect(() => {
    if (!isZoomOpen) return;
    const timer = setTimeout(() => {
      zoomApiRef.current?.scrollTo(currentRef.current, true);
    }, 100);
    return () => clearTimeout(timer);
  }, [isZoomOpen]);

  const auctionDate = vehicle?.holdingDate
    ? new Date(vehicle.holdingDate).toLocaleDateString(locale)
    : null;
  const auctionTime = vehicle?.holdingDate
    ? new Date(vehicle.holdingDate).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    : null;

  const labels = [
    { label: t("labels.lotNumber"), value: vehicle?.lotNumber },
    { label: t("labels.vehicleType"), value: vehicle?.vehicleType },
    { label: t("labels.hours"), value: vehicle?.workingHours },
    { label: t("labels.score"), value: vehicle?.score },
    { label: t("labels.year"), value: vehicle?.year },
    { label: t("labels.fuel"), value: vehicle?.fuel },
  ];

  const settings = useSettingsStore((state) => state.settings);

  const getProductUrl = () => {
    // Build absolute URL for the product
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/${locale}/products/${vehicle?.id}`;
  };

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const contact = settings?.whatsapp || settings?.phone;
    const productUrl = getProductUrl();
    const message = isRtl
      ? `مرحباً، أنا مهتم بـ ${vehicle?.carMaker || ""} ${vehicle?.model || ""}.\nرابط المعدة: ${productUrl}\nهل يمكنك تزويدي بمزيد من التفاصيل؟`
      : `Hello, I'm interested in the ${vehicle?.carMaker || ""} ${vehicle?.model || ""}. \nProduct link: ${productUrl}\nCould you provide more details?`;
    const finalUrl = formatWhatsAppUrl(contact, message);
    if (finalUrl) window.open(finalUrl, "_blank");
  };

  const handleEmailContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = settings?.email;
    if (!email) return;
    const productUrl = getProductUrl();
    const subject = isRtl
      ? `استفسار عن ${vehicle?.carMaker || ""} ${vehicle?.model || ""}`
      : `Inquiry about ${vehicle?.carMaker || ""} ${vehicle?.model || ""}`;
    const body = isRtl
      ? `مرحباً،\nأنا مهتم بالمعدة التالية:\n${productUrl}\n\nيرجى تزويدي بمزيد من التفاصيل.`
      : `Hello,\nI'm interested in the following product:\n${productUrl}\n\nCould you please provide more details?`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  return (
    <>
    <Link href={`/products/${vehicle?.id}`} className="block group/card">
    <Card className="overflow-hidden transition-shadow duration-300 group-hover/card:shadow-md">
      <CardContent className="px-4 py-2">
        {/* Top row: date + grade + favorite */}
        <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-2 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="font-semibold tracking-wide group-hover/card:text-red-600 transition-colors">
                {vehicle?.carMaker || "-"} {vehicle?.model || "-"}
              </span>
              {vehicle?.lotNumber && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider">
                  # {vehicle.lotNumber}
                </span>
              )}
            </div>
            <div className={`flex flex-wrap items-center gap-2 text-xs ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground uppercase font-medium">
                {vehicle?.auctionDay}
              </span>
              {auctionDate && (
                <span className="text-muted-foreground font-medium">
                  {auctionDate}
                </span>
              )}
              {auctionTime && (
                <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground">
                  {auctionTime}
                </span>
              )}
              {lastHistory && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-tighter",
                  rawResult.toLowerCase() === "sold" ? "bg-green-100 text-green-700" :
                  rawResult.toLowerCase().includes("not sold") ? "bg-red-100 text-red-700" :
                  rawResult.toLowerCase().includes("yet") ? "bg-blue-100 text-blue-700" :
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
          {images.length > 0 && (
            <div className="relative group">
              <Carousel setApi={setApi} opts={{ direction: isRtl ? 'rtl' : 'ltr' }} className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative group/item w-full h-full">
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            api?.scrollTo(index, true);
                            setIsZoomOpen(true);
                          }}
                          className="relative block overflow-hidden rounded-md border bg-muted aspect-4/3 cursor-zoom-in"
                        >
                          <img
                            src={fixImageUrl(img.download_url) || ""}
                            alt={vehicle?.carMaker || "vehicle"}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover/item:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/50 backdrop-blur-md p-3 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform scale-75 group-hover/item:scale-100">
                              <ZoomIn className="size-6 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Arrow Controls */}
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className={`${isRtl ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-none`} />
                    <CarouselNext className={`${isRtl ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-none`} />
                  </>
                )}
              </Carousel>
              
              {/* Dots Indicator */}
              {images.length > 1 && (
                <div 
                  className="z-20"
                  style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}
                >
                  <div 
                    className="bg-black/50 backdrop-blur-md shadow-lg"
                    style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      alignItems: 'center', 
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      border: '1px solid rgba(255,255,255,0.2)',
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
            <div className={`grid ${isRtl ? 'grid-cols-[1fr_110px]' : 'grid-cols-[110px_1fr]'}`}>
              {labels.map((row, idx) => (
                <div key={`${row.label}-${idx}`} className="contents">
                  {isRtl ? (
                    <>
                      <div className="border-b px-3 py-2 text-xs text-left">
                        {row.value || "-"}
                      </div>
                      <div className="border-b px-3 py-2 text-xs font-medium bg-muted/60 text-right">
                        {row.label}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-b px-3 py-2 text-xs font-medium bg-muted/60 text-left">
                        {row.label}
                      </div>
                      <div className="border-b px-3 py-2 text-xs text-right">
                        {row.value || "-"}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className=" border-t bg-muted/5">
        <div className="flex w-full flex-col gap-2  ">
          {(rawResult.toLowerCase().includes("sold") || rawResult.toLowerCase().includes("yet")) ? (
            <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {rawResult.toLowerCase() === "sold" ? t("status.soldPrice") : t("status.startPrice")}
              </div>
              <div
                className={cn(
                  "text-sm font-black px-2 py-0.5 rounded flex items-center gap-1",
                  isRtl ? 'flex-row-reverse' : '',
                  rawResult.toLowerCase() === "sold" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                )}
              >
                {(() => {
                  const price = rawResult.toLowerCase() === "sold" 
                    ? (vehicle.soldPrice || vehicle.startPrice || vehicle.translatedData?.startPrice) 
                    : (vehicle.startPrice || vehicle.translatedData?.startPrice);
                  
                  if (!price) return <span>{t("status.tbd")}</span>;
                  
                  // strip 'T' if present (e.g. from some auction formats)
                  const cleanPrice = price.toString().replace(/T/gi, '');
                  
                  return (
                    <>
                      {formatPrice(cleanPrice)}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="h-10 invisible" />
          )}

          <div className={`text-[10px] text-muted-foreground flex items-center justify-between border-t border-dashed pt-2 mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1 font-medium italic">
              {t("status.acceptanceEnds")}
            </span>
            <span className="font-bold text-neutral-700">
              {vehicle?.acceptancePeriod
                ? new Date(vehicle.acceptancePeriod).toLocaleDateString(locale)
                : "-"}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-dashed">
            {(settings?.whatsapp || settings?.phone || settings?.email) ? (
              <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {settings?.email && (
                  <Button
                    onClick={handleEmailContact}
                    variant="outline"
                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-1.5 transition-all active:scale-95"
                  >
                    <Mail className="size-4" />
                    {t("contact.email")}
                  </Button>
                )}
                {(settings?.whatsapp || settings?.phone) && (
                  <Button
                    onClick={handleWhatsAppContact}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <MessageCircle className="size-4" />
                    {t("contact.whatsapp")}
                  </Button>
                )}
              </div>
            ) : (
              <Button
                disabled
                variant="outline"
                className="w-full gap-2 opacity-50"
              >
                <MessageCircle className="size-4" />
                {t("contact.unavailable")}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
    </Link>

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="w-screen h-dvh max-w-none sm:max-w-none p-0 border-none bg-black/95 rounded-none" showCloseButton={false}>
          <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-50 flex items-center gap-2`}>
            {/* View Details directly from zoom dialog */}
            <Link href={`/products/${vehicle?.id}`}>
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md">
                {t("labels.viewDetails") || "View Details"}
              </Button>
            </Link>
            <AddToFavBtn vehicle={vehicle} />
          </div>
          <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-50`}>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsZoomOpen(false); }}
              aria-label="Close zoom"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center justify-center backdrop-blur-md border border-white/10"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex h-full w-full items-center justify-center p-0 md:p-8 relative">
            <Carousel
              setApi={setZoomApi}
              opts={{ loop: true, direction: isRtl ? 'rtl' : 'ltr' }}
              className="w-full h-full max-w-[100vw] mx-auto"
            >
              <CarouselContent className="h-full">
                {images.map((img, i: number) => (
                  <CarouselItem key={`zoom-${i}`} className="h-dvh flex items-center justify-center">
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.5}
                      maxScale={6}
                      centerZoomedOut={true}
                    >
                      {({ zoomIn, zoomOut, resetTransform }) => (
                        <div className="relative w-full h-[95vh] flex flex-col">
                          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={fixImageUrl(img.download_url) || ""}
                                alt={`${vehicle?.carMaker || 'vehicle'} zoomed ${i + 1}`}
                                className="object-contain w-full h-full select-none cursor-grab active:cursor-grabbing"
                                draggable={false}
                              />
                            </div>
                          </TransformComponent>
                          
                          <div className={`absolute bottom-[25%] ${isRtl ? 'left-4' : 'right-4'} z-50 flex flex-col gap-2 bg-black/50 p-2 rounded-xl backdrop-blur-md border border-white/10`}>
                            <button
                              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                              aria-label="Zoom in"
                              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <ZoomIn className="size-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                              aria-label="Zoom out"
                              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <ZoomOut className="size-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); resetTransform(); }}
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
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 md:left-10 bg-white/20 hover:bg-white/40 border-none text-white size-10 md:size-12 shadow-md flex" />
                  <CarouselNext className="right-4 md:right-10 bg-white/20 hover:bg-white/40 border-none text-white size-10 md:size-12 shadow-md flex" />
                </>
              )}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm z-50 flex items-center gap-2">
                {zoomCurrent + 1} / {images.length}
              </div>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

