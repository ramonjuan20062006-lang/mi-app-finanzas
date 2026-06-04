import { useEffect } from 'react'
import { useStore, type Tab } from '../store/useStore'
import Header from './Header'
import BottomNav from './BottomNav'
import HomeScreen from '../screens/HomeScreen'
import BalanceScreen from '../screens/BalanceScreen'
import DebtsScreen from '../screens/DebtsScreen'
import InventoryScreen from '../screens/InventoryScreen'
import AdminPanel from './AdminPanel'
import SaleModal from '../modals/SaleModal'
import ExpenseModal from '../modals/ExpenseModal'
import ProductModal from '../modals/ProductModal'
import DebtModal from '../modals/DebtModal'

const SCREENS: Record<Tab, React.FC> = {
  home: HomeScreen,
  balance: BalanceScreen,
  debts: DebtsScreen,
  inventory: InventoryScreen,
}

export default function AppShell() {
  const { tab, loadDebts, loadInventory, pollStatus } = useStore()

  useEffect(() => {
    loadDebts()
    loadInventory()
    const interval = setInterval(pollStatus, 10_000)
    return () => clearInterval(interval)
  }, [loadDebts, loadInventory, pollStatus])

  const Screen = SCREENS[tab]

  return (
    <div className="h-full flex flex-col bg-blue-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 pt-16 scrollbar-hide">
        <Screen />
      </main>
      <BottomNav />
      <AdminPanel />
      <SaleModal />
      <ExpenseModal />
      <ProductModal />
      <DebtModal />
    </div>
  )
}
