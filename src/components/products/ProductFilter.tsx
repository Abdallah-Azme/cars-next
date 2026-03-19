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
import { Trash, Loader2, Check, ChevronsUpDown } from "lucide-react";
import * as React from "react"
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FiltersData } from "@/types/vehicles";
import type { VehicleFilterParams } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { getTypesByModel } from "@/lib/actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select item...",
  emptyMessage = "No item found.",
  disabled = false,
}: {
  items: string[];
  value?: string;
  onChange: (val: string | undefined) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !value ? "opacity-100" : "opacity-0"
                  )}
                />
                Unselected
              </CommandItem>
              {items.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? undefined : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CascadingTypes({ 
  model, 
  value, 
  onChange 
}: { 
  model?: string; 
  value?: string; 
  onChange: (val: string | undefined) => void 
}) {
  const { data, isFetching } = useQuery({
    queryKey: ["typesByModel", model],
    queryFn: () => getTypesByModel(model!),
    enabled: !!model,
  });

  if (!model) return null;

  return (
    <div className="space-y-3">
      <SectionTitle title="Type (Sub Category)" />
      <Combobox
        items={data?.data?.data || []}
        value={value}
        onChange={onChange}
        placeholder="Select a Type"
        emptyMessage="No type found."
        disabled={isFetching}
      />
      {isFetching && (
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading types...
        </div>
      )}
    </div>
  );
}

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
  height?: number | string;
}) {
  return (
    <div className="rounded-md border bg-background">
      <ScrollArea className="p-3 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {items.map((item) => {
            const id = item.replace(/\s+/g, "-").toLowerCase();

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

export function ProductFilters({
  filters,
  onFilterChange,
}: {
  filters: FiltersData;
  onFilterChange: (params: VehicleFilterParams) => void;
}) {
  const [selectedMakers, setSelectedMakers] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const [yearFrom, setYearFrom] = useState<string>();
  const [yearTo, setYearTo] = useState<string>();
  const [hourFrom, setHourFrom] = useState<string>();
  const [hourTo, setHourTo] = useState<string>();
  const [scoreFrom, setScoreFrom] = useState<string>();
  const [scoreTo, setScoreTo] = useState<string>();
  
  const [cascadingModel, setCascadingModel] = useState<string>();
  const [cascadingType, setCascadingType] = useState<string>();

  // NOTE: We derive the model list from the standard /vehicles/filters response (passed via props)
  // The /filters-by-model endpoint requires maker+model params and is for a different purpose.

  const notify = (overrides: Partial<VehicleFilterParams>) => {
    onFilterChange({
      makers: selectedMakers,
      models: selectedModels,
      types: selectedTypes,
      sizes: selectedSizes,
      yearFrom,
      yearTo,
      hourFrom,
      hourTo,
      scoreFrom,
      scoreTo,
      cascadingModel,
      cascadingType,
      ...overrides,
    });
  };

  const toggleItem = (
    value: string,
    checked: boolean,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    key: keyof VehicleFilterParams,
  ) => {
    const next = checked
      ? [...list, value]
      : list.filter((item) => item !== value);
    setList(next);
    notify({ [key]: next });
  };

  const handleReset = () => {
    setSelectedMakers([]);
    setSelectedModels([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setYearFrom(undefined);
    setYearTo(undefined);
    setHourFrom(undefined);
    setHourTo(undefined);
    setScoreFrom(undefined);
    setScoreTo(undefined);
    setCascadingModel(undefined);
    setCascadingType(undefined);
    onFilterChange({});
  };

  // Use the models list from the standard filters API (already fetched in ProductsSection and passed as prop)
  const dynamicModels = filters.models ?? [];

  return (
    <div className="space-y-5">
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
        {/* New Cascading Filters */}
        <div className="space-y-6">
          <div className="space-y-3">
            <SectionTitle title="Model (Main Category)" />
            <Combobox
              items={dynamicModels}
              value={cascadingModel}
              onChange={(val) => {
                setCascadingModel(val);
                setCascadingType(undefined);
                notify({ cascadingModel: val, cascadingType: undefined });
              }}
              placeholder="Select a Model"
              emptyMessage="No model found."
            />
          </div>

          {/* Types dropdown that relies on the selected Model */}
          <CascadingTypes 
            model={cascadingModel} 
            value={cascadingType}
            onChange={(val) => {
              setCascadingType(val);
              notify({ cascadingType: val });
            }}
          />
        </div>

        {/* Old Model and Type checklists replaced by cascading dropdowns above */}

        {!!filters.makers.length && (
          <div className="space-y-3">
            <SectionTitle title="Make" />
            <ChecklistBox
              items={filters.makers}
              selectedItems={selectedMakers}
              onToggle={(value, checked) =>
                toggleItem(
                  value,
                  checked,
                  selectedMakers,
                  setSelectedMakers,
                  "makers",
                )
              }
            />
          </div>
        )}

        {!!filters.years.length && (
          <div className="space-y-3">
            <SectionTitle title="Year" />
            <RangeSelect
              items={filters.years}
              fromValue={yearFrom}
              toValue={yearTo}
              onFromChange={(value) => {
                const v = value === "all" ? undefined : value;
                setYearFrom(v);
                notify({ yearFrom: v });
              }}
              onToChange={(value) => {
                const v = value === "all" ? undefined : value;
                setYearTo(v);
                notify({ yearTo: v });
              }}
            />
          </div>
        )}

        {!!filters.workingHours.length && (
          <div className="space-y-3">
            <SectionTitle title="Hour" />
            <RangeSelect
              items={filters.workingHours}
              fromValue={hourFrom}
              toValue={hourTo}
              onFromChange={(value) => {
                const v = value === "all" ? undefined : value;
                setHourFrom(v);
                notify({ hourFrom: v });
              }}
              onToChange={(value) => {
                const v = value === "all" ? undefined : value;
                setHourTo(v);
                notify({ hourTo: v });
              }}
            />
          </div>
        )}

        {!!filters.scores.length && (
          <div className="space-y-3">
            <SectionTitle title="Evaluation Points" />
            <RangeSelect
              items={filters.scores}
              fromValue={scoreFrom}
              toValue={scoreTo}
              onFromChange={(value) => {
                const v = value === "all" ? undefined : value;
                setScoreFrom(v);
                notify({ scoreFrom: v });
              }}
              onToChange={(value) => {
                const v = value === "all" ? undefined : value;
                setScoreTo(v);
                notify({ scoreTo: v });
              }}
            />
          </div>
        )}

        {!!filters.sizes.length && (
          <div className="space-y-3">
            <SectionTitle title="Size" />
            <ChecklistBox
              items={filters.sizes}
              selectedItems={selectedSizes}
              onToggle={(value, checked) =>
                toggleItem(
                  value,
                  checked,
                  selectedSizes,
                  setSelectedSizes,
                  "sizes",
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
