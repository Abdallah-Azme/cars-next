import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, fixImageUrl } from "@/lib/utils";
import {
  Tractor,
  Truck,
  Car,
  Bike,
  Wrench,
  Construction,
  Sprout,
  Bug,
  Scissors,
  Waves,
  Hammer,
  Package,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";


interface FilterItemProps {
  label: string;
  count?: number;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  icon?: React.ReactNode;
  apiImageUrl?: string | null;
  isRtl?: boolean;
}

const FilterItem = ({
  label,
  isSelected,
  onSelect,
  icon,
  apiImageUrl,
  isRtl,
}: FilterItemProps) => {
  // Normalize label for image filename (e.g. "Wheel Loader" -> "wheel-loader")
  const imageName = label.toLowerCase().replace(/\s+/g, "-");
  const localImageUrl = `/images/categories/${imageName}.jpg`;
  const defaultImageUrl = "/images/categories/default.jpg";

  const cleanApiUrl = fixImageUrl(apiImageUrl);
  const initialImgSrc = cleanApiUrl || localImageUrl;
  const [imgSrc, setImgSrc] = React.useState(initialImgSrc);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    const nextUrl = fixImageUrl(apiImageUrl) || localImageUrl;
    setImgSrc(nextUrl);
    setImgError(false);
  }, [apiImageUrl, localImageUrl]);

  return (
    <div
      onClick={() => onSelect(!isSelected)}
      className={cn(
        "group relative flex min-w-28 cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all duration-500",
        isSelected
          ? "border-red-600 bg-red-50/50 shadow-md ring-2 ring-red-600/10 -translate-y-1"
          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg hover:-translate-y-1",
      )}
    >
      <div
        className={cn(
          "relative flex size-12 items-center justify-center overflow-hidden rounded-xl transition-all duration-500 shadow-inner group-hover:shadow-md",
          isSelected
            ? "bg-red-600 text-white shadow-red-200/50"
            : "bg-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500",
        )}
      >
        {!imgError ? (
          <Image
            src={imgSrc}
            alt={label}
            width={48}
            height={48}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
            onError={() => {
              // Only try local fallback if some local images existed (but we saw they don't yet)
              // For now, let's just go straight to icon if the fixed API URL fails
              if (imgSrc !== defaultImageUrl) {
                setImgSrc(defaultImageUrl);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="p-3 transition-transform duration-500 group-hover:scale-110">
            {icon || <Package className="h-6 w-6" />}
          </div>
        )}

        {/* Shine overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <span
        className={cn(
          "text-center text-[10px] font-bold uppercase drop-shadow-sm line-clamp-2 px-1",
          isSelected
            ? "text-red-700"
            : "text-gray-500 group-hover:text-gray-900",
        )}
      >
        {label}
      </span>

      <div className={cn("absolute top-1.5", isRtl ? "left-1.5" : "right-1.5")}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(!!checked)}
          className={cn(
            "h-4 w-4 rounded-md border-2 border-gray-200 transition-all duration-500",
            isSelected &&
              "border-red-600 bg-red-600 data-[state=checked]:bg-red-600 scale-110 shadow-sm shadow-red-400/30",
          )}
        />
      </div>
    </div>
  );
};

const iconMap: Record<string, React.ReactNode> = {
  TRACTOR: <Tractor className="h-6 w-6" />,
  "COMBINE HARVESTER": <Construction className="h-6 w-6" />,
  "RICE PLANTING MACHINE": <Sprout className="h-6 w-6" />,
  ATTACHMENT: <Wrench className="h-6 w-6" />,
  TRUCK: <Truck className="h-6 w-6" />,
  CAR: <Car className="h-6 w-6" />,
  MOTORCYCLE: <Bike className="h-6 w-6" />,
  EXCAVATOR: <Hammer className="h-6 w-6" />,
  "MACHINE LAWN MOWER": <Scissors className="h-6 w-6" />,
  "AGRICULTURAL CARRIER": <Truck className="h-6 w-6" />,
  "TILLER CULTIVATOR": <Waves className="h-6 w-6" />,
  "PEST CONTROL MACHINE SPRAYER": <Bug className="h-6 w-6" />,
  CHIPPER: <Scissors className="h-6 w-6" />,
  TRENCHER: <Construction className="h-6 w-6" />,
  "POWER SPRAYER": <Bug className="h-6 w-6" />,
  "AGRICULTURAL MACHINERY": <Tractor className="h-6 w-6" />,
  "CONSTRUCTION MACHINERY": <Construction className="h-6 w-6" />,
};

export interface FilterItemData {
  name: string;
  image?: string | null;
}

interface HorizontalFiltersProps {
  title: string;
  items: FilterItemData[];
  selectedItems: string[];
  onToggle: (item: string, checked: boolean) => void;
  variant?: "scroll" | "grid";
}

export function HorizontalFilterRow({
  title,
  items,
  selectedItems,
  onToggle,
  variant = "scroll",
}: HorizontalFiltersProps) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          {title}
        </h3>
        {selectedItems.length > 0 && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100 uppercase">
            {selectedItems.length} {t("selected")}
          </span>
        )}
      </div>


      {variant === "grid" ? (
        <div className="flex flex-wrap gap-4 py-4">
          {items.map((item) => (
            <FilterItem
              key={item.name}
              label={item.name}
              apiImageUrl={item.image}
              isSelected={selectedItems.includes(item.name)}
              onSelect={(checked) => onToggle(item.name, checked)}
               isRtl={isRtl}
              icon={
                iconMap[item.name.toUpperCase()] || (
                  <Package className="h-6 w-6" />
                )
              }
            />
          ))}
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap pb-4" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex gap-4 py-4">
            {items.map((item) => (
              <FilterItem
                key={item.name}
                label={item.name}
                apiImageUrl={item.image}
                isSelected={selectedItems.includes(item.name)}
                onSelect={(checked) => onToggle(item.name, checked)}
                isRtl={isRtl}
                icon={
                  iconMap[item.name.toUpperCase()] || (
                    <Package className="h-6 w-6" />
                  )
                }
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      )}
    </div>
  );
}
