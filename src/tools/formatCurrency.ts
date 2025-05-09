export function formatCurrency(amount: number, locale: string, currency: string): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error) {
    console.error(`Error formatting currency for locale ${locale} and currency ${currency}:`, error);
    return amount.toLocaleString(locale, options);
  }
}
