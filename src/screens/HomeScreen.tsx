import { useState } from 'react'
import {
  RefreshCw, ShoppingCart, TrendingDown, Package, Crown, ArrowRight,
  Tag, FileText, Landmark, BarChart3, Users, Truck, UserCog,
} from 'lucide-react'
import { useStore } from '../store/useStore'

export default function HomeScreen() {
  const { user, rates, refreshRates, setTab, setModal } = useStore()
  const isPremium = user?.plan === 'premium'
  const [amount, setAmount]     = useState('')
  const [converted, setConverted] = useState<number | null>(null)

  const handleConvert = () => {
    const n = parseFloat(amount)
    if (!isNaN(n)) setConverted(Math.round(n * rates.bcv * 100) / 100)
  }

  const premiumGuard = (label: string) => {
    if (!isPremium) alert(`"${label}" es una función Premium.\nContacta al administrador para activar tu plan.`)
  }

  const SUGGESTIONS = [
    { label: 'Catálogo Virtual', Icon: Tag,     premium: false, action: () => alert('Catálogo Virtual — próximamente') },
    { label: 'Cotizaciones',     Icon: FileText, premium: false, isNew: true, action: () => alert('Cotizaciones — próximamente') },
    { label: 'Deudas',           Icon: Landmark, premium: false, action: () => setTab('debts') },
    { label: 'Estadísticas',     Icon: BarChart3, premium: true, action: () => isPremium ? alert('Estadísticas Premium') : premiumGuard('Estadísticas') },
    { label: 'Clientes',         Icon: Users,    premium: true, action: () => isPremium ? alert('Clientes Premium') : premiumGuard('Clientes') },
    { label: 'Proveedores',      Icon: Truck,    premium: true, action: () => isPremium ? alert('Proveedores Premium') : premiumGuard('Proveedores') },
    { label: 'Empleados',        Icon: UserCog,  premium: true, action: () => isPremium ? alert('Empleados Premium') : premiumGuard('Empleados') },
  ]

  return (
    <div className="px-4 py-4 space-y-4">

      {/* ── Exchange Rate Widget ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold">Tasas de Cambio — Venezuela</p>
            <p className="text-[11px] opacity-70">Actualizado: {rates.updatedAt}</p>
          </div>
          <button
            onClick={refreshRates}
            className="flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </button>
        </div>

        {/* Rate tiles */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'USD/BS · BCV',  value: rates.bcv },
            { label: 'USD/BS · Hoy',  value: rates.dolarHoy },
            { label: 'EUR/BS · Oficial', value: rates.euro },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-[10px] opacity-75 mb-0.5">{label}</p>
              <p className="text-lg font-extrabold">{value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Converter */}
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-[11px] opacity-80 mb-2">Conversor rápido · USD → BS (Tasa BCV)</p>
          <div className="flex gap-2">
            <input
              type="number" placeholder="Monto en USD" value={amount}
              onChange={e => { setAmount(e.target.value); setConverted(null) }}
              className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              onClick={handleConvert}
              className="px-4 py-2 bg-white text-blue-800 font-bold rounded-lg text-sm hover:bg-blue-50 transition-all active:scale-95"
            >
              Calcular
            </button>
          </div>
          {converted !== null && (
            <p className="mt-2 text-sm font-bold">
              {amount} USD = {converted.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
            </p>
          )}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setModal('sale')}
          className="bg-blue-900 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:bg-blue-950 transition-all active:scale-95"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[11px] font-semibold leading-tight text-center">Registrar Venta</span>
        </button>
        <button
          onClick={() => setModal('expense')}
          className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <TrendingDown className="w-6 h-6 text-red-500" />
          <span className="text-[11px] font-semibold text-blue-900 leading-tight text-center">Registrar Gasto</span>
        </button>
        <button
          onClick={() => setTab('inventory')}
          className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Package className="w-6 h-6 text-blue-500" />
          <span className="text-[11px] font-semibold text-blue-900 leading-tight text-center">Ver Inventario</span>
        </button>
      </div>

      {/* ── Promo Banner ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-4 flex items-center gap-3 shadow-md">
        <div className="flex-1">
          <p className="text-white text-sm font-bold leading-snug">
            Agiliza tus ventas! Con el Plan Básico o Pro, genera tickets de venta
          </p>
          <button className="mt-2 flex items-center gap-1 text-white/90 text-xs font-semibold hover:text-white transition-colors">
            Explorar planes <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* ── Premium Stats ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-blue-900">Función premium</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Producto estrella', value: '$78' },
            { label: 'Ganancias',         value: '$247', green: true },
          ].map(({ label, value, green }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm relative overflow-hidden">
              {!isPremium && (
                <div className="absolute inset-0 z-10 blur-premium bg-white/20 rounded-2xl" />
              )}
              <p className="text-[11px] text-blue-400 mb-1">{label}</p>
              <p className={`text-2xl font-extrabold ${green ? 'text-green-600' : 'text-blue-900'}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Suggestions Grid ──────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-blue-900 mb-3">Sugeridos para ti</h3>
        <div className="grid grid-cols-4 gap-3">
          {SUGGESTIONS.map(({ label, Icon, premium, isNew, action }) => (
            <button
              key={label}
              onClick={action}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-blue-100 shadow-sm hover:shadow-md transition-all active:scale-95 relative"
            >
              {premium && !isPremium && (
                <Crown className="w-3 h-3 text-amber-500 absolute top-1.5 right-1.5" />
              )}
              {isNew && (
                <span className="absolute top-1.5 left-1.5 text-[8px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Nuevo</span>
              )}
              <Icon className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] text-blue-700 font-semibold text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
