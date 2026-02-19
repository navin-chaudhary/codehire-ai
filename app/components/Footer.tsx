'use client'

import React from 'react'
import Link from 'next/link'
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CodeHire AI</span>
            </Link>
            <p className="text-sm text-slate-400">AI-powered tools for smarter development and career growth.</p>
          </div>

          {/* Product Links - only pages that exist */}
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/code-review" className="hover:text-cyan-400 transition-colors">Code Reviewer</Link>
              </li>
              <li>
                <Link href="/resume-analysis" className="hover:text-cyan-400 transition-colors">Resume Analyzer</Link>
              </li>
              <li>
                <Link href="/#tools" className="hover:text-cyan-400 transition-colors">Tools</Link>
              </li>
            </ul>
          </div>

          {/* Connect - Contact only working link */}
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <a href="mailto:hello@codehireai.com" className="inline-flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors mb-4">
              <Mail className="w-4 h-4" />
              Contact
            </a>
            <div className="flex gap-4 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} CodeHire AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
