import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import sheetClient from '@/lib/sheet-client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  saveProfile: (userData: Partial<User>) => Promise<boolean>
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      saveProfile: async (userData) => {
        const currentUser = get().user
        if (!currentUser) return false

        try {
          console.log('SaveProfile: Fetching all users...')
          const response = await sheetClient.getData('Users')
          if (response.status === 'success') {
            const allUsers = (response.data || []) as User[]
            
            // Try matching by ID first
            let index = allUsers.findIndex(u => String(u.id) === String(currentUser.id))
            
            // If ID match fails, try Username
            if (index === -1 && currentUser.username) {
              console.log('SaveProfile: ID match failed, trying Username match...')
              index = allUsers.findIndex(u => u.username === currentUser.username)
            }

            if (index !== -1) {
              const updatedUser = { ...allUsers[index], ...userData }
              console.log('SaveProfile: Updating user at index:', index)
              const updateRes = await sheetClient.updateData('Users', index, updatedUser)

              if (updateRes.status === 'success') {
                set({ user: updatedUser })
                return true
              }
              console.error('SaveProfile: UpdateData failed:', updateRes.message)
            } else {
              console.error('SaveProfile: User not found in sheet by ID or Username')
            }
          } else {
            console.error('SaveProfile: GetData failed:', response.message)
          }
          return false
        } catch (error) {
          console.error('SaveProfile: Unexpected error:', error)
          return false
        }
      },
      changePassword: async (currentPass, newPass) => {
        const currentUser = get().user
        if (!currentUser) return { success: false, message: 'ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້' }

        try {
          const response = await sheetClient.getData('Users')
          if (response.status === 'success') {
            const allUsers = (response.data || []) as (User & { password?: string })[]
            
            let index = allUsers.findIndex(u => String(u.id) === String(currentUser.id))
            if (index === -1) index = allUsers.findIndex(u => u.username === currentUser.username)

            if (index !== -1) {
              const userInSheet = allUsers[index]
              
              if (userInSheet.password !== currentPass) {
                return { success: false, message: 'ລະຫັດຜ່ານປັດຈຸບັນບໍ່ຖືກຕ້ອງ' }
              }

              const updatedUser = { ...userInSheet, password: newPass }
              const updateRes = await sheetClient.updateData('Users', index, updatedUser)

              if (updateRes.status === 'success') {
                return { success: true, message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ' }
              }
              return { success: false, message: updateRes.message || 'ບໍ່ສາມາດອັບເດດລະຫັດຜ່ານໄດ້' }
            }
            return { success: false, message: 'ບໍ່ພົບຜູ້ໃຊ້ໃນລະບົບ' }
          }
          return { success: false, message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ຂໍ້ມູນໄດ້' }
        } catch (error) {
          console.error('ChangePassword error:', error)
          return { success: false, message: 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ' }
        }
      },
    }),
    {
      name: 'jo-money-auth', // ຊື່ key ໃນ localStorage
    }
  )
)
