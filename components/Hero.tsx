"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/Magnetic";

export function Hero() {
  const fullText = "Hi, I'm Tharun Chandra Lingala";
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  // 3D Card State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Status Ticker State
  const messages = ["Full Stack Developer", "Open to Full-time Roles", "Building in Public"];
  const [tickerIndex, setTickerIndex] = useState(0);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Set typing done after the animation duration (approx 30 chars * 0.05s = 1.5s)
    const timer = setTimeout(() => {
      setIsTypingDone(true);
    }, fullText.length * 50 + 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch live resume URL from Vercel Blob
  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.url) setResumeUrl(d.url);
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  // Status Ticker Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    // Max rotation 12deg
    setRotation({
      x: normalizedY * -12, // tilt up/down
      y: normalizedX * 12, // tilt left/right
    });
    setMousePos({ x: normalizedX, y: normalizedY });
  };

  const speedMultiplier = isHovering ? 0.5 : 1;
  const highlightX = 50 - mousePos.x * 30;
  const highlightY = 50 - mousePos.y * 30;

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-20 px-[8%] overflow-hidden">
      {/* Background Radial Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--accent)] opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--accent3)] opacity-10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[60%_40%] gap-12 items-center relative z-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col items-start">
          {/* Availability Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--green)]/10 border border-[var(--green)]/20 mb-8">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]"></span>
            </div>
            <span className="font-mono text-[12px] text-[var(--green)]">Available for hire</span>
          </div>

          <h1 className="font-syne text-[40px] md:text-[64px] lg:text-[72px] font-[800] tracking-[-0.03em] leading-tight mb-4 min-h-[1.2em]">
            {fullText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ display: "none" }}
                animate={{ display: "inline" }}
                transition={{ delay: index * 0.05 }}
                className={index >= 8 ? "text-gradient" : ""}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-[3px] h-[0.9em] bg-[var(--accent)] ml-1 align-middle"
            />
          </h1>

          {/* H2 */}
          <h2
            className={`font-dm-sans text-[20px] md:text-[24px] font-[300] text-[var(--muted2)] mb-6 transition-opacity duration-400 ease-in-out ${
              isTypingDone ? "opacity-100" : "opacity-0"
            }`}
          >
            Frontend-Focused Full Stack Developer
          </h2>

          <p className="font-dm-sans text-[16px] text-[var(--muted)] leading-[1.8] max-w-[520px] mb-10">
            I build real-time apps, AI-powered platforms and scalable UIs using React, Next.js 15 and TypeScript —
            shipping production-ready code with a focus on performance and user experience.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-10 mb-12 w-full">
            {[
              { value: "5+", label: "Projects Shipped" },
              { value: "434+", label: "LeetCode Solved" },
              { value: "1yr", label: "Building in public" },
              { value: "Open", label: "To work" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col w-[calc(50%-12px)] md:w-auto">
                <span className="font-syne text-[30px] font-[800] text-gradient leading-none mb-1">{stat.value}</span>
                <span className="font-mono text-[11px] text-[var(--muted)]">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 w-full">
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={() => {
                  history.replaceState(null, "", window.location.pathname + "#projects");
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center h-[48px] rounded-[12px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-dm-sans font-medium px-8 hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer border-0"
              >
                View My Work
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link
                href={resumeUrl}
                target="_blank"
                download="Tharun_Chandra_Lingala_Resume.pdf"
                onClick={() => console.log("resume_download")}
                className="flex items-center justify-center gap-2 h-[48px] rounded-[12px] border border-[var(--border2)] text-[var(--text)] font-dm-sans font-medium px-8 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                Download Resume
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* RIGHT COLUMN - 3D CARD */}
        <div className="hidden md:flex justify-end perspective-[1000px] relative">
          {/* Card glow shift on hover */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-[32px] pointer-events-none filter blur-[50px] z-0"
              style={{
                width: "340px",
                height: "440px",
                willChange: "transform, opacity",
              }}
              animate={{
                opacity: isHovering ? 0.35 : 0,
                scale: isHovering ? 1.05 : 0.95,
                backgroundImage: [
                  "radial-gradient(circle, var(--accent) 0%, var(--accent2) 100%)",
                  "radial-gradient(circle, var(--accent2) 0%, var(--accent) 100%)",
                  "radial-gradient(circle, var(--accent) 0%, var(--accent2) 100%)",
                ],
              }}
              transition={{
                opacity: { duration: isHovering ? 0.4 : 0.6, ease: "easeOut" },
                scale: { duration: 0.4, ease: "easeOut" },
                backgroundImage: { repeat: Infinity, duration: 5, ease: "easeInOut" },
              }}
            />
          )}

          {/* Actual Card Container */}
          <div
            ref={cardRef}
            className="relative w-[340px] h-[440px] rounded-[32px] overflow-hidden transition-all duration-300 ease-out flex flex-col items-center justify-center group z-10 border border-[var(--border)]"
            style={{
              transform: isHovering && !prefersReducedMotion
                ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                : "rotateX(0deg) rotateY(0deg)",
              transformStyle: "preserve-3d",
              // Dynamic specular depth shadow + glow
              boxShadow: isHovering
                ? `${-rotation.y * 1.2}px ${rotation.x * 1.2}px 30px rgba(0, 0, 0, 0.45), 
                   0 0 40px rgba(var(--accent-rgb, 99, 102, 241), 0.35), 
                   0 0 80px rgba(var(--accent-rgb, 99, 102, 241), 0.1)`
                : "0 10px 30px rgba(0, 0, 0, 0.15)",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setRotation({ x: 0, y: 0 });
              setMousePos({ x: 0, y: 0 });
            }}
          >
            {/* Background fluid blobs (Theme-aware opacity and blend modes) */}
            <div className="absolute inset-[-80px] z-0 overflow-visible pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <motion.div
                animate={{
                  x: [0, 40, -20, 0],
                  y: [0, -40, 20, 0],
                  scale: [1, 1.3, 0.8, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: prefersReducedMotion ? 20 : 8 * speedMultiplier,
                  ease: "easeInOut",
                }}
                style={{
                  mixBlendMode: "var(--blob-blend)" as any,
                  opacity: "var(--blob-opacity)" as any,
                }}
                className="absolute top-[10%] left-[10%] w-[200px] h-[200px] bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-full filter blur-[40px]"
              />
              <motion.div
                animate={{
                  x: [0, -30, 40, 0],
                  y: [0, 30, -20, 0],
                  scale: [1, 0.8, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: prefersReducedMotion ? 25 : 10 * speedMultiplier,
                  ease: "easeInOut",
                }}
                style={{
                  mixBlendMode: "var(--blob-blend)" as any,
                  opacity: "var(--blob-opacity)" as any,
                }}
                className="absolute top-[20%] right-[10%] w-[180px] h-[180px] bg-gradient-to-tr from-[#06b6d4] to-[#2dd4bf] rounded-full filter blur-[40px]"
              />
              <motion.div
                animate={{
                  x: [0, 20, -30, 0],
                  y: [0, 20, -40, 0],
                  scale: [0.9, 1.2, 0.9, 0.9],
                }}
                transition={{
                  repeat: Infinity,
                  duration: prefersReducedMotion ? 30 : 12 * speedMultiplier,
                  ease: "easeInOut",
                }}
                style={{
                  mixBlendMode: "var(--blob-blend)" as any,
                  opacity: "var(--blob-opacity)" as any,
                }}
                className="absolute bottom-[10%] left-[30%] w-[200px] h-[200px] bg-gradient-to-tl from-[#8b5cf6] to-[#d946ef] rounded-full filter blur-[40px]"
              />
              {/* 4th Blob (Orange/Amber) */}
              <motion.div
                animate={{
                  x: [0, -20, 30, 0],
                  y: [0, -20, 40, 0],
                  scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: prefersReducedMotion ? 35 : 14 * speedMultiplier,
                  ease: "easeInOut",
                }}
                style={{
                  mixBlendMode: "var(--blob-blend)" as any,
                  opacity: "var(--blob-opacity)" as any,
                }}
                className="absolute bottom-[5%] right-[5%] w-[160px] h-[160px] bg-gradient-to-br from-[#d97706] to-[#f59e0b] rounded-full filter blur-[40px]"
              />
            </div>

            {/* Radial Vignette Overlay above blobs but below glass (Theme-aware var(--card-vignette)) */}
            <div
              className="absolute inset-0 z-0 pointer-events-none rounded-[32px] transition-colors duration-300"
              style={{
                background: "radial-gradient(ellipse at center, transparent 40%, var(--card-vignette) 100%)",
              }}
            />

            {/* Clipping Mask to hide jagged edges from SVG filter */}
            <div className="absolute inset-0 z-10 rounded-[32px] overflow-hidden" style={{ transform: "translateZ(0)" }}>
              {/* Apple-style Frosted Glass Container (Dynamic overlay opacity inside dynamic theme surface) */}
              <div
                className="absolute inset-[-40px] bg-[var(--surface)]/10 dark:bg-transparent"
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  filter: "url(#container-glass)",
                  WebkitFilter: "url(#container-glass)",
                }}
              />
            </div>

            {/* Glass texture overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none rounded-[32px] opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 1px, transparent 1px, transparent 4px)",
              }}
            />

            {/* Pristine Rim Light (Not distorted by filter) */}
            <div
              className="absolute inset-0 z-20 rounded-[32px] pointer-events-none"
              style={{
                boxShadow: "inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7)",
              }}
            >
              {/* Diagonal glass reflection */}
              <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                {/* Rest: Static Highlight at top-left corner */}
                <div
                  className="absolute top-0 left-0 w-32 h-32 opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)",
                  }}
                />

                {/* Hover: Diagonal beam 1 */}
                {!prefersReducedMotion && (
                  <>
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: "-150%", y: "-150%" }}
                      animate={isHovering ? { x: "150%", y: "150%" } : { x: "-150%", y: "-150%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      style={{
                        background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                        mixBlendMode: "overlay",
                      }}
                    />
                    {/* Hover: Diagonal beam 2 */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: "-150%", y: "-150%" }}
                      animate={isHovering ? { x: "150%", y: "150%" } : { x: "-150%", y: "-150%" }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                      style={{
                        background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                        mixBlendMode: "overlay",
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Specular highlight overlay */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-[32px]"
                style={{
                  background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
                }}
              />
            )}

            {/* Availability indicator */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface)]/40 border border-[var(--border)] backdrop-blur-md select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--green)]"></span>
              </span>
              <span className="font-mono text-[10px] text-[var(--text)]/70">Available</span>
            </div>

            {/* Floating tech badges */}
            {/* Top-Right Badge: Next.js */}
            <motion.div
              className="absolute z-30 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--text)]/90 bg-[var(--surface)]/60 border border-[var(--border2)] px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md pointer-events-none"
              style={{ top: 28, right: -16 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [-4, 4, -4],
                      x: isHovering ? 8 : 0,
                    }
              }
              transition={{
                y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                x: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text)] dark:bg-white shadow-[0_0_6px_var(--text)] dark:shadow-[0_0_6px_#ffffff]" />
              Next.js
            </motion.div>

            {/* Right Middle Badge: TypeScript */}
            <motion.div
              className="absolute z-30 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--text)]/90 bg-[var(--surface)]/60 border border-[var(--border2)] px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md pointer-events-none"
              style={{ top: 220, right: -24 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [4, -4, 4],
                      x: isHovering ? 8 : 0,
                    }
              }
              transition={{
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                x: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
              TypeScript
            </motion.div>

            {/* Bottom Left Badge: Node.js */}
            <motion.div
              className="absolute z-30 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--text)]/90 bg-[var(--surface)]/60 border border-[var(--border2)] px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md pointer-events-none"
              style={{ bottom: 44, left: -16 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [-3, 5, -3],
                      x: isHovering ? -8 : 0,
                    }
              }
              transition={{
                y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                x: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              Node.js
            </motion.div>

            {/* Left Middle Badge: React */}
            <motion.div
              className="absolute z-30 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--text)]/90 bg-[var(--surface)]/60 border border-[var(--border2)] px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md pointer-events-none"
              style={{ top: 154, left: -24 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [3, -5, 3],
                      x: isHovering ? -8 : 0,
                    }
              }
              transition={{
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                x: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              React
            </motion.div>

            {/* Floating Content (Moves with 3D tilt) */}
            <div
              className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none"
              style={{ transform: "translateZ(50px)" }}
            >
              {/* Avatar Core with Multi-Ring border system */}
              <div className="relative w-[230px] h-[230px] flex items-center justify-center mb-4 animate-float">
                {/* Innermost SVG Gradient border with rotating dots */}
                <motion.div
                  className="absolute w-[196px] h-[196px] rounded-full pointer-events-none z-0"
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    <defs>
                      <linearGradient id="ring1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent)" />
                        <stop offset="100%" stopColor="var(--accent2)" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="47.5" fill="none" stroke="url(#ring1-gradient)" strokeWidth="2.5" />
                  </svg>
                  {/* Spaced at 0deg, 120deg, 240deg */}
                  {/* 0deg: top center. x = 50%, y = 2.5% */}
                  <div
                    className="absolute w-1.5 h-1.5 bg-[var(--text)] dark:bg-white rounded-full shadow-[0_0_8px_var(--accent)]"
                    style={{ top: "2.5%", left: "50%", transform: "translate(-50%, -50%)" }}
                  />
                  {/* 120deg: top = 73.75%, left = 91.13% */}
                  <div
                    className="absolute w-1.5 h-1.5 bg-[var(--text)] dark:bg-white rounded-full shadow-[0_0_8px_var(--accent)]"
                    style={{ top: "73.75%", left: "91.13%", transform: "translate(-50%, -50%)" }}
                  />
                  {/* 240deg: top = 73.75%, left = 8.87% */}
                  <div
                    className="absolute w-1.5 h-1.5 bg-[var(--text)] dark:bg-white rounded-full shadow-[0_0_8px_var(--accent)]"
                    style={{ top: "73.75%", left: "8.87%", transform: "translate(-50%, -50%)" }}
                  />
                </motion.div>

                {/* Middle dashed ring */}
                <motion.div
                  className="absolute rounded-full border border-dashed border-[var(--text)]/20 pointer-events-none z-0"
                  style={{ width: 212, height: 212 }}
                  animate={prefersReducedMotion ? {} : { rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                />

                {/* Outermost active hover glow ring */}
                <motion.div
                  className="absolute rounded-full border border-[var(--accent)]/40 pointer-events-none z-0"
                  style={{
                    width: 228,
                    height: 228,
                    boxShadow: "0 0 15px var(--accent)",
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    scale: isHovering && !prefersReducedMotion ? [1, 1.05, 1] : 1,
                    opacity: isHovering ? 0.6 : 0,
                  }}
                  transition={{
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    opacity: { duration: 0.4 },
                  }}
                />

                {/* Avatar Core */}
                <motion.div
                  animate={prefersReducedMotion ? {} : { y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative w-[180px] h-[180px] rounded-full overflow-hidden shadow-2xl pointer-events-auto z-10"
                >
                  <img src="/avatar.png" alt="Tharun" className="w-full h-full object-cover scale-110" />
                </motion.div>
              </div>

              <h3 className="font-syne text-[22px] font-[700] text-[var(--text)] drop-shadow-sm mb-1">Tharun Chandra</h3>

              {/* Status Ticker */}
              <div className="h-6 overflow-hidden flex items-center justify-center mb-6 pointer-events-none select-none">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tickerIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="font-mono text-[12px] text-[var(--muted2)] drop-shadow-sm font-semibold"
                  >
                    {messages[tickerIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Minimal Tech Stack Text */}
              <div className="flex gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text)] bg-[var(--surface2)] border border-[var(--border)] px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
                  React
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text)] bg-[var(--surface2)] border border-[var(--border)] px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
                  Next
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70">
        <span className="font-mono text-[11px] text-[var(--muted)] mb-1">scroll</span>
        <ChevronDown size={16} className="text-[var(--muted)] animate-bounce-subtle" />
      </div>

      {/* SVG Filters for Liquid Glass Effect */}
      <svg style={{ display: "none" }}>
        <filter id="glass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" seed="2" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </section>
  );
}
