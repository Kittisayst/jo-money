import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface NetWorthChartProps {
  totalAssets: number
  totalLiabilities: number
}

const COLORS = {
  assets: '#22c55e',
  liabilities: '#ef4444',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function NetWorthChart({ totalAssets, totalLiabilities }: NetWorthChartProps) {
  const data = [
    { name: 'ຊັບສິນ', value: Math.max(0, totalAssets), color: COLORS.assets },
    { name: 'ໜີ້ສິນ', value: Math.max(0, totalLiabilities), color: COLORS.liabilities },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <Card className="glass-card w-full border-0 overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <h2 className="text-base font-semibold text-foreground">ສັດສ່ວນຊັບສິນ vs ໜີ້ສິນ</h2>
          <div className="flex h-56 items-center justify-center text-muted-foreground">
            ບໍ່ມີຂໍ້ມູນສຳລັບກຣາຟ
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card w-full border-0 overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <h2 className="text-base font-semibold text-foreground">ສັດສ່ວນຊັບສິນ vs ໜີ້ສິນ</h2>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={88}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatCurrency(Number(value) || 0), String(name)]}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--background) / 0.95)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-secondary/40 p-2">
            <p className="text-muted-foreground">ຊັບສິນ</p>
            <p className="font-semibold text-income">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="rounded-lg bg-secondary/40 p-2">
            <p className="text-muted-foreground">ໜີ້ສິນ</p>
            <p className="font-semibold text-expense">{formatCurrency(totalLiabilities)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
