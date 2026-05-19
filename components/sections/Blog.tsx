"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
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

  // Fetch live CMS data first, fallback to Dev.to
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const cmsRes = await fetch("/api/blogs");
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          if (cmsData.success && Array.isArray(cmsData.blogs) && cmsData.blogs.length > 0) {
            setArticles(cmsData.blogs);
            setLoading(false);
            return;
          }
        }

        // Fallback to Dev.to
        const res = await fetch("https://dev.to/api/articles?username=tharunchandra&per_page=3");
        if (!res.ok) throw new Error("Failed to fetch from Dev.to");
        const data = await res.json();
        if (data.length > 0) {
          setArticles(data);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error fetching articles:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section id="blog" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[12px] px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-bold tracking-[0.15em] uppercase">
              DEV NOTES
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--accent)]/30 to-transparent" />
          </div>
          <TextReveal
            text="Writing & thoughts"
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4"
          />
          <p className="font-dm-sans text-[16px] text-[var(--muted2)] flex items-center gap-2">
            <span>I write about things I build, bugs I solve, and architectures.</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 h-[240px] relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--text)]/5 to-transparent -translate-x-full animate-shimmer" style={{ backgroundSize: '1000px 100%' }} />
                <div className="w-16 h-4 bg-[var(--border2)] rounded mb-6" />
                <div className="w-full h-6 bg-[var(--border2)] rounded mb-3" />
                <div className="w-3/4 h-6 bg-[var(--border2)] rounded mb-8" />
                <div className="w-24 h-4 bg-[var(--border2)] rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : error && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 h-[240px] flex flex-col items-center justify-center text-center shadow-lg">
                <BookOpen size={32} className="text-[var(--accent)] mb-4" />
                <p className="font-dm-sans text-[15px] text-[var(--muted)] mb-4">
                  Articles database syncing...
                </p>
                <Link href="https://dev.to/tharunchandra" target="_blank" className="font-mono text-[12px] text-[var(--accent)] hover:underline">
                  Follow me on Dev.to @tharunchandra &rarr;
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
                className="group bg-[var(--surface)] backdrop-blur-xl border border-[var(--border)] rounded-3xl p-6 hover:-translate-y-2 hover:border-[var(--accent)]/40 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                {/* Corner glow accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)]/5 rounded-bl-full blur-xl group-hover:bg-[var(--accent)]/10 transition-colors pointer-events-none" />

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tag_list?.slice(0, 3).map((tag) => (
                    <span key={tag} className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 tracking-wider text-[var(--accent)]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-syne text-[20px] font-bold text-[var(--text)] mb-4 group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {article.title}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="font-mono text-[11px] text-[var(--muted)]">
                    {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &middot; {article.reading_time_minutes} min read
                  </div>
                  <div className="font-dm-sans text-[13px] font-bold text-[var(--accent)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read article</span> <ArrowRight size={14} />
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
