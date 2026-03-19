import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'
import { useSavingsStore } from '@/store/savings-store'
import { SavingsGoalCard } from '@/components/savings/SavingsGoalCard'
import { DepositForm } from '@/components/savings/DepositForm'
import type { SavingsGoal, SavingsTransaction } from '@/types'

export default function SavingsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    goals,
    isLoading,
    initialized,
    fetchSavings,
    addTransaction,
    deleteGoal,
  } = useSavingsStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [transactionType, setTransactionType] = useState<SavingsTransaction['type']>('deposit')
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleFetchSavings = useCallback(() => {
    if (user && !initialized && !isLoading) {
      fetchSavings(user.id)
    }
  }, [fetchSavings, initialized, isLoading, user])

  useEffect(() => {
    handleFetchSavings()
  }, [handleFetchSavings])

  const summary = useMemo(() => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const progress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

    return {
      totalTarget,
      totalSaved,
      progress,
    }
  }, [goals])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  const openTransactionDialog = useCallback((goal: SavingsGoal, type: SavingsTransaction['type']) => {
    setSelectedGoal(goal)
    setTransactionType(type)
    setDialogOpen(true)
  }, [])

  const handleDeleteGoal = useCallback(async (goal: SavingsGoal) => {
    setGoalToDelete(goal)
    setShowDeleteDialog(true)
  }, [])

  const confirmDeleteGoal = useCallback(async () => {
    if (goalToDelete) {
      const ok = await deleteGoal(goalToDelete.id)
      if (ok) {
        toast.success('ລຶບເປົ້າໝາຍສຳເລັດ')
        setShowDeleteDialog(false)
        setGoalToDelete(null)
      } else {
        toast.error('ບໍ່ສາມາດລຶບເປົ້າໝາຍໄດ້')
      }
    }
  }, [goalToDelete, deleteGoal])

  const handleSubmitTransaction = useCallback(async (payload: { amount: number; note: string; date: string }) => {
    if (!user || !selectedGoal) return

    const ok = await addTransaction(
      {
        userId: user.id,
        goalId: selectedGoal.id,
        type: transactionType,
        amount: payload.amount,
        note: payload.note,
        date: payload.date,
      },
      selectedGoal.currentAmount
    )

    if (ok) {
      toast.success(transactionType === 'deposit' ? 'ອອມເພີ່ມສຳເລັດ' : 'ຖອນເງິນສຳເລັດ')
      setDialogOpen(false)
      setSelectedGoal(null)
      return
    }

    toast.error(transactionType === 'deposit' ? 'ບໍ່ສາມາດອອມເພີ່ມໄດ້' : 'ບໍ່ສາມາດຖອນເງິນໄດ້')
  }, [addTransaction, selectedGoal, transactionType, user])

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      <Card className="glass-card border-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">ເປົ້າໝາຍການອອມ</h1>
            <Button size="sm" onClick={() => navigate('/savings/new')} className="gap-1.5">
              <Plus className="h-4 w-4" />
              ເພີ່ມ
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-muted-foreground">ເງິນອອມລວມ</p>
              <p className="mt-1 text-lg font-semibold text-income">{formatCurrency(summary.totalSaved)}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-muted-foreground">ເປົ້າໝາຍລວມ</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(summary.totalTarget)}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">ຄວາມຄືບໜ້າລວມ {summary.progress}%</p>
        </CardContent>
      </Card>

      {goals.length === 0 ? (
        <Card className="glass-card border-0">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">ຍັງບໍ່ມີເປົ້າໝາຍການອອມ</p>
            <Button className="mt-3" onClick={() => navigate('/savings/new')}>
              ສ້າງເປົ້າໝາຍແລກ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => navigate(`/savings/${g.id}/edit`)}
              onDelete={handleDeleteGoal}
              onDeposit={(g) => openTransactionDialog(g, 'deposit')}
              onWithdraw={(g) => openTransactionDialog(g, 'withdraw')}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'deposit' ? 'ອອມເພີ່ມ' : 'ຖອນເງິນ'}
              {selectedGoal ? ` - ${selectedGoal.name}` : ''}
            </DialogTitle>
            <DialogDescription>
              ກະລຸນາປ້ອນຈຳນວນເງິນ, ວັນທີ ແລະ ໝາຍເຫດ ສຳລັບລາຍການນີ້
            </DialogDescription>
          </DialogHeader>

          {selectedGoal && (
            <DepositForm
              goal={selectedGoal}
              type={transactionType}
              isLoading={isLoading}
              onSubmit={handleSubmitTransaction}
              onCancel={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນການລຶບ</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ທີ່ຕ້ອງການລຶບເປົ້າໝາຍ "{goalToDelete?.name}"? ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGoal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              ລຶບ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
