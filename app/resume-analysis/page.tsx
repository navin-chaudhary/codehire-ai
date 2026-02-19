'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Upload, Sparkles, CheckCircle, AlertTriangle, Target, Briefcase, 
  Award, TrendingUp, X, Download, IndianRupee, LineChart, Users, Zap,
  FileCheck, BarChart3, BookOpen, Mail, Shield, Eye, Copy, RefreshCw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// Types
interface SkillMatch {
  skill: string
  match: number
  demand: 'high' | 'medium' | 'low'
  category?: string
}

interface SectionAnalysis {
  score: number
  status: 'good' | 'needs-improvement' | 'missing'
  feedback?: string
}

interface CareerInsight {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface AnalysisResult {
  atsScore: number
  jobMatchScore: number
  skillMatches: SkillMatch[]
  strengths: string[]
  improvements: string[]
  sections: {
    contactInfo: SectionAnalysis
    summary: SectionAnalysis
    experience: SectionAnalysis
    education: SectionAnalysis
    skills: SectionAnalysis
  }
  keywords: {
    present: string[]
    missing: string[]
  }
  careerInsights?: CareerInsight[]
  salaryEstimate?: {
    min: number
    max: number
    average: number
    currency: string
  }
  industryComparison?: {
    percentile: number
    benchmark: string
  }
  coverLetter?: string
  actionableSteps?: string[]
}

export default function AnalyzeMyResumePage() {
  const router = useRouter()
  const { user: contextUser, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'insights' | 'cover-letter'>('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!contextUser) {
      showToast('Please log in to access this page')
      const t = setTimeout(() => router.replace('/'), 500)
      return () => clearTimeout(t)
    }
  }, [contextUser, authLoading, router, showToast])

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const uint8Array = new Uint8Array(arrayBuffer)
          
          let text = ''
          let inTextBlock = false
          
          for (let i = 0; i < uint8Array.length - 1; i++) {
            if (uint8Array[i] === 66 && uint8Array[i + 1] === 84) { // BT
              inTextBlock = true
              i += 1
              continue
            }
            if (uint8Array[i] === 69 && uint8Array[i + 1] === 84) { // ET
              inTextBlock = false
              text += ' '
              i += 1
              continue
            }
            
            if (inTextBlock) {
              const char = String.fromCharCode(uint8Array[i])
              if (char.match(/[\x20-\x7E\n\r\t]/)) {
                text += char
              }
            }
          }
          
          if (text.length < 100) {
            text = ''
            for (let i = 0; i < uint8Array.length; i++) {
              const char = String.fromCharCode(uint8Array[i])
              if (char.match(/[\x20-\x7E\n\r\t]/)) {
                text += char
              }
            }
          }
          
          text = text
            .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/\[/g, '')
            .replace(/\]/g, '')
            .replace(/</g, '')
            .replace(/>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/T[jd]/g, ' ')
            .trim()
          
          if (text.length < 100) {
            reject(new Error('Could not extract enough text from PDF. The PDF might be scanned or image-based. Please try a text-based PDF or copy-paste your resume content.'))
          } else {
            resolve(text)
          }
        } catch (err) {
          reject(new Error('Failed to extract text from PDF'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const extractTextFromTXT = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const text = e.target?.result as string
        if (text && text.length >= 50) {
          resolve(text)
        } else {
          reject(new Error('Text file is too short or empty'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const isTXT = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')
    
    if (!isPDF && !isTXT) {
      setError('Please upload a PDF or TXT file. For other formats, please copy your resume as text and save it as a .txt file.')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    setError('')
    setIsExtracting(true)

    try {
      let text = ''
      
      if (isPDF) {
        text = await extractTextFromPDF(file)
      } else if (isTXT) {
        text = await extractTextFromTXT(file)
      }
      
      setResumeText(text)
      setError('')
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from file')
      setResumeText('')
      setSelectedFile(null)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a resume file.')
      return
    }
  
    setIsAnalyzing(true)
    setError('')
  
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
  
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        body: formData,
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze resume')
      }
  
      const data = await response.json()
      setAnalysisResult(data)
      setActiveTab('overview')
      // Track activity for logged-in users
      fetch('/api/activity/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'resume_analysis', score: data.atsScore }),
      }).catch(() => {})
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setSelectedFile(null)
    setResumeText('')
    setError('')
    setActiveTab('overview')
  }

  const downloadReport = () => {
    if (!analysisResult) return

    const report = {
      timestamp: new Date().toISOString(),
      atsScore: analysisResult.atsScore,
      jobMatchScore: analysisResult.jobMatchScore,
      skillMatches: analysisResult.skillMatches,
      strengths: analysisResult.strengths,
      improvements: analysisResult.improvements,
      sections: analysisResult.sections,
      keywords: analysisResult.keywords,
      careerInsights: analysisResult.careerInsights,
      salaryEstimate: analysisResult.salaryEstimate,
      industryComparison: analysisResult.industryComparison
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-analysis-${Date.now()}.json`
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-12 h-12 text-cyan-400" />
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                AI Resume Analyzer
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get comprehensive AI-powered insights to optimize your resume for ATS systems, 
              career growth, and interview success
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                ATS Optimization
              </span>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Skill Analysis
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                Salary Insights
              </span>
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-300 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Cover Letters
              </span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {!analysisResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-slate-800/50 backdrop-blur-lg rounded-xl p-12 border-2 border-dashed transition-all ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-white/20 hover:border-cyan-400/50'
                }`}
              >
                <div className="text-center">
                  <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                  
                  {selectedFile ? (
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-300 font-medium">{selectedFile.name}</span>
                        <button
                          onClick={() => {
                            setSelectedFile(null)
                            setResumeText('')
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">
                        {(selectedFile.size / 1024).toFixed(2)} KB • {resumeText.length} characters extracted
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        Upload Your Resume
                      </h3>
                      <p className="text-slate-400 mb-6">
                        Drag and drop your resume or click to browse
                      </p>
                    </>
                  )}

                  <div className="space-y-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg">
                      <Upload className="w-5 h-5" />
                      {selectedFile ? 'Change File' : 'Choose File'}
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>

                    {selectedFile && resumeText && (
                      <div>
                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="w-full max-w-md mx-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              Analyzing Resume...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              Analyze Resume
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mt-6">
                    Supported formats: PDF, TXT (Max 5MB)
                  </p>

                  {isExtracting && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-cyan-400">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>Extracting text from file...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What We Analyze */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <FileCheck className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">ATS Optimization</h3>
                  <p className="text-sm text-slate-400">
                    Ensure your resume passes Applicant Tracking Systems with keyword optimization and formatting analysis
                  </p>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Skill Gap Analysis</h3>
                  <p className="text-sm text-slate-400">
                    Identify missing skills and get personalized recommendations for career advancement
                  </p>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <IndianRupee className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Salary Insights</h3>
                  <p className="text-sm text-slate-400">
                    Get estimated salary ranges based on your skills, experience, and market data
                  </p>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <Mail className="w-8 h-8 text-orange-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Cover Letter Generation</h3>
                  <p className="text-sm text-slate-400">
                    AI-generated cover letters tailored to your experience and target roles
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                <div className="flex border-b border-white/10 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      Overview
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'skills'
                        ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      Skills ({analysisResult.skillMatches?.length || 0})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'insights'
                        ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LineChart className="w-4 h-4" />
                      Career Insights
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('cover-letter')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'cover-letter'
                        ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Cover Letter
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
                      {/* Score Cards */}
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {/* ATS Score */}
                        <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                          <div className="relative inline-block mb-4">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="url(#atsGradient)"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${analysisResult.atsScore * 2.64} 264`}
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#10b981" />
                                  <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-3xl font-bold ${getScoreTextColor(analysisResult.atsScore)}`}>
                                {analysisResult.atsScore}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">ATS Score</h3>
                          <p className="text-xs text-slate-400">Applicant Tracking System</p>
                        </div>

                        {/* Job Match Score */}
                        <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl">
                          <div className="relative inline-block mb-4">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="url(#jobGradient)"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${analysisResult.jobMatchScore * 2.64} 264`}
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="jobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-3xl font-bold ${getScoreTextColor(analysisResult.jobMatchScore)}`}>
                                {analysisResult.jobMatchScore}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">Job Match</h3>
                          <p className="text-xs text-slate-400">Market Alignment</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-col justify-center space-y-4 p-6 bg-slate-900/50 border border-white/10 rounded-xl">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <div>
                              <p className="text-white font-semibold">{analysisResult.strengths?.length || 0}</p>
                              <p className="text-xs text-slate-400">Strengths</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-yellow-400" />
                            <div>
                              <p className="text-white font-semibold">{analysisResult.improvements?.length || 0}</p>
                              <p className="text-xs text-slate-400">Improvements</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Target className="w-6 h-6 text-blue-400" />
                            <div>
                              <p className="text-white font-semibold">{analysisResult.skillMatches?.length || 0}</p>
                              <p className="text-xs text-slate-400">Skills</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Salary Estimate & Industry Comparison */}
                      {(analysisResult.salaryEstimate || analysisResult.industryComparison) && (
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {analysisResult.salaryEstimate && (
                            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                              <div className="flex items-center gap-2 mb-4">
                                <IndianRupee className="w-6 h-6 text-purple-400" />
                                <h3 className="text-lg font-semibold text-white">Salary Estimate</h3>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-400">Range:</span>
                                  <span className="text-white font-semibold">
                                    {analysisResult.salaryEstimate.currency}
                                    {analysisResult.salaryEstimate.min.toLocaleString()} - 
                                    {analysisResult.salaryEstimate.currency}
                                    {analysisResult.salaryEstimate.max.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-400">Average:</span>
                                  <span className="text-purple-400 font-bold text-xl">
                                    {analysisResult.salaryEstimate.currency}
                                    {analysisResult.salaryEstimate.average.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {analysisResult.industryComparison && (
                            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                              <div className="flex items-center gap-2 mb-4">
                                <Users className="w-6 h-6 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Industry Comparison</h3>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-400">Percentile:</span>
                                  <span className="text-blue-400 font-bold text-xl">
                                    {analysisResult.industryComparison.percentile}th
                                  </span>
                                </div>
                                <div className="mt-3">
                                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                      style={{ width: `${analysisResult.industryComparison.percentile}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-slate-400 mt-2">
                                    {analysisResult.industryComparison.benchmark}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sections Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Section Analysis */}
                        {analysisResult.sections && (
                          <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-cyan-400" />
                              Section Scores
                            </h3>
                            <div className="space-y-4">
                              {Object.entries(analysisResult.sections).map(([section, data]: [string, any], index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium capitalize text-sm">
                                      {section.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {data.status === 'good' ? (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                      ) : data.status === 'needs-improvement' ? (
                                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                      ) : (
                                        <X className="w-4 h-4 text-red-400" />
                                      )}
                                      <span className="text-white font-semibold text-sm">{data.score}%</span>
                                    </div>
                                  </div>
                                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        data.status === 'good'
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                          : data.status === 'needs-improvement'
                                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                                      }`}
                                      style={{ width: `${data.score}%` }}
                                    />
                                  </div>
                                  {data.feedback && (
                                    <p className="text-xs text-slate-400 mt-1">{data.feedback}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Keywords */}
                        {analysisResult.keywords && (
                          <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4">Keywords Analysis</h3>
                            <div className="space-y-4">
                              {analysisResult.keywords.present && analysisResult.keywords.present.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Present ({analysisResult.keywords.present.length})
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {analysisResult.keywords.present.slice(0, 8).map((keyword: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/30">
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {analysisResult.keywords.missing && analysisResult.keywords.missing.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1">
                                    <X className="w-4 h-4" />
                                    Missing ({analysisResult.keywords.missing.length})
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {analysisResult.keywords.missing.slice(0, 8).map((keyword: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs border border-red-500/30">
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Strengths */}
                        {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                          <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              Strengths
                            </h3>
                            <div className="space-y-2">
                              {analysisResult.strengths.map((strength: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-slate-200 text-sm">{strength}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Improvements */}
                        {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                          <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-yellow-400" />
                              Improvement Suggestions
                            </h3>
                            <div className="space-y-2">
                              {analysisResult.improvements.map((improvement: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-slate-200 text-sm">{improvement}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'skills' && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-cyan-400" />
                        Skill Analysis & Match Percentage
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                        {analysisResult.skillMatches && analysisResult.skillMatches.length > 0 ? (
                          analysisResult.skillMatches.map((skill, index) => (
                            <div key={index} className="p-4 bg-slate-800/30 border border-white/10 rounded-xl">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <span className="text-white font-semibold">{skill.skill}</span>
                                  {skill.category && (
                                    <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                      {skill.category}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    skill.demand === 'high' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : skill.demand === 'medium'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {skill.demand}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full bg-gradient-to-r ${getScoreColor(skill.match)}`}
                                      style={{ width: `${skill.match}%` }}
                                    />
                                  </div>
                                </div>
                                <span className={`font-bold ${getScoreTextColor(skill.match)}`}>
                                  {skill.match}%
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-12 text-slate-400">
                            No skill matches found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <LineChart className="w-6 h-6 text-cyan-400" />
                        Career Growth Insights
                      </h3>

                      {/* Career Insights */}
                      {analysisResult.careerInsights && analysisResult.careerInsights.length > 0 ? (
                        <div className="space-y-4 mb-8">
                          {analysisResult.careerInsights.map((insight, index) => (
                            <div
                              key={index}
                              className={`p-5 rounded-xl border ${
                                insight.priority === 'high'
                                  ? 'bg-red-500/10 border-red-500/30'
                                  : insight.priority === 'medium'
                                  ? 'bg-yellow-500/10 border-yellow-500/30'
                                  : 'bg-blue-500/10 border-blue-500/30'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  insight.priority === 'high'
                                    ? 'bg-red-500/20'
                                    : insight.priority === 'medium'
                                    ? 'bg-yellow-500/20'
                                    : 'bg-blue-500/20'
                                }`}>
                                  <Zap className={`w-5 h-5 ${
                                    insight.priority === 'high'
                                      ? 'text-red-400'
                                      : insight.priority === 'medium'
                                      ? 'text-yellow-400'
                                      : 'text-blue-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
                                  <p className="text-slate-300 text-sm">{insight.description}</p>
                                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${
                                    insight.priority === 'high'
                                      ? 'bg-red-500/20 text-red-300'
                                      : insight.priority === 'medium'
                                      ? 'bg-yellow-500/20 text-yellow-300'
                                      : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {insight.priority.toUpperCase()} PRIORITY
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400 mb-8">
                          Career insights will be generated based on your resume analysis
                        </div>
                      )}

                      {/* Actionable Steps */}
                      {analysisResult.actionableSteps && analysisResult.actionableSteps.length > 0 && (
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
                          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-400" />
                            Next Steps
                          </h4>
                          <div className="space-y-3">
                            {analysisResult.actionableSteps.map((step, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-cyan-400 text-sm font-bold">{index + 1}</span>
                                </div>
                                <p className="text-slate-200 text-sm pt-0.5">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'cover-letter' && (
                    <motion.div
                      key="cover-letter"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                          <Mail className="w-6 h-6 text-cyan-400" />
                          AI-Generated Cover Letter
                        </h3>
                        {analysisResult.coverLetter && (
                          <button
                            onClick={() => copyToClipboard(analysisResult.coverLetter || '')}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2 transition-all"
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {analysisResult.coverLetter ? (
                        <div className="bg-slate-800/30 border border-white/10 rounded-xl p-8">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {analysisResult.coverLetter}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-slate-800/30 border border-white/10 rounded-xl">
                          <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">
                            Cover letter generation coming soon...
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={resetAnalysis}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Analyze Another Resume
                </button>
                <button
                  onClick={downloadReport}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}