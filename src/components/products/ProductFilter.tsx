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
import { Trash, Loader2 } from "lucide-react";
import type { VehicleFilterParams } from "@/lib/actions";
import { useLocale, useTranslations } from "next-intl";

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
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { state, data, loading, handlers } = useProductFilters({
    onFilterChange,
    exclude,
    controlledParams,
  });

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
        {/* ── 8. Auction Status checklist (Moved to Top) ────────────────────── */}
        {!exclude.includes("auctionStatus") && (
          <div className="space-y-3">
            <SectionTitle title={t('auctionStatus')} />
            <ChecklistBox
              items={data.displayResults}
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
        {state.selectedChildIds.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title={t('model')} />
            {loading.loadingModels ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> {t('loadingModels')}
              </div>
            ) : data.modelItems.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                {t('noModels')}
              </p>
            ) : (
              <ChecklistBox
                items={data.modelItems.map((m) => m.name)}
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
