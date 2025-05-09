"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import { logger } from "../utils/logger";

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  conversionRates: Record<string, number>;
  convert: (value: number, toCurrency: string) => number;
  format: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const localeCurrencyMap: Record<string, string> = {
  "id-ID": "IDR",
  "en-PH": "PHP",
  "th-TH": "THB",
  "en-US": "USD",
  "en-GB": "GBP",
  "fr-FR": "EUR",
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({ USD: 1 });

  useEffect(() => {
    const userLocale = navigator.language || "en-US";
    setLocale(userLocale);
    const detectedCurrency = localeCurrencyMap[userLocale] || "USD";
    setCurrency(detectedCurrency);

    const fetchConversionRates = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        setConversionRates(data.rates);
      } catch (error) {
        logger.error("Failed to fetch conversion rates:", error);
      }
    };

    fetchConversionRates();
  }, []);

  const convert = (value: number, toCurrency: string) => {
    if (!conversionRates[toCurrency]) return value;
    const rate = conversionRates[toCurrency];
    return value * rate;
  };

  const format = (value: number) => {
    return formatCurrency(value, locale, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, conversionRates, convert, format }}>
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
