import { useEffect } from 'react'
import { createHashRouter, RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { FinanceLayout } from '@/components/layout/FinanceLayout'
import DashboardPage from '@/pages/DashboardPage'
import TransactionsPage from '@/pages/TransactionsPage'
import AddTransactionPage from '@/pages/AddTransactionPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import CategoriesPage from '@/pages/CategoriesPage'
import SavingsPage from '@/pages/SavingsPage'
import AddSavingsGoalPage from '@/pages/AddSavingsGoalPage'
import AssetsPage from '@/pages/AssetsPage'
import LiabilitiesPage from '@/pages/LiabilitiesPage'
import NetWorthPage from '@/pages/NetWorthPage'
import FinancialHealthPage from '@/pages/FinancialHealthPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import EditTransactionPage from '@/pages/EditTransactionPage'
import ProfilePage from '@/pages/ProfilePage'
import ChangePasswordPage from '@/pages/ChangePasswordPage'
import { useThemeStore } from '@/store/theme-store'

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'transactions/:id/edit', element: <EditTransactionPage /> },
          { path: 'add', element: <AddTransactionPage /> },
          { path: 'reports', element: <ReportsPage /> },
          // Finance Hub — sub-pages share FinanceTabBar
          {
            element: <FinanceLayout />,
            children: [
              { path: 'savings', element: <SavingsPage /> },
              { path: 'assets', element: <AssetsPage /> },
              { path: 'liabilities', element: <LiabilitiesPage /> },
              { path: 'net-worth', element: <NetWorthPage /> },
              { path: 'financial-health', element: <FinancialHealthPage /> },
            ],
          },
          { path: 'savings/new', element: <AddSavingsGoalPage /> },
          { path: 'savings/:id/edit', element: <AddSavingsGoalPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'settings/profile', element: <ProfilePage /> },
          { path: 'settings/change-password', element: <ChangePasswordPage /> },
          { path: 'settings/categories', element: <CategoriesPage /> },
        ],
      },
      // Public Routes
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
])

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        theme={theme}
        richColors
        toastOptions={{
          classNames: {
            toast: 'font-lao',
            title: 'font-lao',
            description: 'font-lao',
            actionButton: 'font-lao',
            cancelButton: 'font-lao',
          },
        }}
      />
    </>
  )
}

export default App
