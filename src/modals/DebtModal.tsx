import { useState } from 'react'
import { X, Landmark } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function DebtModal() {
  const { modal, setModal, addDebt } = useStore()
  const [desc, setDesc]     = useState('')
  const [amount, setAmount] = useState('')
  const [contact, setContact] = useState('')
  const [type, setType]     = useState<'receivable' | 'payable'>('receivable')
  const [date, setDate]     = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  if (modal !== 'debt') return null

  const close = () => { setModal(null); setDesc(''); setAmount(''); setContact('') }

  const submit = async () => {
    if (!desc.trim() || !amount) return
    setSaving(true)
    await addDebt({ description: desc.trim(), amount: parseFloat(amount), type, contact_name: contact.trim(), date })
    setSaving(false)
    close()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-fade-in" onClick={close}>
      <div className="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Landmark className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Nueva Deuda</h3>
          </div>
          <button onClick={close}><X className="w-5 h-5 text-blue-300" /></button>
        </div>
        <div className="space-y-3">
          <div className="flex bg-blue-50 rounded-xl p-1">
            {(['receivable', 'payable'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === t ? (t === 'receivable' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'text-blue-400'}`}>
                {t === 'receivable' ? 'Por cobrar' : 'Por pagar'}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Descripción</label>
            <input type="text" placeholder="Ej: Préstamo a Juan" value={desc} onChange={e => setDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Monto (USD)</label>
            <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Contacto (opcional)</label>
            <input type="text" placeholder="Nombre del contacto" value={contact} onChange={e => setContact(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1 block">Fecha</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button onClick={submit} disabled={saving}
            className="w-full py-3.5 bg-blue-700 text-white font-bold rounded-xl shadow-md hover:bg-blue-800 transition-all disabled:opacity-60 active:scale-[0.98]">
            {saving ? 'Guardando…' : 'Crear Deuda'}
          </button>
        </div>
      </div>
    </div>
  )
}
