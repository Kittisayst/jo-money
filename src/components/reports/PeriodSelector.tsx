import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PeriodType = 'day' | 'week' | 'month' | 'year'

interface PeriodSelectorProps {
  value: PeriodType
  onChange: (value: PeriodType) => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function PeriodSelector({ 
  value, 
  onChange, 
  currentDate, 
  onDateChange 
}: PeriodSelectorProps) {
  const periods: { value: PeriodType; label: string }[] = [
    { value: 'day', label: 'ວັນ' },
    { value: 'week', label: 'ອາທິດ' },
    { value: 'month', label: 'ເດືອນ' },
    { value: 'year', label: 'ປີ' }
  ]

  const formatDateRange = () => {
    const format = new Intl.DateTimeFormat('lo-LA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    switch (value) {
      case 'day':
        return format.format(currentDate)
      
      case 'week':
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        return `${format.format(startOfWeek)} - ${format.format(endOfWeek)}`
      
      case 'month':
        return `${currentDate.toLocaleDateString('lo-LA', { 
          year: 'numeric', 
          month: 'long' 
        })}`
      
      case 'year':
        return `${currentDate.toLocaleDateString('lo-LA', { 
          year: 'numeric' 
        })}`
      
      default:
        return ''
    }
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    
    switch (value) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
    }
    
    onDateChange(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    
    switch (value) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    
    onDateChange(newDate)
  }

  const navigateCurrent = () => {
    onDateChange(new Date())
  }

  return (
    <Card className="glass-card border-0">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Period Type Selector */}
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={value === period.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onChange(period.value)}
                className={cn(
                  value === period.value 
                    ? "bg-primary text-primary-foreground" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {period.label}
              </Button>
            ))}
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigatePrevious}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground text-center">
                {formatDateRange()}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={navigateNext}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Period Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateCurrent}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              ໄປຍັງປະຈຸບັນ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
