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
import { Trash } from "lucide-react";
import { useState } from "react";
import type { FiltersData } from "@/types/vehicles";
import type { VehicleFilterParams } from "@/lib/actions";

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
      <ScrollArea  className="p-3 max-h-96 overflow-y-auto">
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
    const next = checked ? [...list, value] : list.filter((item) => item !== value);
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
    onFilterChange({});
  };

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
        {!!filters.types.length && (
          <div className="space-y-3">
            <SectionTitle title="Category" />
            <ChecklistBox
              items={filters.types}
              selectedItems={selectedTypes}
              onToggle={(value, checked) =>
                toggleItem(value, checked, selectedTypes, setSelectedTypes, "types")
              }
            />
          </div>
        )}

        {!!filters.models.length && (
          <div className="space-y-3">
            <SectionTitle title="Model" />
            <ChecklistBox
              items={filters.models}
              selectedItems={selectedModels}
              onToggle={(value, checked) =>
                toggleItem(value, checked, selectedModels, setSelectedModels, "models")
              }
            />
          </div>
        )}

        {!!filters.makers.length && (
          <div className="space-y-3">
            <SectionTitle title="Make" />
            <ChecklistBox
              items={filters.makers}
              selectedItems={selectedMakers}
              onToggle={(value, checked) =>
                toggleItem(value, checked, selectedMakers, setSelectedMakers, "makers")
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
                toggleItem(value, checked, selectedSizes, setSelectedSizes, "sizes")
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
