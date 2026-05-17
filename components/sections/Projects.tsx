"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/Magnetic";
import { MagicCard } from "@/components/MagicCard";
import { TextReveal } from "@/components/TextReveal";

const filters = ["All", "Real-Time", "AI", "Full Stack", "ML"];

const projects = [
  {
    id: "weconnect",
    title: "WeConnect",
    subtitle: "Real-Time Distributed Messaging Platform",
    description: "A production-style real-time messaging platform with instant chat, typing indicators, read receipts, and live online/offline presence. Built with distributed state management and low-latency Socket.IO communication.",
    stack: ["Next.js", "TypeScript", "Convex", "Socket.IO", "Clerk", "Zustand", "Node.js"],
    tags: ["real-time", "featured"],
    badge: { text: "Featured", color: "bg-[var(--accent)] text-white" },
    gridClass: "md:col-span-2 md:row-span-2 border-t-2 border-t-[var(--accent)]",
    github: "https://github.com/7337475780",
    live: "#"
  },
  {
    id: "aimagix",
    title: "aiMagix",
    subtitle: "AI-Powered Image Generation Platform",
    description: "A modern AI image generation platform with intelligent prompt enhancement, HD image downloads, secure auth flows, and persistent generation history. Built with Next.js 15 and Gemini API.",
    stack: ["Next.js 15", "Gemini API", "Supabase", "Prisma", "NextAuth", "Node.js"],
    tags: ["ai", "featured"],
    badge: { text: "AI", color: "bg-[var(--accent3)] text-white" },
    gridClass: "md:col-span-2 md:row-span-2",
    github: "https://github.com/7337475780",
    live: "#"
  },
  {
    id: "webgenie",
    title: "webGenie",
    subtitle: "AI-Powered Website Generator",
    description: "Converts natural language prompts into complete website layouts and content using Gemini and OpenAI APIs. Modular React frontend with full mobile responsiveness.",
    stack: ["Next.js", "React", "TypeScript", "Gemini", "OpenAI"],
    tags: ["ai"],
    gridClass: "md:col-span-1",
    github: "https://github.com/7337475780",
    live: "#"
  },
  {
    id: "instaload",
    title: "InstaLoad & TubeFetcher",
    subtitle: "Containerized Media Download Platforms",
    description: "Full-stack media downloading apps for Instagram Reels and YouTube videos. Containerized with Docker, deployed on Railway, with auth and persistent download history.",
    stack: ["Next.js", "Node.js", "Docker", "Railway", "Supabase", "Clerk"],
    tags: ["full stack"],
    gridClass: "md:col-span-2",
    github: "https://github.com/7337475780",
    live: "#"
  },
  {
    id: "cardioai",
    title: "Cardio AI",
    subtitle: "Heart Disease Prediction — Team Lead",
    description: "Led a 3-person team building production-grade ML models for heart disease risk prediction. Integrated trained models with a PostgreSQL backend for patient record management.",
    stack: ["Python", "scikit-learn", "PostgreSQL", "ML", "pandas"],
    tags: ["ai", "ml"],
    badge: { text: "Team Lead", color: "bg-[var(--green)] text-white" },
    gridClass: "md:col-span-1",
    github: "https://github.com/7337475780",
    live: "#"
  }
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
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

  const filteredProjects = projects.filter(p => 
    activeFilter === "All" || p.tags.includes(activeFilter.toLowerCase())
  );

  return (
    <section id="projects" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[12px] px-3 py-1 rounded-full bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 text-[var(--yellow)] font-bold tracking-[0.15em] uppercase">
              CHAPTER 03 // PROJECTS AS SYSTEMS
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--yellow)]/30 to-transparent" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <TextReveal 
                text="Things I've built" 
                className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4" 
              />
              <p className="font-dm-sans text-[16px] text-[var(--muted2)]">
                Production-style applications built independently from design to deployment.
              </p>
            </div>
            
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full font-dm-sans text-[14px] transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-[var(--accent)] text-white border border-[var(--accent)]"
                      : "bg-transparent text-[var(--muted)] border border-[var(--border2)] hover:border-[var(--muted)]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <MagicCard 
              key={project.id}
            >
              <div className={`flex flex-col p-6 h-full ${project.gridClass}`}>
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm rounded-full" />
                {project.badge && (
                  <span className={`inline-block self-start px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-6 ${project.badge.color}`}>
                    {project.badge.text}
                  </span>
                )}
              
              <h3 className="font-syne text-[24px] font-[700] text-[var(--text)] mb-1">
                {project.title}
              </h3>
              <p className="font-mono text-[12px] text-[var(--muted2)] mb-4">
                {project.subtitle}
              </p>
              
              <p className="font-dm-sans text-[15px] text-[var(--muted)] mb-8 flex-1 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-auto flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="font-mono text-[11px] text-[var(--muted2)] bg-[var(--bg3)] border border-[var(--border)] rounded px-2 py-1">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                  <Magnetic>
                    <Link href={project.github} target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2 -ml-2" aria-label="GitHub">
                      <FaGithub size={20} />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link href={project.live} target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2" aria-label="Live Demo">
                      <ExternalLink size={20} />
                    </Link>
                  </Magnetic>
                  {project.id === "weconnect" && (
                    <Link href={project.live} className="ml-auto flex items-center gap-2 font-dm-sans text-[14px] font-medium text-[var(--accent)] hover:text-[var(--accent2)] transition-colors">
                      Watch Demo <Play size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
