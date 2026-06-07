"use client";

import React, { useState, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { 
  ArrowUpRight, MessageSquare, Sparkles, Wand2, DownloadCloud, 
  Activity, Zap, Play, CheckCircle, ShieldCheck, Cpu 
} from "lucide-react";
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiNodedotjs, 
  SiPython, SiDocker, SiPostgresql, SiSupabase, SiPrisma, SiOpenai, SiGoogle 
} from "react-icons/si";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "./ui/Button";

interface ProjectCardProps {
  title: string;
  description: string;
  stack: string[];
  tag?: string;
  githubUrl?: string;
  liveUrl?: string;
  className?: string;
  index?: number;
}

// Custom icons helper for technology pills
function getTechIcon(name: string) {
  const n = name.toLowerCase().trim();
  if (n.includes("react")) return <SiReact className="w-3.5 h-3.5 text-[#61dafb] shrink-0" />;
  if (n.includes("next.js") || n.includes("nextjs")) return <SiNextdotjs className="w-3.5 h-3.5 text-slate-800 dark:text-white shrink-0" />;
  if (n.includes("typescript") || n === "ts") return <SiTypescript className="w-3.5 h-3.5 text-[#3178c6] shrink-0" />;
  if (n.includes("javascript") || n === "js") return <SiJavascript className="w-3.5 h-3.5 text-[#f7df1e] shrink-0" />;
  if (n.includes("tailwind")) return <SiTailwindcss className="w-3.5 h-3.5 text-[#3ecf8e] shrink-0" />;
  if (n.includes("node")) return <SiNodedotjs className="w-3.5 h-3.5 text-[#339933] shrink-0" />;
  if (n.includes("python")) return <SiPython className="w-3.5 h-3.5 text-[#3776ab] shrink-0" />;
  if (n.includes("docker")) return <SiDocker className="w-3.5 h-3.5 text-[#2496ed] shrink-0" />;
  if (n.includes("postgresql") || n.includes("postgres")) return <SiPostgresql className="w-3.5 h-3.5 text-[#4169e1] shrink-0" />;
  if (n.includes("supabase")) return <SiSupabase className="w-3.5 h-3.5 text-[#3ecf8e] shrink-0" />;
  if (n.includes("prisma")) return <SiPrisma className="w-3.5 h-3.5 text-slate-800 dark:text-white shrink-0" />;
  if (n.includes("openai")) return <SiOpenai className="w-3.5 h-3.5 text-slate-800 dark:text-white shrink-0" />;
  if (n.includes("gemini") || n.includes("google")) return <SiGoogle className="w-3.5 h-3.5 text-[#4285f4] shrink-0" />;
  if (n.includes("convex")) return <span className="text-[10px] font-bold text-yellow-500 dark:text-yellow-400 font-mono shrink-0">▲</span>;
  if (n.includes("clerk")) return <span className="text-[9px] font-extrabold text-[#6c47ff] font-mono shrink-0">C</span>;
  
  return <span className="text-[8px] font-mono font-bold uppercase text-slate-700 dark:text-white">{name.slice(0, 2)}</span>;
}

export function ProjectCard({
  title,
  description,
  stack,
  tag,
  githubUrl = "#",
  liveUrl = "#",
  className,
  index = 0
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const isWebGenie = title.toLowerCase().includes("genie");
  const isWeConnect = title.toLowerCase().includes("connect");
  const isAiMagix = title.toLowerCase().includes("magix");
  const isInstaLoad = title.toLowerCase().includes("load") || title.toLowerCase().includes("fetcher");
  const isCardio = title.toLowerCase().includes("cardio");

  // Determine card accent colors matching the user image
  let accentColor = "border-slate-200 dark:border-white/5 hover:border-purple-500/40 dark:hover:border-purple-500/30";
  let spotlightColor = "rgba(168, 85, 247, 0.08)";
  let topGlow = "from-purple-500/5 dark:from-purple-500/10 to-transparent";

  if (isWeConnect) {
    accentColor = "border-slate-200 dark:border-white/5 hover:border-emerald-500/40 dark:hover:border-emerald-500/30";
    spotlightColor = "rgba(16, 185, 129, 0.08)";
    topGlow = "from-emerald-500/5 dark:from-emerald-500/10 to-transparent";
  } else if (isAiMagix) {
    accentColor = "border-slate-200 dark:border-white/5 hover:border-pink-500/40 dark:hover:border-pink-500/30";
    spotlightColor = "rgba(236, 72, 153, 0.08)";
    topGlow = "from-pink-500/5 dark:from-pink-500/10 to-transparent";
  } else if (isInstaLoad) {
    accentColor = "border-slate-200 dark:border-white/5 hover:border-amber-500/40 dark:hover:border-amber-500/30";
    spotlightColor = "rgba(245, 158, 11, 0.08)";
    topGlow = "from-amber-500/5 dark:from-amber-500/10 to-transparent";
  } else if (isCardio) {
    accentColor = "border-slate-200 dark:border-white/5 hover:border-red-500/40 dark:hover:border-red-500/30";
    spotlightColor = "rgba(239, 68, 68, 0.08)";
    topGlow = "from-red-500/5 dark:from-red-500/10 to-transparent";
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 65, damping: 13 }}
      className={cn(
        "group relative rounded-[28px] overflow-hidden border bg-white dark:bg-[#07070f] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between h-full min-h-[380px]",
        accentColor,
        className
      )}
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Decorative gradient sheet top */}
      <div className={cn("absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b opacity-40 pointer-events-none z-0", topGlow)} />

      {/* Dynamic Cursor Spotlight Overlay */}
      {hovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[28px] transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`
          }}
        />
      )}

      {/* Grid container: Split left / right on sm+ */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-6 p-6 md:p-8 h-full flex-grow items-center">

        {/* LEFT COLUMN: Texts & Info */}
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            {/* Top row: Icon + Title + Status/Badge */}
            <div className="flex items-center gap-3 mb-4">
              {/* App Icon matching image */}
              <div className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm dark:shadow-lg",
                isWebGenie && "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
                isWeConnect && "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
                isAiMagix && "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400",
                isInstaLoad && "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500",
                isCardio && "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              )}>
                {isWebGenie && <Wand2 className="w-5 h-5" />}
                {isWeConnect && <MessageSquare className="w-5 h-5" />}
                {isAiMagix && <Sparkles className="w-5 h-5" />}
                {isInstaLoad && <DownloadCloud className="w-5 h-5" />}
                {isCardio && <Activity className="w-5 h-5" />}
              </div>

              {/* Title & Pulse Indicator */}
              <div className="flex flex-col">
                <h3 className="font-syne text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  {title}
                  {isWeConnect && (
                    <span className="relative flex h-2 w-2 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </h3>
                {tag && (
                  <span className={cn(
                    "text-[9px] font-mono mt-1.5 uppercase tracking-wider font-semibold w-fit px-1.5 py-0.5 rounded",
                    isWebGenie && "text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20",
                    isWeConnect && "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
                    isAiMagix && "text-pink-600 dark:text-pink-400 bg-pink-500/10 border border-pink-500/20",
                    isInstaLoad && "text-amber-600 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20",
                    isCardio && "text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20"
                  )}>
                    {tag}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="font-dm-sans text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light mb-4">
              {description}
            </p>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {stack.slice(0, 5).map((tech) => (
                <div
                  key={tech}
                  title={tech}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] select-none cursor-default"
                >
                  {getTechIcon(tech)}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom elements inside Left Column */}
          <div className="mt-auto flex flex-col gap-5">
            {/* Stats Row underneath stack (Matches Image) */}
            {isWeConnect && (
              <div className="flex gap-5 font-mono border-t border-slate-100 dark:border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs">1.8k</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Users</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-5">
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs">120k+</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Messages</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">99.9%</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Uptime</span>
                </div>
              </div>
            )}

            {isInstaLoad && (
              <div className="flex gap-5 font-mono border-t border-slate-100 dark:border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs">10k+</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Downloads</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-5">
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs">1.2MB</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Avg. Size</span>
                </div>
              </div>
            )}

            {isCardio && (
              <div className="flex gap-5 font-mono border-t border-slate-100 dark:border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs">98%</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Accuracy</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-5">
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs">1.2s</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Inference</span>
                </div>
              </div>
            )}

            {/* CTA Link Buttons */}
            <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-4">
              <Link
                href={liveUrl}
                target="_blank"
                className="font-mono text-[11px] font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors group/link"
              >
                <span>&gt; Live Demo</span>
              </Link>
              <Link
                href={githubUrl}
                target="_blank"
                className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <FaGithub size={13} />
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Custom graphics to match attached image */}
        <div className="w-full h-full flex items-center justify-center min-h-[160px] sm:min-h-0 relative select-none">

          {/* webGenie mockup layout */}
          {isWebGenie && (
            <div className="w-[170px] h-[130px] rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0c0d1b] shadow-2xl flex flex-col overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
              {/* Top bar */}
              <div className="h-6 bg-slate-100 dark:bg-[#080914] border-b border-slate-200 dark:border-white/5 flex items-center px-2 justify-between shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]/80" />
                </div>
                <div className="w-20 h-2.5 rounded bg-slate-200 dark:bg-white/5" />
                <div className="w-2" />
              </div>
              {/* Main body */}
              <div className="p-3.5 flex flex-col gap-2.5 flex-grow justify-between bg-gradient-to-b from-transparent to-purple-500/5 dark:to-[#12142d]/30">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold text-slate-900 dark:text-white leading-none">Build Your Site</div>
                  <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full" />
                  <div className="w-4/5 h-1 bg-slate-200 dark:bg-white/5 rounded-full" />
                </div>
                {/* Accent generate CTA */}
                <div className="w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-[8px] font-bold text-center text-white shadow-lg shadow-purple-600/30 tracking-wider uppercase">
                  Generate Layout
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* WeConnect glasschat bubble stats layout */}
          {isWeConnect && (
            <div className="relative w-[130px] h-[110px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {/* Big Bubble */}
              <div className="absolute top-2 right-4 w-16 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 border border-white/20 shadow-lg flex items-center justify-center text-white/80">
                <span className="text-[10px] tracking-widest font-bold">...</span>
                {/* Bubble tail */}
                <div className="absolute bottom-[-4px] right-3 w-3 h-3 bg-purple-600 rotate-45 border-r border-b border-white/20" />
              </div>
              {/* Small Bubble */}
              <div className="absolute bottom-2 left-4 w-14 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-emerald-600 border border-white/20 shadow-lg flex items-center justify-center text-white/80">
                <span className="text-[8px] tracking-wide font-medium">Hi!</span>
                {/* Bubble tail */}
                <div className="absolute top-[-3px] left-3 w-2.5 h-2.5 bg-cyan-600 rotate-45 border-t border-l border-white/20" />
              </div>
              {/* Accent Glow */}
              <div className="absolute w-20 h-20 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-xl pointer-events-none" />
            </div>
          )}

          {/* aiMagix Astronaut layout */}
          {isAiMagix && (
            <div className="flex flex-col gap-3 items-center group-hover:scale-105 transition-transform duration-500">
              {/* Main astronaut generated preview with filters */}
              <div className="w-[115px] h-[105px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 shadow-2xl relative">
                <img
                  src="/projects/aimagix.png"
                  alt="AI Generated Astronaut"
                  className="w-full h-full object-cover object-center"
                />
                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent pointer-events-none" />
              </div>
              {/* Row of 4 minor generated thumbnail variations */}
              <div className="flex gap-1">
                {[0, 90, 180, 270].map((hue, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-md overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/30 shadow-sm"
                  >
                    <img
                      src="/projects/aimagix.png"
                      alt="Variation"
                      className="w-full h-full object-cover"
                      style={{ filter: `hue-rotate(${hue}deg) saturate(1.2)` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* InstaLoad speed circular progress gauge */}
          {isInstaLoad && (
            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {/* SVG Circle Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-200 dark:stroke-white/5"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#greenGradient)"
                  strokeWidth="6"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8" // 75% progress
                  strokeLinecap="round"
                  fill="transparent"
                  className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
                {/* Gradients */}
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center Text */}
              <div className="absolute flex flex-col items-center justify-center font-mono">
                <span className="text-slate-900 dark:text-white font-extrabold text-lg leading-none">0.8s</span>
                <span className="text-[8px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Avg. Time</span>
              </div>
            </div>
          )}

          {/* Cardio AI Heartbeat ECG graphic */}
          {isCardio && (
            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {/* Radial Glow */}
              <div className="absolute w-20 h-20 rounded-full bg-red-500/10 dark:bg-red-500/20 blur-xl pointer-events-none" />
              <img
                src="/projects/cardioai_3d.png"
                alt="Cardio AI 3D Render"
                className="w-[120px] h-[120px] object-contain filter drop-shadow-[0_8px_16px_rgba(239,68,68,0.25)]"
              />
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
