const defaultCurrency = 'USD';

export function formatCurrency(amount, currency = defaultCurrency) {
  const numericAmount = Number(amount ?? 0);
  const safeCurrency = currency || defaultCurrency;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrency,
      minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  }
}
