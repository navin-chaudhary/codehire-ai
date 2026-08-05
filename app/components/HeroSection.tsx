"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, FileText, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const easeInOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeInOut },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: easeInOut,
        delay: 0.2,
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#070B14] text-white min-h-[100svh] flex flex-col"
    >
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-0 left-0 w-[min(600px,100%)] h-[400px] sm:h-[600px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top left, #2563eb 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[min(500px,100%)] h-[300px] sm:h-[500px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, #06b6d4 0%, transparent 70%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-12 sm:pb-28 lg:pt-10 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-col items-start"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Developer Tools
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-display font-bold leading-[1.08] tracking-tight mb-5 sm:mb-6 text-[clamp(2.1rem,6vw,3.75rem)]"
              >
                <span className="block text-white mb-1">CodeHire AI</span>
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Smarter Reviews. Better Careers.
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg text-slate-400"
              >
                Improve code quality and optimize resumes with AI-driven
                insights — so you can ship better code and land your next role
                faster.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              >
                <Link
                  href="/code-review"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
                >
                  <Code2 className="relative w-[18px] h-[18px]" />
                  <span className="relative">Review My Code</span>
                  <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                <Link
                  href="/resume-analysis"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-xl font-semibold text-sm transition-all duration-300 bg-white/5 border border-white/12 text-slate-200 hover:bg-white/10"
                >
                  <FileText className="w-[18px] h-[18px] opacity-80" />
                  Analyze My Resume
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative w-full max-w-xl mx-auto lg:max-w-none"
            >
              <div
                className="absolute inset-[-12px] sm:inset-[-20px] rounded-3xl blur-3xl opacity-25"
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                }}
              />

              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                <Image
                  width={680}
                  height={480}
                  src="/herosectionimages/airesults.png"
                  alt="CodeHire AI analysis results"
                  className="w-full h-auto object-cover block"
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-10 sm:h-14 md:h-20"
          preserveAspectRatio="none"
        >
          <path
            fill="#f8fafc"
            d="M0,48L60,42.7C120,37,240,27,360,29.3C480,32,600,48,720,50.7C840,53,960,43,1080,37.3C1200,32,1320,32,1380,32L1440,32L1440,80L0,80Z"
          />
        </svg>
      </div>
    </section>
  );
}
