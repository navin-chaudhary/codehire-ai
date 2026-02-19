'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, Upload, Sparkles, CheckCircle, AlertCircle, Info, FileCode, Zap, X,
  Download, Shield, TrendingUp, RefreshCw, Bug, Lock, Gauge, FileText,
  BookOpen, AlertTriangle, Check, Copy, Eye
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// Types for better type safety
interface CodeIssue {
  type: 'error' | 'warning' | 'info'
  category?: 'bug' | 'performance' | 'security' | 'quality' | 'structure'
  message: string
  severity: 'high' | 'medium' | 'low'
  line?: number
  suggestion?: string
}

interface CodeQuality {
  readability: number
  maintainability: number
  performance: number
  security: number
}

interface AnalysisResult {
  score: number
  issues: CodeIssue[]
  suggestions: string[]
  codeQuality: CodeQuality
  bestPractices: string[]
  securityAnalysis?: {
    vulnerabilities: string[]
    riskLevel: 'critical' | 'high' | 'medium' | 'low'
    recommendations: string[]
  }
  performanceInsights?: {
    slowPatterns: string[]
    optimizations: string[]
  }
  refactoringOpportunities?: string[]
}

export default function ReviewMyCodePage() {
  const router = useRouter()
  const { user: contextUser, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [code, setCode] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'security' | 'performance'>('overview')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!contextUser) {
      showToast('Please log in to access this page')
      const t = setTimeout(() => router.replace('/'), 500)
      return () => clearTimeout(t)
    }
  }, [contextUser, authLoading, router, showToast])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setError('File size must be less than 1MB')
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        setCode(typeof result === 'string' ? result : '')
      }
      reader.readAsText(file)
    }
  }

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter or upload code to analyze')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/code-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze code')
      }

      const data = await response.json()
      setAnalysisResult(data)
      setActiveTab('overview')
      // Track activity for logged-in users
      fetch('/api/activity/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'code_review', score: data.score }),
      }).catch(() => {})
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the code')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setCode('')
    setSelectedFile(null)
    setError('')
    setActiveTab('overview')
  }

  const downloadReport = () => {
    if (!analysisResult) return

    const report = {
      timestamp: new Date().toISOString(),
      score: analysisResult.score,
      codeQuality: analysisResult.codeQuality,
      issues: analysisResult.issues,
      suggestions: analysisResult.suggestions,
      bestPractices: analysisResult.bestPractices,
      securityAnalysis: analysisResult.securityAnalysis,
      performanceInsights: analysisResult.performanceInsights
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-review-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadMarkdownReport = () => {
    if (!analysisResult) return

    let markdown = `# Code Review Report\n\n`
    markdown += `**Date:** ${new Date().toLocaleString()}\n`
    markdown += `**Language:** Auto-detected\n`
    markdown += `**Overall Score:** ${analysisResult.score}/100\n\n`
    
    markdown += `## Code Quality Metrics\n\n`
    Object.entries(analysisResult.codeQuality).forEach(([key, value]) => {
      markdown += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}%\n`
    })
    
    if (analysisResult.issues.length > 0) {
      markdown += `\n## Issues Found (${analysisResult.issues.length})\n\n`
      const groupedIssues = {
        high: analysisResult.issues.filter(i => i.severity === 'high'),
        medium: analysisResult.issues.filter(i => i.severity === 'medium'),
        low: analysisResult.issues.filter(i => i.severity === 'low')
      }
      
      Object.entries(groupedIssues).forEach(([severity, issues]) => {
        if (issues.length > 0) {
          markdown += `### ${severity.toUpperCase()} Severity (${issues.length})\n\n`
          issues.forEach((issue, idx) => {
            markdown += `${idx + 1}. **${issue.message}**\n`
            if (issue.line) markdown += `   - Line: ${issue.line}\n`
            if (issue.suggestion) markdown += `   - Suggestion: ${issue.suggestion}\n`
            markdown += '\n'
          })
        }
      })
    }

    if (analysisResult.suggestions.length > 0) {
      markdown += `## Improvement Suggestions\n\n`
      analysisResult.suggestions.forEach((suggestion, idx) => {
        markdown += `${idx + 1}. ${suggestion}\n`
      })
      markdown += '\n'
    }

    if (analysisResult.bestPractices.length > 0) {
      markdown += `## Best Practices\n\n`
      analysisResult.bestPractices.forEach((practice, idx) => {
        markdown += `${idx + 1}. ${practice}\n`
      })
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-review-report-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getFilteredIssues = () => {
    if (!analysisResult) return []
    if (filterSeverity === 'all') return analysisResult.issues
    return analysisResult.issues.filter(issue => issue.severity === filterSeverity)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (authLoading || !contextUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code2 className="w-12 h-12 text-cyan-400" />
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                AI Code Reviewer
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Upload your code for AI-powered analysis with bug detection, security scanning, and performance optimization
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300 flex items-center gap-1">
                <Bug className="w-3 h-3" />
                Bug Detection
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Performance
              </span>
              <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Security Scan
              </span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Best Practices
              </span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Input Section */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-cyan-400" />
                    Your Code
                  </h3>
                  <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.go,.rs,.php,.rb,.swift,.kt,.cs"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                </div>
                
                {selectedFile && (
                  <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-300" />
                      <p className="text-sm text-blue-300">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setCode('')
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here or upload a file..."
                  className="w-full h-96 bg-slate-900 text-white p-4 rounded-lg border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 font-mono text-sm resize-none"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!code || isAnalyzing}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Analyze Code
                      </>
                    )}
                  </button>
                  
                  {code && !isAnalyzing && (
                    <button
                      onClick={() => {
                        setCode('')
                        setSelectedFile(null)
                      }}
                      className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                      title="Clear code"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Code Stats */}
                {code && (
                  <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Lines: {code.split('\n').length}</span>
                      <span>Characters: {code.length}</span>
                      <span>Words: {code.split(/\s+/).filter(Boolean).length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results Section */}
            <div className="space-y-6">
              {analysisResult ? (
                <>
                  {/* Tabs */}
                  <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                    <div className="flex border-b border-white/10">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                          activeTab === 'overview'
                            ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Gauge className="w-4 h-4" />
                          Overview
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('issues')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                          activeTab === 'issues'
                            ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Bug className="w-4 h-4" />
                          Issues ({analysisResult.issues.length})
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                          activeTab === 'security'
                            ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Shield className="w-4 h-4" />
                          Security
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('performance')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                          activeTab === 'performance'
                            ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Performance
                        </div>
                      </button>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                      {activeTab === 'overview' && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-6"
                        >
                          {/* Overall Score */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-semibold text-white">Code Quality Score</h3>
                              <div className="flex gap-2">
                                <button
                                  onClick={downloadMarkdownReport}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                                  title="Download Markdown Report"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={downloadReport}
                                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                                  title="Download JSON Report"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={resetAnalysis}
                                  className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                                  title="Reset analysis"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="relative w-32 h-32">
                                <svg className="w-32 h-32 transform -rotate-90">
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="8"
                                    fill="none"
                                  />
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${analysisResult.score * 3.51} 351`}
                                    strokeLinecap="round"
                                  />
                                  <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#06b6d4" />
                                      <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className={`text-4xl font-bold ${getScoreTextColor(analysisResult.score)}`}>
                                    {analysisResult.score}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="space-y-3">
                                  {Object.entries(analysisResult.codeQuality).map(([key, value]: [string, any]) => (
                                    <div key={key}>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300 capitalize flex items-center gap-2">
                                          {key === 'readability' && <Eye className="w-4 h-4" />}
                                          {key === 'maintainability' && <FileCode className="w-4 h-4" />}
                                          {key === 'performance' && <Zap className="w-4 h-4" />}
                                          {key === 'security' && <Lock className="w-4 h-4" />}
                                          {key}
                                        </span>
                                        <span className="text-white font-semibold">{value}%</span>
                                      </div>
                                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full bg-gradient-to-r ${getScoreColor(value)}`}
                                          style={{ width: `${value}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-slate-900/50 rounded-lg border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Bug className="w-5 h-5 text-red-400" />
                                <span className="text-sm text-slate-400">Total Issues</span>
                              </div>
                              <p className="text-2xl font-bold text-white">{analysisResult.issues.length}</p>
                              <div className="flex gap-2 mt-2 text-xs">
                                <span className="text-red-400">
                                  {analysisResult.issues.filter(i => i.severity === 'high').length} High
                                </span>
                                <span className="text-yellow-400">
                                  {analysisResult.issues.filter(i => i.severity === 'medium').length} Med
                                </span>
                                <span className="text-blue-400">
                                  {analysisResult.issues.filter(i => i.severity === 'low').length} Low
                                </span>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-lg border border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                <span className="text-sm text-slate-400">Suggestions</span>
                              </div>
                              <p className="text-2xl font-bold text-white">{analysisResult.suggestions.length}</p>
                              <p className="text-xs text-slate-400 mt-2">Improvement opportunities</p>
                            </div>
                          </div>

                          {/* Best Practices Preview */}
                          {analysisResult.bestPractices && analysisResult.bestPractices.length > 0 && (
                            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                              <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Top Best Practices
                              </h4>
                              <ul className="space-y-1">
                                {analysisResult.bestPractices.slice(0, 3).map((practice, idx) => (
                                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <span>{practice}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'issues' && (
                        <motion.div
                          key="issues"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-6"
                        >
                          {/* Filter */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-slate-400">Filter:</span>
                            <div className="flex gap-2">
                              {['all', 'high', 'medium', 'low'].map((severity) => (
                                <button
                                  key={severity}
                                  onClick={() => setFilterSeverity(severity as any)}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                    filterSeverity === severity
                                      ? 'bg-cyan-500 text-white'
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                >
                                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Issues List */}
                          <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {getFilteredIssues().length > 0 ? (
                              getFilteredIssues().map((issue, index) => (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border ${
                                    issue.severity === 'high'
                                      ? 'bg-red-500/10 border-red-500/30'
                                      : issue.severity === 'medium'
                                      ? 'bg-yellow-500/10 border-yellow-500/30'
                                      : 'bg-blue-500/10 border-blue-500/30'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {issue.severity === 'high' ? (
                                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    ) : issue.severity === 'medium' ? (
                                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="text-slate-200 text-sm font-medium">{issue.message}</p>
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                                          issue.severity === 'high'
                                            ? 'bg-red-500/20 text-red-300'
                                            : issue.severity === 'medium'
                                            ? 'bg-yellow-500/20 text-yellow-300'
                                            : 'bg-blue-500/20 text-blue-300'
                                        }`}>
                                          {issue.severity.toUpperCase()}
                                        </span>
                                      </div>
                                      {issue.line && (
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                          <FileCode className="w-3 h-3" />
                                          Line {issue.line}
                                        </p>
                                      )}
                                      {issue.category && (
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                                          {issue.category}
                                        </span>
                                      )}
                                      {issue.suggestion && (
                                        <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-slate-300">
                                          <strong className="text-cyan-400">Suggestion:</strong> {issue.suggestion}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-slate-400">
                                No issues found with this filter
                              </div>
                            )}
                          </div>

                          {/* Suggestions */}
                          {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                                Improvement Suggestions
                              </h4>
                              <div className="space-y-2">
                                {analysisResult.suggestions.map((suggestion, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-slate-200 text-sm">{suggestion}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'security' && (
                        <motion.div
                          key="security"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-6"
                        >
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-400" />
                            Security Analysis
                          </h3>

                          {analysisResult.securityAnalysis ? (
                            <>
                              {/* Risk Level */}
                              <div className={`p-4 rounded-lg border mb-6 ${
                                analysisResult.securityAnalysis.riskLevel === 'critical'
                                  ? 'bg-red-500/20 border-red-500/40'
                                  : analysisResult.securityAnalysis.riskLevel === 'high'
                                  ? 'bg-orange-500/20 border-orange-500/40'
                                  : analysisResult.securityAnalysis.riskLevel === 'medium'
                                  ? 'bg-yellow-500/20 border-yellow-500/40'
                                  : 'bg-green-500/20 border-green-500/40'
                              }`}>
                                <div className="flex items-center gap-2">
                                  <Lock className="w-5 h-5" />
                                  <span className="font-semibold">Risk Level:</span>
                                  <span className="uppercase font-bold">
                                    {analysisResult.securityAnalysis.riskLevel}
                                  </span>
                                </div>
                              </div>

                              {/* Vulnerabilities */}
                              {analysisResult.securityAnalysis.vulnerabilities.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-lg font-semibold text-white mb-3">Vulnerabilities Found</h4>
                                  <div className="space-y-2">
                                    {analysisResult.securityAnalysis.vulnerabilities.map((vuln, idx) => (
                                      <div key={idx} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-sm text-slate-200 flex items-start gap-2">
                                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                          {vuln}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Security Recommendations */}
                              {analysisResult.securityAnalysis.recommendations.length > 0 && (
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-3">Security Recommendations</h4>
                                  <div className="space-y-2">
                                    {analysisResult.securityAnalysis.recommendations.map((rec, idx) => (
                                      <div key={idx} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-sm text-slate-200 flex items-start gap-2">
                                          <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                          {rec}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-12">
                              <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                              <p className="text-slate-400">
                                Security analysis will appear here after code review
                              </p>
                            </div>
                          )}

                          {/* Security-related issues from main issues */}
                          {analysisResult.issues.filter(i => i.category === 'security').length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-white mb-3">Security Issues</h4>
                              <div className="space-y-2">
                                {analysisResult.issues
                                  .filter(i => i.category === 'security')
                                  .map((issue, idx) => (
                                    <div key={idx} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                      <p className="text-sm text-slate-200">{issue.message}</p>
                                      {issue.line && (
                                        <p className="text-xs text-slate-400 mt-1">Line {issue.line}</p>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'performance' && (
                        <motion.div
                          key="performance"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-6"
                        >
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                            Performance Analysis
                          </h3>

                          {/* Performance Score */}
                          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg mb-6">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Performance Score</span>
                              <span className={`text-2xl font-bold ${getScoreTextColor(analysisResult.codeQuality.performance)}`}>
                                {analysisResult.codeQuality.performance}%
                              </span>
                            </div>
                          </div>

                          {analysisResult.performanceInsights ? (
                            <>
                              {/* Slow Patterns */}
                              {analysisResult.performanceInsights.slowPatterns && 
                               analysisResult.performanceInsights.slowPatterns.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-lg font-semibold text-white mb-3">Slow Patterns Detected</h4>
                                  <div className="space-y-2">
                                    {analysisResult.performanceInsights.slowPatterns.map((pattern, idx) => (
                                      <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-sm text-slate-200 flex items-start gap-2">
                                          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                          {pattern}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Optimizations */}
                              {analysisResult.performanceInsights.optimizations && 
                               analysisResult.performanceInsights.optimizations.length > 0 && (
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-3">Optimization Opportunities</h4>
                                  <div className="space-y-2">
                                    {analysisResult.performanceInsights.optimizations.map((opt, idx) => (
                                      <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-sm text-slate-200 flex items-start gap-2">
                                          <Zap className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                          {opt}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-12">
                              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                              <p className="text-slate-400">
                                Performance insights will appear here after code review
                              </p>
                            </div>
                          )}

                          {/* Performance-related issues */}
                          {analysisResult.issues.filter(i => i.category === 'performance').length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-white mb-3">Performance Issues</h4>
                              <div className="space-y-2">
                                {analysisResult.issues
                                  .filter(i => i.category === 'performance')
                                  .map((issue, idx) => (
                                    <div key={idx} className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                      <p className="text-sm text-slate-200">{issue.message}</p>
                                      {issue.line && (
                                        <p className="text-xs text-slate-400 mt-1">Line {issue.line}</p>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Refactoring Opportunities */}
                          {analysisResult.refactoringOpportunities && 
                           analysisResult.refactoringOpportunities.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-white mb-3">Refactoring Suggestions</h4>
                              <div className="space-y-2">
                                {analysisResult.refactoringOpportunities.map((ref, idx) => (
                                  <div key={idx} className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                    <p className="text-sm text-slate-200 flex items-start gap-2">
                                      <Code2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                                      {ref}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Best Practices - Always visible at bottom */}
                  {analysisResult.bestPractices && analysisResult.bestPractices.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        Best Practices & Recommendations
                      </h3>
                      <div className="space-y-2">
                        {analysisResult.bestPractices.map((practice, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-200 text-sm">{practice}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-12 border border-white/10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">Ready to review your code</p>
                    <p className="text-slate-500 text-sm">
                      Upload a file or paste code to get started with AI-powered analysis
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}