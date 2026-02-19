"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Code2, 
  FileText, 
  Bug, 
  Shield, 
  TrendingUp, 
  Download,
  Sparkles,
  FileCode,
  IndianRupee,
  Mail
} from "lucide-react";
import { Feature } from "./Feature";
import Link from "next/link";

export function ToolsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="tools" ref={ref} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Powerful AI Tools
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to level up your development career
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Reviewer - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">
                Code Reviewer
              </h3>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Bug className="w-3 h-3" />
                Bug Detection
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Security Scan
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Performance
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Download className="w-3 h-3" />
                Export Reports
              </span>
            </div>

            <p className="text-slate-600 mb-6">
              Upload or paste your code for comprehensive AI-powered analysis with bug detection, 
              security scanning, performance optimization, and detailed reports.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Left Column */}
              <div className="space-y-3">
                <Feature text="Bug detection" />
                <Feature text="Security analysis" />
                <Feature text="Performance insights" />
                <Feature text="Code quality score" />
              </div>
              
              {/* Right Column */}
              <div className="space-y-3">
                <Feature text="Detailed reports" />
                <Feature text="Export (JSON/MD)" />
                <Feature text="Any language support" />
                <Feature text="Best practices" />
              </div>
            </div>

            {/* Highlights Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-6 border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Advanced Features:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Vulnerability detection (SQL injection, XSS, CSRF)</li>
                <li>• Slow pattern & memory leak identification</li>
                <li>• Refactoring suggestions with line numbers</li>
                <li>• Downloadable analysis reports</li>
              </ul>
            </div>

            <Link
              href="/code-review"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Review My Code →
            </Link>
          </motion.div>

          {/* Resume Analyzer - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">
                Resume Analyzer
              </h3>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                ATS Scoring
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                Salary Insights
              </span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Cover Letters
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Career Insights
              </span>
            </div>

            <p className="text-slate-600 mb-6">
              Upload your resume for comprehensive AI-powered analysis with ATS optimization, 
              salary insights, career coaching, and personalized cover letter generation.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Left Column */}
              <div className="space-y-3">
                <Feature text="ATS optimization" />
                <Feature text="Skill gap analysis" />
                <Feature text="Salary estimation" />
                <Feature text="Career insights" />
              </div>
              
              {/* Right Column */}
              <div className="space-y-3">
                <Feature text="Cover letter AI" />
                <Feature text="Industry comparison" />
                <Feature text="Export reports" />
                <Feature text="Actionable steps" />
              </div>
            </div>

            {/* Highlights Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-100">
              <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Advanced Features:
              </p>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• Salary range estimation based on experience & skills</li>
                <li>• Industry percentile ranking & competitive benchmarking</li>
                <li>• AI-generated personalized cover letters</li>
                <li>• Prioritized career growth recommendations</li>
              </ul>
            </div>

            <Link
              href="/resume-analysis"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Analyze My Resume →
            </Link>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-slate-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-sm text-slate-600">Languages Supported</div>
            <div className="text-xs text-slate-400 mt-1">JS, Python, Java, Go, Rust, C++, TS & more</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-slate-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-sm text-slate-600">ATS Optimization</div>
            <div className="text-xs text-slate-400 mt-1">Resume Analyzer</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-slate-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">AI</div>
            <div className="text-sm text-slate-600">Cover Letters</div>
            <div className="text-xs text-slate-400 mt-1">Auto-Generated</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-slate-200">
            <div className="text-3xl font-bold text-green-600 mb-2">4</div>
            <div className="text-sm text-slate-600">Export Formats</div>
            <div className="text-xs text-slate-400 mt-1">JSON & Markdown</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}