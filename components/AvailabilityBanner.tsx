"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AvailabilityBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("availability-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("availability-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-3 px-4 relative z-[90] flex items-center justify-center animate-fade-up">
      <div 
        className="w-full relative flex items-center justify-center py-2.5 px-12 rounded-full overflow-hidden bg-[var(--surface)]/70 backdrop-blur-xl border border-[var(--border2)] shadow-xl transition-all duration-300 group"
        style={{
          boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.15), 0 0 20px rgba(16,185,129,0.15)",
        }}
      >
        {/* Top Specular Rim Reflection */}
        <span className="absolute top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full" />
        {/* Bottom Emerald Glow */}
        <span className="absolute bottom-[1px] left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--green)]/30 to-transparent rounded-full" />

        <div className="flex items-center justify-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--green)]"></span>
          </div>
          <span className="font-mono text-[13px] font-medium text-[var(--text)] group-hover:text-[var(--green)] transition-colors">
            Currently open to full-time roles — Let's talk!
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-4 w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
