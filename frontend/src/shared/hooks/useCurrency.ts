import { useAppSelector } from '@/app/hooks';

export const useCurrency = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const currencySymbol = user?.tenant?.currencySymbol || '$';
  const currencyCode = user?.tenant?.currencyCode || 'USD';

  const formatCurrency = (amount: number | string) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${currencySymbol}${Number(value || 0).toLocaleString()}`;
  };

  return {
    currencySymbol,
    currencyCode,
    formatCurrency
  };
};
