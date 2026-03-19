import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sheetClient from '@/lib/sheet-client'
import type { Asset } from '@/types'

interface AssetState {
  assets: Asset[]
  isLoading: boolean
  initialized: boolean
  error: string | null

  fetchAssets: (userId: string) => Promise<void>
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<boolean>
  deleteAsset: (id: string) => Promise<boolean>
}

interface AssetSheetRow extends Partial<Asset> {
  category?: string
  value?: number | string
  isLiquid?: boolean | string | number
}

const ASSET_TYPES: Asset['type'][] = ['cash', 'bank', 'investment', 'property', 'other']

function normalizeAssetRow(row: AssetSheetRow): Asset {
  const typeCandidate = String(row.type ?? row.category ?? 'other')
  const type = (ASSET_TYPES.includes(typeCandidate as Asset['type']) ? typeCandidate : 'other') as Asset['type']
  const amountSource = row.amount ?? row.value ?? 0
  const now = new Date().toISOString()

  return {
    id: String(row.id ?? crypto.randomUUID()),
    userId: String(row.userId ?? ''),
    name: String(row.name ?? ''),
    type,
    amount: Number(amountSource) || 0,
    note: String(row.note ?? ''),
    createdAt: row.createdAt ? String(row.createdAt) : now,
    updatedAt: row.updatedAt ? String(row.updatedAt) : now,
  }
}

function toAssetSheetRow(asset: Asset): AssetSheetRow {
  return {
    ...asset,
    category: asset.type,
    value: asset.amount,
    isLiquid: asset.type === 'cash' || asset.type === 'bank',
  }
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set) => ({
      assets: [],
      isLoading: false,
      initialized: false,
      error: null,

      fetchAssets: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Assets')
          if (response.status === 'success') {
            const allAssets = (response.data || []) as AssetSheetRow[]
            const userAssets = allAssets
              .filter((item) => String(item.userId) === String(userId))
              .map((item) => normalizeAssetRow(item))

            userAssets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            set({ assets: userAssets, isLoading: false, initialized: true })
            return
          }

          set({
            error: response.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນຊັບສິນໄດ້',
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

      addAsset: async (assetData) => {
        set({ isLoading: true, error: null })
        try {
          const now = new Date().toISOString()
          const newAsset: Asset = {
            ...assetData,
            amount: Number(assetData.amount) || 0,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          }

          const response = await sheetClient.insertData('Assets', toAssetSheetRow(newAsset))
          if (response.status === 'success') {
            set((state) => ({
              assets: [newAsset, ...state.assets],
              isLoading: false,
            }))
            return true
          }

          set({ error: response.message || 'ບໍ່ສາມາດເພີ່ມຊັບສິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຊັບສິນ', isLoading: false })
          return false
        }
      },

      updateAsset: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Assets')
          if (response.status === 'success') {
            const allAssets = (response.data || []) as AssetSheetRow[]
            const index = allAssets.findIndex((item) => String(item.id) === String(id))

            if (index !== -1) {
              const target = normalizeAssetRow(allAssets[index])
              const newData: Asset = {
                ...target,
                ...updates,
                ...(updates.amount !== undefined && { amount: Number(updates.amount) || 0 }),
                updatedAt: new Date().toISOString(),
              }

              const updateRes = await sheetClient.updateData('Assets', index, toAssetSheetRow(newData))
              if (updateRes.status === 'success') {
                set((state) => ({
                  assets: state.assets.map((item) => (item.id === id ? newData : item)),
                  isLoading: false,
                }))
                return true
              }
            }
          }

          set({ error: 'ບໍ່ສາມາດແກ້ໄຂຊັບສິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂຊັບສິນ', isLoading: false })
          return false
        }
      },

      deleteAsset: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await sheetClient.getData('Assets')
          if (response.status === 'success') {
            const allAssets = (response.data || []) as AssetSheetRow[]
            const index = allAssets.findIndex((item) => String(item.id) === String(id))

            if (index !== -1) {
              const deleteRes = await sheetClient.deleteData('Assets', index)
              if (deleteRes.status === 'success') {
                set((state) => ({
                  assets: state.assets.filter((item) => item.id !== id),
                  isLoading: false,
                }))
                return true
              }
            }
          }

          set({ error: 'ບໍ່ສາມາດລຶບຊັບສິນໄດ້', isLoading: false })
          return false
        } catch (error) {
          set({ error: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບຊັບສິນ', isLoading: false })
          return false
        }
      },
    }),
    {
      name: 'jo-money-assets-v1',
      partialize: (state) => ({ assets: state.assets }),
    }
  )
)
