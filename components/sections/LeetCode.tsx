"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";
import { Magnetic } from "@/components/Magnetic";

const CircleChart = ({ label, value, max, color, inView }: { label: string, value: number, max: number, color: string, inView: boolean }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (value / max) * circumference;

  // Animation state for the stroke dashoffset
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (inView) {
      // Trigger animation after a slight delay
      const timer = setTimeout(() => {
        setOffset(targetOffset);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setOffset(circumference);
    }
  }, [inView, targetOffset, circumference]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        {/* Background track */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48" cy="48" r={radius}
            className="fill-none stroke-[var(--border2)] stroke-[6px]"
          />
          {/* Animated progress */}
          <circle
            cx="48" cy="48" r={radius}
            className="fill-none stroke-[6px] transition-all duration-[1500ms] ease-out"
            style={{
              stroke: `var(--${color})`,
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-syne text-[20px] font-[700] text-[var(--text)]">{value}</span>
        </div>
      </div>
      <span className={`font-mono text-[12px] uppercase tracking-wider text-[var(--${color})] font-bold`}>{label}</span>
    </div>
  );
};

export function LeetCode() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [totalProblems, setTotalProblems] = useState(0);
  const [acceptance, setAcceptance] = useState(0);

  const [totalTarget, setTotalTarget] = useState(434);
  const [accTarget, setAccTarget] = useState(73.59);
  const [easySolved, setEasySolved] = useState(168);
  const [mediumSolved, setMediumSolved] = useState(195);
  const [hardSolved, setHardSolved] = useState(71);
  const [totals, setTotals] = useState({ easy: 820, medium: 1620, hard: 680 });

  useEffect(() => {
    fetch("https://leetcode-api-faisalshohag.vercel.app/Tharunchandralingala")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setTotalTarget(data.totalSolved || 434);
          setAccTarget(data.acceptanceRate || 73.59);
          setEasySolved(data.easySolved || 168);
          setMediumSolved(data.mediumSolved || 195);
          setHardSolved(data.hardSolved || 71);
          setTotals({
            easy: data.totalEasy || 820,
            medium: data.totalMedium || 1620,
            hard: data.totalHard || 680
          });
        }
      })
      .catch((err) => console.error("Error fetching LeetCode stats in section:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("in-view");
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Number counting animation
  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 1500;
      const incrementTime = 20;
      const steps = duration / incrementTime;

      const totalInc = totalTarget / steps;
      const accInc = accTarget / steps;

      const timer = setInterval(() => {
        start += 1;
        if (start >= steps) {
          setTotalProblems(totalTarget);
          setAcceptance(accTarget);
          clearInterval(timer);
        } else {
          setTotalProblems(Math.floor(start * totalInc));
          setAcceptance(Number((start * accInc).toFixed(2)));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, totalTarget, accTarget]);

  return (
    <section id="leetcode" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-12 text-center">
          <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.15em] uppercase mb-4 block">
            // competitive programming
          </span>
          <TextReveal
            text="LeetCode grind"
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4"
          />
          <p className="font-dm-sans text-[16px] text-[var(--muted2)] max-w-xl mx-auto">
            Consistent problem-solving because great UI engineers also think algorithmically.
          </p>
        </div>

        <div className="w-full max-w-4xl bg-[var(--surface)] rounded-[24px] border border-[var(--border2)] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--yellow)]/10 rounded-full blur-[80px]" />

          <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-12 relative z-10">
            {/* SVG Charts */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              <CircleChart label="Easy" value={easySolved} max={totals.easy} color="green" inView={inView} />
              <CircleChart label="Medium" value={mediumSolved} max={totals.medium} color="yellow" inView={inView} />
              <CircleChart label="Hard" value={hardSolved} max={totals.hard} color="red" inView={inView} />
            </div>

            {/* Total Stats */}
            <div className="flex flex-col justify-center gap-8 md:border-l border-[var(--border2)] md:pl-12">
              <div>
                <span className="block font-mono text-[12px] text-[var(--muted)] mb-1 uppercase tracking-wider">Total Problems</span>
                <span className="font-syne text-[48px] font-[800] text-gradient leading-none">{totalProblems}+</span>
              </div>
              <div>
                <span className="block font-mono text-[12px] text-[var(--muted)] mb-1 uppercase tracking-wider">Acceptance Rate</span>
                <span className="font-syne text-[48px] font-[800] text-gradient leading-none">{acceptance.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center relative z-10">
            <Magnetic>
              <Link
                href="https://leetcode.com/u/Tharunchandralingala"
                target="_blank"
                className="flex items-center gap-2 h-[44px] px-6 rounded-[8px] border border-[var(--border2)] text-[var(--text)] font-dm-sans font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                View LeetCode Profile <ExternalLink size={16} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
