import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { ChevronDownIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { z } from 'zod'

import { transactionSchema, type TransactionFormData } from '@/schemas'
import { CategoryPicker } from '@/components/shared/CategoryPicker'
import type { Transaction } from '@/types'

type TransactionFormValues = z.input<typeof transactionSchema>

// ຟັງຊັນ Format ຕົວເລກເປັນ comma-separated (100,000)
function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? value.replace(/,/g, '') : String(value)
  if (!num || num === '0') return ''
  const parts = num.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

function parseNumber(formatted: string): number {
  const num = Number(formatted.replace(/,/g, ''))
  return isNaN(num) ? 0 : num
}

interface TransactionFormProps {
  initialData?: Transaction
  onSubmit: (data: TransactionFormData) => Promise<void>
  isLoading?: boolean
}

export function TransactionForm({
  initialData,
  onSubmit,
  isLoading = false,
}: TransactionFormProps) {
  const isEditing = !!initialData

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialData?.type || 'expense',
      amount: initialData?.amount || ('' as unknown as number),
      categoryId: initialData?.categoryId || '',
      note: initialData?.note || '',
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      imageUrl: initialData?.imageUrl || '',
    },
  })

  // ສະຖານະສຳລັບ formatted amount display
  const [displayAmount, setDisplayAmount] = useState(
    initialData?.amount ? formatNumber(initialData.amount) : ''
  )


  const currentType = form.watch('type')

  const handleSubmit = async (values: TransactionFormValues) => {
    await onSubmit({
      ...values,
      note: values.note ?? '',
    })
  }

  // ແປງ string date ເປັນ Date object ສຳລັບ Calendar
  const currentDateStr = form.watch('date')
  const currentDate = currentDateStr
    ? parse(currentDateStr, 'yyyy-MM-dd', new Date())
    : new Date()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* Income / Expense Tabs */}
        <div className="flex p-1 bg-secondary/40 rounded-xl border border-border backdrop-blur-md">
          <button
            type="button"
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
              currentType === 'expense' 
                ? "bg-expense/20 text-expense shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            onClick={() => {
              form.setValue('type', 'expense')
              form.setValue('categoryId', '')
            }}
          >
            ລາຍຈ່າຍ
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
              currentType === 'income' 
                ? "bg-income/20 text-income shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            onClick={() => {
              form.setValue('type', 'income')
              form.setValue('categoryId', '')
            }}
          >
            ລາຍຮັບ
          </button>
        </div>

        {/* ຈຳນວນເງິນ — ມີ comma formatting */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">ຈຳນວນເງິນ (₭)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="text"
                    inputMode="numeric"
                    placeholder="0" 
                    className="glass-input pl-12 text-2xl font-bold h-16 tracking-wider" 
                    value={displayAmount}
                    onChange={(e) => {
                      // ຮັບແຕ່ຕົວເລກ ແລະ comma
                      const raw = e.target.value.replace(/[^0-9]/g, '')
                      const formatted = formatNumber(raw)
                      setDisplayAmount(formatted)
                      field.onChange(parseNumber(raw))
                    }}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                    ₭
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* ໝວດໝູ່ */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-foreground">ໝວດໝູ່</FormLabel>
                <CategoryPicker 
                  type={currentType} 
                  value={field.value} 
                  onChange={field.onChange}
                  error={form.formState.errors.categoryId?.message}
                />
              </FormItem>
            )}
          />

          {/* ວັນທີ — Shadcn DatePicker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-foreground">ວັນທີ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className="w-full justify-between text-left h-auto py-3 px-4 font-normal font-lao data-[empty=true]:text-muted-foreground"
                    >
                      {field.value
                        ? format(parse(field.value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
                        : 'ເລືອກວັນທີ...'}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, 'yyyy-MM-dd'))
                        }
                      }}
                      defaultMonth={currentDate}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
        </div>

        {/* ໝາຍເຫດ */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">ໝາຍເຫດ (ທາງເລືອກ)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="ເຊັ່ນ: ຄ່າເຂົ້າຊອຍພ້ອມກາເຟ..." 
                  className="glass-input resize-none h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          className={cn(
            "w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all",
            currentType === 'expense' 
              ? "bg-expense hover:bg-expense/90 shadow-expense/20" 
              : "bg-income hover:bg-income/90 shadow-income/20"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>ກຳລັງບັນທຶກ...</span>
            </div>
          ) : (
            <span>{isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມລາຍການ'}</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
