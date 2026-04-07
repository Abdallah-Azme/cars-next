import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback } from 'react';

interface CurrencyState {
  rates: Record<string, number>;
  selectedCurrency: string;
  setRates: (rates: Record<string, number>) => void;
  setSelectedCurrency: (curr: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      rates: { USD: 1 },
      selectedCurrency: 'USD',
      setRates: (rates) => set({ rates }),
      setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),
    }),
    {
      name: 'currency-storage',
    }
  )
);

export function useCurrency() {
  const { rates, selectedCurrency, setRates, setSelectedCurrency } = useCurrencyStore();

  const formatPrice = useCallback((price: string | number | undefined | null) => {
    if (price === undefined || price === null || price === '') return '';
    const str = price.toString();
    const numMatch = str.match(/[\d,.]+/);
    if (!numMatch) return str;

    const numPrice = parseFloat(numMatch[0].replace(/,/g, ''));
    if (isNaN(numPrice)) return str;

    const rate = rates[selectedCurrency] || 1;
    const converted = numPrice * rate;

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: selectedCurrency,
        maximumFractionDigits: 0,
      }).format(converted);
    } catch {
      return `${converted.toFixed(2)} ${selectedCurrency}`;
    }
  }, [rates, selectedCurrency]);

  return {
    formatPrice,
    rates,
    selectedCurrency,
    setRates,
    setSelectedCurrency,
  };
}
