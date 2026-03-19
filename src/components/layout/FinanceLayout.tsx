import { Outlet } from 'react-router'
import { FinanceTabBar } from './FinanceTabBar'

export function FinanceLayout() {
  return (
    <div className="flex flex-col pb-24">
      <FinanceTabBar />
      <Outlet />
    </div>
  )
}
