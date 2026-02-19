'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

interface FeatureProps {
  text: string
}

export function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
      <span className="text-slate-700">{text}</span>
    </div>
  )
}
