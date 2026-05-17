"use client";

import React, { useRef, useState } from "react";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagicCard({ children, className = "" }: MagicCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative overflow-hidden rounded-[20px] p-[1px] group hover:-translate-y-1 transition-transform duration-300 h-full"
    >
      {/* The animated spinning border */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--accent)_0%,var(--accent2)_50%,var(--accent)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      
      {/* The static border (when not hovering) */}
      <div className="absolute inset-0 rounded-[20px] border border-[var(--border)] group-hover:border-transparent transition-colors duration-500 z-10" />

      {/* The actual content card mask */}
      <div className={`relative h-full w-full bg-[var(--surface)] rounded-[19px] z-20 flex flex-col ${className}`}>
        
        {/* Glow around cursor inside the card */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500 z-0 rounded-[19px]"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79, 142, 247, 0.15), rgba(0, 212, 255, 0.05) 40%, transparent 80%)`,
          }}
        />

        {/* Content wrapper with z-index to stay above the glow */}
        <div className="relative z-10 flex flex-col h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
