"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VehicleData } from "@/types/vehicles";
import { Link } from "@/i18n/routing";
import RemoveFromFavBtn from "./RemoveFromFavBtn";
import { fixImageUrl } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  vehicle: VehicleData;
};

export function FavCard({ vehicle }: Props) {
  const locale = useLocale();
  const t = useTranslations("Vehicle");
  const isRtl = locale === 'ar';

  const labels = [
    { label: t("labels.vehicleType"), value: vehicle?.vehicleType },
    { label: t("labels.chassisId"), value: vehicle?.chassisId },
    { label: t("labels.hours"), value: vehicle?.workingHours },
    { label: t("labels.score"), value: vehicle?.score },
    { label: t("labels.year"), value: vehicle?.year },
    { label: t("labels.fuel"), value: vehicle?.fuel },
    { label: t("labels.size"), value: vehicle?.vehicleSize },
    { label: t("labels.inspection"), value: vehicle?.inspection },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-2">
        {/* Top row: date + grade + favorite */}
        <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
          <div className="space-y-1">
            <div className=" font-semibold tracking-wide">
              {vehicle?.carMaker || "-"} {vehicle?.model || "-"}
            </div>
            <div className="text-sm text-muted-foreground">
              {vehicle?.auctionDay}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RemoveFromFavBtn id={vehicle?.id} />
          </div>
        </div>

        <Separator className="my-3" />

        {/* Middle: specs table + image */}
        <div className="flex flex-col gap-4">
          {/* Image */}
          {(() => {
            const firstValidImg = vehicle?.images?.find((img) => img.download_url);
            if (!firstValidImg) return null;
            return (
              <Link
                href={`/products/${vehicle?.id}`}
                className="relative overflow-hidden rounded-md border bg-muted aspect-4/3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fixImageUrl(firstValidImg.download_url) || ""}
                  alt={vehicle?.carMaker || "vehicle"}
                  className="object-cover w-full h-full absolute inset-0 hover:scale-105 transition-all duration-300"
                />
              </Link>
            );
          })()}
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
          <div className={`text-xs text-muted-foreground flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span>{t("status.startPrice")}</span>
            <div className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
               <span className="text-[10px] opacity-70 font-bold italic">{t("contact.currency")}</span>
               <span className="text-sm font-semibold text-foreground">
                 {vehicle?.startPrice || vehicle?.translatedData?.startPrice || t("status.tbd")}
               </span>
            </div>
          </div>

          <div className={`text-[10px] text-muted-foreground flex items-center justify-between border-t border-dashed pt-2 mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1 font-medium italic">{t("status.acceptancePeriod")}</span>
            <span className="font-bold text-neutral-700">
              {vehicle?.acceptancePeriod ? new Date(vehicle.acceptancePeriod).toLocaleDateString(locale) : "-"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

