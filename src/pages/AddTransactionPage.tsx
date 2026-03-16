import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useTransactionStore } from '@/store/transaction-store'
import { useCategoryStore } from '@/store/category-store'
import { useAuthStore } from '@/store/auth-store'
import type { TransactionFormData } from '@/schemas'

export default function AddTransactionPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addTransaction, isLoading: isTxLoading } = useTransactionStore()
  const { fetchCategories, isLoading: isCatLoading, initialized: isCatInitialized } = useCategoryStore()
  
  const [isReady, setIsReady] = useState(false)

  // ດຶງຂໍ້ມູນ Categories ຖ້າຍັງບໍ່ມີ (ເພື່ອສະແດງໃນ Form)
  useEffect(() => {
    if (user && !isCatInitialized && !isCatLoading) {
      fetchCategories(user.id)
    }
  }, [user, isCatInitialized, isCatLoading, fetchCategories])

  // ສ້າງ flag ຊ່ວຍບອກຄວາມພ້ອມຂອງຂໍ້ມູນ
  useEffect(() => {
    if (isCatInitialized) {
      setIsReady(true)
    }
  }, [isCatInitialized])

  const handleSubmit = async (data: TransactionFormData) => {
    if (!user) return

    const success = await addTransaction({
      userId: user.id,
      type: data.type,
      amount: data.amount,
      categoryId: data.categoryId,
      note: data.note || '',
      date: data.date,
      imageUrl: data.imageUrl || '',
    })

    if (success) {
      toast.success('ບັນທຶກລາຍການສຳເລັດ!')
      navigate('/transactions') // ກັບໄປໜ້າລາຍການ
    } else {
      toast.error('ບໍ່ສາມາດບັນທຶກໄດ້ ກະລຸນາລອງໃໝ່')
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
        <h1 className="text-xl font-bold font-lao">ບັນທຶກລາຍການໃໝ່</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {!isReady ? (
          <div className="flex justify-center p-10 mt-10">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <p className="text-white/40">ກຳລັງກຽມຂໍ້ມູນໝວດໝູ່...</p>
            </div>
          </div>
        ) : (
          <div className="glass-card p-5">
            <TransactionForm 
              onSubmit={handleSubmit} 
              isLoading={isTxLoading} 
            />
          </div>
        )}
      </main>
    </div>
  )
}
