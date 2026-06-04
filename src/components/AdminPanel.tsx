import { useEffect, useState } from 'react'
import { X, Shield, Crown, Loader as Loader2 } from 'lucide-react'
import { useStore, type Plan } from '../store/useStore'

export default function AdminPanel() {
  const { isAdmin, adminLogout, allUsers, loadUsers, setPlan, vetoUser } = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) { setLoading(true); loadUsers().then(() => setLoading(false)) }
  }, [isAdmin, loadUsers])

  if (!isAdmin) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-fade-in"
      onClick={adminLogout}
    >
      <div
        className="bg-white rounded-t-2xl w-full max-w-md max-h-[88vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-blue-900">Panel Administrador</h2>
          </div>
          <button onClick={adminLogout} className="p-1.5 hover:bg-blue-50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* User list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>
          ) : allUsers.length === 0 ? (
            <p className="text-center text-sm text-blue-400 py-10">No hay usuarios registrados.</p>
          ) : (
            allUsers.map(u => (
              <div key={u.id} className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
                {/* User info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {u.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-900 truncate">{u.display_name || u.email.split('@')[0]}</p>
                    <p className="text-[11px] text-blue-400 truncate">{u.email}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>
                    {u.plan === 'premium' ? 'Premium' : 'Básico'}
                  </span>
                </div>

                {/* Plan toggle */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${u.plan === 'premium' ? 'text-amber-500' : 'text-blue-300'}`} />
                    <span className="text-xs font-medium text-blue-600">Plan Premium</span>
                  </div>
                  <button
                    onClick={() => setPlan(u.id, (u.plan === 'premium' ? 'basic' : 'premium') as Plan)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${u.plan === 'premium' ? 'bg-amber-400' : 'bg-blue-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${u.plan === 'premium' ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Veto */}
                <button
                  onClick={() => { if (confirm(`¿Vetar/bloquear a ${u.email}? El usuario perderá acceso inmediatamente.`)) vetoUser(u.id) }}
                  className="w-full py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-all"
                >
                  Vetar / Bloquear Usuario
                </button>
                {u.is_vetted && <p className="mt-1.5 text-[10px] text-red-500 font-semibold text-center">Usuario vetado</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
