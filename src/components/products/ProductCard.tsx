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
import { MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLocale, useTranslations } from "next-intl";

import { ZoomDialog } from "./ZoomDialog";

type Props = {
  isFavorite?: boolean;
  vehicle: VehicleData;
};

export function ProductCard({ vehicle }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const locale = useLocale();
  const t = useTranslations("Vehicle");
  const isRtl = locale === 'ar';

  const images = vehicle?.images?.filter(img => img.download_url) || [];
  
  const lastHistory = vehicle?.statusHistory && vehicle.statusHistory.length > 0 
    ? vehicle.statusHistory[vehicle.statusHistory.length - 1] 
    : null;
  const rawResult = lastHistory?.result || "";
  
  // Localize the result if it's a known status
  const lastResult = rawResult.toLowerCase().includes("sold") ? t("status.sold") : rawResult;

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
    { label: t("labels.lotNumber"), value: vehicle?.lotNumber },
    { label: t("labels.vehicleType"), value: vehicle?.vehicleType },
    { label: t("labels.chassisId"), value: vehicle?.chassisId },
    { label: t("labels.hours"), value: vehicle?.workingHours },
    { label: t("labels.score"), value: vehicle?.score },
    { label: t("labels.year"), value: vehicle?.year },
    { label: t("labels.fuel"), value: vehicle?.fuel },
    { label: t("labels.size"), value: vehicle?.vehicleSize },
    { label: t("labels.inspection"), value: vehicle?.inspection },
  ];

  const settings = useSettingsStore((state) => state.settings);

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const contact = settings?.whatsapp || settings?.phone;
    const message = isRtl 
      ? `مرحباً، أنا مهتم بـ ${vehicle?.carMaker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id}). هل يمكنك تزويدي بمزيد من التفاصيل؟`
      : `Hello, I'm interested in the ${vehicle?.carMaker || ""} ${vehicle?.model || ""} (ID: ${vehicle?.id}). Could you provide more details?`;
    const finalUrl = formatWhatsAppUrl(contact, message);
    if (finalUrl) window.open(finalUrl, "_blank");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-2">
        {/* Top row: date + grade + favorite */}
        <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className=" font-semibold tracking-wide">
              {vehicle?.carMaker || "-"} {vehicle?.model || "-"}
            </div>
            <div className={`flex flex-wrap items-center gap-2 text-xs ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                {t("labels.lot")} {vehicle?.lotNumber || "-"}
              </span>
              <span className="text-muted-foreground uppercase font-medium">
                {vehicle?.auctionDay}
              </span>
              {lastHistory && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-tighter",
                  rawResult.toLowerCase().includes("sold") ? "bg-green-100 text-green-700" :
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
                      <ZoomDialog
                        src={fixImageUrl(img.download_url) || ""}
                        alt={vehicle?.carMaker || "vehicle"}
                      >
                        <Link
                          href={`/products/${vehicle?.id}`}
                          className="relative block overflow-hidden rounded-md border bg-muted aspect-4/3 cursor-zoom-in group/item"
                        >
                          <img
                            src={fixImageUrl(img.download_url) || ""}
                            alt={vehicle?.carMaker || "vehicle"}
                            className="object-cover w-full h-full transition-all duration-700 group-hover/item:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors duration-300 pointer-events-none" />
                        </Link>
                      </ZoomDialog>
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
            <div className={`grid ${isRtl ? 'grid-cols-[1fr_110px]' : 'grid-cols-[110px_1fr]'}`}>
              {labels.map((row, idx) => (
                <div key={`${row.label}-${idx}`} className="contents">
                  <div className={`border-b px-3 py-2 text-xs font-medium bg-muted/60 ${isRtl ? 'order-2 text-right' : 'order-1 text-left'}`}>
                    {row.label}
                  </div>
                  <div className={`border-b px-3 py-2 text-xs ${isRtl ? 'order-1 text-left' : 'order-2 text-right'}`}>
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
          {(rawResult.toLowerCase().includes("sold") || rawResult.toLowerCase().includes("yet")) ? (
            <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {rawResult.toLowerCase().includes("sold") ? t("status.soldPrice") : t("status.startPrice")}
              </div>
              <div
                className={cn(
                  "text-sm font-black px-2 py-0.5 rounded flex items-center gap-1",
                  isRtl ? 'flex-row-reverse' : '',
                  rawResult.toLowerCase().includes("sold") ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                )}
              >
                <span className="text-[10px] opacity-70 font-bold italic">{t("contact.currency")}</span>
                {rawResult.toLowerCase().includes("sold") 
                  ? (vehicle.soldPrice || vehicle.startPrice || vehicle.translatedData?.startPrice || t("status.tbd")) 
                  : (vehicle.startPrice || vehicle.translatedData?.startPrice || t("status.tbd"))}
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
            {settings?.whatsapp || settings?.phone ? (
              <Button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 transition-all active:scale-95 shadow-sm"
              >
                <MessageCircle className="size-4" />
                {t("contact.whatsapp")}
              </Button>
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
  );
}

