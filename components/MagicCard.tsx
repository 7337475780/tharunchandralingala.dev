"use client";

import React, { useRef, useState } from "react";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagicCard({ children, className = "" }: MagicCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    // Calculate distance from center for 3D tilt (-1 to 1)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    setRotation({
      x: normalizedY * -6, // Max tilt 6 degrees
      y: normalizedX * 6,
    });
  };

  return (
    <div className="perspective-[1000px] h-full">
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(1)}
        onMouseLeave={() => { setOpacity(0); setRotation({ x: 0, y: 0 }); }}
        className="relative overflow-hidden rounded-[20px] p-[1px] group transition-all duration-300 ease-out h-full"
        style={{
          transform: opacity ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(-4px)` : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transformStyle: 'preserve-3d',
          boxShadow: opacity ? '0 20px 40px rgba(37,99,235,0.2)' : 'none'
        }}
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
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79, 142, 247, 0.22), rgba(0, 212, 255, 0.08) 40%, transparent 80%)`,
            }}
          />

          {/* Content wrapper with z-index to stay above the glow */}
          <div className="relative z-10 flex flex-col h-full w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
