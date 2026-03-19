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

/**
 * Format numeric input string as grouped integer (e.g. 1000000 -> 1,000,000)
 */
export function formatIntegerInput(value: string): string {
  const digitsOnly = value.replace(/\D/g, '')
  if (!digitsOnly) return ''

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Number(digitsOnly))
}

/**
 * Parse grouped integer input string (e.g. 1,000,000 -> 1000000)
 */
export function parseIntegerInput(value: string): number {
  return Number(value.replace(/,/g, ''))
}
