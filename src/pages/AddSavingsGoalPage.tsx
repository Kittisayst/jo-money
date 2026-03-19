import { useCallback, useEffect, useMemo, useState } from 'react'
import { format, parse } from 'date-fns'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatIntegerInput, parseIntegerInput } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'
import { useSavingsStore } from '@/store/savings-store'
import type { SavingsGoal } from '@/types'

const ICONS = ['🎯', '📱', '🏍️', '🏠', '🎓', '💍', '💻', '✈️', '🚗', '🛍️']
const COLORS = ['#22c55e', '#0ea5e9', '#f59e0b', '#a855f7', '#ef4444', '#14b8a6']

interface GoalFormData {
  name: string
  targetAmount: string
  icon: string
  color: string
  targetDate: string
  status: SavingsGoal['status']
}

const INITIAL_FORM: GoalFormData = {
  name: '',
  targetAmount: '',
  icon: '🎯',
  color: '#22c55e',
  targetDate: '',
  status: 'active',
}

export default function AddSavingsGoalPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuthStore()
  const { goals, addGoal, updateGoal, fetchSavings, initialized, isLoading } = useSavingsStore()

  const [formData, setFormData] = useState<GoalFormData>(INITIAL_FORM)

  const editingGoal = useMemo(() => goals.find((goal) => goal.id === id), [goals, id])
  const isEditing = Boolean(id)
  const currentTargetDate = formData.targetDate
    ? parse(formData.targetDate, 'yyyy-MM-dd', new Date())
    : new Date()

  useEffect(() => {
    if (user && !initialized && !isLoading) {
      fetchSavings(user.id)
    }
  }, [fetchSavings, initialized, isLoading, user])

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name,
        targetAmount: formatIntegerInput(String(editingGoal.targetAmount)),
        icon: editingGoal.icon,
        color: editingGoal.color,
        targetDate: editingGoal.targetDate,
        status: editingGoal.status,
      })
    }
  }, [editingGoal])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const targetAmount = parseIntegerInput(formData.targetAmount)
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      return
    }

    if (isEditing && editingGoal) {
      const ok = await updateGoal(editingGoal.id, {
        name: formData.name.trim(),
        targetAmount,
        icon: formData.icon,
        color: formData.color,
        targetDate: formData.targetDate,
        status: formData.status,
      })
      if (ok) {
        toast.success('ບັນທຶກການແກ້ໄຂເປົ້າໝາຍສຳເລັດ')
        navigate('/savings')
      } else {
        toast.error('ບໍ່ສາມາດແກ້ໄຂເປົ້າໝາຍໄດ້')
      }
      return
    }

    const ok = await addGoal({
      userId: user.id,
      name: formData.name.trim(),
      targetAmount,
      icon: formData.icon,
      color: formData.color,
      targetDate: formData.targetDate,
      status: formData.status,
    })

    if (ok) {
      toast.success('ສ້າງເປົ້າໝາຍສຳເລັດ')
      navigate('/savings')
    } else {
      toast.error('ບໍ່ສາມາດສ້າງເປົ້າໝາຍໄດ້')
    }
  }, [addGoal, editingGoal, formData, isEditing, navigate, updateGoal, user])

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/savings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">
          {isEditing ? 'ແກ້ໄຂເປົ້າໝາຍ' : 'ສ້າງເປົ້າໝາຍການອອມ'}
        </h1>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ຊື່ເປົ້າໝາຍ</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-background/60 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="ຕົວຢ່າງ: ຊື້ໂທລະສັບໃໝ່"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ຍອດເງິນເປົ້າໝາຍ</label>
              <input
                type="text"
                inputMode="numeric"
                className="w-full px-3 py-2 rounded-lg bg-background/60 border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.targetAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetAmount: formatIntegerInput(e.target.value) }))}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ວັນທີເປົ້າໝາຍ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full justify-between font-normal font-lao"
                  >
                    {formData.targetDate ? format(currentTargetDate, 'dd/MM/yyyy') : 'ເລືອກວັນທີ...'}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentTargetDate}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setFormData((prev) => ({ ...prev, targetDate: format(selectedDate, 'yyyy-MM-dd') }))
                      }
                    }}
                    defaultMonth={currentTargetDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ໄອຄອນ</label>
              <div className="grid grid-cols-5 gap-2">
                {ICONS.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icon === icon ? 'default' : 'ghost'}
                    className="text-lg"
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ສີ</label>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="ghost"
                    className="h-8 p-0"
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    style={{
                      backgroundColor: color,
                      outline: formData.color === color ? '2px solid hsl(var(--ring))' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate('/savings')}>
                ຍົກເລີກ
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'ກຳລັງບັນທຶກ...' : isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ສ້າງເປົ້າໝາຍ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
