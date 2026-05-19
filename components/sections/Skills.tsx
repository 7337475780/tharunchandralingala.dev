"use client";

import React, { useEffect, useRef } from "react";
import { Code2, Server, Database, Wrench, Sparkles } from "lucide-react";
import { MagicCard } from "@/components/MagicCard";
import { TextReveal } from "@/components/TextReveal";

const skillGroups = [
  {
    id: "frontend",
    title: "Frontend",
    icon: <Code2 size={16} className="text-white" />,
    color: "bg-[var(--accent)]",
    skills: ["React.js", "Next.js 15", "TypeScript", "JavaScript ES6+", "Tailwind CSS", "HTML5 & CSS3", "Redux", "Zustand", "CodeMirror 6"]
  },
  {
    id: "backend",
    title: "Backend",
    icon: <Server size={16} className="text-white" />,
    color: "bg-[var(--green)]",
    skills: ["Node.js", "Express.js", "REST APIs", "Socket.IO", "Prisma"]
  },
  {
    id: "database",
    title: "Database & Auth",
    icon: <Database size={16} className="text-white" />,
    color: "bg-[var(--accent3)]", // purple
    skills: ["PostgreSQL", "Supabase", "Firebase", "Convex", "Clerk", "NextAuth"]
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    icon: <Wrench size={16} className="text-white" />,
    color: "bg-[var(--yellow)]",
    skills: ["Git", "GitHub", "Docker", "Railway", "Vercel", "Linux", "CI/CD"]
  },
  {
    id: "ai",
    title: "AI Integration",
    icon: <Sparkles size={16} className="text-white" />,
    color: "bg-[var(--accent2)]", // cyan
    skills: ["Gemini API", "OpenAI API", "Prompt Engineering"]
  }
];

export function Skills() {
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
    <section id="skills" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[12px] px-3 py-1 rounded-full bg-[var(--green)]/10 border border-[var(--green)]/30 text-[var(--green)] font-bold tracking-[0.15em] uppercase">
              CHAPTER 02 // PROBLEMS I SOLVE
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--green)]/30 to-transparent" />
          </div>
          <TextReveal
            text="What I build with"
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4"
          />
          <p className="font-dm-sans text-[16px] text-[var(--muted2)]">
            Technologies I use to build production-ready applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {skillGroups.map((group) => (
            <MagicCard key={group.id}>
              <div className="p-6 flex flex-col h-full relative overflow-hidden">
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm rounded-full" />

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-[12px] flex items-center justify-center ${group.color}`}>
                    {group.icon}
                  </div>
                  <h3 className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--text)] font-bold">
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[var(--bg2)] border border-[var(--border)] font-mono text-[12px] text-[var(--muted2)] rounded-[100px] px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
