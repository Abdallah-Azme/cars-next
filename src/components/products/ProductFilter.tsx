"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Loader2, Search } from "lucide-react";
import type { VehicleFilterParams } from "@/lib/actions";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useProductFilters } from "@/hooks/use-product-filters";
import { SectionTitle } from "./filters/SectionTitle";
import { ChecklistBox } from "./filters/ChecklistBox";
import { RangeSelect } from "./filters/RangeSelect";

export function ProductFilters({
  onFilterChange,
  exclude = [],
  controlledParams = {},
}: {
  onFilterChange: (params: VehicleFilterParams) => void;
  exclude?: string[];
  controlledParams?: VehicleFilterParams;
}) {
  const t = useTranslations("Vehicle.inventory.filter");
  const tStatus = useTranslations("Vehicle.status");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const tLabels = useTranslations("Vehicle.labels");

  const { state, data, loading, handlers } = useProductFilters({
    onFilterChange,
    exclude,
    controlledParams,
  });

  const [localLotNumber, setLocalLotNumber] = useState(state.lotNumber || "");

  // Removed state sync effect to resolve cascading render warning
  // Initial value is already handled in useState initialization
  useEffect(() => {
    if (state.lotNumber !== undefined && state.lotNumber !== localLotNumber) {
        setLocalLotNumber(state.lotNumber);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lotNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localLotNumber !== state.lotNumber) {
        handlers.handleLotNumberChange(localLotNumber);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localLotNumber, state.lotNumber, handlers]);

  return (
    <div className="space-y-5" dir={isRtl ? "rtl" : "ltr"}>
      {/* header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-red-600">{t('title')}</h3>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={handlers.handleReset}
        >
          <Trash className="h-4 w-4" />
          {t('reset')}
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-6">
        {/* ── Search by Lot Number ────────────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle title={tLabels('lotNumber')} />
          <div className="relative">
            <Input
              placeholder={tCommon('search')}
              value={localLotNumber}
              onChange={(e) => setLocalLotNumber(e.target.value)}
              className={isRtl ? "pr-9" : "pl-9"}
            />
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRtl ? "right-3" : "left-3"
            )} />
          </div>
        </div>

        {/* ── 8. Auction Status checklist (Moved to Top) ────────────────────── */}
        {!exclude.includes("auctionStatus") && (
          <div className="space-y-3">
            <SectionTitle title={t('auctionStatus')} />
            <ChecklistBox
              items={data.displayResults.map((item) => {
                const key =
                  item.value === "Yet To Be Auctioned"
                    ? "yetToBeAuctioned"
                    : item.value === "Not Sold"
                      ? "notSold"
                      : item.value === "Sold"
                        ? "sold"
                        : null;
                return {
                  ...item,
                  label: key ? tStatus(key) : item.label,
                };
              })}
              selectedItems={state.selectedResults}
              onToggle={handlers.toggleResult}
            />
          </div>
        )}

        {/* ── 1. Parent Category ─────────────────────────────────────────── */}
        {!exclude.includes("parentCategory") && (
          <div className="space-y-3">
            <SectionTitle title={t('parentCategory')} />
            {loading.loadingParents ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> {tCommon('loading')}
              </div>
            ) : (
              <Select
                value={state.selectedParentId !== undefined ? String(state.selectedParentId) : ""}
                onValueChange={handlers.handleParentChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectCategoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {data.parentCategories.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* ── 2. Sub-Category ────────────────────────────────────────────── */}
        {!exclude.includes("subCategory") && state.selectedParentId !== undefined && (
          <div className="space-y-3">
            <SectionTitle title={t('subCategory')} />
            {loading.loadingChildren ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> {tCommon('loading')}
              </div>
            ) : (
              <ChecklistBox
                items={data.childCategories.map((c) => c.name)}
                selectedItems={data.childCategories
                  .filter((c) => state.selectedChildIds.includes(c.id))
                  .map((c) => c.name)}
                onToggle={handlers.handleChildToggle}
              />
            )}
          </div>
        )}

        {/* ── 3. Model checklist ─────────────────────────────────────────── */}
        {!exclude.includes("model") && data.displayModels.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title={t('model')} />
            {loading.loadingModels && state.selectedChildIds.length > 0 ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> {tCommon('loading')}
              </div>
            ) : (
              <ChecklistBox
                items={data.displayModels}
                selectedItems={state.selectedModels}
                onToggle={handlers.toggleModel}
                searchable
              />
            )}
          </div>
        )}

        {/* ── 4. Types ─────────────────── */}
        {data.displayTypes.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title={t('type')} />
            {loading.loadingFiltersByModel && state.selectedModels.length > 0 ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> {t('updatingTypes')}
              </div>
            ) : data.displayTypes.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                {t('noTypes')}
              </p>
            ) : (
              <ChecklistBox
                items={data.displayTypes}
                selectedItems={state.selectedTypes}
                onToggle={handlers.toggleType}
                searchable
              />
            )}
          </div>
        )}

        {/* ── 5. Year range ──────────────────────────────────────────────── */}
        {data.dynamicYears.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title={t('year')} />
            <RangeSelect
              items={data.dynamicYears}
              fromValue={state.yearFrom}
              toValue={state.yearTo}
              onFromChange={(v) => handlers.handleYearChange("from", v)}
              onToChange={(v) => handlers.handleYearChange("to", v)}
              tCommon={tCommon}
            />
          </div>
        )}
      </div>
    </div>
  );
}
