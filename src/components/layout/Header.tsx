import { useLocation, useNavigate } from 'react-router'
import { Bell, LogOut, User as UserIcon, Settings, ChevronRight } from 'lucide-react'
import { PAGE_TITLES } from '@/lib/constants'
import { useAuthStore } from '@/store/auth-store'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = PAGE_TITLES[location.pathname] || 'Jo-Money'
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // ເອົາຕົວອັກສອນທຳອິດຂອງຊື່
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3 bg-background/60 backdrop-blur-2xl border-b border-border/10 shadow-sm">
        {/* Page Title */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight font-lao bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Notification Button */}
          <button
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary/40 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95 border border-white/5 shadow-inner"
            aria-label="ການແຈ້ງເຕືອນ"
          >
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-[15deg]" />
            {/* Notification Badge with pulse */}
            <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-background"></span>
            </span>
          </button>

          {/* User Profile Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="group relative flex h-9 w-9 items-center justify-center rounded-full p-[2px] bg-gradient-to-br from-primary via-violet-500 to-primary hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 shrink-0"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-card font-bold text-xs shadow-inner overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-violet-500 text-white">
                    {initial}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 bg-card/90 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 font-lao">
              <div className="px-3 py-4 mb-1">
                <p className="text-xs text-muted-foreground leading-none mb-1 font-medium">ເຂົ້າສູ່ລະບົບໂດຍ</p>
                <p className="font-bold text-sm truncate">{user?.displayName || 'ຜູ້ໃຊ້ທົ່ວໄປ'}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              
              <div className="h-px bg-white/5 mx-2 mb-1" />
              
              <div className="grid gap-1">
                <button 
                  onClick={() => navigate('/settings/profile')}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl hover:bg-secondary/50 transition-colors group"
                >
                 <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <UserIcon size={14} />
                  </div>
                  <span className="flex-1 text-left">ໂປຣໄຟລ໌</span>
                  <ChevronRight size={14} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button 
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl hover:bg-secondary/50 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                    <Settings size={14} />
                  </div>
                  <span className="flex-1 text-left">ຕັ້ງຄ່າ</span>
                  <ChevronRight size={14} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <div className="h-px bg-white/5 mx-2 my-1" />
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10">
                    <LogOut size={14} />
                  </div>
                  <span className="flex-1 text-left font-bold">ອອກຈາກລະບົບ</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
