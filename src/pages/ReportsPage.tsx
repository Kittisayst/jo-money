import { useEffect, useState, useMemo, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { PeriodSelector, type PeriodType } from '@/components/reports/PeriodSelector'
import { MonthlyChart } from '@/components/reports/MonthlyChart'
import { CategoryPieChart } from '@/components/reports/CategoryPieChart'
import { useTransactionStore } from '@/store/transaction-store'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'
import type { Category } from '@/types'

export default function ReportsPage() {
  const { user } = useAuthStore()
  const { transactions, fetchTransactions, initialized: isTxInitialized, isLoading: isTxLoading } = useTransactionStore()
  const { categories, fetchCategories, initialized: isCatInitialized, isLoading: isCatLoading } = useCategoryStore()
  
  const [period, setPeriod] = useState<PeriodType>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  // Memoize period data calculation
  const periodData = useMemo(() => {
    const startDate = new Date(currentDate)
    const endDate = new Date(currentDate)

    switch (period) {
      case 'day':
        // Same day
        break
      case 'week':
        // Start of week to end of week
        const dayOfWeek = startDate.getDay()
        startDate.setDate(startDate.getDate() - dayOfWeek)
        endDate.setDate(endDate.getDate() + (6 - dayOfWeek))
        break
      case 'month':
        // Start of month to end of month
        startDate.setDate(1)
        endDate.setMonth(endDate.getMonth() + 1, 0)
        break
      case 'year':
        // Start of year to end of year
        startDate.setMonth(0, 1)
        endDate.setMonth(11, 31)
        break
    }

    return { startDate, endDate }
  }, [period, currentDate])

  // Memoize monthly chart data
  const monthlyData = useMemo(() => {
    const { startDate, endDate } = periodData
    
    // Filter transactions by period
    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })

    // Group by month
    const monthlyDataMap = new Map<string, { income: number; expense: number }>()
    
    periodTransactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7) // YYYY-MM
      const current = monthlyDataMap.get(monthKey) || { income: 0, expense: 0 }
      
      if (transaction.type === 'income') {
        current.income += transaction.amount
      } else {
        current.expense += transaction.amount
      }
      
      monthlyDataMap.set(monthKey, current)
    })

    // Convert to array and sort
    return Array.from(monthlyDataMap.entries())
      .map(([month, data]) => ({
        name: new Date(month + '-01').toLocaleDateString('lo-LA', { month: 'short' }),
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [periodData, transactions])

  // Memoize category data function
  const getCategoryData = useCallback((type: 'income' | 'expense') => {
    const { startDate, endDate } = periodData
    
    // Filter transactions by period and type
    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && 
             transactionDate <= endDate && 
             t.type === type
    })

    // Group by category
    const categoryTotals = new Map<string, { value: number; category: Category }>()
    
    periodTransactions.forEach(transaction => {
      const category = categories.find(cat => cat.id === transaction.categoryId)
      if (category) {
        const current = categoryTotals.get(category.id) || { value: 0, category }
        current.value += transaction.amount
        categoryTotals.set(category.id, current)
      }
    })

    // Calculate total for percentage
    const total = Array.from(categoryTotals.values()).reduce((sum, { value }) => sum + value, 0)

    // Convert to array and sort by value
    return Array.from(categoryTotals.values())
      .map(({ value, category }) => ({
        name: category.name,
        value,
        color: category.color,
        icon: category.icon,
        type,
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value)
  }, [periodData, transactions, categories])

  // Memoize category data to avoid recalculation
  const incomeCategoryData = useMemo(() => getCategoryData('income'), [getCategoryData])
  const expenseCategoryData = useMemo(() => getCategoryData('expense'), [getCategoryData])

  // Memoize fetch function
  const fetchData = useCallback(() => {
    if (user) {
      if (!isTxInitialized && !isTxLoading) fetchTransactions(user.id)
      if (!isCatInitialized && !isCatLoading) fetchCategories(user.id)
    }
  }, [user, fetchTransactions, fetchCategories, isTxInitialized, isCatInitialized, isTxLoading, isCatLoading])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
      {/* Period Selector */}
      <PeriodSelector
        value={period}
        onChange={setPeriod}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      {/* Monthly Chart */}
      <MonthlyChart
        data={monthlyData}
        title="ລາຍຮັບ vs ລາຍຈ່າຍ"
      />

      {/* Category Pie Charts */}
      <div className="grid grid-cols-1 gap-4">
        <CategoryPieChart
          data={incomeCategoryData}
          type="income"
          title="ລາຍຮັບຕາມໝວດ"
        />
        
        <CategoryPieChart
          data={expenseCategoryData}
          type="expense"
          title="ລາຍຈ່າຍຕາມໝວດ"
        />
      </div>
    </div>
  )
}
