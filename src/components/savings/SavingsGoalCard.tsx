import { format } from 'date-fns'
import { Plus, Minus, TrendingUp, Pencil, Trash2 } from 'lucide-react'
import type { SavingsGoal } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface SavingsGoalCardProps {
  goal: SavingsGoal
  onEdit: (goal: SavingsGoal) => void
  onDelete: (goal: SavingsGoal) => void
  onDeposit: (goal: SavingsGoal) => void
  onWithdraw: (goal: SavingsGoal) => void
}

export function SavingsGoalCard({ goal, onEdit, onDelete, onDeposit, onWithdraw }: SavingsGoalCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const progress = goal.targetAmount > 0 
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0

  return (
    <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              <span role="img" aria-label={goal.name}>{goal.icon || '🎯'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{goal.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                ເປົ້າໝາຍລວມ {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="ແກ້ໄຂເປົ້າໝາຍ"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(goal)}
              className="rounded-full p-2 text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="ລຶບເປົ້າໝາຍ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold" style={{ color: goal.color }}>
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 w-full rounded-full bg-secondary/50 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: goal.color 
              }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
            <span>ຍັງເຫຼືອ {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}</span>
            {goal.targetDate && (
              <span>ສຳເລັດພາຍໃນ: {format(new Date(goal.targetDate), 'dd/MM/yyyy')}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
          <button 
            onClick={() => onWithdraw(goal)}
            className="flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <Minus className="h-4 w-4" />
            <span>ຖອນ</span>
          </button>
          <button 
            onClick={() => onDeposit(goal)}
            className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: goal.color }}
          >
            <Plus className="h-4 w-4" />
            <span>ອອມເພີ່ມ</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
