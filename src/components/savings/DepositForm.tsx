import { useMemo, useState } from 'react'
import { format, parse } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatIntegerInput, parseIntegerInput } from '@/lib/utils'
import type { SavingsGoal, SavingsTransaction } from '@/types'

interface DepositFormProps {
  goal: SavingsGoal
  type: SavingsTransaction['type']
  isLoading?: boolean
  onSubmit: (payload: { amount: number; note: string; date: string }) => Promise<void>
  onCancel: () => void
}

export function DepositForm({
  goal,
  type,
  isLoading = false,
  onSubmit,
  onCancel,
}: DepositFormProps) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const parsedAmount = useMemo(() => parseIntegerInput(amount), [amount])
  const currentDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date()
  const isWithdraw = type === 'withdraw'
  const isInvalidAmount = !Number.isFinite(parsedAmount) || parsedAmount <= 0
  const exceedsBalance = isWithdraw && parsedAmount > goal.currentAmount

  const canSubmit = !isInvalidAmount && !exceedsBalance && !isLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    await onSubmit({
      amount: parsedAmount,
      note: note.trim(),
      date,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">ຈຳນວນເງິນ</Label>
        <Input
          id="amount"
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(formatIntegerInput(e.target.value))}
          placeholder="0"
          className="h-11"
          required
        />
        {exceedsBalance && (
          <p className="text-xs text-destructive">ຍອດຖອນຫຼາຍກວ່າເງິນອອມປະຈຸບັນ</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">ວັນທີ</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 w-full justify-between font-normal font-lao"
            >
              {date ? format(currentDate, 'dd/MM/yyyy') : 'ເລືອກວັນທີ...'}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(selectedDate) => {
                if (selectedDate) setDate(format(selectedDate, 'yyyy-MM-dd'))
              }}
              defaultMonth={currentDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">ໝາຍເຫດ</Label>
        <Input
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isWithdraw ? 'ຕົວຢ່າງ: ຖອນໄປຊື້ຂອງ' : 'ຕົວຢ່າງ: ອອມຈາກເງິນເດືອນ'}
          className="h-11"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          ຍົກເລີກ
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!canSubmit}
          variant={isWithdraw ? 'destructive' : 'default'}
        >
          {isLoading ? 'ກຳລັງບັນທຶກ...' : isWithdraw ? 'ຖອນເງິນ' : 'ອອມເພີ່ມ'}
        </Button>
      </div>
    </form>
  )
}
