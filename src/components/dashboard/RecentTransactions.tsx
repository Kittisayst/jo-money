import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { ArrowRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
  limit?: number
}

export function RecentTransactions({ 
  transactions, 
  categories, 
  limit = 5 
}: RecentTransactionsProps) {
  const navigate = useNavigate()

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTotalAmount = () => {
    return recentTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount)
    }, 0)
  }

  if (recentTransactions.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5" />
            ລາຍການລ່າສຸດ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <p>ຍັງບໍ່ມີລາຍການ</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/add')}
            >
              ເພີ່ມລາຍການໃໝ່
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5" />
          ລາຍການລ່າສຸດ
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ລວມທັງໝົດ</p>
            <p className={cn(
              "text-sm font-semibold",
              getTotalAmount() >= 0 ? "text-income" : "text-expense"
            )}>
              {formatCurrency(Math.abs(getTotalAmount()))}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.map((transaction) => {
          const category = categories.find(cat => cat.id === transaction.categoryId)
          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 cursor-pointer transition-colors"
              onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
            >
              <div className="text-2xl">{category?.icon || '📝'}</div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{transaction.note}</p>
                <p className="text-sm text-muted-foreground">{category?.name}</p>
              </div>
              <p className={cn(
                "font-semibold",
                transaction.type === 'income' ? "text-income" : "text-expense"
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          )
        })}
        
        {transactions.length > limit && (
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={() => navigate('/transactions')}
          >
            ເບິ່ງທັງໝົດ ({transactions.length - limit} ລາຍການ)
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
