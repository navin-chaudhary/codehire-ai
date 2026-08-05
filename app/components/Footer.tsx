'use client'

import React from 'react'
import Link from 'next/link'
import { Code2, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CodeHire AI</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              AI-powered tools for smarter code reviews and career growth.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/code-review" className="hover:text-cyan-400 transition-colors">
                  Code Reviewer
                </Link>
              </li>
              <li>
                <Link href="/resume-analysis" className="hover:text-cyan-400 transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link href="/#tools" className="hover:text-cyan-400 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-cyan-400 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <a
              href="mailto:hello@codehireai.com"
              className="inline-flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@codehireai.com
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} CodeHire AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
