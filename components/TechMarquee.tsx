"use client";

import React from "react";
import { motion } from "framer-motion";

const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
  "PostgreSQL", "Prisma", "Docker", "Socket.IO", "Zustand",
  "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
  "PostgreSQL", "Prisma", "Docker", "Socket.IO", "Zustand"
];

export function TechMarquee() {
  return (
    <div className="w-full bg-[var(--surface)] border-y border-[var(--border)] overflow-hidden py-4 flex items-center relative z-20">
      {/* Left/Right Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--surface)] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--surface)] to-transparent z-10" />

      <motion.div
        className="flex gap-8 md:gap-16 items-center whitespace-nowrap"
        animate={{
          x: [0, -1000] // Arbitrary negative value, adjusted by css flex wrapping and repitition
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear"
        }}
      >
        {/* We map multiple times to ensure seamless infinite loop depending on screen width */}
        {[...technologies, ...technologies].map((tech, i) => (
          <span
            key={i}
            className="font-syne text-[18px] md:text-[24px] font-[800] text-[var(--muted)]/40 hover:text-[var(--accent)] transition-colors duration-300 cursor-default"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
