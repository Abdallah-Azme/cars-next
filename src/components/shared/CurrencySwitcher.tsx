"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Coins, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/hooks/useCurrency";

export default function CurrencySwitcher() {
  const { rates, selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Coins size={18} className="text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider">USD</span>
      </Button>
    );
  }

  const availableCurrencies = Object.keys(rates);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Coins size={18} className="text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider">{selectedCurrency}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {availableCurrencies.map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all",
                selectedCurrency === curr
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}
            >
              <span className="font-semibold">{curr}</span>
              {selectedCurrency === curr && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
