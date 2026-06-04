import { useEffect, useRef, useState } from 'react'
import { Download, ShoppingCart, Info, Crown, Package, Trash2, Plus } from 'lucide-react'
import { useStore, type InventoryItem } from '../store/useStore'

const SEED = [
  { name: 'Perfume 212party',  price: 14, cost: 0, stock: 0, is_available: false, category: 'perfume' },
  { name: 'Perfume bozzs men', price: 12, cost: 0, stock: 0, is_available: false, category: 'perfume' },
  { name: 'Perfumes 9pm',      price: 16, cost: 0, stock: 0, is_available: false, category: 'perfume' },
]

export default function InventoryScreen() {
  const { inventory, loadInventory, addProduct, deleteProduct, user, setModal } = useStore()
  const isPremium = user?.plan === 'premium'
  const [filter, setFilter]     = useState<'all' | 'low'>('all')
  const [sort, setSort]         = useState<'recent' | 'price_asc' | 'price_desc'>('recent')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const seeded = useRef(false)

  useEffect(() => { loadInventory() }, [loadInventory])

  useEffect(() => {
    if (!seeded.current && inventory.length === 0 && user) {
      seeded.current = true
      SEED.forEach(item => addProduct(item))
    }
  }, [inventory.length, user, addProduct])

  const totalRefs  = inventory.length
  const totalCost  = inventory.reduce((s, i) => s + Number(i.cost ?? 0), 0)
  const totalValue = inventory.reduce((s, i) => s + Number(i.price ?? 0) * Number(i.stock ?? 0), 0)

  const sorted = [...inventory].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const filtered = filter === 'low' ? sorted.filter(i => i.stock >= 0 && i.stock < 5) : sorted

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`¿Eliminar "${item.name}" del inventario?`)) return
    setDeleting(item.id)
    if (detailId === item.id) setDetailId(null)
    await deleteProduct(item.id)
    setDeleting(null)
  }

  return (
    <div className="px-4 py-4 space-y-4">

      {/* Top controls */}
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

      {/* Summary — 3 metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl px-3 py-2.5 border border-blue-100 text-center">
          <p className="text-[10px] text-blue-400">Referencias</p>
          <p className="text-lg font-extrabold text-blue-900">{totalRefs}</p>
        </div>
        <div className="bg-white rounded-xl px-3 py-2.5 border border-blue-100 text-center">
          <p className="text-[10px] text-blue-400">Costo total</p>
          <p className="text-base font-extrabold text-blue-900">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl px-3 py-2.5 border border-blue-100 text-center">
          <p className="text-[10px] text-blue-400">Val. inventario</p>
          <p className="text-base font-extrabold text-green-600">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={sort}
          onChange={e => setSort(e.target.value as typeof sort)}
          className="text-xs bg-white border border-blue-100 rounded-lg px-2.5 py-1.5 text-blue-600 focus:outline-none"
        >
          <option value="recent">Más reciente</option>
          <option value="price_asc">Mayor precio</option>
          <option value="price_desc">Menor precio</option>
        </select>
        <div className="flex gap-1.5 ml-auto">
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

      {/* Product list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <Package className="w-10 h-10 text-blue-200 mx-auto mb-2" />
            <p className="text-sm text-blue-400">No hay productos en esta vista</p>
          </div>
        )}
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-3 flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-900 truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.is_available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.is_available ? 'Disponible' : 'No disponible'}
                  </span>
                  <span className="text-[10px] text-blue-400">Stock: {item.stock}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-blue-900">${item.price}</span>
                <button
                  onClick={() => setDetailId(detailId === item.id ? null : item.id)}
                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Info className="w-4 h-4 text-blue-300" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                >
                  <Trash2 className={`w-4 h-4 ${deleting === item.id ? 'text-red-200' : 'text-red-400'}`} />
                </button>
              </div>
            </div>
            {/* Expanded detail */}
            {detailId === item.id && (
              <div className="border-t border-blue-50 px-4 py-3 bg-blue-50/40">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div><span className="text-blue-400">Categoría:</span> <strong className="text-blue-800">{item.category || '—'}</strong></div>
                  <div><span className="text-blue-400">Costo:</span> <strong className="text-blue-800">${item.cost ?? 0}</strong></div>
                  <div><span className="text-blue-400">Precio venta:</span> <strong className="text-green-700">${item.price}</strong></div>
                  <div><span className="text-blue-400">Margen:</span> <strong className="text-green-700">${(item.price - (item.cost ?? 0)).toFixed(2)}</strong></div>
                  <div><span className="text-blue-400">Stock actual:</span> <strong className="text-blue-800">{item.stock}</strong></div>
                  <div><span className="text-blue-400">Val. stock:</span> <strong className="text-blue-800">${(item.price * item.stock).toFixed(2)}</strong></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create product button */}
      <button
        onClick={() => setModal('product')}
        className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl shadow-md hover:bg-blue-950 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Crear producto
      </button>
    </div>
  )
}
