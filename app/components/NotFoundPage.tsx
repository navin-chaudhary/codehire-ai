'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, FileQuestion, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <div className="relative mb-8">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-[180px] md:text-[240px] font-bold leading-none"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                404
              </span>
            </motion.h1>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Oops! The page youre looking for seems to have wandered off into the digital void. 
              Lets get you back on track.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 p-6 bg-slate-800/50 backdrop-blur-lg rounded-xl border border-white/10 max-w-2xl mx-auto"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Try These Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/code-review">
                <div className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all cursor-pointer group">
                  <p className="text-cyan-400 font-medium group-hover:text-cyan-300">Code Review</p>
                  <p className="text-xs text-slate-400 mt-1">Analyze your code</p>
                </div>
              </Link>
              <Link href="/resume-analysis">
                <div className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all cursor-pointer group">
                  <p className="text-cyan-400 font-medium group-hover:text-cyan-300">Resume Analysis</p>
                  <p className="text-xs text-slate-400 mt-1">Optimize your resume</p>
                </div>
              </Link>
              <Link href="/profile">
                <div className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all cursor-pointer group">
                  <p className="text-cyan-400 font-medium group-hover:text-cyan-300">Profile</p>
                  <p className="text-xs text-slate-400 mt-1">View your profile</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8"
          >
            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Error Code: 404 - Resource Not Found
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}