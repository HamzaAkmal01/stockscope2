'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(credentials)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Blurred Gradient Shapes */}
      <div className="absolute top-0 left-0 w-[60vw] h-[20vw] bg-gradient-to-tr from-purple-800/40 to-blue-400/10 rounded-full blur-3xl -rotate-12 -translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute top-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-yellow-700/30 to-purple-900/10 rounded-full blur-2xl rotate-12 translate-x-1/4 z-0" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[12vw] bg-gradient-to-tr from-purple-900/30 to-pink-400/10 rounded-full blur-2xl rotate-6 translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute bottom-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-pink-700/30 to-purple-900/10 rounded-full blur-2xl -rotate-12 translate-x-1/4 z-0" />

      {/* Glassmorphism Login Form */}
      <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl glass-effect shadow-2xl p-8 backdrop-blur-md border border-white/10">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">Sign in to StockScope</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/30 p-4 border border-red-500/30 text-center">
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition pr-12"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-400 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.03 0 2.02.155 2.96.445M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.06 2.06A9.978 9.978 0 0021 12c0-3-4-7-9-7-.71 0-1.4.07-2.07.2M4.22 4.22l15.56 15.56" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3-4 7-9 7s-9-4-9-7 4-7 9-7 9 4 9 7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 mt-2"
          >
            Sign in
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400">Don&apos;t have an account?</span>{' '}
          <a
            href="/register"
            className="font-semibold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent hover:underline transition"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  )
} 