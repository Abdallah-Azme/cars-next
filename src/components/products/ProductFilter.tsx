"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Loader2 } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import type {
  VehicleFilterParams,
  ParentCategory,
  ChildCategory,
  ModelItem,
  FiltersByModelData,
} from "@/lib/actions";
import {
  getParentCategories,
  getChildCategories,
  getModelsByChildCategory,
  getFiltersByModels,
} from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

// ─── tiny helpers ────────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold">{title}</h4>
    </div>
  );
}

function ChecklistBox({
  items,
  selectedItems,
  onToggle,
}: {
  items: string[];
  selectedItems: string[];
  onToggle: (value: string, checked: boolean) => void;
}) {
  return (
    <div className="rounded-md border bg-background">
      <ScrollArea className="p-3 max-h-60 overflow-y-auto">
        <div className="space-y-2">
          {items.map((item) => {
            const id = `chk-${item.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div key={item} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={(checked) => onToggle(item, !!checked)}
                />
                <Label htmlFor={id} className="text-sm font-normal">
                  {item}
                </Label>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function RangeSelect({
  items,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
}: {
  items: string[];
  fromValue?: string;
  toValue?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Select value={fromValue} onValueChange={onFromChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Unselected" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">Unselected</SelectItem>
          {items.map((item) => (
            <SelectItem key={`from-${item}`} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={toValue} onValueChange={onToChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Unselected" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">Unselected</SelectItem>
          {items.map((item) => (
            <SelectItem key={`to-${item}`} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function ProductFilters({
  onFilterChange,
  exclude = [],
  controlledParams = {},
}: {
  onFilterChange: (params: VehicleFilterParams) => void;
  exclude?: string[];
  controlledParams?: VehicleFilterParams & {
    selectedParentId?: number;
    selectedChildId?: number;
  };
}) {
  // ── category hierarchy state ──────────────────────────────────────────────
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>(
    controlledParams.selectedParentId,
  );
  const [selectedChildId, setSelectedChildId] = useState<number | undefined>(
    controlledParams.selectedChildId,
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(
    controlledParams.selectedModels || [],
  );

  // ── side-filter state driven by filters-by-model ────────────────────────
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    controlledParams.selectedTypes || [],
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    controlledParams.sizes || [],
  );
  const [selectedResults, setSelectedResults] = useState<string[]>(
    (controlledParams.results as string[]) || [],
  );

  // ── range filter state ───────────────────────────────────────────────────
  const [yearFrom, setYearFrom] = useState<string | undefined>(
    controlledParams.yearFrom,
  );
  const [yearTo, setYearTo] = useState<string | undefined>(
    controlledParams.yearTo,
  );
  const [hourFrom, setHourFrom] = useState<string | undefined>(
    controlledParams.hourFrom,
  );
  const [hourTo, setHourTo] = useState<string | undefined>(
    controlledParams.hourTo,
  );
  const [scoreFrom, setScoreFrom] = useState<string | undefined>(
    controlledParams.scoreFrom,
  );
  const [scoreTo, setScoreTo] = useState<string | undefined>(
    controlledParams.scoreTo,
  );

  // Sync state with controlledParams
  React.useEffect(() => {
    if (controlledParams.selectedParentId !== undefined)
      setSelectedParentId(controlledParams.selectedParentId);
    if (controlledParams.selectedChildId !== undefined)
      setSelectedChildId(controlledParams.selectedChildId);
    if (controlledParams.selectedModels)
      setSelectedModels(controlledParams.selectedModels);
    if (controlledParams.selectedTypes)
      setSelectedTypes(controlledParams.selectedTypes);
    if (controlledParams.sizes) setSelectedSizes(controlledParams.sizes);
    if (controlledParams.results)
      setSelectedResults(controlledParams.results as string[]);
    setYearFrom(controlledParams.yearFrom);
    setYearTo(controlledParams.yearTo);
    setHourFrom(controlledParams.hourFrom);
    setHourTo(controlledParams.hourTo);
    setScoreFrom(controlledParams.scoreFrom);
    setScoreTo(controlledParams.scoreTo);
  }, [controlledParams]);

  // Restoring queries
  const { data: parentData, isLoading: loadingParents } = useQuery({
    queryKey: ["parentCategories"],
    queryFn: getParentCategories,
  });

  const { data: childData, isLoading: loadingChildren } = useQuery({
    queryKey: ["childCategories", selectedParentId],
    queryFn: () => getChildCategories(selectedParentId!),
    enabled: !!selectedParentId,
  });

  const { data: modelsData, isLoading: loadingModels } = useQuery({
    queryKey: ["modelsByChild", selectedChildId],
    queryFn: () => getModelsByChildCategory(selectedChildId!),
    enabled: !!selectedChildId,
  });

  const { data: filtersByModelData, isLoading: loadingFiltersByModel } =
    useQuery({
      queryKey: ["filtersByModel", selectedModels],
      queryFn: () => getFiltersByModels(selectedModels),
      enabled: selectedModels.length > 0,
    });

  const parentCategories: ParentCategory[] = parentData?.data?.data ?? [];
  const childCategories: ChildCategory[] = childData?.data?.data ?? [];
  const modelItems: ModelItem[] = modelsData?.data?.data ?? [];
  const dynamicFilters: FiltersByModelData | undefined =
    filtersByModelData?.data?.data;

  const dynamicTypes = dynamicFilters?.types.map((t) => t.title) ?? [];
  const dynamicSizes = dynamicFilters?.sizes.map((s) => s.title) ?? [];
  const dynamicYears = dynamicFilters?.years.map((y) => y.title) ?? [];
  const dynamicHours = dynamicFilters?.workingHours.map((h) => h.title) ?? [];
  const dynamicScores = dynamicFilters?.scores.map((s) => s.title) ?? [];

  const notify = (overrides: Partial<VehicleFilterParams>) => {
    const params: VehicleFilterParams = {
      selectedModels,
      selectedTypes,
      sizes: selectedSizes,
      results: selectedResults,
      yearFrom,
      yearTo,
      hourFrom,
      hourTo,
      scoreFrom,
      scoreTo,
      ...overrides,
    };

    // Remove excluded fields to avoid overwriting parent state
    exclude.forEach((field) => {
      delete (params as Record<string, any>)[field];
    });

    onFilterChange(params);
  };

  // ── toggle helpers ────────────────────────────────────────────────────────
  const toggleModel = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedModels, name]
      : selectedModels.filter((m) => m !== name);
    setSelectedModels(next);
    // reset dependent filters when model selection changes
    setSelectedTypes([]);
    notify({ selectedModels: next, selectedTypes: [] });
  };

  const toggleType = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedTypes, name]
      : selectedTypes.filter((t) => t !== name);
    setSelectedTypes(next);
    notify({ selectedTypes: next });
  };

  const toggleSize = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedSizes, name]
      : selectedSizes.filter((s) => s !== name);
    setSelectedSizes(next);
    notify({ sizes: next });
  };

  const toggleResult = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedResults, name]
      : selectedResults.filter((r) => r !== name);
    setSelectedResults(next);
    notify({ results: next });
  };

  // ── reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setSelectedParentId(undefined);
    setSelectedChildId(undefined);
    setSelectedModels([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSelectedResults([]);
    setYearFrom(undefined);
    setYearTo(undefined);
    setHourFrom(undefined);
    setHourTo(undefined);
    setScoreFrom(undefined);
    setScoreTo(undefined);
    onFilterChange({}); // Sending empty object to signal reset in parent
  };

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-red-600">Filters</h3>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={handleReset}
        >
          <Trash className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-6">
        {/* ── 1. Parent Category ─────────────────────────────────────────── */}
        {!exclude.includes("parentCategory") && (
          <div className="space-y-3">
            <SectionTitle title="Category" />
            {loadingParents ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
              </div>
            ) : (
              <Select
                value={
                  selectedParentId !== undefined ? String(selectedParentId) : ""
                }
                onValueChange={(val) => {
                  const id = Number(val);
                  setSelectedParentId(id);
                  setSelectedChildId(undefined);
                  setSelectedModels([]);
                  setSelectedTypes([]);
                  notify({ selectedModels: [], selectedTypes: [] });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category…" />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories.map((p) => (
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
        {!exclude.includes("subCategory") && selectedParentId !== undefined && (
          <div className="space-y-3">
            <SectionTitle title="Sub-Category" />
            {loadingChildren ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
              </div>
            ) : (
              <Select
                value={
                  selectedChildId !== undefined ? String(selectedChildId) : ""
                }
                onValueChange={(val) => {
                  const id = Number(val);
                  setSelectedChildId(id);
                  setSelectedModels([]);
                  setSelectedTypes([]);
                  notify({ selectedModels: [], selectedTypes: [] });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sub-category…" />
                </SelectTrigger>
                <SelectContent>
                  {childCategories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* ── 3. Model checklist ─────────────────────────────────────────── */}
        {selectedChildId !== undefined && (
          <div className="space-y-3">
            <SectionTitle title="Model" />
            {loadingModels ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading models…
              </div>
            ) : modelItems.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No models available.
              </p>
            ) : (
              <ChecklistBox
                items={modelItems.map((m) => m.name)}
                selectedItems={selectedModels}
                onToggle={toggleModel}
              />
            )}
          </div>
        )}

        {/* ── 4. Types (auto-updated when models change) ─────────────────── */}
        {selectedModels.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title="Type" />
            {loadingFiltersByModel ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Updating types…
              </div>
            ) : dynamicTypes.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No types available.
              </p>
            ) : (
              <ChecklistBox
                items={dynamicTypes}
                selectedItems={selectedTypes}
                onToggle={toggleType}
              />
            )}
          </div>
        )}

        {/* ── 5. Year range ──────────────────────────────────────────────── */}
        {dynamicYears.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title="Year" />
            <RangeSelect
              items={dynamicYears}
              fromValue={yearFrom}
              toValue={yearTo}
              onFromChange={(v) => {
                const val = v === "all" ? undefined : v;
                setYearFrom(val);
                notify({ yearFrom: val });
              }}
              onToChange={(v) => {
                const val = v === "all" ? undefined : v;
                setYearTo(val);
                notify({ yearTo: val });
              }}
            />
          </div>
        )}

        {/* ── 6. Working Hours range ─────────────────────────────────────── */}
        {dynamicHours.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title="Hour" />
            <RangeSelect
              items={dynamicHours}
              fromValue={hourFrom}
              toValue={hourTo}
              onFromChange={(v) => {
                const val = v === "all" ? undefined : v;
                setHourFrom(val);
                notify({ hourFrom: val });
              }}
              onToChange={(v) => {
                const val = v === "all" ? undefined : v;
                setHourTo(val);
                notify({ hourTo: val });
              }}
            />
          </div>
        )}

        {/* ── 7. Score range ─────────────────────────────────────────────── */}
        {dynamicScores.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title="Evaluation Points" />
            <RangeSelect
              items={dynamicScores}
              fromValue={scoreFrom}
              toValue={scoreTo}
              onFromChange={(v) => {
                const val = v === "all" ? undefined : v;
                setScoreFrom(val);
                notify({ scoreFrom: val });
              }}
              onToChange={(v) => {
                const val = v === "all" ? undefined : v;
                setScoreTo(val);
                notify({ scoreTo: val });
              }}
            />
          </div>
        )}

        {/* ── 8. Auction Status checklist ────────────────────────────────────── */}
        {!exclude.includes("auctionStatus") && (
          <div className="space-y-3">
            <SectionTitle title="Auction Status" />
            <ChecklistBox
              items={["Sold", "Yet To Be Auctioned"]}
              selectedItems={selectedResults}
              onToggle={toggleResult}
            />
          </div>
        )}
        {/* {dynamicSizes.length > 0 && (
          <div className="space-y-3">
            <SectionTitle title="Size" />
            <ChecklistBox
              items={dynamicSizes}
              selectedItems={selectedSizes}
              onToggle={toggleSize}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}
