"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, Play, FolderGit2 } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/Magnetic";
import { MagicCard } from "@/components/MagicCard";
import { TextReveal } from "@/components/TextReveal";
import { ProjectCard } from "@/components/ProjectCard";

const filters = ["All", "Real-Time", "AI", "Full Stack", "ML"];

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  tags: string[];
  badge?: { text: string; color: string };
  gridClass?: string;
  github: string;
  live: string;
}

const fallbackProjects: ProjectItem[] = [
  {
    id: "weconnect",
    title: "WeConnect",
    subtitle: "Real-Time Distributed Messaging Platform",
    description: "A production-style real-time messaging platform with instant chat, typing indicators, read receipts, and live online/offline presence. Built with distributed state management and low-latency Socket.IO communication.",
    stack: ["Next.js", "TypeScript", "Convex", "Socket.IO", "Clerk", "Zustand", "Node.js"],
    tags: ["real-time", "featured"],
    badge: { text: "Featured", color: "bg-[#2563eb] text-white" },
    gridClass: "md:col-span-2 md:row-span-2 border-t-2 border-t-[#00d4ff]",
    github: "https://github.com/7337475780",
    live: "https://github.com/7337475780"
  },
  {
    id: "aimagix",
    title: "aiMagix",
    subtitle: "AI-Powered Image Generation Platform",
    description: "A modern AI image generation platform with intelligent prompt enhancement, HD image downloads, secure auth flows, and persistent generation history. Built with Next.js 15 and Gemini API.",
    stack: ["Next.js 15", "Gemini API", "Supabase", "Prisma", "NextAuth", "Node.js"],
    tags: ["ai", "featured"],
    badge: { text: "AI", color: "bg-[#10b981] text-white" },
    gridClass: "md:col-span-2 md:row-span-2",
    github: "https://github.com/7337475780",
    live: "https://github.com/7337475780"
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
    live: "https://github.com/7337475780"
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
    live: "https://github.com/7337475780"
  },
  {
    id: "cardioai",
    title: "Cardio AI",
    subtitle: "Heart Disease Prediction — Team Lead",
    description: "Led a 3-person team building production-grade ML models for heart disease risk prediction. Integrated trained models with a PostgreSQL backend for patient record management.",
    stack: ["Python", "scikit-learn", "PostgreSQL", "ML", "pandas"],
    tags: ["ai", "ml"],
    badge: { text: "Team Lead", color: "bg-[#f59e0b] text-white" },
    gridClass: "md:col-span-1",
    github: "https://github.com/7337475780",
    live: "https://github.com/7337475780"
  }
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projectsData, setProjectsData] = useState<ProjectItem[]>(fallbackProjects);
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

  // Fetch live CMS data from filesystem DB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjectsData(data.projects);
          }
        }
      } catch (err) {
        console.error("Failed to load CMS projects, using local fallback.", err);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projectsData.filter((p) =>
    activeFilter === "All" || p.tags.includes(activeFilter.toLowerCase())
  );

  return (
    <section id="projects" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[12px] px-3 py-1 rounded-full bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 text-[var(--yellow)] font-bold tracking-[0.15em] uppercase">
              PROJECTS AS SYSTEMS
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--yellow)]/30 to-transparent" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <TextReveal
                text="Things I've built"
                className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4"
              />
              <p className="font-dm-sans text-[16px] text-[var(--muted2)] flex items-center gap-2">
                <span>Production-style applications built independently. Live synchronized with CMS DB.</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full font-dm-sans text-[14px] transition-all duration-200 cursor-pointer ${activeFilter === filter
                    ? "bg-[var(--accent)] text-white border border-[var(--accent)] shadow-md"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              stack={project.stack}
              tag={project.badge?.text}
              githubUrl={project.github}
              liveUrl={project.live}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
