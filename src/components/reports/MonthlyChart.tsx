import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MonthlyData {
  name: string
  income: number
  expense: number
  balance: number
}

interface MonthlyChartProps {
  data: MonthlyData[]
  title?: string
}

export function MonthlyChart({ data, title = "ລາຍຮັບ vs ລາຍຈ່າຍ" }: MonthlyChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0
      const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0
      const balance = income - expense

      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-400">
              ລາຍຮັບ: {formatCurrency(income)}
            </p>
            <p className="text-sm text-red-400">
              ລາຍຈ່າຍ: {formatCurrency(expense)}
            </p>
            <p className={cn(
              "text-sm font-semibold border-t pt-1",
              balance >= 0 ? "text-green-400" : "text-red-400"
            )}>
              ຍອດເຫຼືອ: {formatCurrency(Math.abs(balance))}
              {balance < 0 && ' (ຂາດ)'}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    return (
      <text 
        x={x} 
        y={y + 12} 
        textAnchor="middle" 
        className="text-[10px] fill-muted-foreground font-medium"
      >
        {payload.value}
      </text>
    )
  }

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const value = payload.value
    const formatted = value >= 1000000 
      ? `${(value / 1000000).toFixed(1)}M`
      : value >= 1000 
      ? `${(value / 1000).toFixed(0)}K`
      : value.toString()
    
    return (
      <text 
        x={x - 8} 
        y={y} 
        textAnchor="end" 
        dominantBaseline="central"
        className="text-[10px] fill-muted-foreground font-medium"
      >
        {formatted}
      </text>
    )
  }

  const totals = data.reduce(
    (acc, item) => ({
      income: acc.income + item.income,
      expense: acc.expense + item.expense,
      balance: acc.balance + item.balance
    }),
    { income: 0, expense: 0, balance: 0 }
  )

  if (data.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>ບໍ່ມີຂໍ້ມູນສະແດງ</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-green-400">
              ລາຍຮັບ: {formatCurrency(totals.income)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-red-400">
              ລາຍຈ່າຍ: {formatCurrency(totals.expense)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="name" tick={<CustomXAxisTick />} />
            <YAxis tick={<CustomYAxisTick />} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
            />
            <Legend 
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px' }}
              formatter={(value) => (
                <span className="text-xs font-medium text-muted-foreground capitalize">
                  {value === 'income' ? 'ລາຍຮັບ' : 'ລາຍຈ່າຍ'}
                </span>
              )}
            />
            <Bar 
              dataKey="income" 
              fill="#22c55e" 
              name="income"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expense" 
              fill="#ef4444" 
              name="expense"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
