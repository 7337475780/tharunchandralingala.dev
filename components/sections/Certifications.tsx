"use client";

import React, { useEffect, useRef } from "react";
import { TextReveal } from "@/components/TextReveal";

const certs = [
  { title: "Next.js App Router Fundamentals", issuer: "Vercel", date: "May 2025", color: "bg-[var(--text)] text-[var(--bg)]" },
  { title: "JavaScript Algorithms & Data Structures", issuer: "freeCodeCamp", date: "Aug 2024", color: "bg-[var(--green)] text-white" },
  { title: "Python (Basic)", issuer: "HackerRank", date: "Aug 2024", color: "bg-[var(--accent2)] text-white" }, // cyan
  { title: "Responsive Web Design", issuer: "freeCodeCamp", date: "May 2024", color: "bg-[var(--green)] text-white" },
];

export function Certifications() {
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
    <section id="certifications" ref={sectionRef} className="py-[80px] px-[8%] bg-[var(--bg)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.15em] uppercase mb-4 block">
            // certifications
          </span>
          <TextReveal
            text="Credentials"
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((cert, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 hover:-translate-y-1 hover:border-[var(--border2)] transition-all duration-200">
              <span className={`inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider mb-4 ${cert.color}`}>
                {cert.issuer}
              </span>
              <h3 className="font-syne text-[16px] font-[600] text-[var(--text)] mb-3 leading-tight">
                {cert.title}
              </h3>
              <p className="font-mono text-[12px] text-[var(--muted)]">
                {cert.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
