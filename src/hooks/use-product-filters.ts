"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getParentCategories,
  getChildCategories,
  getModelsByChildCategory,
  getFiltersByModels,
  type VehicleFilterParams,
  type ParentCategory,
  type ChildCategory,
  type ModelItem,
  type FiltersByModelData,
} from "@/lib/actions";

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
  // ── category hierarchy state ──────────────────────────────────────────────
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>(
    controlledParams.selectedParentId,
  );
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>(
    controlledParams.selectedChildIds || [],
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
  useEffect(() => {
    if (controlledParams.selectedParentId !== undefined)
      setSelectedParentId(controlledParams.selectedParentId);
    if (controlledParams.selectedChildIds)
      setSelectedChildIds(controlledParams.selectedChildIds);
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

  // Queries
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

  // Derived data
  const parentCategories: ParentCategory[] = parentData?.data?.data ?? [];
  const childCategories: ChildCategory[] = childData?.data?.data ?? [];
  const modelItems: ModelItem[] = modelsDataResponse?.data?.data?.models ?? [];
  const typesFromCategory = modelsDataResponse?.data?.data?.types?.map((t) => t.title) ?? [];
  const dynamicResultsData = modelsDataResponse?.data?.data?.results ?? [];

  const dynamicFilters: FiltersByModelData | undefined = filtersByModelData?.data?.data;
  const dynamicTypes = dynamicFilters?.types.map((t) => t.title) ?? [];
  const allTypes = allTypesData?.data?.data?.types.map((t) => t.title) ?? [];
  
  const displayTypes = 
    selectedModels.length > 0 ? dynamicTypes : 
    selectedChildIds.length > 0 ? typesFromCategory : 
    allTypes;

  const displayResults = (dynamicResultsData.length > 0 
    ? dynamicResultsData.filter(r => r !== "Sold By Nego") 
    : ["Sold", "Not Sold", "Yet To Be Auctioned"]
  ).map(r => ({ 
    label: r === "Yet To Be Auctioned" ? "Soon in Auction" : r, 
    value: r 
  }));

  const dynamicYears = dynamicFilters?.years.map((y) => y.title) ?? [];

  const notify = (overrides: Partial<VehicleFilterParams>) => {
    const params: VehicleFilterParams = {
      selectedParentId,
      selectedChildIds,
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

    exclude.forEach((field) => {
      delete (params as Record<string, unknown>)[field];
    });

    onFilterChange(params);
  };

  // Handlers
  const handleParentChange = (val: string) => {
    const id = Number(val);
    setSelectedParentId(id);
    setSelectedChildIds([]);
    setSelectedModels([]);
    setSelectedTypes([]);
    notify({ selectedParentId: id, selectedChildIds: [], selectedModels: [], selectedTypes: [] });
  };

  const handleChildToggle = (name: string, checked: boolean) => {
    const cat = childCategories.find((c) => c.name === name);
    if (!cat) return;
    const next = checked
      ? [...selectedChildIds, cat.id]
      : selectedChildIds.filter((id) => id !== cat.id);
    setSelectedChildIds(next);
    setSelectedModels([]);
    setSelectedTypes([]);
    notify({ selectedChildIds: next, selectedModels: [], selectedTypes: [] });
  };

  const toggleModel = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedModels, name]
      : selectedModels.filter((m) => m !== name);
    setSelectedModels(next);
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

  const toggleResult = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedResults, name]
      : selectedResults.filter((r) => r !== name);
    setSelectedResults(next);
    notify({ results: next });
  };

  const handleYearChange = (type: "from" | "to", v: string) => {
    const val = v === "all" ? undefined : v;
    if (type === "from") {
      setYearFrom(val);
      notify({ yearFrom: val });
    } else {
      setYearTo(val);
      notify({ yearTo: val });
    }
  };

  const handleReset = () => {
    setSelectedParentId(undefined);
    setSelectedChildIds([]);
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
    onFilterChange({});
  };

  return {
    state: {
      selectedParentId,
      selectedChildIds,
      selectedModels,
      selectedTypes,
      selectedResults,
      yearFrom,
      yearTo,
    },
    data: {
      parentCategories,
      childCategories,
      modelItems,
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
      handleReset,
    },
  };
}
