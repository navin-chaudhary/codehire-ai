'use client'

import React from 'react'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'
import { Navbar } from './Navbar'
import { AuthModal } from './AuthModal'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <AuthModal />
          {children}
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
