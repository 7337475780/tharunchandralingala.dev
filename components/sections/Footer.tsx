"use client";

import React from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Magnetic } from "@/components/Magnetic";

export function Footer() {
  const openTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)] pt-[32px] pb-[16px] px-[8%] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="font-dm-sans text-[14px] text-[var(--text)]">
            Designed & built by Tharun Chandra Lingala &middot; 2025
          </div>
          
          {/* Center */}
          <button 
            onClick={openTerminal}
            className="font-mono text-[12px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            Press Ctrl+K to open terminal ↗
          </button>
          
          {/* Right */}
          <div className="flex items-center gap-6">
            <Magnetic>
              <Link href="https://github.com/7337475780" target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2" aria-label="GitHub">
                <FaGithub size={20} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="https://www.linkedin.com/in/tharun-chandra-lingala-bba016309/" target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="https://leetcode.com/u/Tharunchandralingala" target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2" aria-label="LeetCode">
                <Code2 size={20} />
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="text-center font-mono text-[11px] text-[var(--muted)]">
          Built with Next.js &middot; TypeScript &middot; Tailwind CSS &middot; Framer Motion
        </div>
      </div>
    </footer>
  );
}
