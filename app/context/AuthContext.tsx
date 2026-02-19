'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string
}

type AuthMode = 'login' | 'signup'

interface AuthContextValue {
  user: AuthUser | null
  setUser: (u: AuthUser | null) => void
  authModalOpen: boolean
  openAuthModal: (mode?: AuthMode) => void
  closeAuthModal: () => void
  authMode: AuthMode
  setAuthMode: (m: AuthMode) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authModalOpen, setAuthModalOpenState] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(true)

  const openAuthModal = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode)
    setAuthModalOpenState(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpenState(false)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const value: AuthContextValue = {
    user,
    setUser,
    authModalOpen,
    openAuthModal,
    closeAuthModal,
    authMode,
    setAuthMode,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
