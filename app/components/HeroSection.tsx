"use client";

import React from "react";
import { motion, Variants, Easing } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, FileText, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  /* ------------------ Easing ------------------ */

  const easeInOut: Easing = [0.22, 1, 0.36, 1];

  /* ------------------ Variants ------------------ */

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: easeInOut,
      },
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
        delay: 0.3,
        ease: easeInOut,
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#070B14] text-white"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      {/* Main */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pt-10 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            
            {/* LEFT */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-col items-start"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Developer Tools
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-black leading-[1.08] tracking-tight mb-6"
              >
                Smarter Code Reviews{" "}
                <span>
                  Better Career Opportunities.
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg text-slate-400"
              >
                CodeHire AI helps developers improve code quality and optimize
                resumes with powerful AI-driven insights — so you can land your
                next role faster.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href="/code-review"
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm"
                >
                  <Code2 className="w-[18px] h-[18px]" />
                  Review My Code
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/resume-analysis"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm"
                >
                  <FileText className="w-[18px] h-[18px]" />
                  Analyze My Resume
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/herosectionimages/airesults.png"
                  width={680}
                  height={480}
                  alt="CodeHire AI Dashboard"
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
