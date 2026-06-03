"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Code2, Send, CheckCircle2, AlertCircle, Loader2, Calendar } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TextReveal } from "@/components/TextReveal";
import { MagicCard } from "@/components/MagicCard";
import { motion, AnimatePresence } from "framer-motion";

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 16,
    },
  },
};

export function Contact() {
  const [formData, setFormData] = useState<ContactRequest>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerErrorMessage("");

    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ContactResponse = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setServerErrorMessage(data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Network error during submission:", err);
      setStatus("error");
      setServerErrorMessage("Network error. Please try again or email directly.");
    }
  };

  return (
    <section id="contact" className="py-[120px] px-[8%] bg-[var(--bg2)] relative overflow-hidden">
      {/* Background radial gradient glow for layered depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--accent)/4,transparent_50%)] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Section Heading & Subtext */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[12px] px-3.5 py-1 rounded-full bg-[var(--red)]/10 border border-[var(--red)]/30 text-[var(--red)] font-bold tracking-[0.15em] uppercase">
              Connect
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--red)]/30 to-transparent" />
          </div>
          <TextReveal
            text="Let's build something great together"
            className="font-syne text-[38px] md:text-[50px] font-[800] text-[var(--text)] tracking-[-0.02em] mb-4"
          />
          <p className="font-dm-sans text-[17px] text-[var(--muted2)] max-w-2xl leading-relaxed">
            I'm actively looking for full-time roles. Whether you have a position, a project, or just want to say hello — my inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Left: Interactive Contact Cards with Magic Mouse-Follow Glow */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full">
            <MagicCard className="w-full">
              <a href="mailto:tharunlingala6@gmail.com" className="group p-6 flex items-center gap-6 w-full h-full">
                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text)] group-hover:text-[#00d4ff] group-hover:border-[#00d4ff]/40 transition-all duration-300">
                  <Mail size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">Direct Email</span>
                  <span className="font-dm-sans text-[16px] font-bold text-[var(--text)] group-hover:underline">tharunlingala6@gmail.com</span>
                </div>
              </a>
            </MagicCard>

            <MagicCard className="w-full">
              <a href="https://cal.com/tharunchandralingala" target="_blank" rel="noopener noreferrer" className="group p-6 flex items-center gap-6 w-full h-full">
                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text)] group-hover:text-[#f59e0b] group-hover:border-[#f59e0b]/40 transition-all duration-300">
                  <Calendar size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">Live Meeting</span>
                  <span className="font-dm-sans text-[16px] font-bold text-[var(--text)] group-hover:underline">Schedule a Call via Cal.com</span>
                </div>
              </a>
            </MagicCard>

            <MagicCard className="w-full">
              <Link href="https://github.com/7337475780" target="_blank" className="group p-6 flex items-center gap-6 w-full h-full">
                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text)] group-hover:text-[#10b981] group-hover:border-[#10b981]/40 transition-all duration-300">
                  <FaGithub size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">GitHub Repositories</span>
                  <span className="font-dm-sans text-[16px] font-bold text-[var(--text)] group-hover:underline">github.com/7337475780</span>
                </div>
              </Link>
            </MagicCard>

            <MagicCard className="w-full">
              <Link href="https://www.linkedin.com/in/tharun-chandra-lingala-bba016309/" target="_blank" className="group p-6 flex items-center gap-6 w-full h-full">
                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text)] group-hover:text-blue-500 group-hover:border-blue-500/40 transition-all duration-300">
                  <FaLinkedin size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">LinkedIn Network</span>
                  <span className="font-dm-sans text-[16px] font-bold text-[var(--text)] group-hover:underline truncate">/in/tharun-chandra-lingala</span>
                </div>
              </Link>
            </MagicCard>

            <MagicCard className="w-full">
              <Link href="https://leetcode.com/u/Tharunchandralingala" target="_blank" className="group p-6 flex items-center gap-6 w-full h-full">
                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text)] group-hover:text-[#f59e0b] group-hover:border-[#f59e0b]/40 transition-all duration-300">
                  <Code2 size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">LeetCode Profile</span>
                  <span className="font-dm-sans text-[16px] font-bold text-[var(--text)] group-hover:underline">434+ Problems Solved</span>
                </div>
              </Link>
            </MagicCard>
          </motion.div>

          {/* Right: Refactored Premium Contact Form Card */}
          <motion.div
            variants={itemVariants}
            className="w-full bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border2)] rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-[#00d4ff]/20 to-[#2563eb]/10 rounded-full blur-[90px] pointer-events-none" />

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="min-h-[440px] flex flex-col items-center justify-center text-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h3 className="font-syne text-[28px] font-bold text-[var(--text)] mb-3 tracking-tight">Message Sent Successfully!</h3>
                  <p className="font-dm-sans text-[16px] text-[var(--muted2)] max-w-sm mb-8 leading-relaxed">
                    Thank you for reaching out. A confirmation has been sent to your inbox, and I will get back to you personally within 24 hours.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-[var(--border2)] text-[var(--text)] font-mono text-[13px] font-bold transition-all cursor-pointer"
                  >
                    &larr; Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  animate={status === "error" ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col gap-6 relative z-10"
                >
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider ml-1">
                      Your Name <span className="text-[#00d4ff]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      disabled={status === "submitting"}
                      className={`form-input w-full border ${errors.name
                          ? "border-red-500/80 ring-2 ring-red-500/10 focus:border-red-500"
                          : "focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20"
                        } rounded-xl px-4 py-3.5 font-dm-sans text-[15px] focus:outline-none transition-all`}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="font-mono text-[11px] text-red-500 dark:text-red-400 ml-1 mt-1 flex items-center gap-1.5"
                        >
                          <AlertCircle size={12} /> {errors.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider ml-1">
                      Your Email <span className="text-[#00d4ff]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      disabled={status === "submitting"}
                      className={`form-input w-full border ${errors.email
                          ? "border-red-500/80 ring-2 ring-red-500/10 focus:border-red-500"
                          : "focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20"
                        } rounded-xl px-4 py-3.5 font-dm-sans text-[15px] focus:outline-none transition-all`}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="font-mono text-[11px] text-red-500 dark:text-red-400 ml-1 mt-1 flex items-center gap-1.5"
                        >
                          <AlertCircle size={12} /> {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Subject field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider ml-1">
                      Subject (Optional)
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Full-time Full-Stack Engineer Role / Inquiry"
                      disabled={status === "submitting"}
                      className="form-input w-full border rounded-xl px-4 py-3.5 font-dm-sans text-[15px] focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="message" className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider ml-1">
                      Message <span className="text-[#00d4ff]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Tharun, we're impressed by your portfolio and would love to schedule an interview..."
                      disabled={status === "submitting"}
                      data-lenis-prevent
                      className={`form-textarea w-full border ${errors.message
                          ? "border-red-500/80 ring-2 ring-red-500/10 focus:border-red-500"
                          : "focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20"
                        } rounded-xl px-4 py-3.5 font-dm-sans text-[15px] focus:outline-none transition-all resize-none overflow-y-auto`}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="font-mono text-[11px] text-red-500 dark:text-red-400 ml-1 mt-1 flex items-center gap-1.5"
                        >
                          <AlertCircle size={12} /> {errors.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Server error feedback */}
                  {serverErrorMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-[13px] flex items-center gap-2"
                    >
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{serverErrorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={status === "submitting"}
                    className="w-full h-13 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#2563eb] hover:opacity-95 text-white font-mono text-[14px] font-bold shadow-[0_4px_20px_rgba(0,212,255,0.35)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer border-0"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white" />
                        <span>Dispatching Email...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Secure Message</span>
                        <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
