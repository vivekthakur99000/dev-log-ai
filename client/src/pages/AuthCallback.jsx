import { useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import authService from '../services/auth.service'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()

  useEffect(() => {
    // First check fragment token: server redirects to frontend with token in hash
    const hash = location.hash || ''
    if (hash.startsWith('#')) {
      const params = new URLSearchParams(hash.slice(1))
      const token = params.get('token')
      const userRaw = params.get('user')
      if (token) {
        let user = null
        try {
          user = userRaw ? JSON.parse(decodeURIComponent(userRaw)) : null
        } catch (e) {
          user = null
        }
        dispatch(setCredentials({ token, user }))
        navigate('/dashboard')
        return
      }
    }

    // Fallback: check for code query param (in case client initiated exchange)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('GitHub auth error:', error)
      navigate('/login')
      return
    }

    if (!code) {
      // nothing to do
      navigate('/login')
      return
    }

    // Exchange code for token via API
    const exchangeCode = async () => {
      try {
        const data = await authService.exchangeCodeForToken(code)

        if (data.token) {
          // Save token to Redux and localStorage
          dispatch(setCredentials({ token: data.token, user: data.user }))
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Failed to exchange auth code:', error)
        navigate('/login')
      }
    }

    exchangeCode()
  }, [location, searchParams, navigate, dispatch])

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(248,113,113,0.14),transparent_26%),linear-gradient(180deg,#0a1324_0%,#07111f_55%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-400" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">Signing you in...</h2>
            <p className="mt-2 text-slate-400">Authenticating with GitHub</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
