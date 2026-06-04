import { useEffect, useState } from 'react'
import { Banknote, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function DebtsScreen() {
  const { debts, loadDebts, deleteDebt, setModal } = useStore()
  const [tab, setTab] = useState<'receivable' | 'payable'>('receivable')

  useEffect(() => { loadDebts() }, [loadDebts])

  const list = debts.filter(d => d.type === tab)

  const handleDelete = async (id: string, desc: string) => {
    if (!confirm(`¿Eliminar deuda "${desc}"?`)) return
    await deleteDebt(id)
  }

  return (
    <div className="px-4 py-4 space-y-4">

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-blue-100 shadow-sm">
        <button onClick={() => setTab('receivable')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'receivable' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-400'}`}>
          Por cobrar ({debts.filter(d => d.type === 'receivable').length})
        </button>
        <button onClick={() => setTab('payable')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'payable' ? 'bg-red-500 text-white shadow-sm' : 'text-blue-400'}`}>
          Por pagar ({debts.filter(d => d.type === 'payable').length})
        </button>
      </div>

      {/* List / empty */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center py-14">
          <div className="relative mb-5">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
              <Banknote className="w-12 h-12 text-blue-200" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-blue-900 text-center px-4">
            {tab === 'receivable'
              ? "No tienes deudas por cobrar. Créalas en 'Nueva venta'."
              : "No tienes deudas por pagar. Registra un gasto para crearlas."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(d => (
            <div key={d.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-blue-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">{d.description}</p>
                {d.contact_name && <p className="text-[11px] text-blue-400">{d.contact_name}</p>}
                <p className="text-[10px] text-blue-300">{d.date}</p>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <p className={`text-sm font-bold ${d.type === 'receivable' ? 'text-green-600' : 'text-red-500'}`}>
                  ${Number(d.amount).toFixed(2)}
                </p>
                {d.is_paid && <span className="text-[10px] text-green-500 font-semibold">Pagado</span>}
              </div>
              <button
                onClick={() => handleDelete(d.id, d.description)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating action buttons */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => setModal('sale')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white rounded-xl font-bold shadow-md hover:bg-green-600 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Nueva venta
        </button>
        <button onClick={() => setModal('expense')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-500 text-white rounded-xl font-bold shadow-md hover:bg-red-600 transition-all active:scale-95">
          <Minus className="w-5 h-5" /> Nuevo gasto
        </button>
      </div>
    </div>
  )
}
