import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sheetClient from '@/lib/sheet-client'
import type { Transaction } from '@/types'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  initialized: boolean
  error: string | null
  
  // Actions
  fetchTransactions: (userId: string) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      isLoading: false,
      initialized: false,
      error: null,

      fetchTransactions: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Transactions')
          
          if (response.status === 'success') {
            const allTx = (response.data || []) as Transaction[]
            // ກັ່ນຕອງເອົາສະເພາະຂອງ User ທີ່ Login
            const userTx = allTx.filter(t => String(t.userId) === String(userId))
            
            // ລຽງລຳດັບຈາກໃໝ່ຫາເກົ່າ
            userTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            
            set({ transactions: userTx, isLoading: false, initialized: true })
          } else {
            set({ error: response.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍການ', isLoading: false, initialized: true })
          }
        } catch (error) {
          set({ error: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້', isLoading: false, initialized: true })
        }
      },

      addTransaction: async (transactionData) => {
        set({ isLoading: true, error: null })
        try {
          const now = new Date().toISOString()
          const newTransaction = {
            ...transactionData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          } as Transaction

          const response = await sheetClient.insertData('Transactions', newTransaction)
          
          if (response.status === 'success') {
            set(state => {
              const newTxList = [newTransaction, ...state.transactions]
              // ລຽງລຳດັບໃໝ່
              newTxList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              return { transactions: newTxList, isLoading: false }
            })
            return true
          }
          set({ error: response.message || 'ບໍ່ສາມາດບັນທຶກລາຍການໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກລາຍການ', isLoading: false })
          return false
        }
      },

      updateTransaction: async (id, updatedData) => {
        set({ isLoading: true, error: null })
        try {
          // ຕ້ອງດຶງຂໍ້ມູນທັງໝົດເພາະ updateData ຕ້ອງການ index ຂອງແຖວໃນ Sheet
          const response = await sheetClient.getData('Transactions')
          if (response.status === 'success') {
            const allTx = (response.data || []) as Transaction[]
            const index = allTx.findIndex(t => t.id === id)
            
            if (index !== -1) {
              const targetTx = allTx[index]
              const newData = { 
                ...targetTx, 
                ...updatedData,
                updatedAt: new Date().toISOString() // ອັບເດດເວລາ
              }
              
              const updateRes = await sheetClient.updateData('Transactions', index, newData)
              
              if (updateRes.status === 'success') {
                set(state => {
                  const newTxList = state.transactions.map(t => t.id === id ? newData : t)
                  newTxList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  return { transactions: newTxList, isLoading: false }
                })
                return true
              }
            }
          }
          set({ error: 'ບໍ່ສາມາດແກ້ໄຂລາຍການໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂລາຍການ', isLoading: false })
          return false
        }
      },

      deleteTransaction: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Transactions')
          if (response.status === 'success') {
            const allTx = (response.data || []) as Transaction[]
            const index = allTx.findIndex(t => t.id === id)
            
            if (index !== -1) {
              const deleteRes = await sheetClient.deleteData('Transactions', index)
              
              if (deleteRes.status === 'success') {
                set(state => ({
                  transactions: state.transactions.filter(t => t.id !== id),
                  isLoading: false
                }))
                return true
              }
            }
          }
          set({ error: 'ບໍ່ສາມາດລຶບລາຍການໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບລາຍການ', isLoading: false })
          return false
        }
      }
    }),
    {
      name: 'jo-money-transactions',
    }
  )
)

