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
    <div className="w-full relative z-[90] flex items-center justify-center py-2 px-12" style={{ backgroundColor: "color-mix(in srgb, var(--green) 8%, transparent)" }}>
      <div className="flex items-center justify-center gap-3">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--green)]"></span>
        </div>
        <span className="font-mono text-[13px] text-text-main">
          Currently open to full-time roles — Let's talk!
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 text-[var(--muted2)] hover:text-text-main transition-colors p-1"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
