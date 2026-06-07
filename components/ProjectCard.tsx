"use client";

import React, { useState, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { ArrowUpRight, MessageSquare, Sparkles, Wand2, DownloadCloud, Activity, Zap, Play, CheckCircle } from "lucide-react";
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

// Custom icons helper
function getTechIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("next.js") || n.includes("nextjs")) {
    return <span className="text-[10px] font-extrabold text-[#f8fafc]">N</span>;
  }
  if (n.includes("typescript") || n === "ts") {
    return <span className="text-[10px] font-bold text-[#3178c6]">TS</span>;
  }
  if (n.includes("react")) {
    return <span className="text-[10px] font-bold text-[#61dafb]">R</span>;
  }
  if (n.includes("node")) {
    return <span className="text-[10px] font-bold text-[#339933]">Ex</span>;
  }
  if (n.includes("socket")) {
    return <Zap className="w-3 h-3 text-[#f59e0b]" />;
  }
  if (n.includes("python")) {
    return <span className="text-[10px] font-bold text-[#3776ab]">Py</span>;
  }
  if (n.includes("convex") || n.includes("db")) {
    return <span className="text-[10px] font-bold text-[#10b981] font-mono">C</span>;
  }
  return <span className="text-[8px] font-mono font-bold uppercase">{name.slice(0, 2)}</span>;
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
  let accentColor = "rgba(161, 85, 255, 0.2)";
  let accentBorder = "group-hover:border-[#a155ff]/40";
  let spotlightColor = "rgba(161, 85, 255, 0.12)";
  let topGlow = "from-[#a155ff]/10 to-transparent";

  if (isWeConnect) {
    accentColor = "rgba(0, 242, 169, 0.2)";
    accentBorder = "group-hover:border-[#00f2a9]/40";
    spotlightColor = "rgba(0, 242, 169, 0.12)";
    topGlow = "from-[#00f2a9]/10 to-transparent";
  } else if (isAiMagix) {
    accentColor = "rgba(236, 72, 153, 0.2)";
    accentBorder = "group-hover:border-[#ec4899]/40";
    spotlightColor = "rgba(236, 72, 153, 0.12)";
    topGlow = "from-[#ec4899]/10 to-transparent";
  } else if (isInstaLoad) {
    accentColor = "rgba(249, 115, 22, 0.2)";
    accentBorder = "group-hover:border-[#f97316]/40";
    spotlightColor = "rgba(249, 115, 22, 0.12)";
    topGlow = "from-[#f97316]/10 to-transparent";
  } else if (isCardio) {
    accentColor = "rgba(239, 68, 68, 0.2)";
    accentBorder = "group-hover:border-[#ef4444]/40";
    spotlightColor = "rgba(239, 68, 68, 0.12)";
    topGlow = "from-[#ef4444]/10 to-transparent";
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
        "group relative rounded-[28px] overflow-hidden border border-white/5 bg-gradient-to-b from-[#090a19] to-[#04050d] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between h-full min-h-[360px]",
        accentBorder,
        className
      )}
      style={{
        perspective: "1200px",
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

      {/* Grid container: Split left / right on md+ */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-6 p-6 md:p-8 h-full flex-grow items-center">

        {/* LEFT COLUMN: Texts & Info */}
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            {/* Top row: Icon + Title + Status/Badge */}
            <div className="flex items-center gap-3 mb-4">
              {/* App Icon matching image */}
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                {isWebGenie && <Wand2 className="w-5 h-5 text-[#a155ff]" />}
                {isWeConnect && <MessageSquare className="w-5 h-5 text-[#00f2a9]" />}
                {isAiMagix && <Sparkles className="w-5 h-5 text-[#ec4899]" />}
                {isInstaLoad && <DownloadCloud className="w-5 h-5 text-[#f97316]" />}
                {isCardio && <Activity className="w-5 h-5 text-[#ef4444]" />}
              </div>

              {/* Title & Pulse Indicator */}
              <div className="flex flex-col">
                <h3 className="font-syne text-xl font-bold text-white flex items-center gap-1.5 leading-none">
                  {title}
                  {isWeConnect && (
                    <span className="relative flex h-2 w-2 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2a9] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2a9]"></span>
                    </span>
                  )}
                </h3>
                {tag && (
                  <span className="text-[10px] font-mono text-[var(--muted)] mt-1 uppercase tracking-wider">
                    {tag}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="font-dm-sans text-xs md:text-sm text-[var(--muted2)] leading-relaxed font-light mb-6">
              {description}
            </p>
          </div>

          {/* Bottom elements inside Left Column */}
          <div className="mt-auto flex flex-col gap-6">
            {/* Tech Stack Pills (Glass circles matching image) */}
            <div className="flex items-center gap-2">
              {stack.slice(0, 4).map((tech) => (
                <div
                  key={tech}
                  title={tech}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--muted)] hover:text-white hover:border-white/20 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] select-none cursor-default"
                >
                  {getTechIcon(tech)}
                </div>
              ))}
            </div>

            {/* CTA Link Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href={liveUrl}
                target="_blank"
                className="font-mono text-[11px] font-bold text-[var(--text)] hover:text-[#00f2fe] flex items-center gap-1 transition-colors group/link"
              >
                <span>&gt; Live Demo</span>
              </Link>
              <Link
                href={githubUrl}
                target="_blank"
                className="font-mono text-[11px] font-bold text-[var(--muted)] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <FaGithub size={13} />
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Custom graphics to match attached image */}
        <div className="w-full h-full flex items-center justify-center min-h-[160px] md:min-h-0 relative select-none">

          {/* webGenie mockup layout */}
          {isWebGenie && (
            <div className="w-[140px] h-[140px] relative select-none hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              <img
                src="/projects/webgenie_3d.png"
                alt="webGenie 3D Render"
                className="w-full h-full object-contain filter drop-shadow([0_8px_24px_rgba(161,85,255,0.35)])"
              />
            </div>
          )}

          {/* WeConnect glasschat bubble stats layout */}
          {isWeConnect && (
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <div className="w-[125px] h-[105px] relative select-none hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <img
                  src="/projects/weconnect_3d.png"
                  alt="WeConnect 3D Render"
                  className="w-full h-full object-contain filter drop-shadow([0_8px_24px_rgba(0,242,169,0.35)])"
                />
              </div>
              {/* Mini stats inline block */}
              <div className="flex gap-4 text-[9px] font-mono text-[var(--muted2)]">
                <div className="flex flex-col items-center">
                  <span className="text-white font-bold">2.4K+</span>
                  <span>Users</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/10 pl-4">
                  <span className="text-white font-bold">120K+</span>
                  <span>Messages</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/10 pl-4">
                  <span className="text-[#00f2a9] font-bold">99.9%</span>
                  <span>Uptime</span>
                </div>
              </div>
            </div>
          )}

          {/* aiMagix Astronaut layout */}
          {isAiMagix && (
            <div className="flex flex-col gap-3 items-center">
              {/* Main astronaut generated preview with filters */}
              <div className="w-[115px] h-[105px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl relative">
                <img
                  src="/projects/aimagix.png"
                  alt="AI Generated Astronaut"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Row of 4 minor generated thumbnail variations (made by adjusting image CSS hue/saturation filter) */}
              <div className="flex gap-1">
                {[0, 80, 160, 240].map((hue, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-md overflow-hidden border border-white/10 bg-black/30"
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

          {/* InstaLoad circular optimizer gauge */}
          {isInstaLoad && (
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <div className="w-[125px] h-[105px] relative select-none hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <img
                  src="/projects/instaload_3d.png"
                  alt="InstaLoad 3D Render"
                  className="w-full h-full object-contain filter drop-shadow([0_8px_24px_rgba(249,115,22,0.35)])"
                />
              </div>
              {/* Mini stats inline block */}
              <div className="flex gap-4 text-[9px] font-mono text-[var(--muted2)]">
                <div className="flex flex-col items-center">
                  <span className="text-white font-bold">10K+</span>
                  <span>Optimized</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/10 pl-4">
                  <span className="text-white font-bold">3.2MB</span>
                  <span>Avg. Saved</span>
                </div>
              </div>
            </div>
          )}

          {/* Cardio AI Heartbeat ECG graphic */}
          {isCardio && (
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <div className="w-[125px] h-[105px] relative select-none hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <img
                  src="/projects/cardioai_3d.png"
                  alt="Cardio AI 3D Render"
                  className="w-full h-full object-contain filter drop-shadow([0_8px_24px_rgba(239,68,68,0.35)])"
                />
              </div>
              {/* Metrics */}
              <div className="flex gap-4 text-[9px] font-mono text-[var(--muted2)]">
                <div className="flex flex-col items-center">
                  <span className="text-white font-bold">98%</span>
                  <span>Accuracy</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/10 pl-4">
                  <span className="text-white font-bold">1.2s</span>
                  <span>Inference</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
