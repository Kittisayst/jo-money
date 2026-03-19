import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface NetWorthSummaryProps {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function NetWorthSummary({ totalAssets, totalLiabilities, netWorth }: NetWorthSummaryProps) {
  return (
    <Card className="glass-card w-full border-0 overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <h1 className="text-xl font-semibold text-foreground">ສະຖານະການເງິນ</h1>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-secondary/40 p-3">
            <p className="text-muted-foreground">ຊັບສິນລວມ</p>
            <p className="mt-1 break-words text-lg font-semibold text-income">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <p className="text-muted-foreground">ໜີ້ສິນລວມ</p>
            <p className="mt-1 break-words text-lg font-semibold text-expense">{formatCurrency(totalLiabilities)}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">ຊັບສິນສຸດທິ</p>
        <p
          className={cn(
            'break-words text-2xl font-bold',
            netWorth >= 0 ? 'text-income' : 'text-expense'
          )}
        >
          {formatCurrency(netWorth)}
        </p>
      </CardContent>
    </Card>
  )
}
