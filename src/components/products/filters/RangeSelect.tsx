"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RangeSelectProps {
  items: string[];
  fromValue?: string;
  toValue?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  tCommon: (arg: string) => string;
}

export function RangeSelect({
  items,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  tCommon,
}: RangeSelectProps) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Select value={fromValue} onValueChange={onFromChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={tCommon('unselected')} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">{tCommon('unselected')}</SelectItem>
          {items.map((item) => (
            <SelectItem key={`from-${item}`} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={toValue} onValueChange={onToChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={tCommon('unselected')} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">{tCommon('unselected')}</SelectItem>
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
