'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="relative min-h-[calc(100svh-4rem)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-10 left-4 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-4 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-[clamp(5rem,22vw,12rem)] font-bold leading-none mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400 bg-clip-text text-transparent">
              404
            </span>
          </motion.h1>

          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Link
              href="/"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          <div className="mt-10 p-5 sm:p-6 bg-slate-800/50 backdrop-blur-lg rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-4">Popular pages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/code-review"
                className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-left"
              >
                <p className="text-cyan-400 font-medium text-sm">Code Review</p>
                <p className="text-xs text-slate-400 mt-1">Analyze your code</p>
              </Link>
              <Link
                href="/resume-analysis"
                className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-left"
              >
                <p className="text-cyan-400 font-medium text-sm">Resume Analysis</p>
                <p className="text-xs text-slate-400 mt-1">Optimize your resume</p>
              </Link>
              <Link
                href="/profile"
                className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-left"
              >
                <p className="text-cyan-400 font-medium text-sm">Profile</p>
                <p className="text-xs text-slate-400 mt-1">View your profile</p>
              </Link>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Error 404 — Resource not found
          </p>
        </motion.div>
      </div>
    </div>
  )
}
