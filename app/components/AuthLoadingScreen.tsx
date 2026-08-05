'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

export function AuthLoadingScreen({ message = 'Checking session...' }: { message?: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-slate-600 text-sm sm:text-base">{message}</p>
      </div>
    </div>
  )
}
