"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { TextReveal } from "@/components/TextReveal";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

const fallbackExperiences: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "AI & Machine Learning Virtual Intern",
    company: "EduSkills & AICTE · Supported by Google for Developers",
    duration: "Apr 2025 – Jun 2025 · Remote",
    bullets: [
      "Completed a structured 10-week AI/ML program sponsored by Google for Developers, applying ML to real-world engineering problems.",
      "Built and evaluated supervised and unsupervised models (classification, regression, clustering) with Python and scikit-learn on real datasets.",
      "Resolved complex data pipeline challenges including class imbalance, missing values, and noisy records via augmentation and multi-source integration.",
      "Gained hands-on exposure to Google's AI developer ecosystem and scalable AI application development practices."
    ]
  },
  {
    id: "exp-2",
    role: "Team Lead — Cardio AI (Heart Disease Prediction)",
    company: "QIS College of Engineering and Technology, Andhra Pradesh",
    duration: "Jan 2024 – Present",
    bullets: [
      "Led a team of 3+ developers building production-grade ML models for heart disease risk prediction, owning task allocation, code reviews, and all technical decisions.",
      "Resolved critical data pipeline challenges through advanced augmentation and multi-source integration, improving model accuracy and generalization.",
      "Integrated trained AI models with a PostgreSQL backend to manage patient records, bridging ML outputs with a scalable, query-optimized database layer."
    ]
  }
];

const colorPalette = ["var(--accent)", "var(--accent3)"];

function ExperienceRow({ exp, index }: { exp: ExperienceItem; index: number }) {
  const colorVar = colorPalette[index % colorPalette.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12 md:pl-16"
    >
      {/* Timeline Dot with pulsing animation when active */}
      <motion.div
        initial={{ scale: 0.75, boxShadow: "none" }}
        whileInView={{ scale: 1, boxShadow: `0 0 16px ${colorVar}` }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-[var(--surface)] border-2 flex items-center justify-center z-10"
        style={{
          borderColor: colorVar
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: colorVar
          }}
        />
      </motion.div>

      <h3 className="font-syne text-[22px] font-[700] text-[var(--text)] mb-1">
        {exp.role}
      </h3>
      <p
        className="font-dm-sans text-[16px] font-medium mb-2 transition-colors duration-500"
        style={{ color: colorVar }}
      >
        {exp.company}
      </p>
      <p className="font-mono text-[12px] text-[var(--muted2)] mb-6">
        {exp.duration}
      </p>

      <ul className="space-y-3 font-dm-sans text-[15px] text-[var(--muted)] leading-relaxed list-none">
        {exp.bullets.map((bullet, idx) => (
          <li
            key={idx}
            className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(fallbackExperiences);

  // Section entrance animation observer (for the page's fade-up rhythm)
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

  // Fetch dynamic experience data from server API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experience");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.experiences) && data.experiences.length > 0) {
            setExperiences(data.experiences);
          }
        }
      } catch (err) {
        console.error("Failed to load CMS experiences, using local fallback.", err);
      }
    };
    fetchExperiences();
  }, []);

  // Set up framer-motion scroll listener on the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 90%"]
  });

  // Apply spring physics for butter-smooth animation
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <section id="experience" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg)] animate-fade-up">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.15em] uppercase mb-4 block">
            // experience
          </span>
          <TextReveal
            text="Where I've worked"
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4"
          />
        </div>

        <div className="relative">
          {/* Scroll-Linked Timeline Line */}
          <motion.div
            className="absolute left-[15px] top-2 bottom-0 w-[2px] z-0"
            style={{
              scaleY,
              originY: 0,
              backgroundImage: "linear-gradient(to bottom, var(--accent), var(--accent3))"
            }}
          />
          {/* Background Line Track */}
          <div className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-[var(--border)] z-[-1]" />

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <ExperienceRow key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



