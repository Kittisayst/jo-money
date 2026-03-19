import { useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'ໜ້າຫຼັກ' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'ລາຍການ' },
  { path: '__fab__', icon: Plus, label: 'ເພີ່ມ' },
  { path: '/savings', icon: PiggyBank, label: 'ການເງິນ' },
  { path: '/reports', icon: BarChart3, label: 'ລາຍງານ' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism background */}
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-background/80 backdrop-blur-xl border-t border-border/10">
          {navItems.map((item) => {
            // FAB button
            if (item.path === '__fab__') {
              return (
                <button
                  key="fab"
                  onClick={() => navigate('/add')}
                  className="fab-pulse -mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-90"
                  aria-label="ເພີ່ມລາຍການ"
                >
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                </button>
              )
            }

            const isFinanceItem = item.path === '/savings'
            const isActive = isFinanceItem
              ? ['/savings', '/assets', '/liabilities', '/net-worth', '/financial-health'].some((p) => location.pathname.startsWith(p))
              : location.pathname === item.path || (item.path === '/reports' && location.pathname.startsWith('/reports'))
            const Icon = item.icon

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label={item.label}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
