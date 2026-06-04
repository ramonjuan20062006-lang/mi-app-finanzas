import { useMemo } from 'react'
import { X, ChartBar as BarChart2, TrendingUp, TrendingDown, Package, Crown } from 'lucide-react'
import { useStore } from '../store/useStore'

function StatCard({ label, value, color, icon: Icon }: { label: string; value: string; color: string; icon: React.FC<{ className?: string }> }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-xs text-blue-400">{label}</p>
      </div>
      <p className="text-2xl font-extrabold text-blue-900">{value}</p>
    </div>
  )
}

export default function StatsModal() {
  const { modal, setModal, sales, expenses, inventory, user } = useStore()
  if (modal !== 'stats') return null

  const isPremium = user?.plan === 'premium'

  const totalIncome  = useMemo(() => sales.reduce((s, x) => s + Number(x.amount), 0), [sales])
  const totalExpense = useMemo(() => expenses.reduce((s, x) => s + Number(x.amount), 0), [expenses])
  const profit       = totalIncome - totalExpense
  const topProduct   = useMemo(() => {
    if (inventory.length === 0) return '—'
    return [...inventory].sort((a, b) => b.stock - a.stock)[0]?.name ?? '—'
  }, [inventory])
  const lowStock     = useMemo(() => inventory.filter(i => i.stock < 5).length, [inventory])
  const inventoryVal = useMemo(() => inventory.reduce((s, i) => s + i.price * i.stock, 0), [inventory])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
      <div className="w-full max-w-md bg-blue-50 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-blue-50 px-5 pt-5 pb-3 flex items-center justify-between border-b border-blue-100 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-900">Estadísticas</h2>
              <p className="text-[11px] text-blue-400">Resumen de tu negocio</p>
            </div>
          </div>
          <button onClick={() => setModal(null)} className="p-2 hover:bg-blue-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {!isPremium && (
          <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">Algunas estadísticas avanzadas requieren Plan Premium.</p>
          </div>
        )}

        <div className="p-4 grid grid-cols-2 gap-3">
          <StatCard label="Ingresos totales" value={`$${totalIncome.toFixed(2)}`} color="bg-green-100" icon={({ className }) => <TrendingUp className={`${className} text-green-600`} />} />
          <StatCard label="Egresos totales" value={`$${totalExpense.toFixed(2)}`} color="bg-red-100" icon={({ className }) => <TrendingDown className={`${className} text-red-500`} />} />
          <StatCard label="Ganancia neta" value={`$${profit.toFixed(2)}`} color={profit >= 0 ? 'bg-green-100' : 'bg-red-100'} icon={({ className }) => <TrendingUp className={`${className} ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`} />} />
          <StatCard label="Val. inventario" value={`$${inventoryVal.toFixed(2)}`} color="bg-blue-100" icon={({ className }) => <Package className={`${className} text-blue-600`} />} />
        </div>

        {/* Premium section */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-blue-900">Estadísticas avanzadas</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`bg-white rounded-2xl p-4 border border-blue-100 shadow-sm relative overflow-hidden`}>
              {!isPremium && <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 rounded-2xl z-10" />}
              <p className="text-xs text-blue-400 mb-1">Producto estrella</p>
              <p className="text-sm font-bold text-blue-900 truncate">{topProduct}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm relative overflow-hidden">
              {!isPremium && <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 rounded-2xl z-10" />}
              <p className="text-xs text-blue-400 mb-1">Stock bajo</p>
              <p className="text-sm font-bold text-red-500">{lowStock} productos</p>
            </div>
            <div className="col-span-2 bg-white rounded-2xl p-4 border border-blue-100 shadow-sm relative overflow-hidden">
              {!isPremium && <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 rounded-2xl z-10" />}
              <p className="text-xs text-blue-400 mb-1">Margen promedio</p>
              <p className="text-2xl font-extrabold text-green-600">
                {inventory.length > 0
                  ? `${(inventory.reduce((s, i) => s + (i.price - (i.cost ?? 0)), 0) / inventory.length).toFixed(2)} USD`
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
