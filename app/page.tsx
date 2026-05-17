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
import { StoryNavigation } from "@/components/StoryNavigation";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <TerminalModal />
      <StoryNavigation />
      
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
    </>
  );
}
