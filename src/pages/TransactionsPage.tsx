import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Search, SlidersHorizontal, ArrowLeftRight, Loader2, X } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { cn } from '@/lib/utils'

import { useTransactionStore } from '@/store/transaction-store'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'
import { TransactionCard } from '@/components/transactions/TransactionCard'
import type { Transaction } from '@/types'

export default function TransactionsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { transactions, fetchTransactions, isLoading: isTxLoading, initialized: isTxInitialized } = useTransactionStore()
  const { categories, fetchCategories, isLoading: isCatLoading, initialized: isCatInitialized } = useCategoryStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // ໂຫຼດຂໍ້ມູນຄັ້ງທຳອິດ
  useEffect(() => {
    if (user) {
      if (!isTxInitialized && !isTxLoading) fetchTransactions(user.id)
      if (!isCatInitialized && !isCatLoading) fetchCategories(user.id)
    }
  }, [user, fetchTransactions, fetchCategories, isTxInitialized, isCatInitialized, isTxLoading, isCatLoading])

  const isLoading = isTxLoading || isCatLoading

  // ການກັ່ນຕອງ (Search) ແລະ ຈັດກຸ່ມ (Group by date) ຂໍ້ມູນ
  const groupedTransactions = useMemo(() => {
    // 1. ຄັດກອງຂໍ້ມູນ
    let filtered = transactions

    // ກັ່ນກອງຕາມ Type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }

    // ກັ່ນກອງຕາມ Category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.categoryId === filterCategory)
    }

    // ກັ່ນກອງຕາມ Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t => {
        const cat = categories.find(c => c.id === t.categoryId)
        return (
          t.note.toLowerCase().includes(term) ||
          cat?.name.toLowerCase().includes(term) ||
          t.amount.toString().includes(term)
        )
      })
    }
    // 2. ຈັດກຸ່ມຕາມວັນທີ
    const groups: Record<string, Transaction[]> = {}
    filtered.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = []
      }
      groups[t.date].push(t)
    })

    // 3. ຈັດລຽງວັນທີໃໝ່ຫາເກົ່າ
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    return sortedDates.map(date => {
      const parsedDate = new Date(date)
      let title = format(parsedDate, 'dd MMMM yyyy')
      if (isToday(parsedDate)) title = 'ມື້ນີ້'
      else if (isYesterday(parsedDate)) title = 'ມື້ວານນີ້'

      return {
        date,
        title,
        transactions: groups[date]
      }
    })
  }, [transactions, categories, searchTerm, filterType, filterCategory])

  const activeFiltersCount = (filterType !== 'all' ? 1 : 0) + (filterCategory !== 'all' ? 1 : 0)
  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-6 pb-24">
      {/* Header & Search */}
      <header className="space-y-4">
        <h1 className="text-2xl font-bold font-lao px-1">ລາຍການທັງໝົດ</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ຄົ້ນຫາລາຍການ, ໝວດໝູ່..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl bg-card/60 backdrop-blur-md pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50 focus:bg-card transition-all font-lao shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-xl bg-card/60 backdrop-blur-md border transition-all shadow-sm",
              activeFiltersCount > 0 ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-background/40 backdrop-blur-md" 
            onClick={() => setIsFilterOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-card/80 backdrop-blur-2xl border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] p-8 animate-in slide-in-from-bottom-full duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
            {/* Handle for bottom sheet on mobile */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold font-lao bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  ກັ່ນກອງລາຍການ
                </h2>
                <p className="text-sm text-muted-foreground font-lao mt-1">ເລືອກເງື່ອນໄຂທີ່ເຈົ້າຕ້ອງການ</p>
              </div>
              <button 
                onClick={() => {
                  setFilterType('all')
                  setFilterCategory('all')
                }}
                className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors font-lao py-2 px-3 bg-primary/10 rounded-full"
              >
                Reset ທັງໝົດ
              </button>
            </div>

            <div className="space-y-8">
              {/* Type Filter */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1 font-lao">ປະເພດລາຍການ</label>
                <div className="flex p-1.5 bg-secondary/30 rounded-2xl border border-white/5 backdrop-blur-md">
                  {[
                    { id: 'all', label: 'ທັງໝົດ' },
                    { id: 'income', label: 'ລາຍຮັບ' },
                    { id: 'expense', label: 'ລາຍຈ່າຍ' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFilterType(item.id as any)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold font-lao transition-all duration-300",
                        filterType === item.id 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1 font-lao">ໝວດໝູ່</label>
                <div className="grid grid-cols-2 gap-3 max-h-[16rem] overflow-y-auto pr-2 custom-scrollbar pb-2">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={cn(
                      "group relative py-4 px-4 rounded-2xl border transition-all duration-300 overflow-hidden",
                      filterCategory === 'all' 
                        ? "border-primary/50 bg-primary/10" 
                        : "border-white/5 bg-secondary/20 hover:border-white/20 hover:bg-secondary/40"
                    )}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <span className="text-2xl grayscale group-data-[selected=true]:grayscale-0 transition-all">📂</span>
                      <span className={cn(
                        "text-sm font-bold font-lao transition-colors",
                        filterCategory === 'all' ? "text-primary" : "text-muted-foreground"
                      )} data-selected={filterCategory === 'all'}>
                        ທຸກໝວດໝູ່
                      </span>
                    </div>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={cn(
                        "group relative py-4 px-4 rounded-2xl border transition-all duration-300 overflow-hidden",
                        filterCategory === cat.id 
                          ? "border-primary/50 bg-primary/10" 
                          : "border-white/5 bg-secondary/20 hover:border-white/20 hover:bg-secondary/40"
                      )}
                    >
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className={cn(
                          "text-sm font-bold font-lao transition-colors truncate w-full text-center",
                          filterCategory === cat.id ? "text-primary" : "text-muted-foreground"
                        )}>
                          {cat.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-[1.25rem] font-bold font-lao shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  ນຳໃຊ້ Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Content */}
      <main>
        {isLoading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-lao">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
          </div>
        ) : groupedTransactions.length > 0 ? (
          <div className="space-y-6">
            {groupedTransactions.map(group => (
              <section key={group.date} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground px-2 font-lao sticky top-[72px] bg-background/95 backdrop-blur-sm py-2 z-10 w-[max-content] rounded-lg">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.transactions.map(transaction => {
                    const category = categories.find(c => c.id === transaction.categoryId)
                    return (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        category={category}
                        onClick={() => navigate(`/transactions/${transaction.id}/edit`)} // ໃຫ້ກົດເຂົ້າໄປແກ້ໄຂໄດ້
                      />
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 mt-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 mb-4 shadow-inner">
                <ArrowLeftRight className="h-7 w-7 text-muted-foreground opacity-50" />
              </div>
              <h3 className="font-semibold mb-2 font-lao text-lg">
                {searchTerm ? 'ບໍ່ພົບລາຍການທີ່ຄົ້ນຫາ' : 'ຍັງບໍ່ມີລາຍການ'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[200px] font-lao">
                {searchTerm 
                  ? 'ລອງປ່ຽນຄຳຄົ້ນຫາໃໝ່ເບິ່ງອີກຄັ້ງ'
                  : 'ກົດປຸ່ມ + ດ້ານລຸ່ມ ເພື່ອເພີ່ມລາຍການທຳອິດຂອງທ່ານ'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
