import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
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

import Image from "next/image";

interface FilterItemProps {
  label: string;
  count?: number;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  icon?: React.ReactNode;
}

const FilterItem = ({ label, isSelected, onSelect, icon }: FilterItemProps) => {
  // Normalize label for image filename (e.g. "Wheel Loader" -> "wheel-loader")
  const imageName = label.toLowerCase().replace(/\s+/g, "-");
  const imageUrl = `/images/categories/${imageName}.jpg`;
  const defaultImageUrl = "/images/categories/default.jpg";

  const [imgSrc, setImgSrc] = React.useState(imageUrl);
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      onClick={() => onSelect(!isSelected)}
      className={cn(
        "group relative flex min-w-[160px] cursor-pointer flex-col items-center gap-4 rounded-3xl border-2 p-6 transition-all duration-500",
        isSelected
          ? "border-red-600 bg-red-50/50 shadow-xl ring-4 ring-red-600/5 -translate-y-1"
          : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2",
      )}
    >
      <div
        className={cn(
          "relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 shadow-inner group-hover:shadow-md",
          isSelected
            ? "bg-red-600 text-white shadow-red-200/50"
            : "bg-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500",
        )}
      >
        {!imgError ? (
          <Image
            src={imgSrc}
            alt={label}
            width={100}
            height={100}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
            onError={() => {
              if (imgSrc !== defaultImageUrl) {
                setImgSrc(defaultImageUrl);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="p-4 transition-transform duration-500 group-hover:scale-110">
            {icon || <Package className="h-10 w-10" />}
          </div>
        )}

        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <span
        className={cn(
          "text-center text-[13px] font-black uppercase tracking-widest leading-none px-2 drop-shadow-sm",
          isSelected
            ? "text-red-700"
            : "text-gray-500 group-hover:text-gray-900",
        )}
      >
        {label}
      </span>

      <div className="absolute right-4 top-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(!!checked)}
          className={cn(
            "h-6 w-6 rounded-full border-2 border-gray-200 transition-all duration-500",
            isSelected &&
              "border-red-600 bg-red-600 data-[state=checked]:bg-red-600 scale-125 shadow-lg shadow-red-400/30",
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

interface HorizontalFiltersProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string, checked: boolean) => void;
}

export function HorizontalFilterRow({
  title,
  items,
  selectedItems,
  onToggle,
}: HorizontalFiltersProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          {title}
        </h3>
        {selectedItems.length > 0 && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100 uppercase">
            {selectedItems.length} Selected
          </span>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4 py-4">
          {items.map((item) => (
            <FilterItem
              key={item}
              label={item}
              isSelected={selectedItems.includes(item)}
              onSelect={(checked) => onToggle(item, checked)}
              icon={
                iconMap[item.toUpperCase()] || <Package className="h-6 w-6" />
              }
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
