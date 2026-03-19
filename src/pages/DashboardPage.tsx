import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Loader2, PiggyBank, Landmark, HeartPulse, Settings } from 'lucide-react'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { SummaryChart } from '@/components/dashboard/SummaryChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { useTransactionStore } from '@/store/transaction-store'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'

const quickLinks = [
  { path: '/savings', icon: PiggyBank, label: 'ອອມເງິນ', color: 'text-emerald-500 bg-emerald-500/10' },
  { path: '/net-worth', icon: Landmark, label: 'ສະຖານະ', color: 'text-blue-500 bg-blue-500/10' },
  { path: '/financial-health', icon: HeartPulse, label: 'ສຸຂະພາບ', color: 'text-rose-500 bg-rose-500/10' },
  { path: '/settings', icon: Settings, label: 'ຕັ້ງຄ່າ', color: 'text-orange-500 bg-orange-500/10' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
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

      {/* Quick Links */}
      <div className="grid grid-cols-4 gap-2">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-card/60 p-3 transition-all hover:bg-card active:scale-95 border border-border/10"
            >
              <div className={`rounded-lg p-2 ${link.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{link.label}</span>
            </button>
          )
        })}
      </div>

      <RecentTransactions
        transactions={transactions}
        categories={categories}
        limit={5}
      />
    </div>
  )
}
