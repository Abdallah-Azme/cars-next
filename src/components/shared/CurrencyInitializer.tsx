"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/hooks/useCurrency";

export default function CurrencyInitializer({
  rates,
}: {
  rates: Record<string, number>;
}) {
  const setRates = useCurrencyStore((state) => state.setRates);

  useEffect(() => {
    if (rates && Object.keys(rates).length > 0) {
      setRates(rates);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
