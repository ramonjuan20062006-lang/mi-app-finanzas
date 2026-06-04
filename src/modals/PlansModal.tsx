import { useStore, type AppPlan } from '../store/useStore'
import { X, Crown, Check, Star } from 'lucide-react'

function PlanCard({ plan, isPremium }: { plan: AppPlan; isPremium: boolean }) {
  const finalPrice = plan.discount > 0
    ? plan.price * (1 - plan.discount / 100)
    : plan.price

  return (
    <div className={`relative rounded-2xl border-2 p-4 transition-all ${plan.price === 0 ? 'border-blue-200 bg-white' : isPremium ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-white' : 'border-blue-400 bg-gradient-to-br from-blue-50 to-white'}`}>
      {plan.price > 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${isPremium ? 'bg-amber-400' : 'bg-blue-500'}`}>
            {isPremium ? 'RECOMENDADO' : 'POPULAR'}
          </span>
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-blue-900 text-sm">{plan.name}</h3>
          <p className="text-[11px] text-blue-400 mt-0.5">{plan.description}</p>
        </div>
        {plan.price > 0 && <Crown className={`w-5 h-5 flex-shrink-0 ${isPremium ? 'text-amber-400' : 'text-blue-400'}`} />}
      </div>
      <div className="mb-3">
        {plan.discount > 0 && (
          <span className="text-xs text-red-400 line-through mr-1">${plan.price.toFixed(2)}</span>
        )}
        <span className="text-2xl font-extrabold text-blue-900">
          {finalPrice === 0 ? 'Gratis' : `$${finalPrice.toFixed(2)}`}
        </span>
        {finalPrice > 0 && <span className="text-xs text-blue-400">/mes</span>}
        {plan.discount > 0 && (
          <span className="ml-2 text-[10px] bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">
            -{plan.discount}%
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-blue-700">
            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      <button className={`mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${plan.price === 0 ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : isPremium ? 'bg-amber-400 text-white hover:bg-amber-500 shadow-md' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}>
        {plan.price === 0 ? 'Plan actual' : 'Contactar para activar'}
      </button>
    </div>
  )
}

export default function PlansModal() {
  const { modal, setModal, appPlans } = useStore()
  if (modal !== 'plans') return null

  const activePlans = appPlans.filter(p => p.is_active)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
      <div className="w-full max-w-md bg-blue-50 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-blue-50 px-5 pt-5 pb-3 flex items-center justify-between border-b border-blue-100 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-900">Planes disponibles</h2>
              <p className="text-[11px] text-blue-400">Elige el plan perfecto para tu negocio</p>
            </div>
          </div>
          <button onClick={() => setModal(null)} className="p-2 hover:bg-blue-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-blue-400" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {activePlans.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="w-10 h-10 text-blue-200 mx-auto mb-3" />
              <p className="text-sm text-blue-400">No hay planes disponibles en este momento.</p>
            </div>
          ) : (
            activePlans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} isPremium={i === activePlans.length - 1 && plan.price > 0} />
            ))
          )}
        </div>
        <div className="px-4 pb-6">
          <p className="text-center text-[11px] text-blue-400">
            Para activar un plan, contacta al administrador de Galaxy Store.
          </p>
        </div>
      </div>
    </div>
  )
}
