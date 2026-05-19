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
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00d4ff] to-[#2563eb] text-white font-dm-sans text-[13px] font-bold shadow-xl border border-white/20 whitespace-nowrap flex items-center gap-2 drop-shadow-lg pointer-events-none"
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
            className="w-12 h-12 rounded-full relative overflow-hidden bg-white/[0.05] backdrop-blur-2xl border border-white/25 text-[#00d4ff] flex items-center justify-center shadow-[0_10px_30px_rgba(0,212,255,0.35)] hover:shadow-[0_10px_45px_rgba(0,212,255,0.7)] hover:scale-110 transition-all duration-300 cursor-pointer group"
            style={{
              boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -4px 8px rgba(0, 212, 255, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle AI Chat Drawer"
          >
            {/* Top Specular Water Rim Reflection */}
            <span className="absolute top-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full pointer-events-none" />
            {/* Bottom Liquid Cyan Glow */}
            <span className="absolute bottom-[1px] left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/60 to-transparent rounded-full pointer-events-none" />

            <Bot size={22} className="animate-pulse group-hover:rotate-12 group-hover:scale-110 transition-all text-[#00d4ff] drop-shadow-[0_0_10px_rgba(0,212,255,0.8)] z-10" />
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
            className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-[105] w-full md:w-[440px] h-[88vh] md:h-[600px] max-h-[800px] bg-[#0b0b12]/95 backdrop-blur-3xl border border-white/15 rounded-t-3xl md:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8),_0_0_30px_rgba(0,212,255,0.2)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161622]/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#2563eb]/20 border border-[#00d4ff]/40 flex items-center justify-center text-[#00d4ff]">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-syne text-[16px] font-bold text-white flex items-center gap-1.5">
                    <span>Ask Tharun's AI</span>
                    <Sparkles size={14} className="text-[#00d4ff]" />
                  </h3>
                  <p className="font-mono text-[11px] text-[#10b981] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                    <span>Powered by Gemini &middot; Ask me anything</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
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
                      ? "bg-gradient-to-r from-[#00d4ff] to-[#2563eb] text-white rounded-br-none font-medium"
                      : "bg-[#161622] text-white/90 border border-white/10 rounded-bl-none font-normal"
                      }`}
                  >
                    {msg.text || (
                      <span className="w-2 h-4 bg-[#00d4ff] inline-block animate-pulse" />
                    )}

                    {/* Copy Button for AI Messages */}
                    {msg.sender === "ai" && msg.text && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-[#1e1e2e] hover:bg-[#2e2e3e] border border-white/20 rounded-lg text-white/80 hover:text-white shadow-md cursor-pointer"
                        title="Copy Message"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-white/40 mt-1 px-1">{msg.time}</span>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#161622] border border-white/10 text-white/60 w-fit rounded-bl-none font-mono text-[13px]">
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-bounce" style={{ animationDelay: "300ms" }} />
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
                  className="px-4 py-2.5 bg-[#161622]/60 border-t border-white/10 flex flex-wrap gap-2 overflow-x-auto"
                  data-lenis-prevent
                >
                  {INITIAL_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 font-mono text-[11px] text-white/70 hover:text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <span>{chip}</span> <CornerDownLeft size={10} className="text-[#00d4ff]" />
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
              className="p-3 border-t border-white/10 bg-[#161622] flex items-center gap-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about skills, projects, notice period..."
                disabled={isLoading}
                className="flex-1 h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-white font-dm-sans text-[14px] placeholder:text-white/30 focus:outline-none focus:border-[#00d4ff] transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#2563eb] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-lg flex-shrink-0"
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
