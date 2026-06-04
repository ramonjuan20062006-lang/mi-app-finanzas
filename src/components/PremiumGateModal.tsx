import { Crown, X, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function PremiumGateModal() {
  const { premiumGate, setPremiumGate, setModal } = useStore()
  if (!premiumGate) return null

  const handleExplorePlans = () => {
    setPremiumGate(null)
    setModal('plans')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setPremiumGate(null)}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end mb-1">
          <button onClick={() => setPremiumGate(null)} className="p-1.5 hover:bg-blue-50 rounded-xl transition-colors">
            <X className="w-4 h-4 text-blue-300" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center pb-2">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-lg font-extrabold text-blue-900 mb-2">Funcion Premium</h2>
          <p className="text-sm text-blue-500 leading-relaxed mb-1">
            <strong className="text-blue-700">"{premiumGate}"</strong> está disponible solo para usuarios con plan Premium.
          </p>
          <p className="text-sm text-blue-400">
            Contacta al administrador de Galaxy Store para activar tu plan y acceder a todas las funciones.
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <button
            onClick={handleExplorePlans}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md"
          >
            Ver planes disponibles <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPremiumGate(null)}
            className="w-full py-3 border border-blue-100 text-blue-500 rounded-2xl font-semibold text-sm hover:bg-blue-50 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
