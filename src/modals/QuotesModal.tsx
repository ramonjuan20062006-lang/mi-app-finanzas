import { useState } from 'react'
import { X, FileText, Plus, Trash2, Copy, Check } from 'lucide-react'
import { useStore } from '../store/useStore'

interface QuoteItem {
  description: string
  quantity: number
  price: number
}

interface Quote {
  id: string
  client: string
  date: string
  items: QuoteItem[]
  notes: string
}

function totalOf(items: QuoteItem[]) {
  return items.reduce((s, i) => s + i.quantity * i.price, 0)
}

export default function QuotesModal() {
  const { modal, setModal } = useStore()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [form, setForm] = useState({ client: '', date: new Date().toISOString().split('T')[0], notes: '' })
  const [items, setItems] = useState<QuoteItem[]>([{ description: '', quantity: 1, price: 0 }])

  if (modal !== 'quotes') return null

  const addItem = () => setItems(prev => [...prev, { description: '', quantity: 1, price: 0 }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof QuoteItem, value: string | number) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  const handleSave = () => {
    if (!form.client.trim() || items.every(i => !i.description.trim())) return
    const validItems = items.filter(i => i.description.trim())
    setQuotes(prev => [...prev, { ...form, items: validItems, id: crypto.randomUUID() }])
    setForm({ client: '', date: new Date().toISOString().split('T')[0], notes: '' })
    setItems([{ description: '', quantity: 1, price: 0 }])
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar esta cotización?')) return
    setQuotes(prev => prev.filter(q => q.id !== id))
  }

  const handleCopy = (q: Quote) => {
    const lines = q.items.map(i => `• ${i.description} x${i.quantity} — $${(i.quantity * i.price).toFixed(2)}`).join('\n')
    const text = `📋 *Cotización Galaxy Store*\nCliente: ${q.client}\nFecha: ${q.date}\n\n${lines}\n\n*Total: $${totalOf(q.items).toFixed(2)} USD*\n${q.notes ? `\nNota: ${q.notes}` : ''}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(q.id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
      <div className="w-full max-w-md bg-blue-50 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-blue-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-900">Cotizaciones</h2>
              <p className="text-[11px] text-blue-400">{quotes.length} cotizaciones</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all active:scale-95">
              <Plus className="w-3.5 h-3.5" /> Nueva
            </button>
            <button onClick={() => setModal(null)} className="p-2 hover:bg-blue-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mx-4 mt-3 bg-white rounded-2xl p-4 border border-blue-100 space-y-3 flex-shrink-0 overflow-y-auto max-h-[60vh]">
            <h3 className="text-sm font-bold text-blue-900">Nueva cotización</h3>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                placeholder="Cliente *" className="col-span-2 w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 focus:ring-blue-200" />
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900 outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-blue-600">Productos / Servicios</p>
              {items.map((item, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                    placeholder="Descripción" className="flex-1 px-2 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 placeholder:text-blue-300 outline-none" />
                  <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                    min={1} className="w-12 px-2 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 outline-none text-center" />
                  <input type="number" value={item.price} onChange={e => updateItem(i, 'price', Number(e.target.value))}
                    placeholder="$" className="w-16 px-2 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 outline-none" />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addItem} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Agregar línea
              </button>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-blue-100">
              <span className="text-xs text-blue-400">Total:</span>
              <span className="text-sm font-bold text-green-600">${totalOf(items).toFixed(2)}</span>
            </div>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Notas adicionales" rows={2}
              className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-blue-200 text-blue-500 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95">Guardar</button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-2 scrollbar-hide">
          {quotes.length === 0 && !showForm ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-sm text-blue-400 text-center">Aún no tienes cotizaciones. Crea la primera.</p>
            </div>
          ) : (
            quotes.map(q => (
              <div key={q.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                <button className="w-full px-4 py-3 flex items-center gap-3 text-left" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-900">{q.client}</p>
                    <p className="text-[10px] text-blue-400">{q.date} · {q.items.length} ítem{q.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">${totalOf(q.items).toFixed(2)}</span>
                </button>
                {expandedId === q.id && (
                  <div className="border-t border-blue-50 px-4 pb-3 bg-blue-50/30">
                    <div className="py-2 space-y-1.5">
                      {q.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs text-blue-700">
                          <span>{item.description} x{item.quantity}</span>
                          <span className="font-semibold">${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                      {q.notes && <p className="text-[11px] text-blue-400 italic mt-2">{q.notes}</p>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleCopy(q)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all active:scale-95">
                        {copied === q.id ? <><Check className="w-3.5 h-3.5" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                      </button>
                      <button onClick={() => handleDelete(q.id)}
                        className="px-3 py-2 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
