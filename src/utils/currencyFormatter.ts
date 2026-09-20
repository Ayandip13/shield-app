/**
 * Format salary amount into Indian Rupee currency standard string (e.g., ₹18,000)
 */
export function formatSalary(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Not specified';
  }

  // Format using Indian Numbering System formatting (en-IN)
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `₹${formattedNumber}`;
}
