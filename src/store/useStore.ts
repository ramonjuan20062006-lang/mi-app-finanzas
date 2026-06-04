import { create } from 'zustand'
import { supabase } from '../lib/supabase'

/* ── Types ────────────────────────────────────────────────────────────────── */
export type Plan = 'basic' | 'premium'
export type Tab  = 'home' | 'balance' | 'debts' | 'inventory'

export interface Profile {
  id: string
  email: string
  display_name: string
  plan: Plan
  is_vetted: boolean
}

export interface Sale {
  id: string
  description: string
  amount: number
  date: string
  created_at: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  created_at: string
}

export interface Debt {
  id: string
  description: string
  amount: number
  type: 'receivable' | 'payable'
  contact_name: string
  is_paid: boolean
  date: string
  created_at: string
}

export interface InventoryItem {
  id: string
  name: string
  price: number
  cost: number
  stock: number
  is_available: boolean
  category: string
  created_at: string
}

interface Rates {
  bcv: number
  dolarHoy: number
  euro: number
  updatedAt: string
}

/* ── Edge-function helpers ────────────────────────────────────────────────── */
const EDGE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`
const edgeHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
})

/* ── Store interface ──────────────────────────────────────────────────────── */
interface AppState {
  /* auth */
  user: Profile | null
  isLoggedIn: boolean
  isVetted: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; msg?: string }>
  loginGoogle: () => Promise<void>
  logout: () => void
  upsertProfile: () => Promise<void>
  pollStatus: () => Promise<void>

  /* nav */
  tab: Tab
  setTab: (t: Tab) => void

  /* rates */
  rates: Rates
  refreshRates: () => void

  /* data */
  sales: Sale[]
  expenses: Expense[]
  debts: Debt[]
  inventory: InventoryItem[]
  loadSales: (date?: string) => Promise<void>
  loadExpenses: (date?: string) => Promise<void>
  loadDebts: () => Promise<void>
  loadInventory: () => Promise<void>
  addSale: (d: { description: string; amount: number; date: string }) => Promise<void>
  addExpense: (d: { description: string; amount: number; date: string }) => Promise<void>
  addDebt: (d: { description: string; amount: number; type: 'receivable' | 'payable'; contact_name: string; date: string }) => Promise<void>
  addProduct: (d: { name: string; price: number; cost: number; stock: number; is_available: boolean; category: string }) => Promise<void>

  /* admin */
  isAdmin: boolean
  adminLogin: (u: string, p: string) => boolean
  adminLogout: () => void
  allUsers: Profile[]
  loadUsers: () => Promise<void>
  setPlan: (uid: string, plan: Plan) => Promise<void>
  vetoUser: (uid: string) => Promise<void>

  /* modals */
  modal: 'sale' | 'expense' | 'product' | 'debt' | null
  setModal: (m: AppState['modal']) => void
}

/* ── Simulated rates ──────────────────────────────────────────────────────── */
function simulateRates(): Rates {
  const v = () => Math.round((Math.random() - 0.5) * 3 * 100) / 100
  return {
    bcv:      Math.round((78.52 + v()) * 100) / 100,
    dolarHoy: Math.round((80.18 + v()) * 100) / 100,
    euro:     Math.round((85.34 + v()) * 100) / 100,
    updatedAt: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
  }
}

/* ── Store ────────────────────────────────────────────────────────────────── */
export const useStore = create<AppState>((set, get) => ({
  /* auth ------------------------------------------------------------------- */
  user: null,
  isLoggedIn: false,
  isVetted: false,

  login: async (email, password) => {
    // Try sign-in first
    const { data: si, error: sie } = await supabase.auth.signInWithPassword({ email, password })
    if (!sie && si.user) {
      await get().upsertProfile()
      return { ok: true }
    }
    // If not found, auto-register
    const { data: su, error: sue } = await supabase.auth.signUp({ email, password })
    if (sue) return { ok: false, msg: sie?.message || sue.message }
    if (su.user) {
      await get().upsertProfile()
      return { ok: true }
    }
    return { ok: false, msg: 'Error inesperado. Intenta de nuevo.' }
  },

  loginGoogle: async () => {
    const fake = `google_${Date.now()}@gmail.com`
    const { data: su } = await supabase.auth.signUp({ email: fake, password: 'Galaxy!2024' })
    if (!su.user) {
      await supabase.auth.signInWithPassword({ email: fake, password: 'Galaxy!2024' })
    }
    await get().upsertProfile()
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isLoggedIn: false, isVetted: false, sales: [], expenses: [], debts: [], inventory: [], isAdmin: false })
  },

  upsertProfile: async () => {
    const { data: { user: au } } = await supabase.auth.getUser()
    if (!au) return
    const { data: existing } = await supabase.from('profiles').select('*').eq('id', au.id).maybeSingle()
    if (existing) {
      if (existing.is_vetted) { set({ isVetted: true, user: existing as Profile }); return }
      set({ user: existing as Profile, isLoggedIn: true })
    } else {
      const np: Profile = { id: au.id, email: au.email ?? '', display_name: (au.email ?? '').split('@')[0], plan: 'basic', is_vetted: false }
      await supabase.from('profiles').insert(np)
      set({ user: np, isLoggedIn: true })
    }
  },

  pollStatus: async () => {
    const { user } = get()
    if (!user) return
    const { data } = await supabase.from('profiles').select('is_vetted,plan').eq('id', user.id).maybeSingle()
    if (!data) return
    if (data.is_vetted) { set({ isVetted: true }); return }
    if (data.plan !== user.plan) set({ user: { ...user, plan: data.plan as Plan } })
  },

  /* nav -------------------------------------------------------------------- */
  tab: 'home',
  setTab: (t) => set({ tab: t }),

  /* rates ------------------------------------------------------------------ */
  rates: simulateRates(),
  refreshRates: () => set({ rates: simulateRates() }),

  /* data ------------------------------------------------------------------- */
  sales: [], expenses: [], debts: [], inventory: [],

  loadSales: async (date) => {
    const { user } = get(); if (!user) return
    let q = supabase.from('sales').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (date) q = q.eq('date', date)
    const { data } = await q
    if (data) set({ sales: data as Sale[] })
  },

  loadExpenses: async (date) => {
    const { user } = get(); if (!user) return
    let q = supabase.from('expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (date) q = q.eq('date', date)
    const { data } = await q
    if (data) set({ expenses: data as Expense[] })
  },

  loadDebts: async () => {
    const { user } = get(); if (!user) return
    const { data } = await supabase.from('debts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) set({ debts: data as Debt[] })
  },

  loadInventory: async () => {
    const { user } = get(); if (!user) return
    const { data } = await supabase.from('inventory').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) set({ inventory: data as InventoryItem[] })
  },

  addSale: async (d) => {
    const { user } = get(); if (!user) return
    await supabase.from('sales').insert({ ...d, user_id: user.id })
    await get().loadSales()
  },

  addExpense: async (d) => {
    const { user } = get(); if (!user) return
    await supabase.from('expenses').insert({ ...d, user_id: user.id })
    await get().loadExpenses()
  },

  addDebt: async (d) => {
    const { user } = get(); if (!user) return
    await supabase.from('debts').insert({ ...d, user_id: user.id })
    await get().loadDebts()
  },

  addProduct: async (d) => {
    const { user } = get(); if (!user) return
    await supabase.from('inventory').insert({ ...d, user_id: user.id })
    await get().loadInventory()
  },

  /* admin ------------------------------------------------------------------ */
  isAdmin: false,

  adminLogin: (u, p) => {
    if (u === 'Luis31600218' && p === '12345678') {
      set({ isAdmin: true })
      return true
    }
    return false
  },

  adminLogout: () => set({ isAdmin: false, allUsers: [] }),

  allUsers: [],

  loadUsers: async () => {
    try {
      const res = await fetch(`${EDGE}/users`, { headers: edgeHeaders() })
      const json = await res.json()
      if (json.data) { set({ allUsers: json.data as Profile[] }); return }
    } catch { /* fallback */ }
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) set({ allUsers: data as Profile[] })
  },

  setPlan: async (uid, plan) => {
    try {
      await fetch(`${EDGE}/update-plan`, { method: 'POST', headers: edgeHeaders(), body: JSON.stringify({ userId: uid, plan }) })
    } catch {
      await supabase.from('profiles').update({ plan }).eq('id', uid)
    }
    await get().loadUsers()
    const { user } = get()
    if (user?.id === uid) set({ user: { ...user, plan } })
  },

  vetoUser: async (uid) => {
    try {
      await fetch(`${EDGE}/veto-user`, { method: 'POST', headers: edgeHeaders(), body: JSON.stringify({ userId: uid }) })
    } catch {
      await supabase.from('profiles').update({ is_vetted: true }).eq('id', uid)
    }
    await get().loadUsers()
    const { user } = get()
    if (user?.id === uid) set({ isVetted: true })
  },

  /* modals ----------------------------------------------------------------- */
  modal: null,
  setModal: (m) => set({ modal: m }),
}))
