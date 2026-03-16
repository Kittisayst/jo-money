import { useLocation } from 'react-router'
import { Bell } from 'lucide-react'
import { PAGE_TITLES } from '@/lib/constants'
import { useAuthStore } from '@/store/auth-store'

export function Header() {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Jo-Money'
  const user = useAuthStore((state) => state.user)

  // ເອົາຕົວອັກສອນທຳອິດຂອງຊື່
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/10">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="ການແຈ້ງເຕືອນ"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          {/* User avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-violet-500 text-xs font-bold text-white shadow-sm shadow-primary/20">
            {initial}
          </div>
        </div>
      </div>
    </header>
  )
}
