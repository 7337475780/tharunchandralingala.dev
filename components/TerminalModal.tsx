"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

type CommandHistory = {
  command: string;
  output: React.ReactNode;
};

export function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setHistory([
              {
                command: "",
                output: "Welcome to Tharun's terminal. Type 'help' for available commands.",
              },
            ]);
          }
          return !prev;
        });
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Listener for custom event dispatched from Footer button
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      setHistory([
        {
          command: "",
          output: "Welcome to Tharun's terminal. Type 'help' for available commands.",
        },
      ]);
    };
    window.addEventListener("open-terminal-modal", handleOpenModal as EventListener);
    return () => window.removeEventListener("open-terminal-modal", handleOpenModal as EventListener);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = "";

    switch (cmd) {
      case "whoami":
        output = "Tharun Chandra Lingala — Full Stack Developer, React specialist, LeetCode grinder, builder of things. Based in Andhra Pradesh, India.";
        break;
      case "ls projects":
        output = (
          <div className="flex flex-col gap-1">
            <span>WeConnect - Real-Time Distributed Messaging Platform</span>
            <span>aiMagix - AI-Powered Image Generation Platform</span>
            <span>webGenie - AI-Powered Website Generator</span>
            <span>InstaLoad - Containerized Media Download Platform</span>
            <span>TubeFetcher - Containerized Media Download Platform</span>
            <span>CardioAI - Heart Disease Prediction Model</span>
          </div>
        );
        break;
      case "skills":
        output = (
          <div className="flex flex-col gap-1">
            <span>Frontend: React.js, Next.js 15, TypeScript, JavaScript ES6+, Tailwind CSS, HTML5 & CSS3, Redux, Zustand, CodeMirror 6</span>
            <span>Backend: Node.js, Express.js, REST APIs, Socket.IO, Prisma</span>
            <span>Database: PostgreSQL, Supabase, Firebase, Convex, Clerk, NextAuth</span>
            <span>Tools: Git, GitHub, Docker, Railway, Vercel, Linux, CI/CD</span>
            <span>AI: Gemini API, OpenAI API, Prompt Engineering</span>
          </div>
        );
        break;
      case "contact":
        output = "Email: tharunlingala6@gmail.com | LinkedIn: linkedin.com/in/tharun-chandra-lingala | GitHub: github.com/7337475780";
        break;
      case "leetcode":
        output = "434+ problems solved. 168 Easy | 195 Medium | 71 Hard. Acceptance rate: 73.59%. Profile: leetcode.com/u/Tharunchandralingala";
        break;
      case "education":
        output = "B.Tech Computer Science & Engineering — QIS College of Engineering, Andhra Pradesh. CGPA: 7.57/10. Expected May 2025.";
        break;
      case "hire":
        output = "I'm currently open to full-time roles and internships. Drop me a line at tharunlingala6@gmail.com or scroll to the contact section.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "help":
        output = (
          <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1">
            <span className="text-[var(--accent)]">whoami</span><span>About me</span>
            <span className="text-[var(--accent)]">ls projects</span><span>List featured projects</span>
            <span className="text-[var(--accent)]">skills</span><span>Show technical skills</span>
            <span className="text-[var(--accent)]">contact</span><span>Show contact links</span>
            <span className="text-[var(--accent)]">leetcode</span><span>Show LeetCode stats</span>
            <span className="text-[var(--accent)]">education</span><span>Show education details</span>
            <span className="text-[var(--accent)]">hire</span><span>Availability status</span>
            <span className="text-[var(--accent)]">clear</span><span>Clear terminal output</span>
            <span className="text-[var(--accent)]">exit</span><span>Close terminal</span>
          </div>
        );
        break;
      case "exit":
        setIsOpen(false);
        setInput("");
        return;
      default:
        output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Terminal Window */}
      <div className="relative w-full max-w-[640px] bg-[var(--surface)] border border-[var(--border2)] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px]">

        {/* Header */}
        <div className="flex items-center px-4 py-3 bg-[var(--surface2)] border-b border-[var(--border2)]">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[var(--red)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--yellow)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
          </div>
          <span className="font-mono text-xs text-[var(--muted2)] flex-1 text-center">tharun@portfolio ~</span>
          <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-[var(--text)]">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-[13px] text-[var(--muted2)] flex flex-col gap-3"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              {item.command && (
                <div className="flex items-center gap-2">
                  <span className="text-[var(--accent)]">❯</span>
                  <span className="text-[var(--text)]">{item.command}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{item.output}</div>
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
            <span className="text-[var(--accent)]">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[var(--text)] font-mono text-[13px] p-0"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
