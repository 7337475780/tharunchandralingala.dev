"use client";

import React, { useEffect, useRef } from "react";
import { TextReveal } from "@/components/TextReveal";
import { MagicCard } from "@/components/MagicCard";
import { FaGithub } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const paragraphVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 10, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 60,
      damping: 14,
    },
  }),
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [gitStats, setGitStats] = React.useState({
    contributions: "150+",
    loading: true,
  });

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const cached = localStorage.getItem("github_stats");
        const cacheTime = localStorage.getItem("github_stats_time");
        const oneHour = 60 * 60 * 1000;

        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < oneHour) {
          const data = JSON.parse(cached);
          setGitStats({ contributions: data.contributions || "150+", loading: false });
          return;
        }

        const res = await fetch("/api/github");
        const json = await res.json();

        if (json.success && json.data) {
          setGitStats({ contributions: json.data.contributions || "150+", loading: false });
          localStorage.setItem("github_stats", JSON.stringify(json.data));
          localStorage.setItem("github_stats_time", Date.now().toString());
        }
      } catch (err) {
        console.error("Error fetching GitHub stats in About:", err);
      }
    };
    fetchStats();
  }, []);

  const paragraphs = [
    "I'm a Full Stack Developer from Andhra Pradesh, India, currently pursuing my B.Tech in Computer Science & Engineering at QIS College of Engineering and Technology (CGPA: 7.57). I specialize in building fast, scalable, production-ready web applications from real-time messaging platforms to AI-powered generators.",
    "Over the past year I've independently designed and shipped 5+ full-stack projects using React, Next.js 15, TypeScript, Node.js, PostgreSQL, Docker and various AI APIs. I care deeply about code quality, component architecture, performance, and the details that make a user experience feel great.",
    "Outside of building, I actively grind LeetCode (434+ problems solved, 73.59% acceptance rate) because I believe exceptional frontend engineers also think algorithmically."
  ];

  return (
    <section id="about" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--accent)]/5 blur-[100px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-[5%] left-[-5%] w-[350px] h-[350px] rounded-full bg-[var(--accent3)]/5 blur-[100px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[12px] px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-bold tracking-[0.15em] uppercase">
            WHO I AM
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
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                custom={i}
                variants={paragraphVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                style={{ perspective: 1200 }}
              >
                {text}
              </motion.p>
            ))}
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
              <div className="p-6 md:p-8 flex flex-col justify-between h-full min-h-[200px] w-full text-left relative overflow-hidden group/git">
                {/* Subtle mesh/aurora background overlay inside the card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text)] group-hover/git:border-[var(--accent)]/30 group-hover/git:text-[var(--accent)] transition-all duration-300">
                      <FaGithub size={20} />
                    </div>
                    <div>
                      <h4 className="font-syne text-[16px] font-[800] text-[var(--text)] tracking-tight">Open Source & Codebases</h4>
                      <p className="font-mono text-[10px] text-[var(--muted)]">@7337475780 on GitHub</p>
                    </div>
                  </div>
                  
                  <p className="font-dm-sans text-[13px] text-[var(--muted2)] leading-relaxed mt-1">
                    Explore my repositories to see how I structure Next.js apps, design database schemas, write custom utilities, and manage deployments.
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[var(--muted)]">
                    {gitStats.loading ? "..." : `${gitStats.contributions} contributions this year`}
                  </span>
                  <Link
                    href="https://github.com/7337475780"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 dark:bg-white/5 border border-[var(--border2)] text-[var(--accent)] hover:text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 font-mono text-[11px] font-bold cursor-pointer group-hover/git:shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]"
                  >
                    Explore Repos <ArrowUpRight size={13} className="transition-transform group-hover/git:translate-x-0.5 group-hover/git:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      </div>
    </section>
  );
}
