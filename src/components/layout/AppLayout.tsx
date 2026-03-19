import { Outlet, useLocation } from 'react-router'
import { BottomNav } from './BottomNav'
import { Header } from './Header'

/**
 * Layout ຫຼັກ — Header + Content + BottomNav
 * ໃຊ້ BottomNav ສະເພາະ ໜ້າທີ່ login ແລ້ວ (ບໍ່ສະແດງ ໃນ /login, /register)
 */
export function AppLayout() {
  const location = useLocation()
  const hideNav = ['/login', '/register'].includes(location.pathname)
  const isFinanceRoute = ['/savings', '/assets', '/liabilities', '/net-worth', '/financial-health'].some(path => location.pathname.startsWith(path))

  return (
    <div className="flex flex-col min-h-dvh">
      {!hideNav && <Header />}

      <main className={`flex-1 ${hideNav ? '' : isFinanceRoute ? '' : 'pb-24'}`}>
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

      {!hideNav && <BottomNav />}
    </div>
  )
}
