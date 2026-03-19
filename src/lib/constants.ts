import type { Category } from '@/types'

/**
 * ໝວດລາຍຈ່າຍ ເລີ່ມຕົ້ນ
 */
export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'ອາຫານ', type: 'expense', icon: 'utensils', color: '#ef4444', sortOrder: 1 },
  { name: 'ຄ່າເດີນທາງ', type: 'expense', icon: 'car', color: '#f97316', sortOrder: 2 },
  { name: 'ຊ໋ອບປິ້ງ', type: 'expense', icon: 'shopping-bag', color: '#a855f7', sortOrder: 3 },
  { name: 'ບັນເທີງ', type: 'expense', icon: 'gamepad-2', color: '#ec4899', sortOrder: 4 },
  { name: 'ສຸຂະພາບ', type: 'expense', icon: 'heart-pulse', color: '#14b8a6', sortOrder: 5 },
  { name: 'ການສຶກສາ', type: 'expense', icon: 'graduation-cap', color: '#3b82f6', sortOrder: 6 },
  { name: 'ຄ່ານ້ຳ-ໄຟ', type: 'expense', icon: 'zap', color: '#eab308', sortOrder: 7 },
  { name: 'ອື່ນໆ', type: 'expense', icon: 'ellipsis', color: '#6b7280', sortOrder: 8 },
]

/**
 * ໝວດລາຍຮັບ ເລີ່ມຕົ້ນ
 */
export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'ເງິນເດືອນ', type: 'income', icon: 'banknote', color: '#22c55e', sortOrder: 1 },
  { name: 'ຟຣີແລນ', type: 'income', icon: 'laptop', color: '#06b6d4', sortOrder: 2 },
  { name: 'ທຸລະກິດ', type: 'income', icon: 'briefcase', color: '#8b5cf6', sortOrder: 3 },
  { name: 'ອື່ນໆ', type: 'income', icon: 'ellipsis', color: '#6b7280', sortOrder: 4 },
]

/**
 * ຕັ້ງຄ່າສະກຸນເງິນ
 */
export const CURRENCY_CONFIG = {
  LAK: { symbol: '₭', name: 'ກີບ', locale: 'lo-LA' },
  THB: { symbol: '฿', name: 'ບາດ', locale: 'th-TH' },
  USD: { symbol: '$', name: 'ໂດລາ', locale: 'en-US' },
} as const

export type CurrencyCode = keyof typeof CURRENCY_CONFIG

/**
 * ຊື່ໜ້າ ສຳລັບ Header
 */
export const PAGE_TITLES: Record<string, string> = {
  '/': 'ໜ້າຫຼັກ',
  '/transactions': 'ລາຍການ',
  '/add': 'ເພີ່ມລາຍການ',
  '/reports': 'ລາຍງານ',
  '/savings': 'ການເງິນ',
  '/assets': 'ການເງິນ',
  '/liabilities': 'ການເງິນ',
  '/net-worth': 'ການເງິນ',
  '/financial-health': 'ການເງິນ',
  '/settings': 'ຕັ້ງຄ່າ',
  '/settings/profile': 'ຂໍ້ມູນສ່ວນຕົວ',
  '/settings/categories': 'ໝວດໝູ່',
  '/settings/change-password': 'ປ່ຽນລະຫັດຜ່ານ',
  '/login': 'ເຂົ້າສູ່ລະບົບ',
  '/register': 'ລົງທະບຽນ',
}
