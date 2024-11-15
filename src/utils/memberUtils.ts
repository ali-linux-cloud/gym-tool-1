export const calculateEndDate = (startDate: string, duration: number): string => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + duration);
  return date.toISOString().split('T')[0];
};

export const isMembershipActive = (endDate: string): boolean => {
  const today = new Date();
  const membershipEnd = new Date(endDate);
  return membershipEnd >= today;
};

export const getDaysRemaining = (endDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
  }).format(amount);
};