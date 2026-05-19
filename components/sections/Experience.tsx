"use client";

import React, { useEffect, useRef, useState } from "react";
import { TextReveal } from "@/components/TextReveal";

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("in-view");
          setLineHeight(100);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
          {/* Animated Line */}
          <div
            className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-[var(--accent)] to-[var(--green)] transition-all duration-1000 ease-out z-0"
            style={{ height: `${lineHeight}%` }}
          />
          {/* Background Line Track */}
          <div className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-[var(--border)] z-[-1]" />

          <div className="space-y-16">
            {/* Entry 1 */}
            <div className="relative pl-12 md:pl-16">
              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)] flex items-center justify-center z-10 shadow-[0_0_10px_var(--accent)]" />

              <h3 className="font-syne text-[22px] font-[700] text-[var(--text)] mb-1">
                AI & Machine Learning Virtual Intern
              </h3>
              <p className="font-dm-sans text-[16px] text-[var(--accent)] font-medium mb-2">
                EduSkills & AICTE &middot; Supported by Google for Developers
              </p>
              <p className="font-mono text-[12px] text-[var(--muted2)] mb-6">
                Apr 2025 &ndash; Jun 2025 &middot; Remote
              </p>

              <ul className="space-y-3 font-dm-sans text-[15px] text-[var(--muted)] leading-relaxed list-none">
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Completed a structured 10-week AI/ML program sponsored by Google for Developers, applying ML to real-world engineering problems.
                </li>
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Built and evaluated supervised and unsupervised models (classification, regression, clustering) with Python and scikit-learn on real datasets.
                </li>
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Resolved complex data pipeline challenges including class imbalance, missing values, and noisy records via augmentation and multi-source integration.
                </li>
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Gained hands-on exposure to Google's AI developer ecosystem and scalable AI application development practices.
                </li>
              </ul>
            </div>

            {/* Entry 2 */}
            <div className="relative pl-12 md:pl-16">
              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--green)] flex items-center justify-center z-10 shadow-[0_0_10px_var(--green)]" />

              <h3 className="font-syne text-[22px] font-[700] text-[var(--text)] mb-1">
                Team Lead &mdash; Cardio AI (Heart Disease Prediction)
              </h3>
              <p className="font-dm-sans text-[16px] text-[var(--green)] font-medium mb-2">
                QIS College of Engineering and Technology, Andhra Pradesh
              </p>
              <p className="font-mono text-[12px] text-[var(--muted2)] mb-6">
                Jan 2024 &ndash; Present
              </p>

              <ul className="space-y-3 font-dm-sans text-[15px] text-[var(--muted)] leading-relaxed list-none">
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Led a team of 3+ developers building production-grade ML models for heart disease risk prediction, owning task allocation, code reviews, and all technical decisions.
                </li>
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Resolved critical data pipeline challenges through advanced augmentation and multi-source integration, improving model accuracy and generalization.
                </li>
                <li className="relative before:content-['—'] before:absolute before:left-[-20px] before:text-[var(--muted2)]">
                  Integrated trained AI models with a PostgreSQL backend to manage patient records, bridging ML outputs with a scalable, query-optimized database layer.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
