"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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

export function ContactForm() {
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

    // Field Validation
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
      console.error("Submission network error:", err);
      setStatus("error");
      setServerErrorMessage("Network timeout. Please try again or email directly.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 bg-[#161622]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-[350px] flex flex-col items-center justify-center text-center p-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              <CheckCircle2 size={36} />
            </motion.div>
            <h3 className="font-syne text-[24px] font-bold text-white mb-2">Message sent successfully!</h3>
            <p className="font-dm-sans text-[15px] text-white/80 max-w-sm mb-8 leading-relaxed">
              Thank you for reaching out. I've sent a confirmation to your email and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-[13px] font-bold transition-all cursor-pointer"
            >
              &larr; Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            animate={status === "error" ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5 relative z-10"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-mono text-[12px] text-white/60 uppercase tracking-wider ml-1">Your Name <span className="text-[#00d4ff]">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={status === "submitting"}
                className={`w-full bg-black/40 border ${errors.name ? 'border-red-500/80 ring-2 ring-red-500/20' : 'border-white/10 focus:border-[#00d4ff]'} rounded-xl px-4 py-3 text-white font-dm-sans text-[15px] focus:outline-none transition-all placeholder:text-white/20`}
              />
              {errors.name && <span className="font-mono text-[11px] text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-mono text-[12px] text-white/60 uppercase tracking-wider ml-1">Your Email <span className="text-[#00d4ff]">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={status === "submitting"}
                className={`w-full bg-black/40 border ${errors.email ? 'border-red-500/80 ring-2 ring-red-500/20' : 'border-white/10 focus:border-[#00d4ff]'} rounded-xl px-4 py-3 text-white font-dm-sans text-[15px] focus:outline-none transition-all placeholder:text-white/20`}
              />
              {errors.email && <span className="font-mono text-[11px] text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="font-mono text-[12px] text-white/60 uppercase tracking-wider ml-1">Subject (Optional)</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Full-time Frontend Engineer Role"
                disabled={status === "submitting"}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-dm-sans text-[15px] focus:outline-none focus:border-[#00d4ff] transition-all placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label htmlFor="message" className="font-mono text-[12px] text-white/60 uppercase tracking-wider ml-1">Message <span className="text-[#00d4ff]">*</span></label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Hi Tharun, we're impressed by your portfolio..."
                disabled={status === "submitting"}
                className={`w-full bg-black/40 border ${errors.message ? 'border-red-500/80 ring-2 ring-red-500/20' : 'border-white/10 focus:border-[#00d4ff]'} rounded-xl px-4 py-3 text-white font-dm-sans text-[15px] focus:outline-none transition-all resize-y placeholder:text-white/20`}
              />
              {errors.message && <span className="font-mono text-[11px] text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.message}</span>}
            </div>

            {serverErrorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-[13px] flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{serverErrorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#2563eb] hover:opacity-90 text-white font-mono text-[14px] font-bold shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <span>Send Secure Message</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
