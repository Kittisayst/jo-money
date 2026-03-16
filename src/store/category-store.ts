import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sheetClient from '@/lib/sheet-client'
import type { Category } from '@/types'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  initialized: boolean
  error: string | null

  // Actions
  fetchCategories: (userId: string) => Promise<void>
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      isLoading: false,
      initialized: false,
      error: null,

      fetchCategories: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Categories')

          if (response.status === 'success') {
            const allCategories = (response.data || []) as Category[]
            const userCategories = allCategories.filter(c => String(c.userId) === String(userId))

            set({ categories: userCategories, initialized: true, isLoading: false })
          } else {
            set({ error: response.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນໝວດໝູ່', isLoading: false, initialized: true })
          }
        } catch (error) {
          set({ error: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້', isLoading: false, initialized: true })
        }
      },

      addCategory: async (category) => {
        set({ isLoading: true, error: null })
        try {
          const newCategory = {
            ...category,
            id: crypto.randomUUID()
          } as Category

          const response = await sheetClient.insertData('Categories', newCategory)

          if (response.status === 'success') {
            set(state => ({
              categories: [...state.categories, newCategory],
              isLoading: false
            }))
            return true
          }
          set({ error: response.message || 'ບໍ່ສາມາດເພີ່ມໝວດໝູ່ໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມໝວດໝູ່', isLoading: false })
          return false
        }
      },

      updateCategory: async (id, updatedData) => {
        set({ isLoading: true, error: null })
        try {
          // ຕ້ອງດຶງຂໍ້ມູນທັງໝົດເພາະ updateData ຕ້ອງການ index ຂອງແຖວໃນ Sheet
          const response = await sheetClient.getData('Categories')
          if (response.status === 'success') {
            const allCategories = (response.data || []) as Category[]
            const index = allCategories.findIndex(c => c.id === id)

            if (index !== -1) {
              const targetCategory = allCategories[index]
              const newData = { ...targetCategory, ...updatedData }

              const updateRes = await sheetClient.updateData('Categories', index, newData)

              if (updateRes.status === 'success') {
                set(state => ({
                  categories: state.categories.map(c => c.id === id ? newData : c),
                  isLoading: false
                }))
                return true
              }
            }
          }
          set({ error: 'ບໍ່ສາມາດແກ້ໄຂໝວດໝູ່ໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂໝວດໝູ່', isLoading: false })
          return false
        }
      },

      deleteCategory: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Categories')
          if (response.status === 'success') {
            const allCategories = (response.data || []) as Category[]
            const index = allCategories.findIndex(c => c.id === id)

            if (index !== -1) {
              const deleteRes = await sheetClient.deleteData('Categories', index)

              if (deleteRes.status === 'success') {
                set(state => ({
                  categories: state.categories.filter(c => c.id !== id),
                  isLoading: false
                }))
                return true
              }
            }
          }
          set({ error: 'ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບໝວດໝູ່', isLoading: false })
          return false
        }
      }
    }),
    {
      name: 'jo-money-categories',
    }
  )
)

