import { useNavigate } from 'react-router'
import { User, Palette, Globe, DollarSign, LogOut, ChevronRight, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'
import { useThemeStore } from '../store/theme-store'
import { cn } from '@/lib/utils'
import type { Currency, Language } from '@/types'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleCurrencyChange = async (currency: Currency) => {
    // TODO: Implement updateSettings in auth store
    console.log('Change currency to:', currency)
  }

  const handleLanguageChange = async (language: Language) => {
    // TODO: Implement updateSettings in auth store
    console.log('Change language to:', language)
  }

  const handleThemeToggle = () => {
    toggleTheme()
    // TODO: Save theme to user profile when updateSettings is ready
    console.log('Theme changed to:', theme === 'dark' ? 'light' : 'dark')
  }

  const formatCurrency = (currency: Currency) => {
    const formats = {
      LAK: '₭ (ກີບ)',
      THB: '฿ (ບາດ)',
      USD: '$ (ໂດລາ)'
    }
    return formats[currency]
  }

  const formatLanguage = (language: Language) => {
    return language === 'lo' ? 'ລາວ' : 'English'
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      {/* User Card */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-xl font-bold text-primary-foreground shadow-md shadow-primary/20">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-foreground">{user?.displayName || 'User'}</h2>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings/profile')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Groups */}
      <div className="space-y-4">
        {/* Currency Settings */}
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">ສະກຸນເງິນ</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['LAK', 'THB', 'USD'] as Currency[]).map((currency) => (
                <Button
                  key={currency}
                  variant={user?.currency === currency ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCurrencyChange(currency)}
                  className={cn(
                    user?.currency === currency
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {formatCurrency(currency)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">ພາສາ</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['lo', 'en'] as Language[]).map((language) => (
                <Button
                  key={language}
                  variant={user?.language === language ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleLanguageChange(language)}
                  className={cn(
                    user?.language === language
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {formatLanguage(language)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground">ຮູບລັກ</h3>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'dark' ? 'ມືດ' : 'ແຈ້ງ'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Management */}
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-between text-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => navigate('/settings/categories')}
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span>ຈັດການໝວດໝູ່</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              ອອກຈາກລະບົບ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
