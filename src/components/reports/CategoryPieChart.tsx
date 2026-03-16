import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CategoryData {
  name: string
  value: number
  color: string
  icon: string
  type: 'income' | 'expense'
  percentage: number
}

interface CategoryPieChartProps {
  data: CategoryData[]
  title?: string
  type: 'income' | 'expense'
}

const COLORS = {
  income: ['#22c55e', '#10b981', '#059669', '#047857', '#065f46'],
  expense: ['#ef4444', '#f43f5e', '#e11d48', '#be123c', '#9f1239']
}

export function CategoryPieChart({ 
  data, 
  title, 
  type 
}: CategoryPieChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{data.icon}</span>
            <span className="font-medium text-foreground">{data.name}</span>
          </div>
          <p className={cn(
            "font-semibold",
            type === 'income' ? "text-green-400" : "text-red-400"
          )}>
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.percentage.toFixed(1)}% ຂອງທັງໝົດ
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

    if (percent < 0.03) return null // Hide labels for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="currentColor" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-[10px] font-bold fill-white drop-shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const chartData = data.map((item, index) => ({
    ...item,
    percentage: (item.value / total) * 100,
    color: item.color || COLORS[type][index % COLORS[type].length]
  }))

  if (data.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground">
            {title || (type === 'income' ? 'ລາຍຮັບຕາມໝວດ' : 'ລາຍຈ່າຍຕາມໝວດ')}
          </CardTitle>
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
        <CardTitle className="text-foreground">
          {title || (type === 'income' ? 'ລາຍຮັບຕາມໝວດ' : 'ລາຍຈ່າຍຕາມໝວດ')}
        </CardTitle>
        <div className="text-sm">
          <span className={cn(
            "font-semibold",
            type === 'income' ? "text-green-400" : "text-red-400"
          )}>
            ລວມ: {formatCurrency(total)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value: string, entry: any) => (
                <span className="text-muted-foreground text-xs font-medium">
                  {entry.payload.icon} {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
