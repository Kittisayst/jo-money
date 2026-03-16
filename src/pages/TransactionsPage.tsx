import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Search, SlidersHorizontal, ArrowLeftRight, Loader2 } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'

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
    // 1. ຄລອງຂໍ້ມູນຕາມຄຳຄົ້ນຫາ
    let filtered = transactions
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
  }, [transactions, categories, searchTerm])

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
              className="h-11 w-full rounded-xl bg-card/60 backdrop-blur-md pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-white/10 focus:border-primary/50 focus:bg-card transition-all font-lao shadow-sm"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-card/60 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-foreground transition-colors shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main>
        {isLoading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-white/40 font-lao">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
          </div>
        ) : groupedTransactions.length > 0 ? (
          <div className="space-y-6">
            {groupedTransactions.map(group => (
              <section key={group.date} className="space-y-3">
                <h3 className="text-sm font-medium text-white/50 px-2 font-lao sticky top-[72px] bg-background/95 backdrop-blur-sm py-2 z-10 w-[max-content] rounded-lg">
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
              <p className="text-sm text-white/40 max-w-[200px] font-lao">
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
