"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

interface ChecklistBoxProps {
  items: (string | { label: string; value: string })[];
  selectedItems: string[];
  onToggle: (value: string, checked: boolean) => void;
  searchable?: boolean;
  maxHeight?: string;
}

export function ChecklistBox({
  items,
  selectedItems,
  onToggle,
  searchable = false,
  maxHeight = "h-auto",
}: ChecklistBoxProps) {
  const [search, setSearch] = useState("");
  const locale = useLocale();
  const t = useTranslations("Common");
  const isRtl = locale === 'ar';

  const normalizedItems = items.map((i) =>
    typeof i === "string" ? { label: i, value: i } : i,
  );

  const filtered = normalizedItems.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rounded-md border bg-background p-4 space-y-3 overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {searchable && (
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn("h-8 text-xs focus-visible:ring-red-600", "text-start")}
        />
      )}
      <ScrollArea className={cn(maxHeight, isRtl ? "pl-4" : "pr-4", "overflow-hidden")} dir={isRtl ? "rtl" : "ltr"} >
        <div className="space-y-2">
          {filtered.map((item) => {
            const id = `chk-${item.value.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div key={item.value} className="flex items-center gap-2 py-0.5">
                <Checkbox
                  id={id}
                  checked={selectedItems.includes(item.value)}
                  onCheckedChange={(checked) => onToggle(item.value, !!checked)}
                />
                <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
                  {item.label}
                </Label>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center">
              No results found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
