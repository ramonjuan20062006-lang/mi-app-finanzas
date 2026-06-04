import { useState } from 'react'
import { X, Package } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function ProductModal() {
  const { modal, setModal, addProduct } = useStore()
  const [name, setName]     = useState('')
  const [price, setPrice]   = useState('')
  const [cost, setCost]     = useState('')
  const [stock, setStock]   = useState('')
  const [cat, setCat]       = useState('perfume')
  const [avail, setAvail]   = useState(false)
  const [saving, setSaving] = useState(false)

  if (modal !== 'product') return null

  const close = () => {
    setModal(null)
    setName(''); setPrice(''); setCost(''); setStock('')
    setCat('perfume'); setAvail(false)
  }

  const submit = async () => {
    if (!name.trim() || !price) return
    setSaving(true)
    await addProduct({ name: name.trim(), price: parseFloat(price), cost: parseFloat(cost) || 0, stock: parseInt(stock) || 0, is_available: avail, category: cat })
    setSaving(false)
    close()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-fade-in" onClick={close}>
      <div className="bg-white rounded-t-2xl w-full max-w-md p-6 max-h-[92vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Crear Producto</h3>
          </div>
          <button onClick={close}><X className="w-5 h-5 text-blue-300" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Nombre del producto</label>
            <input type="text" placeholder="Ej: Perfume 212party" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-blue-500 mb-1 block">Precio (USD)</label>
              <input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-500 mb-1 block">Costo (USD)</label>
              <input type="number" placeholder="0.00" value={cost} onChange={e => setCost(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Stock</label>
            <input type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Categoría</label>
            <select value={cat} onChange={e => setCat(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="perfume">Perfume</option>
              <option value="accesorio">Accesorio</option>
              <option value="ropa">Ropa</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-semibold text-blue-700">Disponible</span>
            <button
              onClick={() => setAvail(a => !a)}
              className={`relative w-12 h-6 rounded-full transition-colors ${avail ? 'bg-green-500' : 'bg-blue-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${avail ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          <button onClick={submit} disabled={saving}
            className="w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl shadow-md hover:bg-blue-950 transition-all disabled:opacity-60 active:scale-[0.98]">
            {saving ? 'Guardando…' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  )
}
