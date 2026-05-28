"use client";

import React from "react";
import Link from "next/link";
import { Code2, Terminal, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Magnetic } from "@/components/Magnetic";

export function Footer() {
  const openTerminal = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-terminal-modal"));
  };

  const scrollToSection = (href: string) => {
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)] pt-16 pb-12 px-[8%] relative z-10 overflow-hidden">
      {/* Top subtle glowing divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[100px] bg-[var(--accent)]/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center justify-between pb-10 border-b border-[var(--border)]">

          {/* Left: Brand & Status */}
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <button
              onClick={() => scrollToSection("#home")}
              className="font-syne text-[28px] font-[800] text-gradient tracking-tight cursor-pointer"
            >
              TC.
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] font-dm-sans text-[13px] text-[var(--muted2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]"></span>
              </span>
              <span>Available for full-time roles & freelance</span>
            </div>
          </div>

          {/* Center: Interactive Terminal Pill */}
          <div className="flex justify-center">
            <button
              onClick={openTerminal}
              className="group flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Terminal size={15} />
              </div>
              <span className="font-mono text-[13px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors font-medium">
                Open Developer Terminal
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg3)] text-[var(--muted)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-colors">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right: Magnetic Social Circles */}
          <div className="flex items-center justify-center md:justify-end gap-4">
            <Magnetic>
              <Link
                href="https://github.com/7337475780"
                target="_blank"
                className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] hover:-translate-y-1 transition-all duration-300 shadow-sm"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="https://www.linkedin.com/in/tharun-chandra-lingala-bba016309/"
                target="_blank"
                className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] hover:-translate-y-1 transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="https://leetcode.com/u/Tharunchandralingala"
                target="_blank"
                className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] hover:-translate-y-1 transition-all duration-300 shadow-sm"
                aria-label="LeetCode"
              >
                <Code2 size={20} />
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tech Ticker */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[12px] text-[var(--muted)]">
          <div>
            &copy; {new Date().getFullYear()} Tharun Chandra Lingala. All rights reserved.
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>Built with Next.js 15</span>
            <span>&middot;</span>
            <span>TypeScript</span>
            <span>&middot;</span>
            <span>Tailwind CSS</span>
            <span>&middot;</span>
            <span>Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
