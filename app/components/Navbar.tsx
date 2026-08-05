'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, Menu, X, LogOut, User, FileText } from 'lucide-react'
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
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user, openAuthModal, setUser, loading } = useAuth()

  const isDarkPage =
    pathname?.startsWith('/code-review') ||
    pathname?.startsWith('/resume-analysis')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setMobileMenuOpen(false)
    setProfileOpen(false)
  }

  useEffect(() => {
    setMobileMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navBg = isDarkPage
    ? 'bg-slate-950/80 border-white/10'
    : 'bg-white/80 border-slate-200'
  const brandText = isDarkPage ? 'text-white' : 'text-slate-900'
  const linkText = isDarkPage
    ? 'text-slate-300 hover:text-cyan-400'
    : 'text-slate-600 hover:text-blue-600'
  const menuIcon = isDarkPage ? 'text-slate-300' : 'text-slate-600'
  const mobilePanel = isDarkPage
    ? 'bg-slate-950 border-white/10'
    : 'bg-white border-slate-200'
  const dropdownBg = isDarkPage
    ? 'bg-slate-900 border-white/10'
    : 'bg-white border-slate-200'
  const dropdownItem = isDarkPage
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-slate-50'

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className={`text-lg sm:text-xl font-bold truncate ${brandText}`}>
              CodeHire AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#tools" className={`transition-colors text-sm font-medium ${linkText}`}>
              Tools
            </Link>
            <Link href="/code-review" className={`transition-colors text-sm font-medium ${linkText}`}>
              Code Review
            </Link>
            <Link href="/resume-analysis" className={`transition-colors text-sm font-medium ${linkText}`}>
              Resume
            </Link>

            {loading ? (
              <div className="w-9 h-9 rounded-full bg-slate-200/50 animate-pulse" />
            ) : user ? (
              <div
                ref={profileRef}
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-0.5 py-1 px-1 rounded-lg transition-colors"
                  title={user.email}
                  aria-label="Open profile menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.name, user.email)}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full pt-2 w-52">
                    <div className={`rounded-xl shadow-lg border py-1 overflow-hidden ${dropdownBg}`}>
                      <div className={`px-4 py-2.5 border-b ${isDarkPage ? 'border-white/10' : 'border-slate-100'}`}>
                        <p className={`text-sm font-medium truncate ${isDarkPage ? 'text-white' : 'text-slate-900'}`}>
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${dropdownItem}`}
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4 opacity-60" />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
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
                <button
                  onClick={() => openAuthModal('login')}
                  className={`transition-colors text-sm font-medium ${linkText}`}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${menuIcon}`} />
            ) : (
              <Menu className={`w-6 h-6 ${menuIcon}`} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t py-4 px-4 ${mobilePanel}`}>
          <div className="flex flex-col gap-1">
            <Link
              href="/#tools"
              className={`px-3 py-2.5 rounded-lg text-sm font-medium ${linkText}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="/code-review"
              className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${linkText}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Code2 className="w-4 h-4" /> Code Review
            </Link>
            <Link
              href="/resume-analysis"
              className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${linkText}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="w-4 h-4" /> Resume Analyzer
            </Link>

            <div className={`my-2 border-t ${isDarkPage ? 'border-white/10' : 'border-slate-200'}`} />

            {loading ? null : user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.name, user.email)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${brandText}`}>{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${linkText}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openAuthModal('login')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium text-left ${linkText}`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup')
                    setMobileMenuOpen(false)
                  }}
                  className="mt-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium text-center"
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
