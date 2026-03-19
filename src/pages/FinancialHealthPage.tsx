import { useEffect, useMemo } from 'react'
import { HeartPulse, ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { HealthIndicator } from '@/components/health/HealthIndicator'
import { useAuthStore } from '@/store/auth-store'
import { useTransactionStore } from '@/store/transaction-store'
import { useAssetStore } from '@/store/asset-store'
import { useLiabilityStore } from '@/store/liability-store'
import {
  calculateDebtToIncomeRatio,
  calculateEmergencyFundRatio,
  calculateSavingsRate,
  evaluateDebtToIncomeRatio,
  evaluateEmergencyFundRatio,
  evaluateSavingsRate,
  getFinancialHealthRecommendations,
} from '@/utils/finance-utils'

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatMonths(value: number) {
  return `${value.toFixed(1)} ເດືອນ`
}

export default function FinancialHealthPage() {
  const { user } = useAuthStore()

  const {
    transactions,
    initialized: txInitialized,
    isLoading: txLoading,
    fetchTransactions,
  } = useTransactionStore()

  const {
    assets,
    initialized: assetInitialized,
    isLoading: assetLoading,
    fetchAssets,
  } = useAssetStore()

  const {
    liabilities,
    initialized: liabilityInitialized,
    isLoading: liabilityLoading,
    fetchLiabilities,
  } = useLiabilityStore()

  useEffect(() => {
    if (!user) return

    if (!txInitialized && !txLoading) fetchTransactions(user.id)
    if (!assetInitialized && !assetLoading) fetchAssets(user.id)
    if (!liabilityInitialized && !liabilityLoading) fetchLiabilities(user.id)
  }, [
    assetInitialized,
    assetLoading,
    fetchAssets,
    fetchLiabilities,
    fetchTransactions,
    liabilityInitialized,
    liabilityLoading,
    txInitialized,
    txLoading,
    user,
  ])

  const healthMetrics = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthTransactions = transactions.filter((tx) => {
      const d = new Date(tx.date)
      return d >= start && d <= end
    })

    const monthlyIncome = monthTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const monthlyExpense = monthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.remainingAmount, 0)

    const liquidAssets = assets
      .filter((item) => item.type === 'cash' || item.type === 'bank')
      .reduce((sum, item) => sum + item.amount, 0)

    const savingsRateValue = calculateSavingsRate(monthlyIncome, monthlyExpense)
    const dtiValue = calculateDebtToIncomeRatio(totalLiabilities, monthlyIncome)
    const emergencyFundValue = calculateEmergencyFundRatio(liquidAssets, monthlyExpense)

    const savingsRate = evaluateSavingsRate(savingsRateValue)
    const dti = evaluateDebtToIncomeRatio(dtiValue)
    const emergencyFund = evaluateEmergencyFundRatio(emergencyFundValue)

    const recommendations = getFinancialHealthRecommendations({
      savingsRate,
      dti,
      emergencyFund,
    })

    return {
      monthlyIncome,
      monthlyExpense,
      liquidAssets,
      totalLiabilities,
      savingsRate,
      dti,
      emergencyFund,
      recommendations,
    }
  }, [assets, liabilities, transactions])

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <h1 className="text-xl font-semibold text-foreground">ສຸຂະພາບການເງິນ</h1>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              ຜົນປະເມີນອີງຕາມຂໍ້ມູນເດືອນປັດຈຸບັນ
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <HealthIndicator
          title="Savings Rate"
          valueLabel={formatPercent(healthMetrics.savingsRate.value)}
          subtitle="(ລາຍຮັບ - ລາຍຈ່າຍ) / ລາຍຮັບ"
          level={healthMetrics.savingsRate.level}
        />

        <HealthIndicator
          title="Debt-to-Income (DTI)"
          valueLabel={formatPercent(healthMetrics.dti.value)}
          subtitle="ໜີ້ສິນລວມ / ລາຍຮັບເດືອນ"
          level={healthMetrics.dti.level}
        />

        <HealthIndicator
          title="Emergency Fund Ratio"
          valueLabel={formatMonths(healthMetrics.emergencyFund.value)}
          subtitle="ຊັບສິນສະພາບຄ່ອງ / ລາຍຈ່າຍລາຍເດືອນ"
          level={healthMetrics.emergencyFund.level}
        />
      </div>

      <Card className="glass-card border-0">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">ຄຳແນະນຳການເງິນ</h2>
          </div>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {healthMetrics.recommendations.map((item, index) => (
              <li key={index} className="rounded-lg bg-secondary/40 p-2.5">
                • {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
          <div>
            <p className="text-muted-foreground">ລາຍຮັບເດືອນນີ້</p>
            <p className="font-semibold text-income">{healthMetrics.monthlyIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ລາຍຈ່າຍເດືອນນີ້</p>
            <p className="font-semibold text-expense">{healthMetrics.monthlyExpense.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ຊັບສິນສະພາບຄ່ອງ</p>
            <p className="font-semibold text-foreground">{healthMetrics.liquidAssets.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ໜີ້ສິນລວມ</p>
            <p className="font-semibold text-foreground">{healthMetrics.totalLiabilities.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
