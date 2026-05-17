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
      <header className="sticky top-0 z-[80] h-[64px] bg-[var(--surface)]/80 backdrop-blur-[20px] border-b border-[var(--border)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

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
                  className={`relative px-4 py-2 font-dm-sans text-[14px] transition-colors rounded-full z-10 cursor-pointer ${isActive
                      ? "text-white font-medium"
                      : "text-[var(--muted2)] hover:text-[var(--text)]"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="liquid-glass-pill"
                      className="absolute inset-0 rounded-full z-[-1]"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08), 0 0 14px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.7,
                      }}
                    >
                      <span className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full" />
                      <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
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
              className="md:hidden text-[var(--text)] p-1"
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden absolute top-[64px] left-0 w-full bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <button
                      key={link.name}
                      onClick={() => { scrollToSection(link.href); setMobileMenuOpen(false); }}
                      className={`relative px-4 py-3 font-dm-sans text-[16px] rounded-[12px] z-10 transition-colors w-full text-left cursor-pointer ${isActive ? "text-white font-medium" : "text-[var(--text)]"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-liquid-pill"
                          className="absolute inset-0 rounded-[12px] z-[-1]"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.22)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                          }}
                          transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
                        >
                          <span className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full" />
                          <span className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-white/10 to-transparent" />
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

      {/* Go To Top Button */}
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
            className="fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.25), 0 0 20px rgba(255,255,255,0.06)",
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
          >
            <span className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full" />
            <ChevronUp size={20} className="text-white drop-shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
