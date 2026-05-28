"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// ============================================================================
// 1. THE "ANTIGRAVITY FLOAT" CARD (Framer Motion)
// ============================================================================
interface AntigravityCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AntigravityCard({ children, className = "" }: AntigravityCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.015,
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.12), 0 0 40px rgba(0, 212, 255, 0.08)",
      }}
      initial={{
        y: 0,
        scale: 1,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04), 0 0 0px rgba(0, 0, 0, 0)",
      }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 22,
        mass: 0.9,
      }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#090912]/80 p-8 backdrop-blur-xl transition-colors duration-300 hover:border-[#00d4ff]/30 ${className}`}
    >
      {/* Gloss reflection overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent z-0" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ============================================================================
// 2. THE "MAGNETIC GRAVITATIONAL" BUTTON (GSAP)
// ============================================================================
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({ children, onClick, className = "" }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    // Create a GSAP context to scoped cleanup and memory safety
    const ctx = gsap.context(() => {});

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      
      // Calculate coordinates relative to center of the button
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Define magnetic threshold / boundary check
      const distance = Math.hypot(distanceX, distanceY);
      const threshold = rect.width * 0.85; // Attraction radius

      if (distance < threshold) {
        // Subtly pull container toward cursor (Max 14px)
        gsap.to(button, {
          x: distanceX * 0.18,
          y: distanceY * 0.18,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });

        // Pull internal text slightly deeper for luxury parallax depth (Max 6px)
        gsap.to(text, {
          x: distanceX * 0.08,
          y: distanceY * 0.08,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        // Smoothly snap back if outside threshold
        handleMouseLeave();
      }
    };

    const handleMouseLeave = () => {
      // Elastic spring snapback on container release
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });

      // Elastic snapback for internal text
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };

    // Attach listeners
    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Clean up event listeners and kill active GSAP animations
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      ctx.revert(); // revert context and kill tweens
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00d4ff] to-[#818cf8] text-[#07070d] font-bold text-sm select-none border-0 shadow-[0_4px_20px_rgba(0,212,255,0.15)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.3)] transition-shadow duration-300 cursor-pointer overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* Ambient glowing specular background */}
      <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span ref={textRef} className="relative block pointer-events-none">
        {children}
      </span>
    </button>
  );
}

// ============================================================================
// 3. THE "STAGGERED FLUID" TEXT LINK (GSAP)
// ============================================================================
interface StaggeredLinkProps {
  label: string;
  href?: string;
  className?: string;
}

export function StaggeredLink({ label, href = "#", className = "" }: StaggeredLinkProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const chars = charsRef.current.filter(Boolean);
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {});

    const handleMouseEnter = () => {
      // Fluid staggered character translate and opacity shift
      gsap.to(chars, {
        y: -4,
        opacity: 0.85,
        scaleY: 1.05,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.015,
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      // Smooth snap back to natural base states
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        scaleY: 1,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.01,
        overwrite: "auto",
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      ctx.revert(); // revert context and kill tweens on cleanup
    };
  }, [label]);

  // Split word into safe single characters
  const characters = label.split("");

  return (
    <a
      ref={containerRef}
      href={href}
      className={`inline-flex items-center text-[15px] font-mono tracking-wider font-semibold text-[#00d4ff] hover:text-[#818cf8] transition-colors duration-300 no-underline cursor-pointer select-none ${className}`}
    >
      <span className="flex overflow-hidden py-1">
        {characters.map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) charsRef.current[index] = el;
            }}
            className="inline-block relative origin-bottom will-change-transform"
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}
