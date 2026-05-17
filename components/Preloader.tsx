"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let current = 0;
    const interval = setInterval(() => {
      // Simulate realistic loading — fast at first, slows near 100
      const remaining = 100 - current;
      const increment = Math.max(1, Math.floor(Math.random() * (remaining * 0.15)) + 1);
      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        // Pause at 100% briefly, then reveal
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(handleRevealComplete, 1600);
        }, 800);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Once reveal animation ends, remove preloader
  const handleRevealComplete = () => {
    setPhase("done");
    document.body.style.overflow = "";
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">

      {/* === PHASE: LOADING === */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            key="loading-screen"
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808] pointer-events-auto"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Ambient glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500 opacity-10 blur-[120px] pointer-events-none" />

            {/* Absolute centered TC — perfectly aligns with reveal mask */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "drop-shadow(0 0 0px rgba(37,99,235,0))" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: [
                    "drop-shadow(0 0 15px rgba(37,99,235,0.4))",
                    "drop-shadow(0 0 60px rgba(99,102,241,0.85))",
                    "drop-shadow(0 0 15px rgba(37,99,235,0.4))"
                  ],
                  backgroundPosition: ["0% center", "200% center", "0% center"]
                }}
                transition={{
                  opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                  filter: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  backgroundPosition: { repeat: Infinity, duration: 3, ease: "linear" }
                }}
                className="font-syne font-black bg-gradient-to-r from-white via-[#818cf8] to-white bg-[length:200%_auto] bg-clip-text text-transparent"
                style={{ fontSize: "15vw", letterSpacing: "-0.04em", lineHeight: 1 }}
              >
                TC
              </motion.div>
            </div>

            {/* Absolute bottom progress container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none select-none tabular-nums"
            >
              {/* Progress number */}
              <div className="flex items-end gap-1">
                <span
                  className="font-syne font-bold text-white tabular-nums"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                  {progress}
                </span>
                <span className="font-syne font-bold text-[var(--accent)] mb-1" style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}>
                  %
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-[2px] w-[240px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--accent2, #818cf8))" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.08, ease: "linear" }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-[40px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: [-40, 240] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
              </div>

              {/* Animated Label Stream */}
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] flex gap-1 overflow-hidden select-none">
                {["L","O","A","D","I","N","G"," ","P","O","R","T","F","O","L","I","O"].map((char, i) => char === " " ? <span key={i} className="w-2" /> : (
                  <motion.span
                    key={i}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.4] }}
                    transition={{
                      y: { repeat: Infinity, duration: 1.4, delay: i * 0.06, ease: "easeInOut" },
                      opacity: { repeat: Infinity, duration: 1.4, delay: i * 0.06, ease: "easeInOut" },
                    }}
                    className={i < 7 ? "text-[var(--accent2)] font-bold drop-shadow-[0_0_8px_var(--accent2)]" : "text-white/60"}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === PHASE: REVEAL — SVG mask zoom === */}
      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            key="reveal-screen"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            onAnimationComplete={handleRevealComplete}
          >
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0"
              style={{ display: "block" }}
            >
              <defs>
                <mask id="tc-reveal-mask">
                  {/* White = opaque (blocked), black hole = transparent (see-through) */}
                  <rect width="100%" height="100%" fill="white" />
                  <motion.text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="black"
                    fontFamily="'Syne', 'Inter', sans-serif"
                    fontWeight="800"
                    fontSize="15vw"
                    letterSpacing="-0.04em"
                    initial={{ scale: 1 }}
                    animate={{ scale: 200 }}
                    transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
                    style={{ transformOrigin: "50% 50%" }}
                  >
                    TC
                  </motion.text>
                </mask>
              </defs>
              {/* Dark overlay with TC hole — as hole grows, page is revealed */}
              <motion.rect
                width="100%"
                height="100%"
                fill="#080808"
                mask="url(#tc-reveal-mask)"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
