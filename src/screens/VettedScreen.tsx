import { ShieldX } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function VettedScreen() {
  const { logout } = useStore()
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-100 max-w-sm w-full text-center animate-scale-in">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-700 mb-3">Acceso Revocado</h2>
        <p className="text-red-600 text-sm leading-relaxed">
          Tu acceso ha sido revocado por el administrador. Comunícate con el soporte para renovar tu suscripción.
        </p>
        <button
          onClick={logout}
          className="mt-6 px-6 py-2.5 bg-red-100 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-200 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
