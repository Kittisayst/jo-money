import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Landmark, WalletCards } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NetWorthChart } from '@/components/networth/NetWorthChart'
import { useAuthStore } from '@/store/auth-store'
import { useAssetStore } from '@/store/asset-store'
import { useLiabilityStore } from '@/store/liability-store'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function NetWorthPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
    assets,
    initialized: assetsInitialized,
    isLoading: assetsLoading,
    fetchAssets,
  } = useAssetStore()

  const {
    liabilities,
    initialized: liabilitiesInitialized,
    isLoading: liabilitiesLoading,
    fetchLiabilities,
  } = useLiabilityStore()

  useEffect(() => {
    if (!user) return
    if (!assetsInitialized && !assetsLoading) fetchAssets(user.id)
    if (!liabilitiesInitialized && !liabilitiesLoading) fetchLiabilities(user.id)
  }, [
    assetsInitialized,
    assetsLoading,
    fetchAssets,
    fetchLiabilities,
    liabilitiesInitialized,
    liabilitiesLoading,
    user,
  ])

  const totals = useMemo(() => {
    const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0)
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.remainingAmount, 0)
    const netWorth = totalAssets - totalLiabilities

    return { totalAssets, totalLiabilities, netWorth }
  }, [assets, liabilities])

  const topAssets = useMemo(() => {
    return [...assets].sort((a, b) => b.amount - a.amount).slice(0, 5)
  }, [assets])

  const topLiabilities = useMemo(() => {
    return [...liabilities].sort((a, b) => b.remainingAmount - a.remainingAmount).slice(0, 5)
  }, [liabilities])

  if (!user) return null

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-4 space-y-4">
      <Card className="glass-card w-full border-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">ສະຖານະການເງິນ</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-muted-foreground">ຊັບສິນລວມ</p>
              <p className="mt-1 break-words text-lg font-semibold text-income">{formatCurrency(totals.totalAssets)}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-muted-foreground">ໜີ້ສິນລວມ</p>
              <p className="mt-1 break-words text-lg font-semibold text-expense">{formatCurrency(totals.totalLiabilities)}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">ຊັບສິນສຸດທິ</p>
          <p className={totals.netWorth >= 0 ? 'break-words text-2xl font-bold text-income' : 'break-words text-2xl font-bold text-expense'}>
            {formatCurrency(totals.netWorth)}
          </p>
        </CardContent>
      </Card>

      <NetWorthChart
        totalAssets={totals.totalAssets}
        totalLiabilities={totals.totalLiabilities}
      />

      <Card className="glass-card w-full border-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Landmark className="h-4 w-4 text-income" />
              ລາຍການຊັບສິນ (ຫຍໍ້)
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/assets')}>
              ເບິ່ງທັງໝົດ
            </Button>
          </div>

          {topAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground">ຍັງບໍ່ມີຂໍ້ມູນຊັບສິນ</p>
          ) : (
            <div className="space-y-2">
              {topAssets.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-secondary/40 p-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <p className="text-sm font-semibold text-income">{formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card w-full border-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <WalletCards className="h-4 w-4 text-expense" />
              ລາຍການໜີ້ສິນ (ຫຍໍ້)
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/liabilities')}>
              ເບິ່ງທັງໝົດ
            </Button>
          </div>

          {topLiabilities.length === 0 ? (
            <p className="text-sm text-muted-foreground">ຍັງບໍ່ມີຂໍ້ມູນໜີ້ສິນ</p>
          ) : (
            <div className="space-y-2">
              {topLiabilities.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-secondary/40 p-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <p className="text-sm font-semibold text-expense">{formatCurrency(item.remainingAmount)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
