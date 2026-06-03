"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, Copy, Check, CornerDownLeft } from "lucide-react";
import { Magnetic } from "@/components/Magnetic";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
}

interface ChatHistoryItem {
  role: "user" | "model";
  text: string;
}

const INITIAL_CHIPS = [
  "What's your strongest skill?",
  "Are you available for hire?",
  "Tell me about WeConnect",
  "What's your notice period?",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Hello! I am Tharun's portfolio assistant. Ask me anything about his full-stack expertise, WeConnect real-time messaging, or availability for roles!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [history, setHistory] = useState<ChatHistoryItem[]>([
    {
      role: "model",
      text: "Hello! I am Tharun's portfolio assistant. Ask me anything about his full-stack expertise, WeConnect real-time messaging, or availability for roles!",
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss tooltip after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Global Keyboard Shortcut: Ctrl + / or Ctrl + Space to toggle AI Chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "/" || e.code === "Space")) {
        // Do not trigger Ctrl+Space if actively typing in an input or textarea
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "") && e.code === "Space") {
          return;
        }
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) setShowTooltip(false);
          return !prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isLoading, isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputMessage).trim();
    if (!prompt || isLoading) return;

    setHasSentMessage(true);
    const msgId = `msg-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: msgId,
      sender: "user",
      text: prompt,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setHistory((prev) => [...prev, { role: "user", text: prompt }]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: history,
        }),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.reply)) {
        const aiMsgId = `ai-${Date.now()}`;
        const fullReply = data.reply || "Hmm, received empty response.";

        // Typewriter Effect Simulation
        const aiMsgPlaceholder: ChatMessage = {
          id: aiMsgId,
          sender: "ai",
          text: "",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsgPlaceholder]);
        setIsLoading(false);

        let currentCharIndex = 0;
        const words = fullReply.split(" ");
        let currentText = "";

        const interval = setInterval(() => {
          if (currentCharIndex < words.length) {
            currentText += (currentCharIndex > 0 ? " " : "") + words[currentCharIndex];
            setMessages((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, text: currentText } : m))
            );
            currentCharIndex++;
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          } else {
            clearInterval(interval);
            setHistory((prev) => [...prev, { role: "model", text: fullReply }]);
          }
        }, 40);

      } else {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "ai",
            text: "Hmm, something went wrong. Try again.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "Hmm, something went wrong. Try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button Trigger (Positioned bottom-6 right-6, above scroll-to-top) */}
      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--accent2)] to-[var(--accent3)] text-white font-dm-sans text-[13px] font-bold shadow-xl border border-white/20 whitespace-nowrap flex items-center gap-2 drop-shadow-lg pointer-events-none"
            >
              <span>Ask me anything about Tharun ✨</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono ml-1 opacity-90 border border-white/30">Ctrl + /</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Magnetic strength={0.2}>
          <motion.button
            onClick={() => {
              setIsOpen((prev) => !prev);
              setShowTooltip(false);
            }}
            className="w-12 h-12 rounded-full relative overflow-hidden bg-[var(--surface)]/10 backdrop-blur-2xl border border-[var(--border2)] text-[var(--accent)] flex items-center justify-center shadow-[0_10px_30px_rgba(var(--accent-rgb),0.35)] hover:shadow-[0_10px_45px_rgba(var(--accent-rgb),0.7)] hover:scale-110 transition-all duration-300 cursor-pointer group"
            style={{
              boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -4px 8px rgba(var(--accent-rgb), 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle AI Chat Drawer"
          >
            {/* Top Specular Water Rim Reflection */}
            <span className="absolute top-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full pointer-events-none" />
            {/* Bottom Liquid Cyan Glow */}
            <span className="absolute bottom-[1px] left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent rounded-full pointer-events-none" />

            <Bot size={22} className="animate-pulse group-hover:rotate-12 group-hover:scale-110 transition-all text-[var(--accent)] drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)] z-10" />
          </motion.button>
        </Magnetic>
      </div>

      {/* Floating Slide-up Chat Drawer (Not a modal) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-[105] w-full md:w-[440px] h-[88vh] md:h-[600px] max-h-[800px] bg-[var(--surface)]/95 backdrop-blur-3xl border border-[var(--border)] rounded-t-3xl md:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.4),_0_0_30px_rgba(var(--accent-rgb),0.2)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface2)]/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent3)]/20 border border-[var(--accent)]/40 flex items-center justify-center text-[var(--accent)]">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-syne text-[16px] font-bold text-[var(--text)] flex items-center gap-1.5">
                    <span>Ask Tharun's AI</span>
                    <Sparkles size={14} className="text-[var(--accent)]" />
                  </h3>
                  <p className="font-mono text-[11px] text-[#10b981] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                    <span>Powered by Gemini &middot; Ask me anything</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--border)] hover:bg-[var(--border2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                aria-label="Close Chat Drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" data-lenis-prevent>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl font-dm-sans text-[14px] leading-relaxed shadow-md relative group ${msg.sender === "user"
                      ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent3)] text-white rounded-br-none font-medium"
                      : "bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] rounded-bl-none font-normal"
                      }`}
                  >
                    {msg.text || (
                      <span className="w-2 h-4 bg-[var(--accent)] inline-block animate-pulse" />
                    )}

                    {/* Copy Button for AI Messages */}
                    {msg.sender === "ai" && msg.text && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-[var(--surface)] hover:bg-[var(--surface2)] border border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)] shadow-md cursor-pointer"
                        title="Copy Message"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--muted)]/60 mt-1 px-1">{msg.time}</span>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--muted)] w-fit rounded-bl-none font-mono text-[13px]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Chips (Fade out after first message) */}
            <AnimatePresence>
              {!hasSentMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  className="px-4 py-2.5 bg-[var(--surface2)]/60 border-t border-[var(--border)] flex flex-wrap gap-2 overflow-x-auto"
                  data-lenis-prevent
                >
                  {INITIAL_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface2)] border border-[var(--border)] font-mono text-[11px] text-[var(--muted2)] hover:text-[var(--text)] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <span>{chip}</span> <CornerDownLeft size={10} className="text-[var(--accent)]" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text Input & Send Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center gap-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about skills, projects, notice period..."
                disabled={isLoading}
                className="flex-1 h-11 bg-[var(--bg)]/50 border border-[var(--border2)] rounded-xl px-4 text-[var(--text)] font-dm-sans text-[14px] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent)] transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent3)] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-lg flex-shrink-0"
                aria-label="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
