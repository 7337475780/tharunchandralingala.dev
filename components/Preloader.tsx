"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

// Single digit slot-machine component - FIXED font-size clipping container bug
function Digit({ val }: { val: string }) {
  const sizeStyle = { fontSize: "clamp(34px, 5vw, 58px)" };
  return (
    <div
      className="relative h-[1.1em] overflow-hidden flex items-center justify-center w-[0.58em] select-none pointer-events-none"
      style={sizeStyle}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={val}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute font-syne font-bold text-white leading-none"
        >
          {val}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [particles, setParticles] = useState<Particle[]>([]);

  const prefersReducedMotion = useReducedMotion();

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

        // Particle burst on load complete (if not reduced motion)
        if (!prefersReducedMotion) {
          const burst: Particle[] = Array.from({ length: 26 }).map((_, idx) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 110; // 60px to 170px
            return {
              id: idx,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              size: Math.floor(Math.random() * 3) + 2, // 2px to 4px
              color:
                idx % 3 === 0
                  ? "var(--accent)"
                  : idx % 3 === 1
                    ? "var(--accent2, #818cf8)"
                    : "#ffffff",
            };
          });
          setParticles(burst);
        }

        // Pause at 100% briefly, then reveal SVG mask
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(handleRevealComplete, 1600);
        }, 800);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Once reveal animation ends, remove preloader
  const handleRevealComplete = () => {
    setPhase("done");
    document.body.style.overflow = "";
  };

  if (phase === "done") return null;

  const isReady = progress >= 100;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">

      {/* === PHASE: LOADING === */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            key="loading-screen"
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808] pointer-events-auto"
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Scanline Overlay Background */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "100% 4px",
              }}
            />

            {/* Ambient background orbs */}
            {!prefersReducedMotion ? (
              <>
                <motion.div
                  className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)] blur-[120px] pointer-events-none z-0"
                  style={{
                    opacity: 0.08 + (progress / 100) * 0.07,
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -30, 20, 0],
                    rotate: 360,
                  }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500 blur-[120px] pointer-events-none z-0"
                  style={{
                    opacity: 0.08 + (progress / 100) * 0.07,
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    x: [0, -40, 30, 0],
                    y: [0, 40, -30, 0],
                    rotate: -360,
                  }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                />
                <motion.div
                  className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-teal-500 blur-[120px] pointer-events-none z-0"
                  style={{
                    opacity: 0.08 + (progress / 100) * 0.07,
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    x: [0, 25, -35, 0],
                    y: [0, -20, 40, 0],
                    rotate: 360,
                  }}
                  transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                />
              </>
            ) : (
              <>
                <div
                  className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)] blur-[120px] pointer-events-none z-0"
                  style={{ opacity: 0.12 }}
                />
                <div
                  className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500 blur-[120px] pointer-events-none z-0"
                  style={{ opacity: 0.12 }}
                />
                <div
                  className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-teal-500 blur-[120px] pointer-events-none z-0"
                  style={{ opacity: 0.12 }}
                />
              </>
            )}

            {/* Absolute centered TC — perfectly aligns with reveal mask */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "drop-shadow(0 0 0px rgba(37,99,235,0))" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: prefersReducedMotion
                    ? "drop-shadow(0 0 15px rgba(37,99,235,0.4))"
                    : [
                      "drop-shadow(0 0 15px rgba(37,99,235,0.4))",
                      "drop-shadow(0 0 60px rgba(99,102,241,0.85))",
                      "drop-shadow(0 0 15px rgba(37,99,235,0.4))",
                    ],
                  backgroundPosition: ["0% center", "200% center", "0% center"],
                }}
                transition={{
                  opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                  filter: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  backgroundPosition: { repeat: Infinity, duration: 3, ease: "linear" },
                }}
                className="font-syne font-black bg-gradient-to-r from-white via-[#818cf8] to-white bg-[length:200%_auto] bg-clip-text text-transparent relative"
                style={{ fontSize: "15vw", letterSpacing: "-0.04em", lineHeight: 1 }}
              >
                TC

                {/* Stroke Tracing SVG */}
                {!prefersReducedMotion && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible"
                    style={{ zIndex: 5 }}
                  >
                    <motion.text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      fontFamily="'Syne', 'Inter', sans-serif"
                      fontWeight="800"
                      fontSize="15vw"
                      letterSpacing="-0.04em"
                      initial={{ strokeDasharray: "1000", strokeDashoffset: "1000" }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{
                        duration: 1.0,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    />
                  </svg>
                )}

                {/* Particle burst */}
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      left: "50%",
                      top: "50%",
                      x: "-50%",
                      y: "-50%",
                      willChange: "transform, opacity",
                      zIndex: 10,
                    }}
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
                    animate={{
                      x: `calc(-50% + ${p.x}px)`,
                      y: `calc(-50% + ${p.y}px)`,
                      scale: 0.1,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      setParticles((prev) => prev.filter((item) => item.id !== p.id));
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Absolute bottom progress container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none select-none z-10"
            >
              {/* Digit Slide Machine - FIXED clipping wrapper bug */}
              <div className="flex items-end gap-0.5">
                <div className="flex select-none leading-none items-center justify-center">
                  {progress.toString().split("").map((digit, i, arr) => (
                    <Digit key={arr.length - i} val={digit} />
                  ))}
                </div>
                <span
                  className="font-syne font-bold text-[var(--accent)] mb-1 leading-none align-baseline font-extrabold"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)", marginLeft: "4px" }}
                >
                  %
                </span>
              </div>

              {/* Progress bar glow */}
              <div className="h-[2px] w-[240px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--accent2, #818cf8))" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.08, ease: "linear" }}
                />
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute top-0 left-0 h-full w-[60px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: [-60, 240] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
              </div>

              {/* Leading Edge Glow Dot */}
              <div className="absolute h-[2px] w-[240px] pointer-events-none mt-10">
                {progress > 0 && !prefersReducedMotion && (
                  <motion.div
                    className="absolute w-1.5 h-1.5 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 top-[-39px] z-20"
                    style={{
                      left: `${progress}%`,
                      boxShadow: "0 0 10px 3px var(--accent), 0 0 4px 1px #ffffff",
                    }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Loading text transition */}
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-1.5 overflow-hidden select-none min-h-[16px] mt-2">
                <AnimatePresence mode="wait">
                  {!isReady ? (
                    <motion.div
                      key="loading-label"
                      className="flex items-center gap-1.5"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {"LOADING".split("").map((char, i) => (
                        <motion.span
                          key={`loading-${i}`}
                          initial={{ y: 8, opacity: 0 }}
                          animate={prefersReducedMotion ? { y: 0, opacity: 0.8 } : { y: [0, -3, 0], opacity: [0.3, 1, 0.4] }}
                          transition={{
                            y: { repeat: Infinity, duration: 1.4, delay: i * 0.06, ease: "easeInOut" },
                            opacity: { repeat: Infinity, duration: 1.4, delay: i * 0.06, ease: "easeInOut" },
                          }}
                          className="text-[var(--accent2)] font-bold drop-shadow-[0_0_8px_var(--accent2)]"
                        >
                          {char}
                        </motion.span>
                      ))}

                      {/* Spinning diamond icon */}
                      <motion.div
                        className="w-2 h-2 bg-transparent border border-[var(--accent)]"
                        animate={prefersReducedMotion ? {} : { rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        style={{ transform: "rotate(45deg)", transformOrigin: "center" }}
                      />

                      {"PORTFOLIO".split("").map((char, i) => (
                        <motion.span
                          key={`portfolio-${i}`}
                          initial={{ y: 8, opacity: 0 }}
                          animate={prefersReducedMotion ? { y: 0, opacity: 0.6 } : { y: [0, -3, 0], opacity: [0.3, 1, 0.4] }}
                          transition={{
                            y: { repeat: Infinity, duration: 1.4, delay: (i + 8) * 0.06, ease: "easeInOut" },
                            opacity: { repeat: Infinity, duration: 1.4, delay: (i + 8) * 0.06, ease: "easeInOut" },
                          }}
                          className="text-white/60"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready-label"
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {"READY".split("").map((char, i) => (
                        <motion.span
                          key={`ready-${i}`}
                          initial={{ y: 8, opacity: 0 }}
                          animate={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: [0, -3, 0], opacity: [0.9, 1, 0.9] }}
                          transition={{
                            y: { repeat: Infinity, duration: 1.2, delay: i * 0.03, ease: "easeInOut" },
                            opacity: { repeat: Infinity, duration: 1.2, delay: i * 0.03, ease: "easeInOut" },
                          }}
                          className="text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
            className="absolute inset-0 z-50 pointer-events-auto"
            initial={{ opacity: 1 }}
            onAnimationComplete={handleRevealComplete}
          >
            {/* Shutter flash */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none z-[100000]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
              />
            )}

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
                    animate={prefersReducedMotion ? { scale: 30 } : { scale: 200 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.8 : 1.4,
                      ease: [0.76, 0, 0.24, 1],
                      delay: prefersReducedMotion ? 0.1 : 0.2,
                    }}
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
                animate={{
                  opacity: 0,
                  filter: prefersReducedMotion
                    ? "none"
                    : [
                      "drop-shadow(2px 0px 0px rgba(239, 68, 68, 0.45)) drop-shadow(-2px 0px 0px rgba(59, 130, 246, 0.45))",
                      "drop-shadow(0px 0px 0px rgba(239, 68, 68, 0)) drop-shadow(0px 0px 0px rgba(59, 130, 246, 0))",
                    ],
                }}
                transition={{
                  opacity: { duration: 0.3, delay: prefersReducedMotion ? 0.8 : 1.3 },
                  filter: { duration: prefersReducedMotion ? 0.8 : 1.4, ease: "easeOut" },
                }}
              />

              {/* White Text Flash */}
              {!prefersReducedMotion && (
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontFamily="'Syne', 'Inter', sans-serif"
                  fontWeight="800"
                  fontSize="15vw"
                  letterSpacing="-0.04em"
                  style={{ transformOrigin: "50% 50%" }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.2, times: [0, 0.1, 1], ease: "easeOut" }}
                />
              )}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
