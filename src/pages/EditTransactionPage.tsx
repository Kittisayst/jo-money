import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useTransactionStore } from '@/store/transaction-store'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'
import type { TransactionFormData } from '@/schemas'
import type { Transaction } from '@/types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { transactions, updateTransaction, deleteTransaction, isLoading: isTxLoading, fetchTransactions, initialized: isTxInitialized } = useTransactionStore()
  const { fetchCategories, initialized: isCatInitialized, isLoading: isCatLoading } = useCategoryStore()
  
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // ດຶງຂໍ້ມູນພື້ນຖານຖ້າຍັງບໍ່ມີ (ເຊັ່ນ: ກໍລະນີ Refresh ໜ້າຈໍນີ້ໂດຍກົງ)
  useEffect(() => {
    if (user) {
      if (!isTxInitialized && !isTxLoading) fetchTransactions(user.id)
      if (!isCatInitialized && !isCatLoading) fetchCategories(user.id)
    }
  }, [user, isTxInitialized, isTxLoading, isCatInitialized, isCatLoading, fetchTransactions, fetchCategories])

  // ດຶງຂໍ້ມູນ Transaction ເດີມມາສະແດງໃນ Form
  useEffect(() => {
    if (id && transactions.length > 0) {
      const found = transactions.find(t => t.id === id)
      if (found) {
        setTransaction(found)
      } else {
        toast.error('ບໍ່ພົບຂໍ້ມູນລາຍການນີ້')
        navigate(-1)
      }
    }
  }, [id, transactions, navigate])

  const handleSubmit = async (data: TransactionFormData) => {
    if (!id || !user) return

    const success = await updateTransaction(id, {
      type: data.type,
      amount: data.amount,
      categoryId: data.categoryId,
      note: data.note || '',
      date: data.date,
      imageUrl: data.imageUrl || '',
    })

    if (success) {
      toast.success('ແກ້ໄຂບັນທຶກສຳເລັດ!')
      navigate(-1) // ກັບໄປໜ້າກ່ອນໜ້າ
    } else {
      toast.error('ບໍ່ສາມາດແກ້ໄຂໄດ້ ກະລຸນາລອງໃໝ່')
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setTransactionToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDeleteTransaction = async () => {
    if (transactionToDelete) {
      const success = await deleteTransaction(transactionToDelete)
      if (success) {
        toast.success('ລຶບລາຍການສຳເລັດແລ້ວ!')
        navigate('/transactions')
      } else {
        toast.error('ບໍ່ສາມາດລຶບໄດ້')
      }
      setShowDeleteDialog(false)
      setTransactionToDelete(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold font-lao">ແກ້ໄຂລາຍການ</h1>
        <button 
          onClick={handleDelete}
          disabled={isTxLoading}
          className="flex h-10 w-10 items-center justify-center rounded-full text-red-500 bg-red-500/10 transition-colors hover:bg-red-500/20 disabled:opacity-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {!transaction || !isCatInitialized ? (
          <div className="flex justify-center p-10 mt-10">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <p className="text-white/40 font-lao">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
            </div>
          </div>
        ) : (
          <div className="glass-card p-5">
            <TransactionForm 
              initialData={transaction}
              onSubmit={handleSubmit} 
              isLoading={isTxLoading} 
            />
          </div>
        )}
      </main>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນການລຶບ</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານຕ້ອງການລຶບລາຍການນີ້ແທ້ບໍ່? ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTransaction} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              ລຶບ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
