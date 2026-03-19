import { useLocation, useNavigate } from 'react-router'
import { cn } from '@/lib/utils'

const financeTabs = [
  { path: '/savings', label: 'ອອມເງິນ' },
  { path: '/assets', label: 'ຊັບສິນ' },
  { path: '/liabilities', label: 'ໜີ້ສິນ' },
  { path: '/net-worth', label: 'ສະຖານະ' },
  { path: '/financial-health', label: 'ສຸຂະພາບ' },
]

export function FinanceTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-lg px-4 pt-2">
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-secondary/40 p-1 no-scrollbar">
        {financeTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
