# ແຜນການພັດທະນາລະບົບການເງິນສ່ວນບຸກຄົນ - Jo-Money

## 1. ວິເຄາະລະບົບເກົ່າ (ແອັບປະຈຸບັນ)

### ຄຸນສົມບັດທີ່ມີແລ້ວ
| ຄຸນສົມບັດ | ລາຍລະອຽດ |
|---|---|
| ບັນທຶກລາຍຮັບ-ລາຍຈ່າຍ | ເພີ່ມ/ແກ້ໄຂ/ລຶບ ລາຍການ income/expense |
| ໝວດໝູ່ | ສ້າງໝວດໝູ່ກຳນົດເອງ ພ້ອມ icon ແລະ ສີ |
| Dashboard | ສະແດງຍອດລວມ, ກຣາຟ, ລາຍການລ້າສຸດ |
| ລາຍງານ | ກຣາຟວົງມົນ ແລະ ກຣາຟແທ່ງ ຕາມເດືອນ/ໝວດໝູ່ |
| ຕັ້ງຄ່າ | ໂປຣໄຟລ໌, ປ່ຽນລະຫັດຜ່ານ, ຈັດການໝວດໝູ່ |
| ສະແກນໃບບິນ (OCR) | ຖ່າຍຮູບໃບບິນ ແລ້ວດຶງຂໍ້ມູນອັດຕະໂນມັດ |

### Google Sheets ທີ່ມີແລ້ວ
- **Users** → id, username, password, displayName, email, currency, language, theme, createdAt
- **Transactions** → id, userId, type, amount, categoryId, note, date, imageUrl, createdAt, updatedAt
- **Categories** → id, userId, name, type, icon, color, sortOrder

### ເທັກໂນໂລຊີທີ່ໃຊ້
React + TypeScript + Vite, Zustand (state), Google Sheets API, Tailwind CSS, Shadcn UI

---

## 2. ຄຸນສົມບັດໃໝ່ທີ່ຈະສ້າງ

ອີງຕາມຂໍ້ມູນທີ່ເຈົ້າສົ່ງມາ ແລະ ຈາກການຄົ້ນຫາອິນເຕີເນັດ, ນີ້ຄືຄຸນສົມບັດໃໝ່ທີ່ເໝາະສົມກັບແອັບ Jo-Money:

### 2.1 📦 ບັນທຶກການອອມເງິນ (Savings Tracker)
- ສ້າງເປົ້າໝາຍການອອມ (ເຊັ່ນ: ຊື້ໂທລະສັບ, ທ່ອງທ່ຽວ, ເງິນສຸກເສີນ)
- ກຳນົດຍອດເປົ້າໝາຍ ແລະ ວັນທີເປົ້າໝາຍ
- ບັນທຶກການຝາກ/ຖອນ ຈາກແຕ່ລະເປົ້າໝາຍ
- ສະແດງ Progress bar ຄວາມຄືບໜ້າ
- ຄິດໄລ່ຈຳນວນເງິນທີ່ຕ້ອງອອມຕໍ່ເດືອນ/ອາທິດ

### 2.2 📊 ງົບສະແດງສະຖານະການເງິນ (Net Worth / Balance Sheet)

#### ຊັບສິນ (Assets)
| ປະເພດ | ຕົວຢ່າງ |
|---|---|
| ເງິນສົດ/ເງິນຝາກ | ບັນຊີທະນາຄານ, ເງິນສົດ |
| ການລົງທຶນ | ຮຸ້ນ, ກອງທຶນ, ຄຣິບໂຕ |
| ຊັບສິນມີຄ່າ | ທອງ, ເຄື່ອງປະດັບ |
| ອະສັງຫາລິມະຊັບ | ບ້ານ, ທີ່ດິນ |
| ຍານພາຫະນະ | ລົດ, ລົດຈັກ |

#### ໜີ້ສິນ (Liabilities)
| ປະເພດ | ຕົວຢ່າງ |
|---|---|
| ເງິນກູ້ບ້ານ | ຍອດຄ້າງ, ຍອດຊຳລະຂັ້ນຕ່ຳ/ເດືອນ |
| ເງິນກູ້ລົດ | ຍອດຄ້າງ, ຍອດຊຳລະ/ເດືອນ |
| ເງິນກູ້ສ່ວນບຸກຄົນ | ຍອດຄ້າງ, ດອກເບ້ຍ |
| ບັດເຄຣດິດ | ຍອດຄ້າງ |
| ໜີ້ອື່ນໆ | ໜີ້ຢືມ, ຜ່ອນຊຳລະ |

### 2.3 🧮 ສູດຄິດໄລ່ສຸຂະພາບການເງິນ (Financial Health Indicators)

| ຕົວຊີ້ວັດ | ສູດ | ເກນທີ່ດີ |
|---|---|---|
| **ຊັບສິນສຸດທິ** (Net Worth) | ຊັບສິນລວມ − ໜີ້ສິນລວມ | ເປັນບວກ ✅ |
| **ອັດຕາການອອມ** (Savings Rate) | (ເງິນອອມ+ລົງທຶນ) ÷ ລາຍໄດ້ × 100 | ≥ 10-20% |
| **ອັດຕາ​ໜີ້​ຕໍ່​ລາຍ​ໄດ້** (DTI Ratio) | ຍອດຊຳລະໜີ້/ເດືອນ ÷ ລາຍໄດ້/ເດືອນ × 100 | ≤ 36% |
| **ເງິນສຸກເສີນ** (Emergency Fund) | ເງິນສົດ/ເງິນຝາກ ÷ ລາຍຈ່າຍ/ເດືອນ | ≥ 3-6 ເດືອນ |
| **ອັດຕາສ່ວນສະພາບຄ່ອງ** (Liquidity) | ຊັບສິນທີ່ແປງເປັນເງິນສົດໄດ້ ÷ ລາຍຈ່າຍ/ເດືອນ | ≥ 3 |

---

## 3. ໂຄງສ້າງ Google Sheet ໃໝ່

### Sheet: `SavingsGoals` (ເປົ້າໝາຍການອອມ)
| Column | Type | Description |
|---|---|---|
| id | string | UUID |
| userId | string | FK → Users.id |
| name | string | ຊື່ເປົ້าໝາຍ (ເຊັ່ນ: "ຊື້ລົດ") |
| targetAmount | number | ຍອດເງິນເປົ້າໝາຍ |
| currentAmount | number | ຍອດເງິນປະຈຸບັນ |
| icon | string | ໄອຄອນ (emoji ຫຼື lucide icon) |
| color | string | ສີ hex |
| targetDate | string | ວັນທີເປົ້າໝາຍ (YYYY-MM-DD) |
| status | string | `active` / `completed` / `cancelled` |
| createdAt | string | ISO datetime |
| updatedAt | string | ISO datetime |

### Sheet: `SavingsTransactions` (ການຝາກ/ຖອນ ເງິນອອມ)
| Column | Type | Description |
|---|---|---|
| id | string | UUID |
| userId | string | FK → Users.id |
| goalId | string | FK → SavingsGoals.id |
| type | string | `deposit` / `withdraw` |
| amount | number | ຈຳນວນເງິນ |
| note | string | ໝາຍເຫດ |
| date | string | ວັນທີ (YYYY-MM-DD) |
| createdAt | string | ISO datetime |

### Sheet: `Assets` (ຊັບສິນ)
| Column | Type | Description |
|---|---|---|
| id | string | UUID |
| userId | string | FK → Users.id |
| name | string | ຊື່ (ເຊັ່ນ: "ບ້ານ", "ລົດ Toyota") |
| category | string | `cash` / `investment` / `valuable` / `property` / `vehicle` / `other` |
| value | number | ມູນຄ່າ (ກີບ) |
| note | string | ໝາຍເຫດ |
| isLiquid | boolean | ແປງເປັນເງິນສົດໄດ້ງ່າຍ? (ໃຊ້ຄິດ Liquidity) |
| createdAt | string | ISO datetime |
| updatedAt | string | ISO datetime |

### Sheet: `Liabilities` (ໜີ້ສິນ)
| Column | Type | Description |
|---|---|---|
| id | string | UUID |
| userId | string | FK → Users.id |
| name | string | ຊື່ (ເຊັ່ນ: "ສິນເຊື່ອບ້ານ") |
| category | string | `mortgage` / `car_loan` / `personal_loan` / `credit_card` / `other` |
| totalAmount | number | ຍອດໜີ້ທັງໝົດ |
| remainingAmount | number | ຍອດໜີ້ຄົງຄ້າງ |
| monthlyPayment | number | ຍອດຊຳລະຕໍ່ເດືອນ (ຂັ້ນຕ່ຳ) |
| interestRate | number | ອັດຕາດອກເບ້ຍ (%) |
| dueDate | number | ວັນຊຳລະ (1-31 ຂອງແຕ່ລະເດືອນ) |
| note | string | ໝາຍເຫດ |
| status | string | `active` / `paid_off` |
| createdAt | string | ISO datetime |
| updatedAt | string | ISO datetime |

---

## 4. TypeScript Types ໃໝ່

```typescript
// ເປົ້າໝາຍການອອມ
export interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  icon: string
  color: string
  targetDate: string
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// ການຝາກ/ຖອນເງິນອອມ
export interface SavingsTransaction {
  id: string
  userId: string
  goalId: string
  type: 'deposit' | 'withdraw'
  amount: number
  note: string
  date: string
  createdAt: string
}

// ຊັບສິນ
export type AssetCategory = 'cash' | 'investment' | 'valuable' | 'property' | 'vehicle' | 'other'
export interface Asset {
  id: string
  userId: string
  name: string
  category: AssetCategory
  value: number
  note: string
  isLiquid: boolean
  createdAt: string
  updatedAt: string
}

// ໜີ້ສິນ
export type LiabilityCategory = 'mortgage' | 'car_loan' | 'personal_loan' | 'credit_card' | 'other'
export interface Liability {
  id: string
  userId: string
  name: string
  category: LiabilityCategory
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  interestRate: number
  dueDate: number
  note: string
  status: 'active' | 'paid_off'
  createdAt: string
  updatedAt: string
}
```

---

## 5. ແຜນການພັດທະນາ (Development Phases)

### Phase 1: 💰 ບັນທຶກການອອມເງິນ (Savings Tracker)
**ເວລາ: ~2-3 sessions**

| ລຳດັບ | ວຽກ | ໄຟລ໌ |
|---|---|---|
| 1 | ເພີ່ມ Types ໃໝ່ (`SavingsGoal`, `SavingsTransaction`) | [types/index.ts](file:///d:/react/jo-money/src/types/index.ts) |
| 2 | ສ້າງ Google Sheet: `SavingsGoals`, `SavingsTransactions` | Google Sheet |
| 3 | ສ້າງ Zustand Store | `store/savings-store.ts` [NEW] |
| 4 | ສ້າງໜ້າ Savings Goals ​(ລາຍການເປົ້າໝາຍ + Progress bar) | `pages/SavingsPage.tsx` [NEW] |
| 5 | ສ້າງ Form ເພີ່ມ/ແກ້ໄຂ ເປົ້າໝາຍ | `pages/AddSavingsGoalPage.tsx` [NEW] |
| 6 | ສ້າງ Form ຝາກ/ຖອນ ເງິນອອມ | `components/savings/DepositForm.tsx` [NEW] |
| 7 | ເພີ່ມ Route ໃໝ່ | [App.tsx](file:///d:/react/jo-money/src/App.tsx) |
| 8 | ເພີ່ມ Navigation ໃນເມນູ | [components/layout/BottomNav.tsx](file:///d:/react/jo-money/src/components/layout/BottomNav.tsx) |

### Phase 2: 📊 ຊັບສິນ ແລະ ໜີ້ສິນ (Assets & Liabilities)
**ເວລາ: ~2-3 sessions**

| ລຳດັບ | ວຽກ | ໄຟລ໌ |
|---|---|---|
| 1 | ເພີ່ມ Types ໃໝ່ (`Asset`, `Liability`) | [types/index.ts](file:///d:/react/jo-money/src/types/index.ts) |
| 2 | ສ້າງ Google Sheet: `Assets`, `Liabilities` | Google Sheet |
| 3 | ສ້າງ Zustand Store | `store/asset-store.ts`, `store/liability-store.ts` [NEW] |
| 4 | ສ້າງໜ້າຈັດການຊັບສິນ (ລາຍການ + CRUD) | `pages/AssetsPage.tsx` [NEW] |
| 5 | ສ້າງໜ້າຈັດການໜີ້ສິນ (ລາຍການ + CRUD) | `pages/LiabilitiesPage.tsx` [NEW] |
| 6 | ເພີ່ມ Route ແລະ Navigation | [App.tsx](file:///d:/react/jo-money/src/App.tsx) |

### Phase 3: 🏦 ງົບສະແດງສະຖານະການເງິນ (Net Worth Dashboard)
**ເວລາ: ~1-2 sessions**

| ລຳດັບ | ວຽກ | ໄຟລ໌ |
|---|---|---|
| 1 | ສ້າງໜ້າ Net Worth ແບບ Overview | `pages/NetWorthPage.tsx` [NEW] |
| 2 | Card ສະແດງ: ຊັບສິນລວມ, ໜີ້ສິນລວມ, ຊັບສິນສຸດທິ | `components/networth/NetWorthSummary.tsx` [NEW] |
| 3 | ກຣາຟວົງມົນ ສັດສ່ວນຊັບສິນ vs ໜີ້ສິນ | `components/networth/NetWorthChart.tsx` [NEW] |
| 4 | ລາຍການຊັບສິນ/ໜີ້ສິນ ແບບຫຍໍ້ | ລວມໃນ `NetWorthPage.tsx` |

### Phase 4: 🧮 ສຸຂະພາບການເງິນ (Financial Health Dashboard)
**ເວລາ: ~1-2 sessions**

| ລຳດັບ | ວຽກ | ໄຟລ໌ |
|---|---|---|
| 1 | ສ້າງ utility ຄິດໄລ່ສູດການເງິນ | `utils/finance-utils.ts` [NEW] |
| 2 | ສ້າງໜ້າ Financial Health | `pages/FinancialHealthPage.tsx` [NEW] |
| 3 | Card ສະແດງ: Savings Rate, DTI, Emergency Fund ratio | `components/health/HealthIndicator.tsx` [NEW] |
| 4 | ສະແດງດ້ວຍສີ (ແດງ/ເຫຼືອງ/ຂຽວ) ຕາມລະດັບ | ລວມໃນ Component |
| 5 | ຄຳແນະນຳທາງການເງິນ ອີງຕາມຜົນລັບ | ລວມໃນ Page |

---

## 6. ໂຄງສ້າງ Navigation ໃໝ່

```
Bottom Nav (5 tabs):
├── 🏠 ໜ້າຫຼັກ (Dashboard) — ເໝືອນເດີມ
├── 📋 ລາຍການ (Transactions) — ເໝືອນເດີມ
├── ➕ ເພີ່ມ (Add) — ເໝືອນເດີມ
├── 💰 ການເງິນ (Finance) — [ໃໝ່]
│   ├── ອອມເງິນ (Savings Goals)
│   ├── ຊັບສິນ (Assets)
│   ├── ໜີ້ສິນ (Liabilities)
│   ├── ສະຖານະການເງິນ (Net Worth)
│   └── ສຸຂະພາບການເງິນ (Financial Health)
└── ⚙️ ຕັ້ງຄ່າ (Settings) — ເໝືອນເດີມ
```

---

## 7. Verification Plan

### ແຕ່ລະ Phase
1. Build ຜ່ານ (`npm run build`) ບໍ່ມີ error
2. ທົດສອບ CRUD ທຸກຟັງຊັ່ນ ໃນເຄື່ອງ (`npm run dev`)
3. ກວດ Google Sheet ວ່າຂໍ້ມູນຖືກບັນທຶກຖືກຕ້ອງ
4. Push ໄປ GitHub → ລໍຖ້າ Deploy → ທົດສອບໃນເວັບຈິງ

> [!IMPORTANT]
> ກ່ອນເລີ່ມ Phase 1, ເຈົ້າຕ້ອງ**ສ້າງ Sheet ໃໝ່** ໃນ Google Sheet ຂອງເຈົ້າ (`SavingsGoals`, `SavingsTransactions`) ພ້ອມ Header row ກ່ອນ.
