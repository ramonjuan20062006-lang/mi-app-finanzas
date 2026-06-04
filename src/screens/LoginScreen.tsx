import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader as Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function LoginScreen() {
  const { login, loginGoogle } = useStore()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr]       = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !pass.trim()) { setErr('Completa todos los campos'); return }
    setLoading(true); setErr('')
    const { ok, msg } = await login(email.trim(), pass)
    if (!ok) setErr(msg || 'Credenciales inválidas')
    setLoading(false)
  }

  const google = async () => {
    setLoading(true); setErr('')
    await loginGoogle()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl mb-4">
            <span className="text-white text-4xl font-extrabold">G</span>
          </div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Galaxy Store Luis</h1>
          <p className="text-sm text-blue-500 mt-1">Tu tienda financiera inteligente</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100">
          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="email" placeholder="Correo electrónico" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type={show ? 'text' : 'password'} placeholder="Contraseña" value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {show ? <EyeOff className="w-5 h-5 text-blue-300" /> : <Eye className="w-5 h-5 text-blue-300" />}
              </button>
            </div>

            {err && (
              <p className="text-red-500 text-xs text-center bg-red-50 rounded-xl py-2 px-3">{err}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 gap-3">
            <div className="flex-1 h-px bg-blue-100" />
            <span className="text-xs text-blue-300 font-medium">o continúa con</span>
            <div className="flex-1 h-px bg-blue-100" />
          </div>

          {/* Google */}
          <button
            onClick={google} disabled={loading}
            className="w-full py-3 bg-white border border-blue-200 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all disabled:opacity-60"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-semibold text-blue-800">Continuar con Google</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-blue-400 mt-5">
          Al continuar aceptas los Terminos de Servicio y Politica de Privacidad
        </p>
      </div>
    </div>
  )
}
