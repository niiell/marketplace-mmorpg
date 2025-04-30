"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  conversionRates: Record<string, number>;
  convert: (value: number, toCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({ USD: 1 });

  useEffect(() => {
    // Fetch conversion rates from an API or use static rates
    // For example purposes, using static rates
    const rates = {
      USD: 1,
      IDR: 15000,
      PHP: 55,
      THB: 35,
      EUR: 0.9,
    };
    setConversionRates(rates);
  }, []);

  const convert = (value: number, toCurrency: string) => {
    if (!conversionRates[toCurrency]) return value;
    const rate = conversionRates[toCurrency];
    return value * rate;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, conversionRates, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
