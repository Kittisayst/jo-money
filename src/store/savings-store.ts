import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sheetClient from '@/lib/sheet-client'
import type { SavingsGoal, SavingsTransaction } from '@/types'

interface SavingsState {
  goals: SavingsGoal[]
  transactions: SavingsTransaction[]
  isLoading: boolean
  initialized: boolean
  error: string | null
  
  // Actions
  fetchSavings: (userId: string) => Promise<void>
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount'>) => Promise<boolean>
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<boolean>
  deleteGoal: (id: string) => Promise<boolean>
  addTransaction: (tx: Omit<SavingsTransaction, 'id' | 'createdAt'>, currentGoalAmount: number) => Promise<boolean>
  deleteTransaction: (id: string, goalId: string, revertAmount: number, isDeposit: boolean) => Promise<boolean>
}

export const useSavingsStore = create<SavingsState>()(
  persist(
    (set) => ({
      goals: [],
      transactions: [],
      isLoading: false,
      initialized: false,
      error: null,

      fetchSavings: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          // Fetch both sheets concurrently
          const [goalsRes, txRes] = await Promise.all([
            sheetClient.getData('SavingsGoals'),
            sheetClient.getData('SavingsTransactions')
          ])

          if (goalsRes.status === 'success') {
            const allGoals = (goalsRes.data || []) as SavingsGoal[]
            const userGoals = allGoals
              .filter(g => String(g.userId) === String(userId))
              .map(g => ({
                ...g,
                currentAmount: Number(g.currentAmount) || 0,
                targetAmount: Number(g.targetAmount) || 0
              }))
            
            // Sort by createdAt desc
            userGoals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            
            let userTx: SavingsTransaction[] = []
            if (txRes.status === 'success') {
              const allTx = (txRes.data || []) as SavingsTransaction[]
              userTx = allTx
                .filter(t => String(t.userId) === String(userId))
                .map(t => ({
                  ...t,
                  amount: Number(t.amount) || 0
                }))
              userTx.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            }

            set({ goals: userGoals, transactions: userTx, isLoading: false, initialized: true })
          } else {
            set({ error: goalsRes.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນເງິນອອມ', isLoading: false, initialized: true })
          }
        } catch (error) {
          set({ error: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້', isLoading: false, initialized: true })
        }
      },

      addGoal: async (goalData) => {
        set({ isLoading: true, error: null })
        try {
          const now = new Date().toISOString()
          const newGoal: SavingsGoal = {
            ...goalData,
            targetAmount: Number(goalData.targetAmount) || 0,
            currentAmount: 0,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
          }

          const response = await sheetClient.insertData('SavingsGoals', newGoal)
          
          if (response.status === 'success') {
            set(state => ({
              goals: [newGoal, ...state.goals],
              isLoading: false
            }))
            return true
          }
          set({ error: response.message || 'ບໍ່ສາມາດບັນທຶກເປົ້າໝາຍໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກເປົ້າໝາຍ', isLoading: false })
          return false
        }
      },

      updateGoal: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('SavingsGoals')
          if (response.status === 'success') {
            const allGoals = (response.data || []) as SavingsGoal[]
            const index = allGoals.findIndex(g => g.id === id)
            
            if (index !== -1) {
              const targetGoal = allGoals[index]
              const newData: SavingsGoal = { 
                ...targetGoal, 
                ...updates,
                ...(updates.targetAmount !== undefined && { targetAmount: Number(updates.targetAmount) }),
                ...(updates.currentAmount !== undefined && { currentAmount: Number(updates.currentAmount) }),
                updatedAt: new Date().toISOString()
              }
              
              const updateRes = await sheetClient.updateData('SavingsGoals', index, newData)
              
              if (updateRes.status === 'success') {
                set(state => ({
                  goals: state.goals.map(g => g.id === id ? newData : g),
                  isLoading: false
                }))
                return true
              }
            }
          }
          set({ error: 'ບໍ່ສາມາດອັບເດດເປົ້າໝາຍໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດເປົ້າໝາຍ', isLoading: false })
          return false
        }
      },

      deleteGoal: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('SavingsGoals')
          if (response.status === 'success') {
            const allGoals = (response.data || []) as SavingsGoal[]
            const index = allGoals.findIndex(g => g.id === id)
            
            if (index !== -1) {
              const deleteRes = await sheetClient.deleteData('SavingsGoals', index)
              if (deleteRes.status === 'success') {
                set(state => ({
                  goals: state.goals.filter(g => g.id !== id),
                  transactions: state.transactions.filter(t => t.goalId !== id),
                  isLoading: false
                }))
                return true
              }
            }
          }
          set({ error: 'ບໍ່ສາມາດລຶບເປົ້າໝາຍໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບເປົ້າໝາຍ', isLoading: false })
          return false
        }
      },

      addTransaction: async (txData, currentGoalAmount) => {
        set({ isLoading: true, error: null })
        try {
          const now = new Date().toISOString()
          const newTx: SavingsTransaction = {
            ...txData,
            amount: Number(txData.amount) || 0,
            id: crypto.randomUUID(),
            createdAt: now
          }

          // In a real app, we should use a transaction/batch, but here we do it sequentially.
          // First add transaction
          const response = await sheetClient.insertData('SavingsTransactions', newTx)
          
          if (response.status === 'success') {
            // Then update goal amount
            const newCurrentAmount = txData.type === 'deposit' 
              ? currentGoalAmount + newTx.amount 
              : currentGoalAmount - newTx.amount;
              
            // Get goal index and update
            const goalRes = await sheetClient.getData('SavingsGoals')
            if (goalRes.status === 'success') {
              const allGoals = (goalRes.data || []) as SavingsGoal[]
              const index = allGoals.findIndex(g => g.id === txData.goalId)
              
              if (index !== -1) {
                const targetGoal = allGoals[index]
                const updatedGoal = { ...targetGoal, currentAmount: newCurrentAmount, updatedAt: now }
                await sheetClient.updateData('SavingsGoals', index, updatedGoal)
                
                set(state => ({
                  transactions: [newTx, ...state.transactions],
                  goals: state.goals.map(g => g.id === txData.goalId ? updatedGoal : g),
                  isLoading: false
                }))
                return true
              }
            }
          }
          set({ error: response.message || 'ບໍ່ສາມາດອັບເດດຍອດເງິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນລາຍການເງິນອອມ', isLoading: false })
          return false
        }
      },

      deleteTransaction: async (id, goalId, revertAmount, isDeposit) => {
        // TODO: implement delete transaction + revert goal balance in a follow-up.
        void id
        void goalId
        void revertAmount
        void isDeposit
        return false
      }
    }),
    {
      name: 'jo-money-savings',
      partialize: (state) => ({ 
        goals: state.goals,
        transactions: state.transactions
      }),
    }
  )
)
