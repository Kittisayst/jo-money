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
  email?: string
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
 * ເປົ້າໝາຍການອອມເງິນ
 */
export interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  icon: string
  color: string
  targetDate: string // YYYY-MM-DD
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

/**
 * ການຝາກ/ຖອນເງິນອອມ
 */
export interface SavingsTransaction {
  id: string
  userId: string
  goalId: string
  type: 'deposit' | 'withdraw'
  amount: number
  note: string
  date: string // YYYY-MM-DD
  createdAt: string
}

/**
 * ຊັບສິນ
 */
export interface Asset {
  id: string
  userId: string
  name: string
  type: 'cash' | 'bank' | 'investment' | 'property' | 'other'
  amount: number
  note: string
  createdAt: string
  updatedAt: string
}

/**
 * ໜີ້ສິນ
 */
export interface Liability {
  id: string
  userId: string
  name: string
  type: 'loan' | 'credit_card' | 'mortgage' | 'other'
  totalAmount: number
  remainingAmount: number
  dueDate: string // YYYY-MM-DD
  note: string
  createdAt: string
  updatedAt: string
}

/**
 * Response ຈາກ Google Sheet API
 */
export interface SheetResponse<T = unknown> {
  status: 'success' | 'error'
  message?: string
  data?: T
}
