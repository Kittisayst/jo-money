# Jo-Money: ແອັບບັນທຶກລາຍຮັບລາຍຈ່າຍ — Development Plan

ແຜນພັດທະນາ PWA ບັນທຶກລາຍຮັບລາຍຈ່າຍ ໂດຍໃຊ້ React 19 + Vite 5 + Google Sheets ເປັນ backend, ອອກແບບ mobile-first ພ້ອມ offline support.

---

## 1. ຄຸນສົມບັດ (Features)

### Core Features

- **Auth** — Login/Register ຜ່ານ `google-sheet-api-client` built-in auth, ຈື່ session ດ້ວຍ localStorage
- **Dashboard** — ສະຫຼຸບລາຍຮັບ/ລາຍຈ່າຍ ປະຈຳເດືອນ, ຍອດເຫຼືອ, ກຣາຟ donut ແບ່ງຕາມໝວດ, bar chart ລາຍວັນ
- **ບັນທຶກລາຍການ** — ເພີ່ມ/ແກ້ໄຂ/ລຶບ ລາຍຮັບ-ລາຍຈ່າຍ, ເລືອກໝວດ+icon, ແນບຮູບ (upload to Drive)
- **ລາຍການ (Transactions)** — ເບິ່ງລາຍການທັງໝົດ, filter ຕາມວັນທີ/ໝວດ/ປະເພດ, ຄົ້ນຫາ, pagination
- **ລາຍງານ (Reports)** — ກຣາຟເປຣຽບທຽບລາຍຮັບ-ລາຍຈ່າຍ ລາຍເດືອນ, pie chart ແບ່ງຕາມໝວດ, ລາຍງານລາຍວັນ/ອາທິດ/ເດືອນ/ປີ
- **ໝວດໝູ່ (Categories)** — ຈັດການໝວດ ລາຍຮັບ/ລາຍຈ່າຍ ກຳນົດ icon ແລະ ສີ ແຕ່ລະໝວດ
- **ຕັ້ງຄ່າ (Settings)** — ແກ້ໄຂ profile, ສະກຸນເງິນ (LAK/THB/USD), ພາສາ, theme (light/dark)

### PWA Features

- **Installable** — Add to Home Screen
- **Offline cache** — cache static assets ດ້ວຍ Service Worker (Workbox)
- **App-like navigation** — Bottom tab bar, swipe gestures

### UX/UI Design

- **Mobile-first** — ອອກແບບ 390px ຂຶ້ນໄປ, responsive ຮອງຮັບ tablet/desktop
- **Bottom Navigation** — 4 tabs: Dashboard, Transactions, Reports, Settings
- **FAB (Floating Action Button)** — ປຸ່ມ + ຢູ່ກາງລຸ່ມ ສຳລັບເພີ່ມລາຍການໄວ
- **Color scheme** — Green (ລາຍຮັບ) / Red (ລາຍຈ່າຍ) / Blue (primary accent)
- **Card-based layout** — ແຕ່ລະລາຍການສະແດງເປັນ card ພ້ອມ icon ໝວດ
- **Skeleton loading** — ສະແດງ skeleton ຂະນະໂຫຼດຂໍ້ມູນ
- **Pull-to-refresh pattern** — ດຶງລົງເພື່ອ refresh ຂໍ້ມູນ

---

## 2. Libraries ທີ່ຕ້ອງໃຊ້

### ມີແລ້ວໃນ project

| Package                  | Version | ໃຊ້ສຳລັບ                     |
| ------------------------ | ------- | ---------------------------- |
| `react`                  | ^19.2.4 | UI framework                 |
| `react-dom`              | ^19.2.4 | DOM rendering                |
| `google-sheet-client-ts` | ^1.5.0  | Google Sheets backend + Auth |

### ຕ້ອງຕິດຕັ້ງເພີ່ມ

| Package                                    | ໃຊ້ສຳລັບ                                                        |
| ------------------------------------------ | --------------------------------------------------------------- |
| **UI & Styling**                           |                                                                 |
| `tailwindcss` + `postcss` + `autoprefixer` | Utility-first CSS (v3)                                          |
| `shadcn/ui` (via `npx shadcn@latest init`) | UI components (Button, Card, Dialog, Sheet, Tabs, Select, etc.) |
| `lucide-react`                             | Icons                                                           |
| `clsx` + `tailwind-merge`                  | Class merging (shadcn dependency)                               |
| **Routing**                                |                                                                 |
| `react-router`                             | Client-side routing (v7)                                        |
| **Forms & Validation**                     |                                                                 |
| `react-hook-form`                          | Form management                                                 |
| `zod`                                      | Schema validation                                               |
| `@hookform/resolvers`                      | Zod + react-hook-form bridge                                    |
| **Charts**                                 |                                                                 |
| `recharts`                                 | Dashboard & report charts                                       |
| **Date**                                   |                                                                 |
| `date-fns`                                 | Date formatting & manipulation                                  |
| **PWA**                                    |                                                                 |
| `vite-plugin-pwa`                          | Service Worker generation (Workbox)                             |
| **State**                                  |                                                                 |
| `zustand`                                  | Lightweight global state (auth, user preferences)               |
| **Utilities**                              |                                                                 |
| `sonner`                                   | Toast notifications                                             |
| `uuid`                                     | Generate unique IDs for transactions                            |

---

## 3. ໂຄງສ້າງ Google Sheet

### Sheet: `Users`

| Column      | Type   | Description     |
| ----------- | ------ | --------------- |
| id          | string | UUID            |
| username    | string | ຊື່ຜູ້ໃຊ້       |
| password    | string | hashed password |
| displayName | string | ຊື່ສະແດງ        |
| currency    | string | LAK / THB / USD |
| language    | string | lo / en         |
| theme       | string | light / dark    |
| createdAt   | string | ISO date        |

### Sheet: `Transactions`

| Column     | Type   | Description           |
| ---------- | ------ | --------------------- |
| id         | string | UUID                  |
| userId     | string | FK → Users.id         |
| type       | string | `income` / `expense`  |
| amount     | number | ຈຳນວນເງິນ             |
| categoryId | string | FK → Categories.id    |
| note       | string | ໝາຍເຫດ                |
| date       | string | YYYY-MM-DD            |
| imageUrl   | string | URL ຮູບແນບ (optional) |
| createdAt  | string | ISO datetime          |
| updatedAt  | string | ISO datetime          |

### Sheet: `Categories`

| Column    | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| id        | string | UUID                               |
| userId    | string | FK → Users.id (`system` = default) |
| name      | string | ຊື່ໝວດ                             |
| type      | string | `income` / `expense`               |
| icon      | string | Lucide icon name                   |
| color     | string | Hex color code                     |
| sortOrder | number | ລຳດັບ                              |

### Default Categories (pre-seeded)

**ລາຍຈ່າຍ (Expense):**
| ໝວດ | Icon | Color |
|-----|------|-------|
| ອາຫານ | utensils | #ef4444 |
| ຄ່າເດີນທາງ | car | #f97316 |
| ຊ໋ອບປິ້ງ | shopping-bag | #a855f7 |
| ບັນເທີງ | gamepad-2 | #ec4899 |
| ສຸຂະພາບ | heart-pulse | #14b8a6 |
| ການສຶກສາ | graduation-cap | #3b82f6 |
| ຄ່ານ້ຳ-ໄຟ | zap | #eab308 |
| ອື່ນໆ | ellipsis | #6b7280 |

**ລາຍຮັບ (Income):**
| ໝວດ | Icon | Color |
|-----|------|-------|
| ເງິນເດືອນ | banknote | #22c55e |
| ຟຣີແລນ | laptop | #06b6d4 |
| ທຸລະກິດ | briefcase | #8b5cf6 |
| ອື່ນໆ | ellipsis | #6b7280 |

---

## 4. ໂຄງສ້າງໂປຣເຈັກ

```
jo-money/
├── public/
│   ├── favicon.svg
│   ├── icons/                    # PWA icons (192, 512)
│   └── manifest.json             # PWA manifest (auto by vite-plugin-pwa)
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Root component + Router
│   ├── index.css                 # Tailwind imports + global styles
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx     # Main layout (header + bottom nav + outlet)
│   │   │   ├── BottomNav.tsx     # Bottom navigation bar
│   │   │   ├── Header.tsx        # Top header bar
│   │   │   └── ProtectedRoute.tsx
│   │   ├── transactions/         # Plural folder name
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionCard.tsx
│   │   ├── dashboard/
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── SummaryChart.tsx
│   │   │   └── RecentTransactions.tsx
│   │   ├── reports/              # Plural folder name
│   │   │   ├── MonthlyChart.tsx
│   │   │   ├── CategoryPieChart.tsx
│   │   │   └── PeriodSelector.tsx
│   │   └── shared/               # Shared components
│   │       └── CategoryPicker.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── AddTransactionPage.tsx
│   │   ├── EditTransactionPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── lib/
│   │   ├── sheet-client.ts       # GoogleSheetClient singleton instance
│   │   ├── utils.ts              # shadcn cn() + helpers
│   │   └── constants.ts          # Default categories, currency config
│   │
│   ├── store/                    # Replaced hooks with Zustand stores
│   │   ├── auth-store.ts
│   │   ├── category-store.ts
│   │   ├── transaction-store.ts
│   │   └── theme-store.ts
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   └── schemas/
│       └── index.ts              # Zod validation schemas
│
├── .env                          # VITE_SHEET_API_URL, VITE_SHEET_KEY
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. ແຜນການພັດທະນາ

### Phase 1: Foundation (ພື້ນຖານ)

1. ຕິດຕັ້ງ dependencies ທັງໝົດ
2. ຕັ້ງຄ່າ Tailwind CSS v4 + shadcn/ui
3. ຕັ້ງຄ່າ vite-plugin-pwa (manifest, service worker)
4. ຕັ້ງຄ່າ react-router (routes structure)
5. ສ້າງ AppLayout + BottomNav + Header
6. ສ້າງ GoogleSheetClient singleton (`lib/sheet-client.ts`)
7. ຕັ້ງຄ່າ .env (API URL + Sheet Key)
8. ສ້າງ TypeScript types ແລະ Zod schemas

### Phase 2: Authentication

1. ສ້າງ Zustand stores (auth, category, transaction, theme)
2. ສ້າງ LoginPage + RegisterPage
3. ເຊື່ອມຕໍ່ `client.login()` / `client.register()`
4. ສ້າງ ProtectedRoute component
5. Auto-login ຈາກ localStorage

### Phase 3: Categories + Transaction CRUD

1. Seed default categories ເຂົ້າ Google Sheet
2. ສ້າງ CategoryPicker component
3. ສ້າງ TransactionForm (react-hook-form + zod)
4. ສ້າງ AddTransactionPage + EditTransactionPage
5. ສ້າງ TransactionCard + TransactionList
6. ສ້າງ TransactionsPage (ພ້ອມ filter, search, pagination)
7. ຮູບແນບ (optional image upload via `client.uploadFile()`)

### Phase 4: Dashboard

1. ສ້າງ BalanceCard (ລາຍຮັບ - ລາຍຈ່າຍ = ຍອດເຫຼືອ)
2. ສ້າງ SummaryChart (donut chart ແບ່ງຕາມໝວດ)
3. ສ້າງ RecentTransactions (5 ລາຍການລ່າສຸດ)
4. ສ້າງ DashboardPage ລວມ components

### Phase 5: Reports

1. ສ້າງ PeriodSelector (ວັນ/ອາທິດ/ເດືອນ/ປີ)
2. ສ້າງ MonthlyChart (bar chart ລາຍຮັບ vs ລາຍຈ່າຍ)
3. ສ້າງ CategoryPieChart
4. ສ້າງ ReportsPage

### Phase 6: Settings + Categories Management

1. ສ້າງ SettingsPage (profile, currency, theme)
2. ສ້າງ CategoriesPage (CRUD ໝວດໝູ່)
3. Dark/Light theme toggle
4. ສະກຸນເງິນ formatting

### Phase 7: Polish + Deploy

1. Loading states (skeleton)
2. Error handling + toast notifications
3. Empty states ແລະ onboarding
4. PWA testing (install, offline)
5. Build ແລະ deploy ໃສ່ GitHub Pages
6. ທົດສອບ ແລະ ແກ້ bugs

---

## 6. Environment Variables

```env
VITE_SHEET_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_SHEET_KEY=1V-KYuJr3NpO7_bnKCeKoLoJXW3KeOXzh8LIsoN16whc
```

> **ໝາຍເຫດ**: ຕ້ອງ deploy Google Apps Script ກ່ອນ ແລ້ວເອົາ URL ມາໃສ່ `VITE_SHEET_API_URL`

---

## 7. Key Technical Decisions

- **State management**: ໃຊ້ Zustand ໃນການຈັດການ State ທັງໝົດ (Auth, Transactions, Categories, Theme) ເພື່ອຄວາມສະດວກໃນການແຊຣ໌ຂໍ້ມູນຂ້າມ Component.
- **No backend server**: ທຸກຢ່າງ communicate ຜ່ານ Google Apps Script Web App ໂດຍ `google-sheet-api-client`
- **Routing**: `react-router` v7 ກັບ hash router (`createHashRouter`) ເພາະ deploy GitHub Pages
- **Currency**: ຮອງຮັບ LAK (₭), THB (฿), USD ($) — format ດ້ວຍ `Intl.NumberFormat`
- **Date**: ເກັບເປັນ `YYYY-MM-DD` string ໃນ sheet, format ດ້ວຍ `date-fns`
