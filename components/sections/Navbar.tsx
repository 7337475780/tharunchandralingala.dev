"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Monitor, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { Magnetic } from "@/components/Magnetic";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "LeetCode", href: "#leetcode" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGoTop, setShowGoTop] = useState(false);
  const { theme, cycleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowGoTop(scrollY > 400);

      // Find which section is currently in the viewport
      // We look for the section whose top is closest to (but not past) the current scroll position + offset
      const offset = 120; // navbar height + some padding
      let current = "home";

      for (const link of navLinks) {
        const id = link.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY - offset;
          if (scrollY >= top) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    // Run immediately on mount
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (el) {
      // Update URL explicitly starting from pathname to prevent hash stacking
      history.replaceState(null, "", window.location.pathname + "#" + id);
      // Smooth scroll to element
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-5xl h-[64px] rounded-full bg-[var(--surface)]/75 backdrop-blur-2xl border border-[var(--border2)] transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.2),_0_0_30px_rgba(37,99,235,0.15)] flex items-center justify-between px-6 py-2 group"
        style={{
          boxShadow: "inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(37,99,235,0.15)",
        }}
      >
        {/* Top Specular Rim Reflection */}
        <span className="absolute top-[1px] left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full pointer-events-none opacity-80" />
        {/* Bottom Ambient Glow */}
        <span className="absolute bottom-[1px] left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent rounded-full pointer-events-none" />

        <div className="w-full h-full flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollToSection("#home")}
            className="font-syne text-[22px] font-[800] text-gradient flex-shrink-0 cursor-pointer"
          >
            TC.
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-4 py-2 font-dm-sans text-[14px] transition-all duration-300 rounded-full z-10 cursor-pointer ${isActive
                    ? "text-[var(--accent)] font-bold tracking-wide drop-shadow-sm scale-105"
                    : "text-[var(--muted2)] hover:text-[var(--text)]"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="liquid-glass-pill"
                      className="absolute inset-0 rounded-full z-[-1] overflow-hidden bg-[var(--surface)]/70 backdrop-blur-xl border border-[var(--border2)]"
                      style={{
                        boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.15), 0 0 20px rgba(37,99,235,0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 30,
                        mass: 0.8,
                      }}
                    >
                      {/* Top Specular Water Rim Reflection */}
                      <span className="absolute top-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full" />
                      {/* Bottom Liquid Glow */}
                      <span className="absolute bottom-[1px] left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent rounded-full" />
                    </motion.div>
                  )}
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Magnetic>
              <button
                onClick={cycleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--surface2)] text-[var(--muted2)] hover:text-[var(--accent)] transition-colors border border-[var(--border)]"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Sun size={18} /> : theme === "dark" ? <Moon size={18} /> : <Monitor size={18} />}
              </button>
            </Magnetic>

            <button
              onClick={() => scrollToSection("#contact")}
              className="hidden md:inline-flex h-[36px] items-center justify-center rounded-[8px] bg-[var(--accent)] text-white px-5 font-dm-sans text-[14px] font-medium hover:bg-[var(--accent2)] transition-colors cursor-pointer"
            >
              Hire Me
            </button>

            <button
              className="md:hidden text-[var(--text)] p-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-[84px] left-4 right-4 z-[95] bg-[var(--surface)]/95 backdrop-blur-2xl border border-[var(--border2)] rounded-3xl overflow-hidden shadow-2xl p-4"
              style={{
                boxShadow: "inset 0 2px 3px rgba(255,255,255,0.4), 0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <button
                      key={link.name}
                      onClick={() => { scrollToSection(link.href); setMobileMenuOpen(false); }}
                      className={`relative px-4 py-3 font-dm-sans text-[16px] rounded-[12px] z-10 transition-all duration-300 w-full text-left cursor-pointer ${isActive ? "text-[var(--accent)] font-bold tracking-wide" : "text-[var(--text)]"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-liquid-pill"
                          className="absolute inset-0 rounded-[12px] z-[-1] overflow-hidden bg-[var(--surface)]/70 backdrop-blur-xl border border-[var(--border2)]"
                          style={{
                            boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.15)",
                          }}
                          transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
                        >
                          <span className="absolute top-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full" />
                          <span className="absolute bottom-[1px] left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent rounded-full" />
                        </motion.div>
                      )}
                      {link.name}
                    </button>
                  );
                })}
                <button
                  onClick={() => { scrollToSection("#contact"); setMobileMenuOpen(false); }}
                  className="mt-3 h-[44px] flex items-center justify-center rounded-[8px] bg-[var(--accent)] text-white font-dm-sans text-[16px] font-medium cursor-pointer w-full"
                >
                  Hire Me
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Go To Top Button (Liquid Glass Droplet) */}
      <AnimatePresence>
        {showGoTop && (
          <motion.button
            key="go-top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={scrollToTop}
            aria-label="Go to top"
            className="fixed bottom-[5.5rem] right-8 z-[90] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-hidden bg-black/[0.08] dark:bg-white/[0.05] border border-black/25 dark:border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.15)] dark:shadow-2xl hover:scale-110 transition-all duration-300 group backdrop-blur-md dark:backdrop-blur-none"
            style={{
              boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.7), inset 0 -4px 6px rgba(37, 99, 235, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.1)",
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Top Specular Rim Reflection */}
            <span className="absolute top-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/80 to-transparent rounded-full" />
            {/* Bottom Ambient Glow */}
            <span className="absolute bottom-[1px] left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-blue-600/40 dark:via-[var(--accent)]/40 to-transparent rounded-full" />
            <ChevronUp size={22} className="text-blue-600 dark:text-[var(--accent)] drop-shadow-sm dark:drop-shadow-md font-bold group-hover:-translate-y-0.5 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
