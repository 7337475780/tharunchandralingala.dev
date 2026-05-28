"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";

const chapters = [
  { 
    id: "home", 
    target: "home",
    num: "01", 
    title: "ORIGIN", 
    subtitle: "Chapter 1: Who I am", 
    glow: "bg-gradient-to-tr from-[#3b82f6]/15 via-[#8b5cf6]/15 to-transparent",
    orbColor: "bg-blue-500/20"
  },
  { 
    id: "skills", 
    target: "skills",
    num: "02", 
    title: "SYSTEMS", 
    subtitle: "Chapter 2: Problems I solve", 
    glow: "bg-gradient-to-tr from-[#10b981]/15 via-[#06b6d4]/15 to-transparent",
    orbColor: "bg-emerald-500/20"
  },
  { 
    id: "projects", 
    target: "projects",
    num: "03", 
    title: "ARCHITECTURE", 
    subtitle: "Chapter 3: Projects as systems", 
    glow: "bg-gradient-to-tr from-[#f59e0b]/15 via-[#6366f1]/15 to-transparent",
    orbColor: "bg-amber-500/20"
  },
  { 
    id: "contact", 
    target: "contact",
    num: "04", 
    title: "DEMOS & FINALE", 
    subtitle: "Chapter 4: Live demos & Contact", 
    glow: "bg-gradient-to-tr from-[#ec4899]/15 via-[#3b82f6]/15 to-transparent",
    orbColor: "bg-pink-500/20"
  }
];

export function StoryNavigation() {
  const [activeChapter, setActiveChapter] = useState("home");
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [storyModeActive, setStoryModeActive] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 300;
      let current = "home";

      for (const ch of chapters) {
        const el = document.getElementById(ch.target);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY - offset;
          if (scrollY >= top) {
            current = ch.id;
          }
        }
      }
      setActiveChapter(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToChapter = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentCh = chapters.find(c => c.id === activeChapter) || chapters[0];

  if (!storyModeActive) return null;

  return (
    <>
      {/* Background Morphing Atmosphere Layer */}
      <div className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden transition-colors duration-1000 ease-in-out">
        <div className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-30 transition-all duration-1000 transform -translate-x-1/2 ${currentCh.orbColor}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 transition-all duration-1000 transform translate-x-1/2 ${currentCh.orbColor}`} />
      </div>

      {/* Fixed Left Floating Story Dock (Desktop) */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[75] hidden lg:flex flex-col gap-6 pointer-events-auto">
        <div className="flex flex-col items-center gap-4 bg-[var(--surface)]/60 backdrop-blur-xl border border-[var(--border)] rounded-full p-3 shadow-2xl relative">
          
          {/* Top Compass Header Icon */}
          <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center mb-2 shadow-inner" title="Story Navigation Active">
            <Compass className="animate-spin-slow" size={20} />
          </div>

          {/* Chapter Nodes */}
          {chapters.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <div 
                key={ch.id} 
                className="relative group flex items-center"
                onMouseEnter={() => setHoveredChapter(ch.id)}
                onMouseLeave={() => setHoveredChapter(null)}
              >
                <button
                  onClick={() => scrollToChapter(ch.target)}
                  className={`w-10 h-10 rounded-full font-mono text-[13px] font-bold flex items-center justify-center transition-all duration-300 relative z-10 cursor-pointer ${
                    isActive 
                      ? "text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110" 
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:scale-105"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="story-active-node"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                  {ch.num}
                </button>

                {/* Floating Chapter Tooltip */}
                <AnimatePresence>
                  {(hoveredChapter === ch.id || isActive) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-14 top-1/2 -translate-y-1/2 pl-3 py-2 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-xl whitespace-nowrap shadow-xl flex flex-col z-20 pointer-events-none"
                    >
                      <span className="font-mono text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider">
                        {ch.subtitle}
                      </span>
                      <span className="font-syne text-[14px] font-[700] text-[var(--text)] leading-tight">
                        {ch.title}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Chapter Connection Track Line */}
          <div className="absolute top-16 bottom-10 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--border)] z-0" />
        </div>
      </div>
    </>
  );
}
