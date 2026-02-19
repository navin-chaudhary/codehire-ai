'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const OTP_LENGTH = 6

const inputBase =
  'w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-base'
const inputError = 'border-red-300 focus:ring-red-500/20 focus:border-red-500'

export function AuthModal() {
  const { authModalOpen, closeAuthModal, authMode, setAuthMode, setUser } = useAuth()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupStep, setSignupStep] = useState<'email' | 'verify'>('email')
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', name: '', otp: '' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isSignup = authMode === 'signup'

  const otpDigits = signupForm.otp.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH)

  const setOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = otpDigits.map((d, i) => (i === index ? digit : d)).join('').slice(0, OTP_LENGTH)
    setSignupForm((p) => ({ ...p, otp: next }))
    if (digit && index < OTP_LENGTH - 1) otpInputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const next = otpDigits.slice(0, index - 1).join('') + otpDigits.slice(index).join('')
      setSignupForm((p) => ({ ...p, otp: next }))
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    setSignupForm((p) => ({ ...p, otp: pasted }))
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    otpInputRefs.current[nextIndex]?.focus()
  }

  useEffect(() => {
    if (!authModalOpen) return
    setFieldErrors({})
    setGeneralError('')
    if (!isSignup) setSignupStep('email')
  }, [authModalOpen, authMode, isSignup])

  const handleClose = () => {
    setLoginForm({ email: '', password: '' })
    setSignupForm({ email: '', password: '', confirmPassword: '', name: '', otp: '' })
    setSignupStep('email')
    setFieldErrors({})
    setGeneralError('')
    setShowLoginPassword(false)
    setShowSignupPassword(false)
    setShowSignupConfirmPassword(false)
    closeAuthModal()
  }

  const validateLogin = (): boolean => {
    const err: Record<string, string> = {}
    if (!loginForm.email.trim()) err.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email.trim())) err.email = 'Please enter a valid email address'
    if (!loginForm.password) err.password = 'Password is required'
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const validateSignupStep1 = (): boolean => {
    const err: Record<string, string> = {}
    if (!signupForm.email.trim()) err.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email.trim())) err.email = 'Please enter a valid email address'
    if (!signupForm.name.trim()) err.name = 'Name is required'
    if (!signupForm.password) err.password = 'Password is required'
    else if (signupForm.password.length < 6) err.password = 'Password must be at least 6 characters'
    if (!signupForm.confirmPassword) err.confirmPassword = 'Please confirm your password'
    else if (signupForm.password !== signupForm.confirmPassword) err.confirmPassword = 'Passwords do not match'
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const validateSignupStep2 = (): boolean => {
    const err: Record<string, string> = {}
    if (!signupForm.otp.trim()) err.otp = 'Verification code is required'
    else if (signupForm.otp.trim().length !== 6) err.otp = 'Enter the 6-digit code'
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    setFieldErrors({})
    if (!validateSignupStep1()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupForm.email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFieldErrors(data.errors || { email: data.error })
        setGeneralError(data.error || 'Failed to send code')
        setLoading(false)
        return
      }
      setSignupStep('verify')
      setFieldErrors({})
    } catch {
      setGeneralError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    if (!validateLogin()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors)
        else setGeneralError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      setUser(data.user)
      handleClose()
    } catch {
      setGeneralError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    if (!validateSignupStep2()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupForm.email.trim().toLowerCase(),
          otp: signupForm.otp.trim(),
          password: signupForm.password,
          name: signupForm.name.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors)
        setGeneralError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      setUser(data.user)
      handleClose()
    } catch {
      setGeneralError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setFieldErrors({})
    setGeneralError('')
    setSignupStep('email')
    setShowLoginPassword(false)
    setShowSignupPassword(false)
    setShowSignupConfirmPassword(false)
    setAuthMode(isSignup ? 'login' : 'signup')
  }

  const backToSignupEmail = () => {
    setSignupStep('email')
    setFieldErrors({})
    setGeneralError('')
  }

  if (!authModalOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
        >
          <div className="border-b border-slate-100 bg-slate-50/80">
            <div className="flex">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  !isSignup
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  isSignup
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Login form */}
            {!isSignup && (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h2>
                <p className="text-slate-500 text-sm mb-6">Log in to your CodeHire AI account</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="auth-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                        className={`${inputBase} pl-10 ${fieldErrors.email ? inputError : 'border-slate-200'}`}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="auth-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                        className={`${inputBase} pl-10 pr-10 ${fieldErrors.password ? inputError : 'border-slate-200'}`}
                        placeholder="Your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>
                  {generalError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
                      {generalError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Please wait...' : 'Log in'}
                  </button>
                </form>
              </>
            )}

            {/* Signup: Step 1 – Email, Name, Password & Send OTP */}
            {isSignup && signupStep === 'email' && (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Create your account</h2>
                <p className="text-slate-500 text-sm mb-6">Enter your details to get a verification code</p>
                <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="signup-name"
                        type="text"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
                        className={`${inputBase} pl-10 ${fieldErrors.name ? inputError : 'border-slate-200'}`}
                        placeholder="e.g. John Doe"
                        autoComplete="name"
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="text-sm text-red-600">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="signup-email"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                        className={`${inputBase} pl-10 ${fieldErrors.email ? inputError : 'border-slate-200'}`}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                        minLength={6}
                        className={`${inputBase} pl-10 pr-10 ${fieldErrors.password ? inputError : 'border-slate-200'}`}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-700">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="signup-confirm-password"
                        type={showSignupConfirmPassword ? 'text' : 'password'}
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        minLength={6}
                        className={`${inputBase} pl-10 pr-10 ${fieldErrors.confirmPassword ? inputError : 'border-slate-200'}`}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                  {generalError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
                      {generalError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send verification code'}
                  </button>
                </form>
              </>
            )}

            {/* Signup: Step 2 – OTP only */}
            {isSignup && signupStep === 'verify' && (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Verify your email</h2>
                <p className="text-slate-500 text-sm mb-6">
                  We sent a 6-digit code to <strong className="text-slate-700">{signupForm.email}</strong>
                  <button type="button" onClick={backToSignupEmail} className="ml-1 text-blue-600 hover:underline text-sm">
                    Change
                  </button>
                </p>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Verification code
                    </label>
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpInputRefs.current[index] = el }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => setOtpDigit(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-12 h-12 text-center text-lg font-semibold rounded-xl border bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition ${fieldErrors.otp ? inputError : 'border-slate-200'}`}
                          aria-label={`Digit ${index + 1}`}
                          autoComplete="one-time-code"
                        />
                      ))}
                    </div>
                    {fieldErrors.otp && (
                      <p className="text-sm text-red-600 text-center">{fieldErrors.otp}</p>
                    )}
                  </div>
                  {generalError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
                      {generalError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Please wait...' : 'Create account'}
                  </button>
                </form>
              </>
            )}

            <p className="mt-5 text-center text-sm text-slate-500">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" onClick={switchMode} className="font-semibold text-blue-600 hover:text-blue-700">
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
