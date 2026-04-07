"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  getParentCategories,
  getChildCategories,
  getModelsByChildCategory,
  getFiltersByModels,
  type VehicleFilterParams,
} from "@/lib/actions";

type FilterValues = {
  selectedParentId?: number;
  selectedChildIds: number[];
  selectedModels: string[];
  selectedTypes: string[];
  selectedSizes: string[];
  selectedResults: string[];
  yearFrom?: string;
  yearTo?: string;
  hourFrom?: string;
  hourTo?: string;
  scoreFrom?: string;
  scoreTo?: string;
  lotNumber?: string;
};

// ── Hook interface ────────────────────────────────────────────────────────────
interface UseProductFiltersProps {
  onFilterChange: (params: VehicleFilterParams) => void;
  exclude?: string[];
  controlledParams?: VehicleFilterParams;
}

export function useProductFilters({
  onFilterChange,
  exclude = [],
  controlledParams = {},
}: UseProductFiltersProps) {
  // ── Single form instance replaces 12 × useState ───────────────────────────
  const form = useForm<FilterValues>({
    defaultValues: {
      selectedParentId: controlledParams.selectedParentId,
      selectedChildIds: controlledParams.selectedChildIds ?? [],
      selectedModels: controlledParams.selectedModels ?? [],
      selectedTypes: controlledParams.selectedTypes ?? [],
      selectedSizes: controlledParams.sizes ?? [],
      selectedResults:
        (controlledParams.results as string[]) ?? ["Yet To Be Auctioned"],
      yearFrom: controlledParams.yearFrom,
      yearTo: controlledParams.yearTo,
      hourFrom: controlledParams.hourFrom,
      hourTo: controlledParams.hourTo,
      scoreFrom: controlledParams.scoreFrom,
      scoreTo: controlledParams.scoreTo,
      lotNumber: controlledParams.lotNumber,
    },
  });

  // ── Sync when controlledParams changes from outside ───────────────────────
  // form.reset() applies the full object, so empty arrays are never skipped
  // (unlike the old truthy-guard approach).
  useEffect(() => {
    form.reset({
      selectedParentId: controlledParams.selectedParentId,
      selectedChildIds: controlledParams.selectedChildIds ?? [],
      selectedModels: controlledParams.selectedModels ?? [],
      selectedTypes: controlledParams.selectedTypes ?? [],
      selectedSizes: controlledParams.sizes ?? [],
      selectedResults:
        (controlledParams.results as string[]) ?? ["Yet To Be Auctioned"],
      yearFrom: controlledParams.yearFrom,
      yearTo: controlledParams.yearTo,
      hourFrom: controlledParams.hourFrom,
      hourTo: controlledParams.hourTo,
      scoreFrom: controlledParams.scoreFrom,
      scoreTo: controlledParams.scoreTo,
      lotNumber: controlledParams.lotNumber,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledParams]);

  // ── Reactive reads that drive query keys + return state ───────────────────
  const values = useWatch({ control: form.control });

  const selectedParentId = values.selectedParentId;
  const selectedChildIds = useMemo(() => values.selectedChildIds ?? [], [values.selectedChildIds]);
  const selectedModels = useMemo(() => values.selectedModels ?? [], [values.selectedModels]);

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: parentData, isLoading: loadingParents } = useQuery({
    queryKey: ["parentCategories"],
    queryFn: getParentCategories,
  });

  const { data: childData, isLoading: loadingChildren } = useQuery({
    queryKey: ["childCategories", selectedParentId],
    queryFn: () => getChildCategories(selectedParentId!),
    enabled: !!selectedParentId,
  });

  const { data: modelsDataResponse, isLoading: loadingModels } = useQuery({
    queryKey: ["modelsByChild", selectedChildIds],
    queryFn: () => getModelsByChildCategory(selectedChildIds),
    enabled: selectedChildIds.length > 0,
  });

  const { data: filtersByModelData, isLoading: loadingFiltersByModel } =
    useQuery({
      queryKey: ["filtersByModel", selectedModels],
      queryFn: () => getFiltersByModels(selectedModels),
      enabled: true,
    });

  const { data: allTypesData } = useQuery({
    queryKey: ["filtersByModel", []],
    queryFn: () => getFiltersByModels([]),
    enabled: true,
  });

  // ── Derived data ──────────────────────────────────────────────────────────
  const parentCategories = useMemo(() => parentData?.data?.data ?? [], [parentData]);
  const childCategories = useMemo(() => childData?.data?.data ?? [], [childData]);
  // modelsDataResponse.data is ActionResponse<{success, message, data: ModelsData}>
  // so .data.data is the object with { models, types, results, lotNumbers }
  const modelItems = useMemo(() => modelsDataResponse?.data?.data?.models ?? [], [modelsDataResponse]);
  const typesFromCategory = useMemo(() =>
    modelsDataResponse?.data?.data?.types?.map((t: { title: string }) => t.title) ?? [], [modelsDataResponse]);
  const dynamicResultsData = useMemo(() => modelsDataResponse?.data?.data?.results ?? [], [modelsDataResponse]);

  const dynamicFilters = useMemo(() =>
    filtersByModelData?.data?.data, [filtersByModelData]);
  const dynamicTypes = useMemo(() => dynamicFilters?.types.map((t) => t.title) ?? [], [dynamicFilters]);
  const allTypes = useMemo(() => allTypesData?.data?.data?.types.map((t) => t.title) ?? [], [allTypesData]);

  const allModels = useMemo(() => allTypesData?.data?.data?.models?.map((m: { title: string }) => m.title) ?? [], [allTypesData]);
  const subCatModels = useMemo(() => modelItems.map((m) => m.name), [modelItems]);

  const displayModels = useMemo(() =>
    selectedChildIds.length > 0
      ? subCatModels
      : allModels
  , [selectedChildIds, subCatModels, allModels]);

  const displayTypes = useMemo(() =>
    selectedModels.length > 0
      ? dynamicTypes
      : selectedChildIds.length > 0
        ? typesFromCategory
        : allTypes
  , [selectedModels, dynamicTypes, selectedChildIds, typesFromCategory, allTypes]);

  const displayResults = useMemo(() => (
    dynamicResultsData.length > 0
      ? dynamicResultsData.filter((r) => r !== "Sold By Nego")
      : ["Sold", "Not Sold", "Yet To Be Auctioned"]
  ).map((r) => ({
    label: r === "Yet To Be Auctioned" ? "Soon in Auction" : r,
    value: r,
  })), [dynamicResultsData]);

  const dynamicYears = useMemo(() => dynamicFilters?.years.map((y) => y.title) ?? [], [dynamicFilters]);

  // ── notify: reads committed form values synchronously ────────────────────
  // We still accept `overrides` because useWatch is async (next render).
  // Passing the new values explicitly ensures onFilterChange fires immediately.
  const notify = useCallback(
    (overrides: Partial<VehicleFilterParams>) => {
      const current = form.getValues();
      const params: VehicleFilterParams = {
        selectedParentId: current.selectedParentId,
        selectedChildIds: current.selectedChildIds,
        selectedModels: current.selectedModels,
        selectedTypes: current.selectedTypes,
        sizes: current.selectedSizes,
        results: current.selectedResults,
        yearFrom: current.yearFrom,
        yearTo: current.yearTo,
        hourFrom: current.hourFrom,
        hourTo: current.hourTo,
        scoreFrom: current.scoreFrom,
        scoreTo: current.scoreTo,
        lotNumber: current.lotNumber,
        ...overrides,
      };

      exclude.forEach((field) => {
        delete (params as Record<string, unknown>)[field];
      });

      onFilterChange(params);
    },
    [form, exclude, onFilterChange],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleParentChange = useCallback((val: string) => {
    const id = Number(val);
    form.setValue("selectedParentId", id);
    form.setValue("selectedChildIds", []);
    form.setValue("selectedModels", []);
    form.setValue("selectedTypes", []);
    notify({
      selectedParentId: id,
      selectedChildIds: [],
      selectedModels: [],
      selectedTypes: [],
    });
  }, [form, notify]);

  const handleChildToggle = useCallback((name: string, checked: boolean) => {
    const cat = childCategories.find((c) => c.name === name);
    if (!cat) return;
    const prev = form.getValues("selectedChildIds");
    const next = checked
      ? [...prev, cat.id]
      : prev.filter((id) => id !== cat.id);
    form.setValue("selectedChildIds", next);
    form.setValue("selectedModels", []);
    form.setValue("selectedTypes", []);
    notify({ selectedChildIds: next, selectedModels: [], selectedTypes: [] });
  }, [childCategories, form, notify]);

  const toggleModel = useCallback((name: string, checked: boolean) => {
    const prev = form.getValues("selectedModels");
    const next = checked ? [...prev, name] : prev.filter((m) => m !== name);
    form.setValue("selectedModels", next);
    form.setValue("selectedTypes", []);
    notify({ selectedModels: next, selectedTypes: [] });
  }, [form, notify]);

  const toggleType = useCallback((name: string, checked: boolean) => {
    const prev = form.getValues("selectedTypes");
    const next = checked ? [...prev, name] : prev.filter((t) => t !== name);
    form.setValue("selectedTypes", next);
    notify({ selectedTypes: next });
  }, [form, notify]);

  const toggleResult = useCallback((name: string, checked: boolean) => {
    const prev = form.getValues("selectedResults");
    const next = checked ? [...prev, name] : prev.filter((r) => r !== name);
    form.setValue("selectedResults", next);
    notify({ results: next });
  }, [form, notify]);

  const handleYearChange = useCallback((type: "from" | "to", v: string) => {
    const val = v === "all" ? undefined : v;
    if (type === "from") {
      form.setValue("yearFrom", val);
      notify({ yearFrom: val });
    } else {
      form.setValue("yearTo", val);
      notify({ yearTo: val });
    }
  }, [form, notify]);
  
  const handleLotNumberChange = useCallback((v: string) => {
    form.setValue("lotNumber", v);
    notify({ lotNumber: v });
  }, [form, notify]);

  const handleReset = useCallback(() => {
    const defaults: FilterValues = {
      selectedParentId: undefined,
      selectedChildIds: [],
      selectedModels: [],
      selectedTypes: [],
      selectedSizes: [],
      selectedResults: ["Yet To Be Auctioned"],
      yearFrom: undefined,
      yearTo: undefined,
      hourFrom: undefined,
      hourTo: undefined,
      scoreFrom: undefined,
      scoreTo: undefined,
      lotNumber: undefined,
    };
    form.reset(defaults);
    onFilterChange({ results: ["Yet To Be Auctioned"] });
  }, [form, onFilterChange]);

  // ── Return (identical shape to before — ProductFilter.tsx unchanged) ──────
  return useMemo(() => ({
    state: {
      selectedParentId: values.selectedParentId,
      selectedChildIds: values.selectedChildIds ?? [],
      selectedModels: values.selectedModels ?? [],
      selectedTypes: values.selectedTypes ?? [],
      selectedResults: values.selectedResults ?? [],
      yearFrom: values.yearFrom,
      yearTo: values.yearTo,
      lotNumber: values.lotNumber,
    },
    data: {
      parentCategories,
      childCategories,
      modelItems,
      displayModels,
      displayTypes,
      displayResults,
      dynamicYears,
    },
    loading: {
      loadingParents,
      loadingChildren,
      loadingModels,
      loadingFiltersByModel,
    },
    handlers: {
      handleParentChange,
      handleChildToggle,
      toggleModel,
      toggleType,
      toggleResult,
      handleYearChange,
      handleLotNumberChange,
      handleReset,
    },
  }), [
    values,
    parentCategories,
    childCategories,
    modelItems,
    displayModels,
    displayTypes,
    displayResults,
    dynamicYears,
    loadingParents,
    loadingChildren,
    loadingModels,
    loadingFiltersByModel,
    handleParentChange,
    handleChildToggle,
    toggleModel,
    toggleType,
    toggleResult,
    handleYearChange,
    handleLotNumberChange,
    handleReset,
  ]);
}
