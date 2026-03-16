import { Card, CardContent } from '../ui/card'
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BalanceCardProps {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function BalanceCard({ 
  totalIncome, 
  totalExpense, 
  balance
}: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className="glass-card border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">ຍອດເຫຼືອ</h3>
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        
        <div className="text-center mb-6">
          <p className={cn(
            "text-3xl font-bold",
            balance >= 0 ? "text-income" : "text-expense"
          )}>
            {formatCurrency(balance)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {balance >= 0 ? 'ມີເງິນເຫຼືອ' : 'ຂາດເງິນ'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-income/10 rounded-lg p-3 border border-income/20">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpCircle className="h-4 w-4 text-income" />
              <span className="text-sm text-income">ລາຍຮັບ</span>
            </div>
            <p className="text-lg font-semibold text-income">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          
          <div className="bg-expense/10 rounded-lg p-3 border border-expense/20">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownCircle className="h-4 w-4 text-expense" />
              <span className="text-sm text-expense">ລາຍຈ່າຍ</span>
            </div>
            <p className="text-lg font-semibold text-expense">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
