import { useEffect, useMemo, useState } from 'react'
import {
  TrendingUp, TrendingDown, ListFilter as Filter, Calendar,
  Download, Eye, Clock, Plus, Minus, Trash2,
} from 'lucide-react'
import { useStore } from '../store/useStore'

function todayStr() { return new Date().toISOString().split('T')[0] }

function last7() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function dateLabel(s: string) {
  const d = new Date(s + 'T12:00:00')
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`
}

export default function BalanceScreen() {
  const { sales, expenses, loadSales, loadExpenses, deleteSale, deleteExpense, setModal } = useStore()
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [subTab, setSubTab] = useState<'income' | 'expense'>('income')
  const days = useMemo(() => last7(), [])

  useEffect(() => {
    loadSales(selectedDate)
    loadExpenses(selectedDate)
  }, [selectedDate, loadSales, loadExpenses])

  const totalIncome  = sales.reduce((s, x) => s + Number(x.amount), 0)
  const totalExpense = expenses.reduce((s, x) => s + Number(x.amount), 0)
  const balance      = totalIncome - totalExpense
  const isEmpty      = sales.length === 0 && expenses.length === 0

  const handleDeleteSale = async (id: string, desc: string) => {
    if (!confirm(`¿Eliminar ingreso "${desc}"?`)) return
    await deleteSale(id)
  }

  const handleDeleteExpense = async (id: string, desc: string) => {
    if (!confirm(`¿Eliminar gasto "${desc}"?`)) return
    await deleteExpense(id)
  }

  return (
    <div className="px-4 py-4 space-y-4">

      {/* Date filter */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
          <Filter className="w-4 h-4 text-blue-400" />
        </button>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
          {days.map(d => (
            <button key={d} onClick={() => setSelectedDate(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${d === selectedDate ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-500 border border-blue-100'}`}>
              {dateLabel(d)}
            </button>
          ))}
        </div>
        <button className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
          <Calendar className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Balance card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
        <p className="text-xs text-blue-400 mb-1">Balance</p>
        <p className={`text-3xl font-extrabold ${balance >= 0 ? 'text-blue-900' : 'text-red-600'}`}>${balance.toFixed(2)}</p>
        <div className="flex gap-6 mt-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-blue-400">Ingresos</p>
              <p className="text-sm font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] text-blue-400">Egresos</p>
              <p className="text-sm font-bold text-red-500">${totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 border-t border-blue-50 pt-3">
          <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-600 transition-colors">
            <Download className="w-3.5 h-3.5" /> Descargar Reportes
          </button>
          <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-600 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Ver Balance
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-blue-100 shadow-sm">
        <button onClick={() => setSubTab('income')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${subTab === 'income' ? 'bg-green-500 text-white shadow-sm' : 'text-blue-400'}`}>
          Ingresos ({sales.length})
        </button>
        <button onClick={() => setSubTab('expense')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${subTab === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'text-blue-400'}`}>
          Egresos ({expenses.length})
        </button>
      </div>

      {/* List / empty */}
      {isEmpty ? (
        <div className="flex flex-col items-center py-12">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm font-semibold text-blue-700 text-center">No tienes registros creados en esta fecha.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {subTab === 'income'
            ? sales.map(s => (
              <div key={s.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-blue-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">{s.description}</p>
                  <p className="text-[11px] text-blue-400">{s.date}</p>
                </div>
                <span className="text-sm font-bold text-green-600 flex-shrink-0">+${Number(s.amount).toFixed(2)}</span>
                <button onClick={() => handleDeleteSale(s.id, s.description)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
            : expenses.map(e => (
              <div key={e.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-blue-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">{e.description}</p>
                  <p className="text-[11px] text-blue-400">{e.date}</p>
                </div>
                <span className="text-sm font-bold text-red-500 flex-shrink-0">-${Number(e.amount).toFixed(2)}</span>
                <button onClick={() => handleDeleteExpense(e.id, e.description)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
          }
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
