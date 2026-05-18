"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/Magnetic";

export function Hero() {
  const fullText = "Hi, I'm Tharun Chandra Lingala";
  const [isTypingDone, setIsTypingDone] = useState(false);

  // 3D Card State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Set typing done after the animation duration (approx 30 chars * 0.05s = 1.5s)
    const timer = setTimeout(() => {
      setIsTypingDone(true);
    }, fullText.length * 50 + 500);
    return () => clearTimeout(timer);
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
      y: normalizedX * 12   // tilt left/right
    });
  };

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
            className={`font-dm-sans text-[20px] md:text-[24px] font-[300] text-[var(--muted2)] mb-6 transition-opacity duration-400 ease-in-out ${isTypingDone ? 'opacity-100' : 'opacity-0'}`}
          >
            Frontend-Focused Full Stack Developer
          </h2>

          <p className="font-dm-sans text-[16px] text-[var(--muted)] leading-[1.8] max-w-[520px] mb-10">
            I build real-time apps, AI-powered platforms and scalable UIs using React, Next.js 15 and TypeScript — shipping production-ready code with a focus on performance and user experience.
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
                href="/resume.pdf"
                target="_blank"
                onClick={() => console.log('resume_download')}
                className="flex items-center justify-center h-[48px] rounded-[12px] border border-[var(--border2)] text-[var(--text)] font-dm-sans font-medium px-8 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                Download Resume
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* RIGHT COLUMN - 3D CARD */}
        <div className="hidden md:flex justify-end perspective-[1000px]">
          <div
            ref={cardRef}
            className="relative w-[340px] h-[440px] rounded-[32px] overflow-hidden transition-transform duration-300 ease-out flex flex-col items-center justify-center group"
            style={{
              transform: isHovering
                ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                : 'rotateX(0deg) rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setRotation({ x: 0, y: 0 });
            }}
          >
            {/* Fluid Background (Required for the gel effect to be visible!) */}
            <div className="absolute inset-[-80px] z-0 overflow-visible pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <motion.div
                animate={{
                  x: [0, 40, -20, 0],
                  y: [0, -40, 20, 0],
                  scale: [1, 1.3, 0.8, 1],
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] w-[200px] h-[200px] bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-full filter blur-[40px] opacity-90 mix-blend-screen"
              />
              <motion.div
                animate={{
                  x: [0, -30, 40, 0],
                  y: [0, 30, -20, 0],
                  scale: [1, 0.8, 1.2, 1],
                }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="absolute top-[20%] right-[10%] w-[180px] h-[180px] bg-gradient-to-tr from-[#06b6d4] to-[#2dd4bf] rounded-full filter blur-[40px] opacity-90 mix-blend-screen"
              />
              <motion.div
                animate={{
                  x: [0, 20, -30, 0],
                  y: [0, 20, -40, 0],
                  scale: [0.9, 1.2, 0.9, 0.9],
                }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                className="absolute bottom-[10%] left-[30%] w-[200px] h-[200px] bg-gradient-to-tl from-[#8b5cf6] to-[#d946ef] rounded-full filter blur-[40px] opacity-90 mix-blend-screen"
              />
            </div>

            {/* Clipping Mask to hide jagged edges from SVG filter */}
            <div className="absolute inset-0 z-10 rounded-[32px] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
              {/* Apple-style Frosted Glass Container (The actual card face with liquid glass filter) */}
              <div
                className="absolute inset-[-40px] bg-transparent"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  filter: 'url(#container-glass)',
                  WebkitFilter: 'url(#container-glass)'
                }}
              />
            </div>

            {/* Pristine Rim Light (Not distorted by filter) */}
            <div
              className="absolute inset-0 z-20 rounded-[32px] pointer-events-none"
              style={{ boxShadow: 'inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7)' }}
            >
              {/* Diagonal Glass Reflection */}
              <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
              </div>
            </div>

            {/* Floating Content (Moves with 3D tilt) */}
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none" style={{ transform: 'translateZ(50px)' }}>

              {/* Avatar Core */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative w-[180px] h-[180px] rounded-full overflow-hidden shadow-2xl mb-4 pointer-events-auto"
              >
                {/* Changed to avatar.png so you can use a background-removed image */}
                <img src="/avatar.jpeg" alt="Tharun" className="w-full h-full object-cover scale-110" />
              </motion.div>

              <h3 className="font-syne text-[22px] font-[700] text-white drop-shadow-md mb-1">Tharun Chandra</h3>
              <p className="font-mono text-[12px] text-white/70 drop-shadow-sm mb-6">Full Stack Developer</p>

              {/* Minimal Tech Stack Text */}
              <div className="flex gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/90 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">React</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/90 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">Next</span>
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
      <svg style={{ display: 'none' }}>
        <filter id="glass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" seed="2" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

    </section>
  );
}
