"use client";

import React from "react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiTypescript } from "react-icons/si";

export function OrbitalAvatar() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      {/* Central 3D Card / Avatar */}
      <div className="absolute z-10 w-32 h-32 md:w-40 md:h-40 glass-card rounded-2xl flex items-center justify-center border-t border-l border-white/20 shadow-[0_0_40px_rgba(79,142,247,0.3)] animate-[float_6s_ease-in-out_infinite]">
        <div className="text-4xl md:text-5xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
          TL
        </div>
      </div>

      {/* Orbit Rings */}
      <div className="absolute w-full h-full border border-white/5 rounded-full" />
      <div className="absolute w-[120%] h-[120%] border border-white/5 rounded-full opacity-50" />
      
      {/* Orbiting Icons Container */}
      <div className="absolute w-full h-full animate-[orbit_12s_linear_infinite] pause-on-hover">
        {/* React Icon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-[#61DAFB] shadow-[0_0_15px_rgba(97,218,251,0.5)]">
          <FaReact size={24} className="animate-[spin_4s_linear_infinite]" />
        </div>
        
        {/* Next.js Icon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <SiNextdotjs size={24} />
        </div>

        {/* TypeScript Icon */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-[#3178C6] shadow-[0_0_15px_rgba(49,120,198,0.5)]">
          <SiTypescript size={24} />
        </div>

        {/* Node.js Icon */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-[#339933] shadow-[0_0_15px_rgba(51,153,51,0.5)]">
          <FaNodeJs size={24} />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
