/**
 * ປະເພດລາຍການ
 */
export type TransactionType = 'income' | 'expense'

/**
 * ສະກຸນເງິນ
 */
export type Currency = 'LAK' | 'THB' | 'USD'

/**
 * Theme
 */
export type Theme = 'light' | 'dark'

/**
 * ພາສາ
 */
export type Language = 'lo' | 'en'

/**
 * ຂໍ້ມູນຜູ້ໃຊ້
 */
export interface User {
  id: string
  username: string
  password?: string
  displayName: string
  currency: Currency
  language: Language
  theme: Theme
  createdAt: string
}

/**
 * ລາຍການທຸລະກຳ
 */
export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  categoryId: string
  note: string
  date: string // YYYY-MM-DD
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

/**
 * ໝວດໝູ່
 */
export interface Category {
  id: string
  userId: string
  name: string
  type: TransactionType
  icon: string
  color: string
  sortOrder: number
}

/**
 * ຂໍ້ມູນສະຫຼຸບ Dashboard
 */
export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionsByCategory: {
    categoryId: string
    categoryName: string
    categoryColor: string
    categoryIcon: string
    total: number
    type: TransactionType
  }[]
  recentTransactions: Transaction[]
}

/**
 * Response ຈາກ Google Sheet API
 */
export interface SheetResponse<T = unknown> {
  status: 'success' | 'error'
  message?: string
  data?: T
}
