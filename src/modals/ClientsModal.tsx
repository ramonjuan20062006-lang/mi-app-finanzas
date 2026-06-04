import { useState } from 'react'
import { X, Users, Plus, Phone, Mail, MapPin, Trash2, Search } from 'lucide-react'
import { useStore } from '../store/useStore'

interface Client {
  id: string
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

export default function ClientsModal() {
  const { modal, setModal } = useStore()
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '' })

  if (modal !== 'clients') return null

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!form.name.trim()) return
    setClients(prev => [...prev, { ...form, id: crypto.randomUUID() }])
    setForm({ name: '', phone: '', email: '', address: '', notes: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`¿Eliminar cliente "${name}"?`)) return
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
      <div className="w-full max-w-md bg-blue-50 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-blue-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-900">Clientes</h2>
              <p className="text-[11px] text-blue-400">{clients.length} clientes registrados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all active:scale-95">
              <Plus className="w-3.5 h-3.5" /> Nuevo
            </button>
            <button onClick={() => setModal(null)} className="p-2 hover:bg-blue-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-blue-300" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." className="flex-1 text-sm outline-none text-blue-900 placeholder:text-blue-300 bg-transparent" />
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mx-4 mb-3 bg-white rounded-2xl p-4 border border-blue-100 space-y-3 flex-shrink-0">
            <h3 className="text-sm font-bold text-blue-900">Nuevo cliente</h3>
            {[
              { key: 'name', placeholder: 'Nombre completo *', icon: Users },
              { key: 'phone', placeholder: 'Teléfono', icon: Phone },
              { key: 'email', placeholder: 'Correo electrónico', icon: Mail },
              { key: 'address', placeholder: 'Dirección', icon: MapPin },
            ].map(({ key, placeholder }) => (
              <input key={key} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 focus:ring-blue-200" />
            ))}
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Notas adicionales" rows={2}
              className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900 placeholder:text-blue-300 outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-blue-200 text-blue-500 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95">Guardar</button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 scrollbar-hide">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-sm text-blue-400 text-center">{clients.length === 0 ? 'Aún no tienes clientes registrados.' : 'No se encontraron resultados.'}</p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.id} className="bg-white rounded-2xl px-4 py-3 border border-blue-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">{c.name[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-900 truncate">{c.name}</p>
                  {c.phone && <p className="text-[11px] text-blue-400">{c.phone}</p>}
                  {c.email && <p className="text-[11px] text-blue-300 truncate">{c.email}</p>}
                </div>
                <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
