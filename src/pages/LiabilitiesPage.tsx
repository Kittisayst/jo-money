import { useCallback, useEffect, useMemo, useState } from 'react'
import { format, parse } from 'date-fns'
import { AlertTriangle, ChevronDownIcon, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatIntegerInput, parseIntegerInput } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'
import { useLiabilityStore } from '@/store/liability-store'
import type { Liability } from '@/types'

const LIABILITY_TYPES: Array<{ value: Liability['type']; label: string }> = [
  { value: 'loan', label: 'ເງິນກູ້' },
  { value: 'credit_card', label: 'ບັດເຄຣດິດ' },
  { value: 'mortgage', label: 'ຈຳນອງ' },
  { value: 'other', label: 'ອື່ນໆ' },
]

const INITIAL_FORM = {
  name: '',
  type: 'loan' as Liability['type'],
  totalAmount: '',
  remainingAmount: '',
  dueDate: '',
  note: '',
}

export default function LiabilitiesPage() {
  const { user } = useAuthStore()
  const {
    liabilities,
    isLoading,
    initialized,
    fetchLiabilities,
    addLiability,
    updateLiability,
    deleteLiability,
  } = useLiabilityStore()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [editingItem, setEditingItem] = useState<Liability | null>(null)
  const [itemToDelete, setItemToDelete] = useState<Liability | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const currentDueDate = formData.dueDate
    ? parse(formData.dueDate, 'yyyy-MM-dd', new Date())
    : new Date()

  useEffect(() => {
    if (user && !initialized && !isLoading) {
      fetchLiabilities(user.id)
    }
  }, [fetchLiabilities, initialized, isLoading, user])

  const totalLiabilities = useMemo(
    () => liabilities.reduce((sum, item) => sum + item.remainingAmount, 0),
    [liabilities]
  )

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM)
    setEditingItem(null)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const totalAmount = parseIntegerInput(formData.totalAmount)
    const remainingAmount = parseIntegerInput(formData.remainingAmount)
    if (!Number.isFinite(totalAmount) || !Number.isFinite(remainingAmount) || totalAmount < 0 || remainingAmount < 0) {
      return
    }

    if (editingItem) {
      const ok = await updateLiability(editingItem.id, {
        name: formData.name.trim(),
        type: formData.type,
        totalAmount,
        remainingAmount,
        dueDate: formData.dueDate,
        note: formData.note.trim(),
      })
      if (ok) {
        toast.success('ບັນທຶກການແກ້ໄຂໜີ້ສິນສຳເລັດ')
        resetForm()
      } else {
        toast.error('ບໍ່ສາມາດແກ້ໄຂໜີ້ສິນໄດ້')
      }
      return
    }

    const ok = await addLiability({
      userId: user.id,
      name: formData.name.trim(),
      type: formData.type,
      totalAmount,
      remainingAmount,
      dueDate: formData.dueDate,
      note: formData.note.trim(),
    })
    if (ok) {
      toast.success('ເພີ່ມໜີ້ສິນສຳເລັດ')
      resetForm()
    } else {
      toast.error('ບໍ່ສາມາດເພີ່ມໜີ້ສິນໄດ້')
    }
  }, [addLiability, editingItem, formData, resetForm, updateLiability, user])

  const handleEdit = useCallback((item: Liability) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      type: item.type,
      totalAmount: formatIntegerInput(String(item.totalAmount)),
      remainingAmount: formatIntegerInput(String(item.remainingAmount)),
      dueDate: item.dueDate,
      note: item.note,
    })
  }, [])

  const handleDelete = useCallback((item: Liability) => {
    setItemToDelete(item)
    setShowDeleteDialog(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return
    const ok = await deleteLiability(itemToDelete.id)
    if (ok) {
      toast.success('ລຶບໜີ້ສິນສຳເລັດ')
      setShowDeleteDialog(false)
      setItemToDelete(null)
    } else {
      toast.error('ບໍ່ສາມາດລຶບໜີ້ສິນໄດ້')
    }
  }, [deleteLiability, itemToDelete])

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      <Card className="glass-card border-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">ໜີ້ສິນ</h1>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <p className="text-sm text-muted-foreground">ໜີ້ສິນຄົງເຫຼືອລວມ</p>
            <p className="mt-1 text-lg font-semibold text-expense">{formatCurrency(totalLiabilities)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-foreground">ຊື່ໜີ້ສິນ</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm text-foreground">ປະເພດ</label>
                <select
                  className="h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as Liability['type'] }))}
                >
                  {LIABILITY_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground">ວັນຄົບກຳນົດ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full justify-between font-normal font-lao"
                    >
                      {formData.dueDate ? format(currentDueDate, 'dd/MM/yyyy') : 'ເລືອກວັນທີ...'}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currentDueDate}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setFormData((prev) => ({ ...prev, dueDate: format(selectedDate, 'yyyy-MM-dd') }))
                        }
                      }}
                      defaultMonth={currentDueDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm text-foreground">ຍອດລວມ</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalAmount: formatIntegerInput(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground">ຍອດຄົງເຫຼືອ</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
                  value={formData.remainingAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, remainingAmount: formatIntegerInput(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-foreground">ໝາຍເຫດ</label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
                value={formData.note}
                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              {editingItem && (
                <Button type="button" variant="ghost" className="flex-1" onClick={resetForm}>
                  ຍົກເລີກ
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Plus className="mr-1 h-4 w-4" />
                {editingItem ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມໜີ້ສິນ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {liabilities.map((item) => (
          <Card key={item.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{LIABILITY_TYPES.find((type) => type.value === item.type)?.label}</p>
                  <p className="text-sm text-muted-foreground">ຍອດລວມ: {formatCurrency(item.totalAmount)}</p>
                  <p className="text-lg font-semibold text-expense">ຄົງເຫຼືອ: {formatCurrency(item.remainingAmount)}</p>
                  {item.dueDate && <p className="text-xs text-muted-foreground">ຄົບກຳນົດ: {item.dueDate}</p>}
                  {item.note && <p className="text-xs text-muted-foreground">{item.note}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {liabilities.length === 0 && (
          <Card className="glass-card border-0">
            <CardContent className="p-8 text-center text-muted-foreground">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-50" />
              ຍັງບໍ່ມີໜີ້ສິນ
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນລຶບໜີ້ສິນ</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຈະລຶບ "{itemToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              ລຶບ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
