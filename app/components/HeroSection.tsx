"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, FileText, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#070B14] text-white"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Radial glow top-left */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top left, #2563eb 0%, transparent 70%)",
          }}
        />
        {/* Radial glow bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, #06b6d4 0%, transparent 70%)",
          }}
        />
        {/* Fine grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pt-10 lg:pb-28">
          <div className="grid lg:grid-cols-2 sm:gap-0 gap-12 xl:gap-20 items-center">

            {/* Left: Text content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-col items-start"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.15))",
                    border: "1px solid rgba(6,182,212,0.3)",
                    color: "#67e8f9",
                    letterSpacing: "0.12em",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Developer Tools
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className="font-black leading-[1.08] tracking-tight mb-6"
                style={{
                  fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                Smarter Code Reviews.{" "}
                <span
                  style={{
                    background: "linear-gradient(95deg, #38bdf8 0%, #818cf8 50%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Better Career Opportunities.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: "#94a3b8" }}
              >
                CodeHire AI helps developers improve code quality and optimize resumes
                with powerful AI-driven insights — so you can land your next role faster.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              >
                <Link
                  href="/code-review"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #0891b2)",
                    boxShadow: "0 0 0 1px rgba(37,99,235,0.5), 0 8px 32px rgba(37,99,235,0.35)",
                  }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                  />
                  <Code2 className="relative w-4.5 h-4.5 w-[18px] h-[18px]" />
                  <span className="relative">Review My Code</span>
                  <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                <Link
                  href="/resume-analysis"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    color: "#e2e8f0",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.22)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  <FileText className="w-[18px] h-[18px] opacity-80" />
                  Analyze My Resume
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Image / Dashboard mockup */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative hidden lg:block"
            >
              {/* Glow behind image */}
              <div
                className="absolute inset-[-20px] rounded-3xl blur-3xl opacity-25"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                }}
              />

              {/* Floating stat cards */}
              <motion.div
                className="absolute -top-5 -left-6 z-20 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
                style={{
                  background: "rgba(7,11,20,0.85)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span style={{ color: "#94a3b8" }}>Code Quality</span>
                <span style={{ color: "#34d399" }}>↑ 94%</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-5 -right-4 z-20 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
                style={{
                  background: "rgba(7,11,20,0.85)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span style={{ color: "#94a3b8" }}>Resume Score</span>
                <span style={{ color: "#60a5fa" }}>↑ 87%</span>
              </motion.div>

              {/* Main image */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <Image
                  width={680}
                  height={480}
                  src="/herosectionimages/airesults.png"
                  alt="CodeHire AI Dashboard"
                  className="w-full h-auto object-cover block"
                  priority
                />
                {/* Subtle gradient overlay on image bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(7,11,20,0.6), transparent)",
                  }}
                />
              </div>
            </motion.div>

            {/* Mobile image (shown below text on small screens) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative lg:hidden"
            >
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
                style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Image
                  width={680}
                  height={480}
                  src="/herosectionimages/airesults.png"
                  alt="CodeHire AI Dashboard"
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          className="w-full"
          style={{ height: "clamp(40px, 6vw, 80px)" }}
          preserveAspectRatio="none"
        >
          <path
            fill="#9BBAF2"
            d="M0,48L60,42.7C120,37,240,27,360,29.3C480,32,600,48,720,50.7C840,53,960,43,1080,37.3C1200,32,1320,32,1380,32L1440,32L1440,80L0,80Z"
          />
        </svg>
      </div>
    </section>
  );
}