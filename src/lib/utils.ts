import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format ຈຳນວນເງິນຕາມສະກຸນເງິນ
 */
export function formatCurrency(amount: number, currency: string = 'LAK'): string {
  const config: Record<string, { locale: string; currency: string }> = {
    LAK: { locale: 'lo-LA', currency: 'LAK' },
    THB: { locale: 'th-TH', currency: 'THB' },
    USD: { locale: 'en-US', currency: 'USD' },
  }

  const { locale, currency: currencyCode } = config[currency] || config.LAK

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currency === 'LAK' ? 0 : 2,
    maximumFractionDigits: currency === 'LAK' ? 0 : 2,
  }).format(amount)
}

/**
 * Format ວັນທີ ເປັນ Lao locale
 */
export function formatDateLao(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('lo-LA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
