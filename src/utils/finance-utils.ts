export type HealthLevel = 'good' | 'warning' | 'critical'

export interface HealthMetricResult {
  value: number
  level: HealthLevel
  advice: string
}

export function calculateSavingsRate(income: number, expense: number): number {
  if (!Number.isFinite(income) || income <= 0) return 0
  const rate = ((income - expense) / income) * 100
  return Math.max(0, rate)
}

export function calculateDebtToIncomeRatio(totalLiabilities: number, monthlyIncome: number): number {
  if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) return 100
  return (Math.max(0, totalLiabilities) / monthlyIncome) * 100
}

export function calculateEmergencyFundRatio(liquidAssets: number, monthlyExpense: number): number {
  if (!Number.isFinite(monthlyExpense) || monthlyExpense <= 0) return 0
  return Math.max(0, liquidAssets) / monthlyExpense
}

export function evaluateSavingsRate(rate: number): HealthMetricResult {
  if (rate >= 20) {
    return {
      value: rate,
      level: 'good',
      advice: 'ດີຫຼາຍ! ຮັກສາອັດຕາອອມໃຫ້ໄດ້ຢ່າງນ້ອຍ 20% ຕໍ່ເດືອນ.',
    }
  }

  if (rate >= 10) {
    return {
      value: rate,
      level: 'warning',
      advice: 'ພໍໃຊ້ໄດ້. ລອງຫຼຸດລາຍຈ່າຍເພື່ອດັນອັດຕາອອມໃຫ້ເກີນ 20%.',
    }
  }

  return {
    value: rate,
    level: 'critical',
    advice: 'ອັດຕາອອມຕ່ຳ. ຄວນຈັດງົບປະມານໃໝ່ ແລະ ຄວບຄຸມລາຍຈ່າຍທີ່ບໍ່ຈຳເປັນ.',
  }
}

export function evaluateDebtToIncomeRatio(ratio: number): HealthMetricResult {
  if (ratio <= 35) {
    return {
      value: ratio,
      level: 'good',
      advice: 'ດີຫຼາຍ! ພາລະໜີ້ສິນຢູ່ໃນລະດັບປອດໄພ.',
    }
  }

  if (ratio <= 50) {
    return {
      value: ratio,
      level: 'warning',
      advice: 'ຄວນລະວັງ. ພະຍາຍາມຫຼຸດໜີ້ສິນ ຫຼື ເພີ່ມລາຍຮັບເພື່ອຫຼຸດ DTI.',
    }
  }

  return {
    value: ratio,
    level: 'critical',
    advice: 'DTI ສູງ. ຄວນຈັດລຳດັບຊຳລະໜີ້ທັນທີ ແລະ ຫຼຸດການກໍ່ໜີ້ເພີ່ມ.',
  }
}

export function evaluateEmergencyFundRatio(ratioInMonths: number): HealthMetricResult {
  if (ratioInMonths >= 6) {
    return {
      value: ratioInMonths,
      level: 'good',
      advice: 'ຢອດຢ້ຽມ! ກອງທຶນສຳຮອງພຽງພໍສຳລັບສະຖານະການສຸກເສີນ.',
    }
  }

  if (ratioInMonths >= 3) {
    return {
      value: ratioInMonths,
      level: 'warning',
      advice: 'ໃກ້ເຄີຍດີ. ຄວນເພີ່ມກອງທຶນສຳຮອງໃຫ້ເຖິງ 6 ເດືອນ.',
    }
  }

  return {
    value: ratioInMonths,
    level: 'critical',
    advice: 'ກອງທຶນສຳຮອງຍັງນ້ອຍ. ແນະນຳໃຫ້ເລີ່ມສະສົມສຳຮອງຢ່າງເຮັ່ງດ່ວນ.',
  }
}

export function getFinancialHealthRecommendations(metrics: {
  savingsRate: HealthMetricResult
  dti: HealthMetricResult
  emergencyFund: HealthMetricResult
}): string[] {
  const recommendations: string[] = []

  if (metrics.savingsRate.level !== 'good') {
    recommendations.push(metrics.savingsRate.advice)
  }

  if (metrics.dti.level !== 'good') {
    recommendations.push(metrics.dti.advice)
  }

  if (metrics.emergencyFund.level !== 'good') {
    recommendations.push(metrics.emergencyFund.advice)
  }

  if (recommendations.length === 0) {
    recommendations.push('ສຸຂະພາບການເງິນຂອງທ່ານຢູ່ໃນເກນດີ. ຮັກສາວິໄນທາງການເງິນແບບນີ້ຕໍ່ໄປ!')
  }

  return recommendations
}
