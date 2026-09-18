/**
 * Currency configuration and formatting for Vanta Footwear
 * Official Currency: Ghana Cedi (GH₵ / GHS)
 */

export const CURRENCY_SYMBOL = 'GH₵';
export const CURRENCY_CODE = 'GHS';

/**
 * Formats a monetary amount into Ghana Cedi (GH₵)
 * @param amount Numeric value to format
 * @param decimals Whether to include 2 decimal places (default: true)
 */
export function formatCedi(amount: number | string | null | undefined, decimals = true): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return `${CURRENCY_SYMBOL} 0.00`;

  if (decimals) {
    return `${CURRENCY_SYMBOL} ${num.toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  return `${CURRENCY_SYMBOL} ${Math.round(num).toLocaleString('en-GH')}`;
}

/**
 * Short format without space, e.g. GH₵240
 */
export function formatCediCompact(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0`;
  return `${CURRENCY_SYMBOL}${Math.round(num).toLocaleString('en-GH')}`;
}
