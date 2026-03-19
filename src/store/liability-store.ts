import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sheetClient from '@/lib/sheet-client'
import type { Liability } from '@/types'

interface LiabilityState {
  liabilities: Liability[]
  isLoading: boolean
  initialized: boolean
  error: string | null

  fetchLiabilities: (userId: string) => Promise<void>
  addLiability: (liability: Omit<Liability, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateLiability: (id: string, updates: Partial<Liability>) => Promise<boolean>
  deleteLiability: (id: string) => Promise<boolean>
}

interface LiabilitySheetRow extends Partial<Liability> {
  category?: string
  monthlyPayment?: number | string
  interestRate?: number | string
  status?: string
}

const LIABILITY_TYPES: Liability['type'][] = ['loan', 'credit_card', 'mortgage', 'other']

function normalizeLiabilityRow(row: LiabilitySheetRow): Liability {
  const typeCandidate = String(row.type ?? row.category ?? 'other')
  const type = (LIABILITY_TYPES.includes(typeCandidate as Liability['type']) ? typeCandidate : 'other') as Liability['type']
  const now = new Date().toISOString()

  return {
    id: String(row.id ?? crypto.randomUUID()),
    userId: String(row.userId ?? ''),
    name: String(row.name ?? ''),
    type,
    totalAmount: Number(row.totalAmount ?? 0) || 0,
    remainingAmount: Number(row.remainingAmount ?? 0) || 0,
    dueDate: String(row.dueDate ?? ''),
    note: String(row.note ?? ''),
    createdAt: row.createdAt ? String(row.createdAt) : now,
    updatedAt: row.updatedAt ? String(row.updatedAt) : now,
  }
}

function toLiabilitySheetRow(liability: Liability): LiabilitySheetRow {
  return {
    ...liability,
    category: liability.type,
  }
}

export const useLiabilityStore = create<LiabilityState>()(
  persist(
    (set) => ({
      liabilities: [],
      isLoading: false,
      initialized: false,
      error: null,

      fetchLiabilities: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Liabilities')
          if (response.status === 'success') {
            const allItems = (response.data || []) as LiabilitySheetRow[]
            const userItems = allItems
              .filter((item) => String(item.userId) === String(userId))
              .map((item) => normalizeLiabilityRow(item))

            userItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            set({ liabilities: userItems, isLoading: false, initialized: true })
            return
          }

          set({
            error: response.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນໜີ້ສິນໄດ້',
            isLoading: false,
            initialized: true,
          })
        } catch (error) {
          set({
            error: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້',
            isLoading: false,
            initialized: true,
          })
        }
      },

      addLiability: async (liabilityData) => {
        set({ isLoading: true, error: null })
        try {
          const now = new Date().toISOString()
          const newItem: Liability = {
            ...liabilityData,
            totalAmount: Number(liabilityData.totalAmount) || 0,
            remainingAmount: Number(liabilityData.remainingAmount) || 0,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          }

          const response = await sheetClient.insertData('Liabilities', toLiabilitySheetRow(newItem))
          if (response.status === 'success') {
            set((state) => ({
              liabilities: [newItem, ...state.liabilities],
              isLoading: false,
            }))
            return true
          }

          set({ error: response.message || 'ບໍ່ສາມາດເພີ່ມໜີ້ສິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມໜີ້ສິນ', isLoading: false })
          return false
        }
      },

      updateLiability: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Liabilities')
          if (response.status === 'success') {
            const allItems = (response.data || []) as LiabilitySheetRow[]
            const index = allItems.findIndex((item) => String(item.id) === String(id))

            if (index !== -1) {
              const target = normalizeLiabilityRow(allItems[index])
              const newData: Liability = {
                ...target,
                ...updates,
                ...(updates.totalAmount !== undefined && { totalAmount: Number(updates.totalAmount) || 0 }),
                ...(updates.remainingAmount !== undefined && { remainingAmount: Number(updates.remainingAmount) || 0 }),
                updatedAt: new Date().toISOString(),
              }

              const payload: LiabilitySheetRow = {
                ...allItems[index],
                ...toLiabilitySheetRow(newData),
              }

              const updateRes = await sheetClient.updateData('Liabilities', index, payload)
              if (updateRes.status === 'success') {
                set((state) => ({
                  liabilities: state.liabilities.map((item) => (item.id === id ? newData : item)),
                  isLoading: false,
                }))
                return true
              }
            }
          }

          set({ error: 'ບໍ່ສາມາດແກ້ໄຂໜີ້ສິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂໜີ້ສິນ', isLoading: false })
          return false
        }
      },

      deleteLiability: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Liabilities')
          if (response.status === 'success') {
            const allItems = (response.data || []) as LiabilitySheetRow[]
            const index = allItems.findIndex((item) => String(item.id) === String(id))

            if (index !== -1) {
              const deleteRes = await sheetClient.deleteData('Liabilities', index)
              if (deleteRes.status === 'success') {
                set((state) => ({
                  liabilities: state.liabilities.filter((item) => item.id !== id),
                  isLoading: false,
                }))
                return true
              }
            }
          }

          set({ error: 'ບໍ່ສາມາດລຶບໜີ້ສິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບໜີ້ສິນ', isLoading: false })
          return false
        }
      },
    }),
    {
      name: 'jo-money-liabilities-v1',
      partialize: (state) => ({ liabilities: state.liabilities }),
    }
  )
)
