"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { TextReveal } from "@/components/TextReveal";
import { MagicCard } from "@/components/MagicCard";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("in-view");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[12px] px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-bold tracking-[0.15em] uppercase">
            CHAPTER 01 // WHO I AM
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--accent)]/30 to-transparent" />
        </div>
        <TextReveal 
          text="Passionate about building things that matter" 
          className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-12" 
        />

        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-20">
          {/* Left Text */}
          <div className="flex flex-col gap-6 font-dm-sans text-[16px] text-[var(--muted2)] leading-[1.8]">
            <p>
              I'm a Full Stack Developer from Andhra Pradesh, India, currently pursuing my B.Tech in Computer Science & Engineering at QIS College of Engineering and Technology (CGPA: 7.57). I specialize in building fast, scalable, production-ready web applications from real-time messaging platforms to AI-powered generators.
            </p>
            <p>
              Over the past year I've independently designed and shipped 5+ full-stack projects using React, Next.js 15, TypeScript, Node.js, PostgreSQL, Docker and various AI APIs. I care deeply about code quality, component architecture, performance, and the details that make a user experience feel great.
            </p>
            <p>
              Outside of building, I actively grind LeetCode (434+ problems solved, 73.59% acceptance rate) because I believe exceptional frontend engineers also think algorithmically.
            </p>
          </div>

          {/* Right Stats & Graph */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "5+", label: "Projects shipped" },
                { value: "434+", label: "LeetCode problems" },
                { value: "7.57", label: "CGPA / 10" },
                { value: "73.59%", label: "LeetCode acceptance" },
              ].map((stat, i) => (
                <MagicCard key={i}>
                  <div className="p-6 flex flex-col justify-center h-full">
                    <span className="font-syne text-[32px] font-[800] text-gradient mb-1 leading-none">{stat.value}</span>
                    <span className="font-mono text-[12px] text-[var(--muted)]">{stat.label}</span>
                  </div>
                </MagicCard>
              ))}
            </div>

            <MagicCard>
              <div className="p-4 flex items-center justify-center overflow-hidden w-full h-full">
                <img 
                  src="https://github-readme-stats.vercel.app/api?username=7337475780&show_icons=true&theme=transparent&hide_border=true&title_color=4f8ef7&icon_color=00d4ff&text_color=94a3b8" 
                  alt="GitHub Contribution Stats" 
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </MagicCard>
          </div>
        </div>
      </div>
    </section>
  );
}
