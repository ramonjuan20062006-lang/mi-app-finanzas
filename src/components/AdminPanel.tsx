import { useEffect, useState } from 'react'
import { X, Shield, Crown, Loader, Users, Package, Plus, Trash2, Check, CreditCard as Edit2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useStore, type Plan, type AppPlan } from '../store/useStore'

type AdminTab = 'users' | 'plans' | 'features'

/* ── Plan editor ─────────────────────────────────────────────────────────── */
function PlanEditor({ plan, onSave, onCancel }: {
  plan: Partial<AppPlan>
  onSave: (p: Partial<AppPlan>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<AppPlan>>({
    name: '', price: 0, discount: 0, description: '', features: [], is_active: true,
    ...plan,
  })
  const [featInput, setFeatInput] = useState('')

  const addFeature = () => {
    if (!featInput.trim()) return
    setForm(f => ({ ...f, features: [...(f.features ?? []), featInput.trim()] }))
    setFeatInput('')
  }

  const removeFeature = (i: number) =>
    setForm(f => ({ ...f, features: (f.features ?? []).filter((_, idx) => idx !== i) }))

  return (
    <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 space-y-3 animate-fade-in">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-blue-500 block mb-1">Nombre del plan</label>
          <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-blue-500 block mb-1">Precio (USD/mes)</label>
          <input type="number" value={form.price ?? 0} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-blue-500 block mb-1">Descuento (%)</label>
          <input type="number" min="0" max="100" value={form.discount ?? 0} onChange={e => setForm(f => ({ ...f, discount: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="text-[10px] font-semibold text-blue-500 mr-2">Activo</label>
          <button onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-blue-200'}`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-blue-500 block mb-1">Descripción</label>
        <input value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="text-[10px] font-semibold text-blue-500 block mb-1">Características</label>
        <div className="space-y-1 mb-2">
          {(form.features ?? []).map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-blue-100">
              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className="text-xs text-blue-800 flex-1">{f}</span>
              <button onClick={() => removeFeature(i)}><X className="w-3 h-3 text-red-400" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          <input value={featInput} onChange={e => setFeatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addFeature()}
            placeholder="Añadir característica..."
            className="flex-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-blue-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button onClick={addFeature} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)}
          className="flex-1 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-all">
          Guardar
        </button>
        <button onClick={onCancel}
          className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all">
          Cancelar
        </button>
      </div>
    </div>
  )
}

/* ── Main AdminPanel ─────────────────────────────────────────────────────── */
export default function AdminPanel() {
  const {
    isAdmin, adminLogout, allUsers, loadUsers, setPlan, vetoUser,
    appPlans, loadAppPlans, savePlan, deletePlan,
    premiumFeatures, loadPremiumFeatures, setFeaturePremium,
  } = useStore()

  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [loading, setLoading]     = useState(false)
  const [editingPlan, setEditingPlan] = useState<Partial<AppPlan> | null>(null)
  const [addingPlan, setAddingPlan]   = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    setLoading(true)
    Promise.all([loadUsers(), loadAppPlans(), loadPremiumFeatures()]).then(() => setLoading(false))
  }, [isAdmin, loadUsers, loadAppPlans, loadPremiumFeatures])

  if (!isAdmin) return null

  const handleSavePlan = async (plan: Partial<AppPlan>) => {
    await savePlan(plan)
    setEditingPlan(null)
    setAddingPlan(false)
  }

  const TABS: { id: AdminTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'users',    label: 'Usuarios', Icon: Users },
    { id: 'plans',    label: 'Planes',   Icon: Package },
    { id: 'features', label: 'Funciones', Icon: Crown },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-fade-in" onClick={adminLogout}>
      <div
        className="bg-white rounded-t-2xl w-full max-w-md max-h-[92vh] flex flex-col animate-slide-up"
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

        {/* Tab bar */}
        <div className="flex bg-blue-50 mx-4 mt-3 rounded-xl p-1 gap-1 flex-shrink-0">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === id ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-400'}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* ── USERS TAB ──────────────────────────────────────────── */}
              {activeTab === 'users' && (
                allUsers.length === 0
                  ? <p className="text-center text-sm text-blue-400 py-10">No hay usuarios registrados.</p>
                  : allUsers.map(u => (
                    <div key={u.id} className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-blue-900 truncate">{u.display_name || u.email.split('@')[0]}</p>
                          <p className="text-[11px] text-blue-400 truncate">{u.email}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>
                          {u.plan === 'premium' ? 'Premium' : 'Básico'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
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
                      <button
                        onClick={() => { if (confirm(`¿Vetar/bloquear a ${u.email}?`)) vetoUser(u.id) }}
                        className="w-full py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-all"
                      >
                        Vetar / Bloquear Usuario
                      </button>
                      {u.is_vetted && <p className="mt-1.5 text-[10px] text-red-500 font-semibold text-center">Usuario vetado</p>}
                    </div>
                  ))
              )}

              {/* ── PLANS TAB ──────────────────────────────────────────── */}
              {activeTab === 'plans' && (
                <>
                  {addingPlan && (
                    <PlanEditor plan={{}} onSave={handleSavePlan} onCancel={() => setAddingPlan(false)} />
                  )}
                  {appPlans.map(plan => (
                    editingPlan?.id === plan.id ? (
                      <PlanEditor key={plan.id} plan={plan} onSave={handleSavePlan} onCancel={() => setEditingPlan(null)} />
                    ) : (
                      <div key={plan.id} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-blue-900">{plan.name}</h3>
                              {!plan.is_active && <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Inactivo</span>}
                            </div>
                            <p className="text-[11px] text-blue-400 mt-0.5">{plan.description}</p>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <p className="text-lg font-extrabold text-blue-900">${plan.price}<span className="text-xs font-normal text-blue-400">/mes</span></p>
                            {plan.discount > 0 && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">{plan.discount}% desc.</span>
                            )}
                          </div>
                        </div>
                        <ul className="space-y-0.5 mb-3">
                          {plan.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-[11px] text-blue-700">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" /> {f}
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-[11px] text-blue-400">+{plan.features.length - 3} más...</li>
                          )}
                        </ul>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingPlan(plan)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-all">
                            <Edit2 className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button onClick={() => { if (confirm(`¿Eliminar el plan "${plan.name}"?`)) deletePlan(plan.id) }}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                  {!addingPlan && (
                    <button onClick={() => setAddingPlan(true)}
                      className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-400 text-sm font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Crear nuevo plan
                    </button>
                  )}
                </>
              )}

              {/* ── FEATURES TAB ───────────────────────────────────────── */}
              {activeTab === 'features' && (
                <>
                  <p className="text-xs text-blue-400 pb-1">
                    Controla qué funciones requieren Plan Premium. Los cambios se aplican en tiempo real.
                  </p>
                  {premiumFeatures.map(f => (
                    <div key={f.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-blue-100">
                      <div>
                        <p className="text-sm font-semibold text-blue-900">{f.label}</p>
                        <p className="text-[11px] text-blue-400">{f.requires_premium ? 'Solo Premium' : 'Acceso libre'}</p>
                      </div>
                      <button
                        onClick={() => setFeaturePremium(f.id, !f.requires_premium)}
                        className="flex items-center gap-1.5 transition-colors"
                        title={f.requires_premium ? 'Quitar restricción Premium' : 'Requerir Premium'}
                      >
                        {f.requires_premium
                          ? <ToggleRight className="w-8 h-8 text-amber-500" />
                          : <ToggleLeft className="w-8 h-8 text-blue-300" />
                        }
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
