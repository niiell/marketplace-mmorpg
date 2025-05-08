export function formatCurrency(value: number, locale: string, currency: string): string {
  try {
    const formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
    return formattedValue;
  } catch (error) {
    console.error(`Error formatting currency for locale ${locale} and currency ${currency}:`, error);
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}