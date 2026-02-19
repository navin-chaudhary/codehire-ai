'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Calendar,
  Lock,
  ArrowLeft,
  Code2,
  FileText,
  BarChart3,
  TrendingUp,
  ExternalLink,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

interface ProfileUser {
  id: string
  email: string
  name: string
  createdAt: string | null
}

interface ProfileStats {
  codeReviewsCount: number
  resumeAnalysesCount: number
  lastCodeReviewAt: string | null
  lastResumeAnalysisAt: string | null
  lastResumeScore: number | null
  lastCodeReviewScore: number | null
}

const inputBase =
  "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 \
   bg-white dark:bg-slate-800 \
   text-slate-900 dark:text-slate-100 \
   placeholder:text-slate-400 dark:placeholder:text-slate-500 \
   focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 \
   transition text-base";

export default function ProfilePage() {
  const router = useRouter()
  const { user: contextUser, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function getInitials(name?: string, email?: string): string {
    if (name && name.trim().length > 0) {
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

  useEffect(() => {
    if (!authLoading && !contextUser) {
      showToast('Please log in to access this page')
      const t = setTimeout(() => router.replace('/'), 500)
      return () => clearTimeout(t)
    }
    if (contextUser) {
      Promise.all([
        fetch('/api/auth/me', { credentials: 'include' }).then((r) => r.json()),
        fetch('/api/profile/stats', { credentials: 'include' }).then((r) =>
          r.ok ? r.json() : { codeReviewsCount: 0, resumeAnalysesCount: 0 }
        ),
      ])
        .then(([userData, statsData]) => {
          if (userData.user) setProfile(userData.user)
          else router.replace('/')
          setStats({
            codeReviewsCount: statsData.codeReviewsCount ?? 0,
            resumeAnalysesCount: statsData.resumeAnalysesCount ?? 0,
            lastCodeReviewAt: statsData.lastCodeReviewAt ?? null,
            lastResumeAnalysisAt: statsData.lastResumeAnalysisAt ?? null,
            lastResumeScore: statsData.lastResumeScore ?? null,
            lastCodeReviewScore: statsData.lastCodeReviewScore ?? null,
          })
        })
        .catch(() => router.replace('/'))
        .finally(() => setLoading(false))
    }
  }, [contextUser, authLoading, router, showToast])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    if (changePassword.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    setPasswordLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: changePassword.currentPassword,
          newPassword: changePassword.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password')
        setPasswordLoading(false)
        return
      }
      setPasswordSuccess('Password updated successfully.')
      setChangePassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      setPasswordError('Something went wrong. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatRelative = (iso: string | null) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return formatDate(iso)
  }

  if (!contextUser) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const totalActivity = (stats?.codeReviewsCount ?? 0) + (stats?.resumeAnalysesCount ?? 0)
  const hasActivity = totalActivity > 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8 mb-8 shadow-xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {getInitials(profile.name, profile.email)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{profile.name || 'Developer'}</h1>
              <p className="text-slate-300 text-sm mb-2">{profile.email}</p>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Code Reviews & Resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-4 mb-8"
        >
          <Link
            href="/code-review"
            className="group block p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Code Reviews</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.codeReviewsCount ?? 0}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            {(stats?.lastCodeReviewScore != null || stats?.lastCodeReviewAt) && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-sm">
                {stats?.lastCodeReviewScore != null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Last: {stats.lastCodeReviewScore}/100
                  </span>
                )}
                {stats?.lastCodeReviewAt && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatRelative(stats.lastCodeReviewAt)}
                  </span>
                )}
              </div>
            )}
          </Link>

          <Link
            href="/resume-analysis"
            className="group block p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-cyan-300 dark:hover:border-cyan-600 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resume Analyses</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.resumeAnalysesCount ?? 0}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
            </div>
            {(stats?.lastResumeScore != null || stats?.lastResumeAnalysisAt) && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-sm">
                {stats?.lastResumeScore != null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    ATS: {stats.lastResumeScore}%
                  </span>
                )}
                {stats?.lastResumeAnalysisAt && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatRelative(stats.lastResumeAnalysisAt)}
                  </span>
                )}
              </div>
            )}
          </Link>
        </motion.div>

        {/* Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Activity Analytics
          </h2>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6">
              {hasActivity ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Code Reviews</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {stats?.codeReviewsCount ?? 0} reviews
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${totalActivity ? ((stats?.codeReviewsCount ?? 0) / totalActivity) * 100 : 0}%`,
                          }}
                          transition={{ duration: 0.6 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Resume Analyses</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {stats?.resumeAnalysesCount ?? 0} analyses
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${totalActivity ? ((stats?.resumeAnalysesCount ?? 0) / totalActivity) * 100 : 0}%`,
                          }}
                          transition={{ duration: 0.6 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Total activity: {totalActivity} {totalActivity === 1 ? 'analysis' : 'analyses'}
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 mb-2">No activity yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                    Review your code or analyze your resume to see analytics here.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link
                      href="/code-review"
                      className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      Code Review
                    </Link>
                    <Link
                      href="/resume-analysis"
                      className="px-4 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/60 transition-colors"
                    >
                      Resume Analysis
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Profile Details & Change Password */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-slate-500" />
                Account Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Full name</dt>
                <dd className="text-slate-900 dark:text-white mt-0.5">{profile.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {profile.email}
                </dd>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-500" />
                Security
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Update your password to keep your account secure.
              </p>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Current password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={changePassword.currentPassword}
                    onChange={(e) =>
                      setChangePassword((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                    className={`${inputBase} pr-10`}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={changePassword.newPassword}
                    onChange={(e) => setChangePassword((p) => ({ ...p, newPassword: e.target.value }))}
                    className={`${inputBase} pr-10`}
                    placeholder="At least 6 characters"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={changePassword.confirmPassword}
                    onChange={(e) =>
                      setChangePassword((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                    className={`${inputBase} pr-10`}
                    placeholder="Re-enter new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-xl flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {passwordSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
