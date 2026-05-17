"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./ui/Button";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      let current = "home";
      const scrollPosition = window.scrollY + 300;

      for (const link of navLinks) {
        const sectionId = link.href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            current = sectionId;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-heading text-white tracking-wider group">
          &lt;Tharun <span className="text-primary group-hover:text-accent transition-colors">/&gt;</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-colors z-10 rounded-full",
                  isActive ? "text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                {/* Liquid Glass Pill - shared moving element */}
                {isActive && (
                  <motion.div
                    layoutId="liquid-glass-pill"
                    className="absolute inset-0 rounded-full z-[-1]"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), 0 0 12px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    }}
                  >
                    {/* Gradient sheen at top */}
                    <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
                    {/* Soft inner glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="md:hidden glass absolute top-full left-0 right-0 border-t border-white/10 p-4 flex flex-col gap-1 shadow-xl"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-5 py-3 text-base font-medium transition-colors z-10 rounded-[14px]",
                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-liquid-glass-pill"
                      className="absolute inset-0 rounded-[14px] z-[-1]"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), 0 0 12px rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.25)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8,
                      }}
                    >
                      <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
                      <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/10 to-transparent" />
                    </motion.div>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
