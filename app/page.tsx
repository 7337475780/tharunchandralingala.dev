"use client";

import React, { useState, useEffect } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { AvailabilityBanner } from "@/components/AvailabilityBanner";
import { TerminalModal } from "@/components/TerminalModal";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { LeetCode } from "@/components/sections/LeetCode";
import { Certifications } from "@/components/sections/Certifications";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load overlay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[1000] bg-[var(--bg)] flex items-center justify-center transition-opacity duration-500">
          <div className="font-syne text-[40px] font-[800] text-gradient animate-pulse">
            TC.
          </div>
        </div>
      )}
      
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <ProgressBar />
        <TerminalModal />
        
        <AvailabilityBanner />
        <Navbar />
        
        <main>
          <Hero />
          <TechMarquee />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <LeetCode />
          <Certifications />
          <Blog />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
