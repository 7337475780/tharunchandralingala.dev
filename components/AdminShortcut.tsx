"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Terminal } from "lucide-react";

export function AdminShortcut() {
  const router = useRouter();
  const [showOverrideToast, setShowOverrideToast] = useState(false);

  useEffect(() => {
    let keyBuffer: string[] = [];
    const secretCode = "admin";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if inside an input or textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName || "")) {
        return;
      }

      // Shortcut 1: Ctrl + Shift + A (Windows/Linux) or Cmd + Shift + A (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        triggerOverride();
        return;
      }

      // Shortcut 2: Typing "admin" sequentially
      keyBuffer.push(e.key.toLowerCase());
      if (keyBuffer.length > secretCode.length) {
        keyBuffer.shift();
      }

      if (keyBuffer.join("") === secretCode) {
        keyBuffer = [];
        triggerOverride();
      }
    };

    const triggerOverride = () => {
      setShowOverrideToast(true);
      setTimeout(() => {
        router.push("/admin");
        setShowOverrideToast(false);
      }, 1200);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <AnimatePresence>
      {showOverrideToast && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
          {/* Backdrop flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#00d4ff]/10 backdrop-blur-sm"
          />

          {/* Toast Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative bg-[#161622]/90 backdrop-blur-2xl border border-[#00d4ff]/50 rounded-3xl px-8 py-6 shadow-[0_0_80px_rgba(0,212,255,0.4)] flex items-center gap-4 text-white font-mono z-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/20 border border-[#00d4ff]/40 flex items-center justify-center text-[#00d4ff] animate-pulse">
              <ShieldCheck size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-syne font-bold text-[#00d4ff] flex items-center gap-2">
                <span>SECURITY OVERRIDE</span>
                <Terminal size={16} className="animate-bounce" />
              </span>
              <span className="text-[13px] text-white/80">Redirecting to CMS Secure Portal...</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
