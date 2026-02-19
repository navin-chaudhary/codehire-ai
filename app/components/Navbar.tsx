'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Code2, Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }

  if (email) {
    return email.slice(0, 2).toUpperCase()
  }

  return ''
}


export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user, openAuthModal, setUser } = useAuth()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setMobileMenuOpen(false)
    setProfileOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={'/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CodeHire AI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-slate-600 hover:text-blue-600 transition-colors">Tools</a>
            {user ? (
              <div
                ref={profileRef}
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  type="button"
                  className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors min-w-[48px]"
                  title={user.email}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user.name, user.email)}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-1 overflow-hidden">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => openAuthModal('login')} className="text-slate-600 hover:text-blue-600 transition-colors">
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-4 px-4">
          <div className="flex flex-col gap-4">
            <a href="#tools" className="text-slate-600 hover:text-blue-600">Tools</a>
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.name, user.email)}
                  </div>
                </div>
                <Link href="/profile" className="text-slate-600 hover:text-blue-600 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }} className="text-slate-600 hover:text-blue-600 text-left">
                  Login
                </button>
                <button
                  onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium text-left"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
