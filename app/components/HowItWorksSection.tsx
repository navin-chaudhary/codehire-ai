"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Upload, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Work",
    description: "Paste code or upload your resume in seconds",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description:
      "Our AI scans for bugs, performance issues, ATS compatibility, and more",
  },
  {
    icon: TrendingUp,
    title: "Instant Suggestions",
    description: "Get actionable insights and downloadable reports immediately",
  },
];

export function HowItWorksSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Three simple steps to better code and stronger applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow border border-slate-100">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 w-7 h-7 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
