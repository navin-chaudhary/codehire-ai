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
  IndianRupee,
  Mail,
} from "lucide-react";
import { Feature } from "./Feature";
import Link from "next/link";

export function ToolsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="tools" ref={ref} className="py-16 sm:py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            Powerful AI Tools
          </h2>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to level up your development career
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Code Reviewer
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Bug className="w-3 h-3" />
                Bug Detection
              </span>
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Security Scan
              </span>
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Performance
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Download className="w-3 h-3" />
                Export Reports
              </span>
            </div>

            <p className="text-slate-600 mb-5 text-sm sm:text-base">
              Paste or upload your code for AI analysis — bugs, security risks,
              performance issues, and a clear quality score with exportable reports.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              <div className="space-y-2.5">
                <Feature text="Bug detection" />
                <Feature text="Security analysis" />
                <Feature text="Performance insights" />
                <Feature text="Code quality score" />
              </div>
              <div className="space-y-2.5">
                <Feature text="Detailed reports" />
                <Feature text="Export JSON / Markdown" />
                <Feature text="Multi-language support" />
                <Feature text="Best practices" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                What you get
              </p>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5">
                <li>• Vulnerability detection (injection, XSS, secrets)</li>
                <li>• Slow patterns & optimization tips</li>
                <li>• Refactoring suggestions with line context</li>
                <li>• Downloadable analysis reports</li>
              </ul>
            </div>

            <Link
              href="/code-review"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Review My Code →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Resume Analyzer
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                ATS Scoring
              </span>
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                Salary Insights
              </span>
              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Cover Letters
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Career Insights
              </span>
            </div>

            <p className="text-slate-600 mb-5 text-sm sm:text-base">
              Upload your resume for ATS scoring, skill-gap analysis, salary
              estimates, career coaching, and a personalized cover letter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              <div className="space-y-2.5">
                <Feature text="ATS optimization" />
                <Feature text="Skill gap analysis" />
                <Feature text="Salary estimation" />
                <Feature text="Career insights" />
              </div>
              <div className="space-y-2.5">
                <Feature text="Cover letter AI" />
                <Feature text="Industry comparison" />
                <Feature text="Export reports" />
                <Feature text="Actionable next steps" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-4 mb-6 border border-sky-100">
              <p className="text-sm font-semibold text-sky-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                What you get
              </p>
              <ul className="text-xs sm:text-sm text-sky-800 space-y-1.5">
                <li>• Salary range based on experience & skills</li>
                <li>• Industry percentile & competitive context</li>
                <li>• Personalized cover letter from your resume</li>
                <li>• Prioritized growth recommendations</li>
              </ul>
            </div>

            <Link
              href="/resume-analysis"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Analyze My Resume →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
