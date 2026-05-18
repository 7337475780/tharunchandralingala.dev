"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { Magnetic } from "@/components/Magnetic";

interface Message {
  sender: "ai" | "user";
  text: string;
  time: string;
}

const SUGGESTED_CHIPS = [
  "What is your tech stack?",
  "Can you work remotely?",
  "What are your salary expectations?",
  "Book an interview",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am Tharun AI, an autonomous recruiter assistant. Ask me anything about Tharun's Next.js 15 architectures, real-time messaging latency, or remote availability!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-collapse trigger text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom of messages and focus input
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isLoading, isOpen]);

  // Keyboard and custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-ai-chat", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-ai-chat", handleCustomOpen);
    };
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputMessage).trim();
    if (!prompt || isLoading) return;

    const userMsg: Message = {
      sender: "user",
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          sender: "ai",
          text: data.reply || "I encountered an error retrieving data.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: "Communication endpoint unreachable. Please email directly at tharunlingala6@gmail.com.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Network timeout. Please email directly at tharunlingala6@gmail.com.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Expanding Trigger Pill (Liquid Glass Droplet - Positioned below Go To Top at bottom-8 right-8) */}
      <div className="fixed bottom-8 right-8 z-[95] flex items-center">
        <Magnetic strength={0.15}>
          <motion.button
            layout
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex items-center justify-center h-12 rounded-full bg-black/[0.08] dark:bg-white/[0.05] border border-black/25 dark:border-white/20 text-black dark:text-white font-dm-sans font-bold text-[14px] tracking-wide shadow-[0_10px_25px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),_0_0_25px_rgba(0,212,255,0.2)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.6),_0_0_35px_rgba(0,212,255,0.4)] transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md dark:backdrop-blur-none"
            style={{
              borderRadius: 9999,
              boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.7), inset 0 -4px 6px rgba(0, 212, 255, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.1)",
            }}
            animate={{
              width: isHovered || showText ? "auto" : 48,
              paddingLeft: isHovered || showText ? 20 : 0,
              paddingRight: isHovered || showText ? 20 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            aria-label="Ask Tharun AI"
          >
            {/* Top Specular Rim Reflection */}
            <span className="absolute top-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/80 to-transparent rounded-full pointer-events-none" />
            {/* Bottom Ambient Cyan Glow */}
            <span className="absolute bottom-[1px] left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-blue-600/40 dark:via-[#00d4ff]/60 to-transparent rounded-full pointer-events-none" />

            <motion.div layout className="flex items-center justify-center w-12 h-12 flex-shrink-0 text-blue-600 dark:text-[#00d4ff]">
              <Bot size={22} className="animate-pulse drop-shadow-[0_0_6px_rgba(37,99,235,0.4)] dark:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            </motion.div>

            <AnimatePresence>
              {(isHovered || showText) && (
                <motion.div
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 whitespace-nowrap pr-1 font-extrabold text-black dark:text-white"
                >
                  <span>Ask AI</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-600/15 dark:bg-[#00d4ff]/10 border border-blue-600/30 dark:border-[#00d4ff]/30 text-blue-600 dark:text-[#00d4ff]">
                    ⌘I
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </Magnetic>
      </div>

      {/* Centered Spotlight Command Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Dark Dimming Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-[560px] h-[520px] max-h-[85vh] rounded-[32px] bg-[#16161f]/95 backdrop-blur-3xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.9),_inset_0_2px_3px_rgba(255,255,255,0.2)] flex flex-col z-[210] overflow-hidden"
            >
              {/* Specular Top Rim */}
              <span className="absolute top-[1px] left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full opacity-80 pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#1e1e2e]/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff]">
                    <Bot size={22} />
                  </div>
                  <div>
                    <div className="font-syne text-[18px] font-[700] text-white flex items-center gap-2">
                      Tharun AI <Sparkles size={14} className="text-[#00d4ff]" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#10b981]">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" /> Recruiter Knowledge Base Active
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Chat Modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message Area */}
              <div
                className="flex-1 overflow-y-auto p-5 flex flex-col gap-4"
                onClick={() => inputRef.current?.focus()}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                  >
                    <div
                      className={`p-4 rounded-2xl font-dm-sans text-[14px] leading-relaxed shadow-md ${msg.sender === "user"
                        ? "bg-gradient-to-r from-[#2563eb] to-[#00d4ff] text-white rounded-br-none font-medium"
                        : "bg-[#1e1e2e]/90 text-white border border-white/10 rounded-bl-none font-normal"
                        }`}
                    >
                      {msg.text}
                    </div>
                    <span className="font-mono text-[10px] text-[#64748b] mt-1 px-1">{msg.time}</span>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-[#00d4ff] font-mono text-[12px] p-2">
                    <Loader2 size={16} className="animate-spin" /> Fetching knowledge packet...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Chips Area */}
              <div className="px-5 py-3 border-t border-white/10 bg-[#0a0a0f]/40 flex flex-wrap gap-2 overflow-x-auto">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[11px] text-[#94a3b8] hover:text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    <span>{chip}</span> &rarr;
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-4 border-t border-white/10 bg-[#1e1e2e]/60 flex items-center gap-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask AI anything (e.g. salary, tech stack)..."
                  disabled={isLoading}
                  className="flex-1 h-11 bg-[#0a0a0f]/80 border border-white/10 rounded-xl px-4 text-white font-dm-sans text-[14px] placeholder:text-[#64748b] focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all duration-300"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d4ff] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-md flex-shrink-0"
                  aria-label="Send Message"
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
