import { useEffect, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { SummaryChart } from '@/components/dashboard/SummaryChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { useTransactionStore } from '@/store/transaction-store'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { transactions, fetchTransactions, initialized: isTxInitialized, isLoading: isTxLoading } = useTransactionStore()
  const { categories, fetchCategories, initialized: isCatInitialized, isLoading: isCatLoading } = useCategoryStore()

  useEffect(() => {
    if (user) {
      if (!isTxInitialized && !isTxLoading) fetchTransactions(user.id)
      if (!isCatInitialized && !isCatLoading) fetchCategories(user.id)
    }
  }, [user, fetchTransactions, fetchCategories, isTxInitialized, isCatInitialized, isTxLoading, isCatLoading])

  // Memoize summary calculations to avoid recalculation on every render
  const summary = useMemo(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= firstDay && transactionDate <= lastDay
    })

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    return { totalIncome, totalExpense, balance }
  }, [transactions])

  // Memoize chart data calculations
  const chartData = useMemo(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= firstDay && transactionDate <= lastDay
    })

    const categoryTotals = new Map()

    monthTransactions.forEach(transaction => {
      const category = categories.find(cat => cat.id === transaction.categoryId)
      if (category) {
        const key = category.id
        const current = categoryTotals.get(key) || { ...category, value: 0 }
        current.value += transaction.amount
        categoryTotals.set(key, current)
      }
    })

    return Array.from(categoryTotals.values())
  }, [transactions, categories])

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      <BalanceCard
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
        balance={summary.balance}
      />

      <SummaryChart 
        data={chartData}
        title="ສະຫຼຸບເດືອນນີ້"
      />

      <RecentTransactions
        transactions={transactions}
        categories={categories}
        limit={5}
      />
    </div>
  )
}
