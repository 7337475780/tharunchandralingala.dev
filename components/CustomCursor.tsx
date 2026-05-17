"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer trailing liquid glass droplet */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] hidden md:flex items-center justify-center overflow-hidden border"
        style={{
          width: 44,
          height: 44,
          marginLeft: -22,
          marginTop: -22,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.6 : 1,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.06)",
          borderColor: isHovering ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)",
          boxShadow: isHovering 
            ? "inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3), 0 0 25px rgba(37,99,235,0.5)"
            : "inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.1)",
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 0.3,
        }}
      >
        {/* Specular top rim highlight */}
        <span className="absolute top-[2px] left-[8px] right-[8px] h-[2px] bg-gradient-to-r from-transparent via-white/90 to-transparent rounded-full" />
      </motion.div>

      {/* Inner precise glowing LED core */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100000] hidden md:block bg-gradient-to-r from-[#00d4ff] to-[#2563eb] shadow-[0_0_10px_#00d4ff]"
        style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 28,
          mass: 0.05,
        }}
      />
    </>
  );
}
