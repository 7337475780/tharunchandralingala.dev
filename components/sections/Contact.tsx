"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, Code2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TextReveal } from "@/components/TextReveal";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email.toString())) newErrors.email = "Valid email is required";
    if (!data.message || data.message.toString().length < 20) newErrors.message = "Message must be at least 20 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/mpqnabbv", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-[100px] px-[8%] bg-[var(--bg2)] animate-fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.15em] uppercase mb-4 block">
            // contact
          </span>
          <TextReveal 
            text="Let's build something great together" 
            className="font-syne text-[36px] md:text-[44px] font-[800] text-[var(--text)] mb-4" 
          />
          <p className="font-dm-sans text-[16px] text-[var(--muted2)] max-w-2xl">
            I'm actively looking for full-time roles. Whether you have a position, a project, or just want to say hello — my inbox is always open.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">

          {/* Left: Contact Info */}
          <div className="flex flex-col gap-4">
            <a href="mailto:tharunlingala6@gmail.com" className="group bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 md:p-5 flex items-center gap-5 hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                <Mail size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">Email</span>
                <span className="font-dm-sans text-[15px] font-medium text-[var(--text)]">tharunlingala6@gmail.com</span>
              </div>
            </a>

            <Link href="https://github.com/7337475780" target="_blank" className="group bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 md:p-5 flex items-center gap-5 hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                <FaGithub size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">GitHub</span>
                <span className="font-dm-sans text-[15px] font-medium text-[var(--text)]">github.com/7337475780</span>
              </div>
            </Link>

            <Link href="https://www.linkedin.com/in/tharun-chandra-lingala-bba016309/" target="_blank" className="group bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 md:p-5 flex items-center gap-5 hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                <FaLinkedin size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">LinkedIn</span>
                <span className="font-dm-sans text-[15px] font-medium text-[var(--text)] overflow-hidden text-ellipsis whitespace-nowrap">/in/tharun-chandra-lingala-bba016309</span>
              </div>
            </Link>

            <Link href="https://leetcode.com/u/Tharunchandralingala" target="_blank" className="group bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 md:p-5 flex items-center gap-5 hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 rounded-[10px] bg-[var(--bg2)] flex items-center justify-center text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                <Code2 size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">LeetCode</span>
                <span className="font-dm-sans text-[15px] font-medium text-[var(--text)]">leetcode.com/u/Tharunchandralingala</span>
              </div>
            </Link>
          </div>

          {/* Right: Form */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px]" />

            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-[var(--green)]/20 flex items-center justify-center text-[var(--green)] mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 className="font-syne text-[24px] font-[700] text-[var(--text)] mb-2">Message sent!</h3>
                <p className="font-dm-sans text-[16px] text-[var(--muted2)]">
                  I'll get back to you within 24 hours.
                </p>
                <button onClick={() => setStatus("idle")} className="mt-8 text-[var(--accent)] font-mono text-[12px] hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-mono text-[12px] text-[var(--muted)] uppercase tracking-wider ml-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full bg-[var(--surface)] border ${errors.name ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-[10px] px-4 py-3 text-[var(--text)] font-dm-sans text-[15px] focus:outline-none focus:border-[var(--accent)] transition-colors`}
                  />
                  {errors.name && <span className="font-mono text-[11px] text-[var(--red)] ml-1">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-mono text-[12px] text-[var(--muted)] uppercase tracking-wider ml-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full bg-[var(--surface)] border ${errors.email ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-[10px] px-4 py-3 text-[var(--text)] font-dm-sans text-[15px] focus:outline-none focus:border-[var(--accent)] transition-colors`}
                  />
                  {errors.email && <span className="font-mono text-[11px] text-[var(--red)] ml-1">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="font-mono text-[12px] text-[var(--muted)] uppercase tracking-wider ml-1">Subject (Optional)</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-4 py-3 text-[var(--text)] font-dm-sans text-[15px] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 mb-2">
                  <label htmlFor="message" className="font-mono text-[12px] text-[var(--muted)] uppercase tracking-wider ml-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className={`w-full bg-[var(--surface)] border ${errors.message ? 'border-[var(--red)]' : 'border-[var(--border)]'} rounded-[10px] px-4 py-3 text-[var(--text)] font-dm-sans text-[15px] focus:outline-none focus:border-[var(--accent)] transition-colors resize-y`}
                  />
                  {errors.message && <span className="font-mono text-[11px] text-[var(--red)] ml-1">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full h-[48px] rounded-[10px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white font-dm-sans font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending..." : "Send Message \u2192"}
                </button>
                {status === "error" && <span className="text-center font-mono text-[12px] text-[var(--red)] mt-2">Oops! There was a problem submitting your form.</span>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
