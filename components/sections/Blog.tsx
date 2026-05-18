"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";

type DevToArticle = {
  id: number;
  title: string;
  url: string;
  tag_list: string[];
  reading_time_minutes: number;
  published_at: string;
};

export function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const [articles, setArticles] = useState<DevToArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    const fetchArticles = async () => {
      try {
        const res = await fetch("https://dev.to/api/articles?username=tharunchandra&per_page=3");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.length > 0) {
          setArticles(data);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section id="blog" ref={sectionRef} className="py-[80px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.15em] uppercase mb-4 block">
            // dev notes
          </span>
          <TextReveal
            text="Writing & thoughts"
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4"
          />
          <p className="font-dm-sans text-[16px] text-[var(--muted2)]">
            I write about things I build, bugs I solve, and lessons I learn.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 h-[240px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent opacity-20 -translate-x-full animate-shimmer" style={{ backgroundSize: '1000px 100%' }} />
                <div className="w-16 h-4 bg-[var(--border)] rounded mb-6" />
                <div className="w-full h-6 bg-[var(--border)] rounded mb-3" />
                <div className="w-3/4 h-6 bg-[var(--border)] rounded mb-8" />
                <div className="w-24 h-4 bg-[var(--border)] rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : error || articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 h-[240px] flex flex-col items-center justify-center text-center">
                <p className="font-dm-sans text-[15px] text-[var(--muted)] mb-4">
                  Articles coming soon
                </p>
                <Link href="https://dev.to/tharunchandra" target="_blank" className="font-mono text-[12px] text-[var(--accent)] hover:underline">
                  follow me on Dev.to @tharunchandra
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={article.url}
                target="_blank"
                className="group bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 hover:-translate-y-1 hover:border-[var(--border2)] hover:shadow-lg transition-all duration-200 flex flex-col h-full"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tag_list.slice(0, 3).map(tag => (
                    <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted2)]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-syne text-[20px] font-[700] text-[var(--text)] mb-4 group-hover:text-[var(--accent)] transition-colors">
                  {article.title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[var(--muted)]">
                    {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &middot; {article.reading_time_minutes} min read
                  </div>
                  <div className="font-dm-sans text-[14px] font-medium text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Read article <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
