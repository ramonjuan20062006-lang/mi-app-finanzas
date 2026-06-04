import { Home, BarChart3, Landmark, Package } from 'lucide-react'
import { useStore, type Tab } from '../store/useStore'

const TABS: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'home',      label: 'Inicio',    Icon: Home },
  { id: 'balance',   label: 'Balance',   Icon: BarChart3 },
  { id: 'debts',     label: 'Deudas',    Icon: Landmark },
  { id: 'inventory', label: 'Inventario', Icon: Package },
]

export default function BottomNav() {
  const { tab, setTab } = useStore()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 pb-safe">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${active ? 'text-blue-600' : 'text-blue-300'}`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-[11px] font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
