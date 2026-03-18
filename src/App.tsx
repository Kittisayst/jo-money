import { useEffect } from 'react'
import { createHashRouter, RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import DashboardPage from '@/pages/DashboardPage'
import TransactionsPage from '@/pages/TransactionsPage'
import AddTransactionPage from '@/pages/AddTransactionPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import CategoriesPage from '@/pages/CategoriesPage'
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
      <Toaster position="top-center" theme={theme} richColors />
    </>
  )
}

export default App
