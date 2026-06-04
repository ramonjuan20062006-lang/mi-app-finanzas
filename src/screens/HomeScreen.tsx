import { useEffect, useState } from 'react'
import { RefreshCw, ShoppingCart, TrendingDown, Package, Crown, ArrowRight, Tag, FileText, Landmark, ChartBar as BarChart2, Users, Truck, UserCog } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function HomeScreen() {
  const { user, rates, refreshRates, setTab, setModal, isFeaturePremium, setPremiumGate } = useStore()
  const isPremium = user?.plan === 'premium'
  const [amount, setAmount]       = useState('')
  const [converted, setConverted] = useState<number | null>(null)
  const [rateType, setRateType]   = useState<'bcv' | 'hoy' | 'euro'>('bcv')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Refresh rates every 5 minutes while on home screen
    const id = setInterval(() => refreshRates(), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [refreshRates])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshRates()
    setRefreshing(false)
  }

  const handleConvert = () => {
    const n = parseFloat(amount)
    if (isNaN(n)) return
    const rate = rateType === 'bcv' ? rates.bcv : rateType === 'hoy' ? rates.dolarHoy : rates.euro
    setConverted(parseFloat((n * rate).toFixed(2)))
  }

  const guardPremium = (label: string, featureId: string, action: () => void) => {
    if (isFeaturePremium(featureId)) {
      setPremiumGate(label)
    } else {
      action()
    }
  }

  const SUGGESTIONS = [
    {
      id: 'catalogo', label: 'Catálogo Virtual', Icon: Tag,
      action: () => guardPremium('Catálogo Virtual', 'catalogo', () => setModal('catalog')),
    },
    {
      id: 'cotizaciones', label: 'Cotizaciones', Icon: FileText, isNew: true,
      action: () => guardPremium('Cotizaciones', 'cotizaciones', () => setModal('quotes')),
    },
    {
      id: 'deudas', label: 'Deudas', Icon: Landmark,
      action: () => setTab('debts'),
    },
    {
      id: 'estadisticas', label: 'Estadísticas', Icon: BarChart2,
      action: () => guardPremium('Estadísticas', 'estadisticas', () => setModal('stats')),
    },
    {
      id: 'clientes', label: 'Clientes', Icon: Users,
      action: () => guardPremium('Clientes', 'clientes', () => setModal('clients')),
    },
    {
      id: 'proveedores', label: 'Proveedores', Icon: Truck,
      action: () => guardPremium('Proveedores', 'proveedores', () => setModal('suppliers')),
    },
    {
      id: 'empleados', label: 'Empleados', Icon: UserCog,
      action: () => guardPremium('Empleados', 'empleados', () => setModal('employees')),
    },
  ]

  const rateLabel = rateType === 'bcv' ? 'BCV' : rateType === 'hoy' ? 'Dólar Hoy' : 'EUR'

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
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { id: 'bcv' as const,  label: 'USD/BS · BCV',     value: rates.bcv },
            { id: 'hoy' as const,  label: 'USD/BS · Hoy',     value: rates.dolarHoy },
            { id: 'euro' as const, label: 'EUR/BS · Oficial',  value: rates.euro },
          ].map(({ id, label, value }) => (
            <button
              key={id}
              onClick={() => setRateType(id)}
              className={`rounded-xl p-2.5 text-center transition-all ${rateType === id ? 'bg-white/30 ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/20'}`}
            >
              <p className="text-[10px] opacity-75 mb-0.5">{label}</p>
              <p className="text-base font-extrabold tabular-nums">{value.toFixed(2)}</p>
            </button>
          ))}
        </div>

        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-[11px] opacity-80 mb-2">
            Conversor rápido · {rateType === 'euro' ? 'EUR' : 'USD'} → BS ({rateLabel})
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={`Monto en ${rateType === 'euro' ? 'EUR' : 'USD'}`}
              value={amount}
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
              {amount} {rateType === 'euro' ? 'EUR' : 'USD'} = {converted.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
            </p>
          )}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setModal('sale')}
          className="bg-blue-900 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:bg-blue-950 transition-all active:scale-95">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[11px] font-semibold leading-tight text-center">Registrar Venta</span>
        </button>
        <button onClick={() => setModal('expense')}
          className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95">
          <TrendingDown className="w-6 h-6 text-red-500" />
          <span className="text-[11px] font-semibold text-blue-900 leading-tight text-center">Registrar Gasto</span>
        </button>
        <button onClick={() => setTab('inventory')}
          className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95">
          <Package className="w-6 h-6 text-blue-500" />
          <span className="text-[11px] font-semibold text-blue-900 leading-tight text-center">Ver Inventario</span>
        </button>
      </div>

      {/* ── Promo Banner ──────────────────────────────────────────────────── */}
      <button
        onClick={() => setModal('plans')}
        className="w-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-4 flex items-center gap-3 shadow-md hover:from-blue-500 hover:to-blue-700 transition-all active:scale-[0.98] text-left"
      >
        <div className="flex-1">
          <p className="text-white text-sm font-bold leading-snug">
            Agiliza tus ventas! Con el Plan Básico o Pro, genera tickets de venta
          </p>
          <p className="mt-1 flex items-center gap-1 text-white/90 text-xs font-semibold">
            Explorar planes <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-white" />
        </div>
      </button>

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
              {!isPremium && <div className="absolute inset-0 z-10 blur-premium bg-white/20 rounded-2xl" />}
              <p className="text-[11px] text-blue-400 mb-1">{label}</p>
              <p className={`text-2xl font-extrabold ${green ? 'text-green-600' : 'text-blue-900'}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Suggestions Grid ──────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-blue-900 mb-3">Sugeridos para ti</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {SUGGESTIONS.map(({ id, label, Icon, isNew, action }) => {
            const locked = isFeaturePremium(id)
            return (
              <button
                key={id}
                onClick={action}
                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-blue-100 shadow-sm hover:shadow-md transition-all active:scale-95 relative"
              >
                {locked && <Crown className="w-3 h-3 text-amber-500 absolute top-1.5 right-1.5" />}
                {isNew && <span className="absolute top-1.5 left-1.5 text-[8px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Nuevo</span>}
                <Icon className={`w-5 h-5 ${locked ? 'text-blue-300' : 'text-blue-500'}`} />
                <span className={`text-[10px] font-semibold text-center leading-tight ${locked ? 'text-blue-300' : 'text-blue-700'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
