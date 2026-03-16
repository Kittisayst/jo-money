import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

interface TransactionCardProps {
  transaction: Transaction
  category?: Category
  onClick?: () => void
}

export function TransactionCard({ transaction, category, onClick }: TransactionCardProps) {
  const isIncome = transaction.type === 'income'

  // Formatting amount with Intl.NumberFormat
  const formattedAmount = new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK', // Default to LAK for MVP (ສາມາດດຶງຈາກ User settings ໄດ້ພາຍຫຼັງ)
    maximumFractionDigits: 0
  }).format(transaction.amount)

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 glass-card cursor-pointer transition-all hover:bg-white/5 active:scale-[0.98]",
        !onClick && "cursor-default hover:bg-transparent active:scale-100"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div 
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm"
          style={{ 
            backgroundColor: category ? `${category.color}20` : 'hsl(var(--muted)/0.1)',
            color: category ? category.color : 'hsl(var(--foreground))'
          }}
        >
          {category?.icon || '📦'}
        </div>
        
        {/* Details */}
        <div className="flex flex-col">
          <span className="font-semibold text-[15px] font-lao block">
            {category?.name || 'ບໍ່ລະບຸໝວດໝູ່'}
          </span>
          {transaction.note && (
            <span className="text-sm text-muted-foreground line-clamp-1 font-lao mt-0.5">
              {transaction.note}
            </span>
          )}
        </div>
      </div>

      {/* Amount & Date */}
      <div className="flex flex-col items-end">
        <span className={cn(
          "font-bold text-[16px]",
          isIncome ? "text-income" : "text-foreground"
        )}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </span>
        <span className="text-xs text-muted-foreground mt-1 font-lao">
          {format(new Date(transaction.date), 'dd MMM')}
        </span>
      </div>
    </div>
  )
}
