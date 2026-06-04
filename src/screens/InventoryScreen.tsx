import { useEffect, useRef, useState } from 'react'
import { Download, ShoppingCart, Edit3, Info, Crown, Package } from 'lucide-react'
import { useStore } from '../store/useStore'

const SEED = [
  { name: 'Perfume 212party',  price: 14, cost: 0, stock: 0, is_available: false, category: 'perfume' },
  { name: 'Perfume bozzs men', price: 12, cost: 0, stock: 0, is_available: false, category: 'perfume' },
  { name: 'Perfumes 9pm',      price: 16, cost: 0, stock: 0, is_available: false, category: 'perfume' },
]

export default function InventoryScreen() {
  const { inventory, loadInventory, addProduct, user, setModal } = useStore()
  const isPremium = user?.plan === 'premium'
  const [filter, setFilter] = useState<'all' | 'low'>('all')
  const seeded = useRef(false)

  useEffect(() => { loadInventory() }, [loadInventory])

  useEffect(() => {
    if (!seeded.current && inventory.length === 0 && user) {
      seeded.current = true
      SEED.forEach(item => addProduct(item))
    }
  }, [inventory.length, user, addProduct])

  const totalRefs = inventory.length
  const totalCost = inventory.reduce((s, i) => s + Number(i.cost ?? 0), 0)

  const filtered = filter === 'low'
    ? inventory.filter(i => i.stock >= 0 && i.stock < 5)
    : inventory

  return (
    <div className="px-4 py-4 space-y-4">

      {/* ── Top controls ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-600 transition-colors">
          <Download className="w-4 h-4" />
          Descargar reporte
        </button>
        <button
          onClick={() => setModal('product')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-950 transition-all active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          Registrar compras
        </button>
      </div>

      {/* ── Summary ───────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center justify-between border border-gray-100">
        <span className="text-xs text-gray-500">
          Total de referencias: <strong className="text-blue-900">{totalRefs}</strong>
        </span>
        <span className="text-xs text-gray-500">
          Costo total: <strong className="text-blue-900">${totalCost.toFixed(2)}</strong>
        </span>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <select className="text-xs bg-white border border-blue-100 rounded-lg px-2.5 py-1.5 text-blue-600 focus:outline-none">
          <option>Más reciente</option>
          <option>Mayor precio</option>
          <option>Menor precio</option>
        </select>
        <button className="p-1.5 bg-white border border-blue-100 rounded-lg">
          <Edit3 className="w-4 h-4 text-blue-400" />
        </button>
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-400 border border-blue-100'}`}
          >
            Todas
          </button>
          <button
            onClick={() => {
              if (isPremium) setFilter(f => f === 'low' ? 'all' : 'low')
              else alert('Filtro "Stock bajo" es una función Premium.')
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${filter === 'low' ? 'bg-blue-600 text-white' : 'bg-white text-blue-400 border border-blue-100'}`}
          >
            {!isPremium && <Crown className="w-3 h-3 text-amber-500" />}
            Stock bajo
          </button>
        </div>
      </div>

      {/* ── Product list ──────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-3 flex items-center gap-3 border border-blue-100 shadow-sm">
            <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-900 truncate">{item.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.is_available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {item.is_available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-bold text-blue-900">${item.price}</span>
              <button className="p-1 hover:bg-blue-50 rounded-lg transition-colors">
                <Info className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create product button ─────────────────────────────────────────── */}
      <button
        onClick={() => setModal('product')}
        className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl shadow-md hover:bg-blue-950 transition-all active:scale-[0.98]"
      >
        Crear producto
      </button>
    </div>
  )
}
