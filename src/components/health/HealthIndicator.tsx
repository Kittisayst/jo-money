import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { HealthLevel } from '@/utils/finance-utils'

interface HealthIndicatorProps {
  title: string
  valueLabel: string
  subtitle: string
  level: HealthLevel
}

const levelStyles: Record<HealthLevel, { container: string; badge: string; text: string }> = {
  good: {
    container: 'border-income/20 bg-income/10',
    badge: 'bg-income/20 text-income',
    text: 'ດີ',
  },
  warning: {
    container: 'border-yellow-500/25 bg-yellow-500/10',
    badge: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    text: 'ປານກາງ',
  },
  critical: {
    container: 'border-expense/20 bg-expense/10',
    badge: 'bg-expense/20 text-expense',
    text: 'ຕ້ອງປັບປຸງ',
  },
}

export function HealthIndicator({ title, valueLabel, subtitle, level }: HealthIndicatorProps) {
  const styles = levelStyles[level]

  return (
    <Card className={cn('border', styles.container)}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', styles.badge)}>
            {styles.text}
          </span>
        </div>

        <p className="text-2xl font-bold text-foreground">{valueLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
