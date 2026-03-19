import { useCallback, useEffect, useMemo, useState } from 'react'
import { Landmark, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { formatIntegerInput, parseIntegerInput } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'
import { useAssetStore } from '@/store/asset-store'
import type { Asset } from '@/types'

const ASSET_TYPES: Array<{ value: Asset['type']; label: string }> = [
  { value: 'cash', label: 'ເງິນສົດ' },
  { value: 'bank', label: 'ບັນຊີທະນາຄານ' },
  { value: 'investment', label: 'ການລົງທຶນ' },
  { value: 'property', label: 'ຊັບສິນຖາວອນ' },
  { value: 'other', label: 'ອື່ນໆ' },
]

const INITIAL_FORM = {
  name: '',
  type: 'cash' as Asset['type'],
  amount: '',
  note: '',
}

export default function AssetsPage() {
  const { user } = useAuthStore()
  const { assets, isLoading, initialized, fetchAssets, addAsset, updateAsset, deleteAsset } = useAssetStore()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (user && !initialized && !isLoading) {
      fetchAssets(user.id)
    }
  }, [fetchAssets, initialized, isLoading, user])

  const totalAssets = useMemo(() => assets.reduce((sum, item) => sum + item.amount, 0), [assets])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM)
    setEditingAsset(null)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const amount = parseIntegerInput(formData.amount)
    if (!Number.isFinite(amount) || amount < 0) return

    if (editingAsset) {
      const ok = await updateAsset(editingAsset.id, {
        name: formData.name.trim(),
        type: formData.type,
        amount,
        note: formData.note.trim(),
      })
      if (ok) {
        toast.success('ບັນທຶກການແກ້ໄຂຊັບສິນສຳເລັດ')
        resetForm()
      } else {
        toast.error('ບໍ່ສາມາດແກ້ໄຂຊັບສິນໄດ້')
      }
      return
    }

    const ok = await addAsset({
      userId: user.id,
      name: formData.name.trim(),
      type: formData.type,
      amount,
      note: formData.note.trim(),
    })

    if (ok) {
      toast.success('ເພີ່ມຊັບສິນສຳເລັດ')
      resetForm()
    } else {
      toast.error('ບໍ່ສາມາດເພີ່ມຊັບສິນໄດ້')
    }
  }, [addAsset, editingAsset, formData, resetForm, updateAsset, user])

  const handleEdit = useCallback((asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      name: asset.name,
      type: asset.type,
      amount: formatIntegerInput(String(asset.amount)),
      note: asset.note,
    })
  }, [])

  const handleDelete = useCallback((asset: Asset) => {
    setAssetToDelete(asset)
    setShowDeleteDialog(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!assetToDelete) return
    const ok = await deleteAsset(assetToDelete.id)
    if (ok) {
      toast.success('ລຶບຊັບສິນສຳເລັດ')
      setShowDeleteDialog(false)
      setAssetToDelete(null)
    } else {
      toast.error('ບໍ່ສາມາດລຶບຊັບສິນໄດ້')
    }
  }, [assetToDelete, deleteAsset])

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      <Card className="glass-card border-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">ຊັບສິນ</h1>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <p className="text-sm text-muted-foreground">ຊັບສິນລວມ</p>
            <p className="mt-1 text-lg font-semibold text-income">{formatCurrency(totalAssets)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-foreground">ຊື່ຊັບສິນ</label>
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as Asset['type'] }))}
                >
                  {ASSET_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground">ມູນຄ່າ</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: formatIntegerInput(e.target.value) }))}
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
              {editingAsset && (
                <Button type="button" variant="ghost" className="flex-1" onClick={resetForm}>
                  ຍົກເລີກ
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Plus className="mr-1 h-4 w-4" />
                {editingAsset ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມຊັບສິນ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{ASSET_TYPES.find((item) => item.value === asset.type)?.label}</p>
                  <p className="text-lg font-semibold text-income">{formatCurrency(asset.amount)}</p>
                  {asset.note && <p className="text-xs text-muted-foreground">{asset.note}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleEdit(asset)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(asset)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {assets.length === 0 && (
          <Card className="glass-card border-0">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Landmark className="mx-auto mb-2 h-8 w-8 opacity-50" />
              ຍັງບໍ່ມີຊັບສິນ
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນລຶບຊັບສິນ</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຈະລຶບ "{assetToDelete?.name}"?
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
