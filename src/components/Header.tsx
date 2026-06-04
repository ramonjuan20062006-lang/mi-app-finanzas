import { useState } from 'react'
import { Circle as HelpCircle, Bell, Search, Settings, LogOut, Shield } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Header() {
  const { user, logout, isAdmin, adminLogin, adminLogout } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')

  const attempt = () => {
    if (adminLogin(u, p)) { setShowModal(false); setU(''); setP(''); setErr('') }
    else setErr('Acceso Denegado / Credenciales Incorrectas')
  }

  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U'

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-blue-100 px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Left — avatar + name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-blue-900">Galaxy store Luis</p>
              <p className="text-[11px] text-blue-400">Propietario</p>
            </div>
          </div>

          {/* Right — action icons */}
          <div className="flex items-center gap-0.5">
            <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors">
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </button>
            <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors relative">
              <Bell className="w-5 h-5 text-blue-400" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-dot" />
            </button>
            <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors">
              <Search className="w-5 h-5 text-blue-400" />
            </button>
            {/* Hidden admin gear */}
            <button
              onClick={() => isAdmin ? adminLogout() : setShowModal(true)}
              title="Admin"
              className={`p-2 rounded-xl hover:bg-blue-50 transition-colors ${isAdmin ? 'opacity-70' : 'opacity-30'}`}
            >
              {isAdmin ? <Shield className="w-4 h-4 text-blue-600" /> : <Settings className="w-4 h-4 text-blue-400" />}
            </button>
            <button onClick={logout} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin login modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Acceso Administrador</h3>
            </div>
            <p className="text-xs text-blue-400 mb-4">Introduce las credenciales de administrador para continuar.</p>
            <input
              type="text" placeholder="Usuario / Clave" value={u} onChange={e => setU(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            />
            <input
              type="password" placeholder="Contraseña" value={p} onChange={e => setP(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
              onKeyDown={e => e.key === 'Enter' && attempt()}
            />
            {err && <p className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 mb-3">{err}</p>}
            <button onClick={attempt} className="w-full py-2.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all">
              Ingresar
            </button>
            <button onClick={() => setShowModal(false)} className="w-full py-2 text-blue-400 text-sm mt-2 hover:text-blue-600">Cancelar</button>
          </div>
        </div>
      )}
    </>
  )
}
