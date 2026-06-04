import { useState } from 'react'
import { X, Tag, Package, Share2, Copy, Check } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function CatalogModal() {
  const { modal, setModal, inventory } = useStore()
  const [copied, setCopied] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  if (modal !== 'catalog') return null

  const available = inventory.filter(i => i.is_available)

  const toggleItem = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selected = available.filter(i => selectedIds.has(i.id))

  const handleCopy = () => {
    if (selected.length === 0) return
    const lines = selected.map(i => `• ${i.name} — $${i.price.toFixed(2)}`).join('\n')
    const text = `🛍️ *Catálogo Galaxy Store*\n\n${lines}\n\n✅ Disponible para la venta. Escríbenos para más info.`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
      <div className="w-full max-w-md bg-blue-50 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-blue-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Tag className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-900">Catálogo Virtual</h2>
              <p className="text-[11px] text-blue-400">Selecciona productos para compartir</p>
            </div>
          </div>
          <button onClick={() => setModal(null)} className="p-2 hover:bg-blue-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-3 space-y-2 scrollbar-hide">
          {available.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Package className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-sm text-blue-400 text-center">No tienes productos disponibles en el inventario.</p>
            </div>
          ) : (
            available.map(item => {
              const isSelected = selectedIds.has(item.id)
              return (
                <button key={item.id} onClick={() => toggleItem(item.id)}
                  className={`w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50/60' : 'border-blue-100'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-blue-200'}`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-blue-900">{item.name}</p>
                    {item.category && <p className="text-[10px] text-blue-400">{item.category}</p>}
                  </div>
                  <span className="text-sm font-bold text-green-600">${item.price.toFixed(2)}</span>
                </button>
              )
            })
          )}
        </div>

        {/* Actions */}
        {available.length > 0 && (
          <div className="px-4 pb-6 pt-2 border-t border-blue-100 flex-shrink-0 space-y-2">
            <p className="text-xs text-blue-400 text-center">{selectedIds.size} producto{selectedIds.size !== 1 ? 's' : ''} seleccionado{selectedIds.size !== 1 ? 's' : ''}</p>
            <div className="flex gap-2">
              <button onClick={() => setSelectedIds(new Set(available.map(i => i.id)))}
                className="flex-1 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all">
                Seleccionar todos
              </button>
              <button onClick={handleCopy} disabled={selectedIds.size === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-40">
                {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar catálogo</>}
              </button>
            </div>
            <button disabled={selectedIds.size === 0} className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all active:scale-95 disabled:opacity-40">
              <Share2 className="w-4 h-4" /> Compartir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
