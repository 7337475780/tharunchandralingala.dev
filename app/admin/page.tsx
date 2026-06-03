"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Save,
  Upload,
  ArrowLeft,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
  Terminal,
  X,
  Activity,
  Briefcase,
  BookOpen,
  LogOut,
  FolderOpen
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  tags: string[];
  badge?: { text: string; color: string };
  gridClass?: string;
  github: string;
  live: string;
}

interface Blog {
  id: number;
  title: string;
  url: string;
  tag_list: string[];
  reading_time_minutes: number;
  published_at: string;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export default function AdminPage() {
  const router = useRouter();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptSteps, setDecryptSteps] = useState<string[]>([]);
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<"projects" | "blogs" | "experiences" | "resume">("projects");
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentResumeUrl, setCurrentResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Forms states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-login if PIN exists in localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem("portfolio-admin-pin");
    if (savedPin) {
      verifyPin(savedPin, true);
    } else {
      setLoading(false);
    }
  }, []);

  // Verify PIN with API
  const verifyPin = async (inputPin: string, isAuto = false) => {
    if (!inputPin) return;
    
    if (!isAuto) {
      setIsDecrypting(true);
      setDecryptSteps(["[SYS] Handshake initialized...", "[SYS] Pinging secure authorization gateway..."]);
      await new Promise((res) => setTimeout(res, 600));
      setDecryptSteps(prev => [...prev, "[SYS] Encrypted tunnel established. Decrypting credential hashes..."]);
      await new Promise((res) => setTimeout(res, 800));
    }

    try {
      // Test auth against projects endpoint
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${inputPin}`
        },
        body: JSON.stringify({ projects: [] }) // Dry run with empty array
      });

      // Status 400 is fine since we sent projects: [] which may fail payload validate or dry run check, 
      // but 401 is unauthorized.
      if (res.status === 401) {
        throw new Error("Invalid admin credentials override request.");
      }

      // Success
      localStorage.setItem("portfolio-admin-pin", inputPin);
      setPin(inputPin);
      setIsAuthenticated(true);
      fetchData(inputPin);
    } catch (err: any) {
      setError(err.message || "Invalid Admin PIN. Authentication failed.");
      if (isAuto) {
        localStorage.removeItem("portfolio-admin-pin");
      }
    } finally {
      setIsDecrypting(false);
      setLoading(false);
    }
  };

  // Fetch initial data
  const fetchData = async (authPin: string) => {
    setLoading(true);
    try {
      // Fetch projects
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();
      if (projData.success) setProjects(projData.projects);

      // Fetch blogs
      const blogRes = await fetch("/api/blogs");
      const blogData = await blogRes.json();
      if (blogData.success) setBlogs(blogData.blogs);

      // Fetch experiences
      const expRes = await fetch("/api/experience");
      const expData = await expRes.json();
      if (expData.success) setExperiences(expData.experiences);

      // Fetch resume
      const resRes = await fetch("/api/resume");
      const resData = await resRes.json();
      if (resData.success) setCurrentResumeUrl(resData.url);
      
    } catch (err) {
      showStatus("Error loading data from servers.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (text: string, type: "success" | "error") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Synchronize Projects
  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pin}`
        },
        body: JSON.stringify({ projects: updatedProjects })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(updatedProjects);
        showStatus("Projects database updated successfully! ✅", "success");
      } else {
        showStatus(data.error || "Failed to sync projects.", "error");
      }
    } catch (err) {
      showStatus("Network failure while saving projects.", "error");
    }
  };

  // Synchronize Blogs
  const saveBlogs = async (updatedBlogs: Blog[]) => {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pin}`
        },
        body: JSON.stringify({ blogs: updatedBlogs })
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(updatedBlogs);
        showStatus("Blog Articles database updated successfully! 📚", "success");
      } else {
        showStatus(data.error || "Failed to sync blogs.", "error");
      }
    } catch (err) {
      showStatus("Network failure while saving blogs.", "error");
    }
  };

  // Synchronize Experiences
  const saveExperiences = async (updatedExperiences: Experience[]) => {
    try {
      const res = await fetch("/api/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pin}`
        },
        body: JSON.stringify({ experiences: updatedExperiences })
      });
      const data = await res.json();
      if (data.success) {
        setExperiences(updatedExperiences);
        showStatus("Experience database updated successfully! 💼", "success");
      } else {
        showStatus(data.error || "Failed to sync experiences.", "error");
      }
    } catch (err) {
      showStatus("Network failure while saving experiences.", "error");
    }
  };

  // Resume PDF upload handler
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${pin}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setCurrentResumeUrl(data.url);
        setResumeFile(null);
        showStatus("Resume PDF uploaded successfully to Vercel Blob! 📄", "success");
      } else {
        showStatus(data.error || "Upload failed.", "error");
      }
    } catch (err) {
      showStatus("Network error during PDF upload.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Sign out / clear credentials
  const handleLogout = () => {
    localStorage.removeItem("portfolio-admin-pin");
    setIsAuthenticated(false);
    setPin("");
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-white font-mono selection:bg-[#00d4ff]/30 selection:text-white">
      
      {/* Background stars & mesh overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(129,140,248,0.08),rgba(255,255,255,0))] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,212,255,0.03),transparent)] -z-10" />
      
      {/* Header bar */}
      <nav className="border-b border-white/5 bg-[#090912]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[14px]"
        >
          <ArrowLeft size={16} />
          <span>BACK TO MAIN SITE</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[12px] text-white/50 font-bold uppercase tracking-widest font-syne">
            Secure Portal v1.0
          </span>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all text-[12px] font-bold"
            >
              <LogOut size={13} />
              <span>TERMINATE</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Loader while verifying saved credentials */}
        {loading && !isDecrypting && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-[#00d4ff] rounded-full animate-spin" />
            <span className="text-white/40 text-[13px]">Authenticating Override Credentials...</span>
          </div>
        )}

        {/* 1. LOGIN OVERRIDE PANEL */}
        {!loading && !isAuthenticated && (
          <div className="max-w-md mx-auto py-12">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0b0b14] border border-[#00d4ff]/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,212,255,0.05)] relative overflow-hidden"
            >
              {/* Matrix code lines decoration */}
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] mb-4">
                  <Shield size={32} className="animate-pulse" />
                </div>
                <h1 className="text-[22px] font-syne font-bold tracking-tight text-[#00d4ff]">
                  SECURITY OVERRIDE CMS
                </h1>
                <p className="text-[13px] text-white/50 mt-1">
                  Decryption clearance is required to proceed.
                </p>
              </div>

              {!isDecrypting ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    verifyPin(pin);
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2 font-bold">
                      ADMIN SECRET ACCESS PIN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">
                        <Lock size={16} />
                      </div>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => {
                          setPin(e.target.value);
                          setError("");
                        }}
                        placeholder="••••"
                        maxLength={8}
                        className="w-full pl-10 pr-4 py-3 bg-[#0d0d1a] border border-white/10 focus:border-[#00d4ff]/50 rounded-xl focus:outline-none transition-colors text-center tracking-[8px] text-[18px]"
                        required
                        autoFocus
                      />
                    </div>
                    {error && (
                      <div className="mt-3 flex items-center gap-2 text-red-400 text-[12px] bg-red-500/5 border border-red-500/20 rounded-lg p-2.5">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#00d4ff] to-[#818cf8] hover:from-[#00d4ff] hover:to-[#c084fc] text-[#07070d] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] text-[14px]"
                  >
                    BYPASS SECURITY
                  </button>
                </form>
              ) : (
                <div className="space-y-4 font-mono text-[12px] bg-black/40 border border-white/5 p-4 rounded-xl h-48 overflow-y-auto flex flex-col justify-end text-emerald-400">
                  <div className="flex gap-2 items-center mb-auto border-b border-white/5 pb-2 text-white/40 uppercase tracking-wider text-[10px]">
                    <Terminal size={12} />
                    <span>OVERRIDE STATUS SHELL</span>
                  </div>
                  {decryptSteps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step}
                    </motion.div>
                  ))}
                  <div className="flex gap-2 items-center text-white/50 animate-pulse">
                    <span>&gt;</span>
                    <span className="w-1.5 h-3 bg-[#00d4ff]" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* 2. ADMIN CMS WORKSPACE */}
        {isAuthenticated && (
          <div className="space-y-8">
            
            {/* Status alerts */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-[13px] ${
                    statusMessage.type === "success"
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/5 border-red-500/20 text-red-400"
                  }`}
                >
                  {statusMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span>{statusMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header intro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-[32px] font-syne font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                  CMS DASHBOARD
                </h1>
                <p className="text-[13px] text-white/40 mt-1">
                  Manage projects, update blogs, edit experiences, or drag-and-drop secure resume binaries.
                </p>
              </div>
              
              {/* Workspace statistics */}
              <div className="flex flex-wrap items-center gap-4 bg-[#0d0d1a] border border-white/5 p-3 rounded-2xl text-[12px] font-bold">
                <div className="flex items-center gap-1.5 px-3 py-1 border-r border-white/5">
                  <Briefcase size={14} className="text-[#00d4ff]" />
                  <span className="text-white/60">Projects: {projects.length}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 border-r border-white/5">
                  <BookOpen size={14} className="text-[#818cf8]" />
                  <span className="text-white/60">Blogs: {blogs.length}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 border-r border-white/5">
                  <Activity size={14} className="text-[#10b981]" />
                  <span className="text-white/60">Experience: {experiences.length}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1">
                  <FileText size={14} className="text-[#c084fc]" />
                  <span className="text-white/60">Resume: {currentResumeUrl ? "BLOB ACTIVE" : "LOCAL"}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-px overflow-x-auto">
              {(["projects", "blogs", "experiences", "resume"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setEditingProject(null);
                    setEditingBlog(null);
                    setEditingExperience(null);
                  }}
                  className={`px-6 py-3 border-b-2 text-[13px] font-bold uppercase transition-all tracking-wider font-syne shrink-0 ${
                    activeTab === tab
                      ? "border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/5"
                      : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/2"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB PANELS */}
            
            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {!editingProject ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-[18px] font-syne font-bold text-white/80 flex items-center gap-2">
                        <FolderOpen size={18} className="text-[#00d4ff]" />
                        <span>PORTFOLIO PROJECTS</span>
                      </h2>
                      <button
                        onClick={() => setEditingProject({
                          id: `project-${Date.now()}`,
                          title: "",
                          subtitle: "",
                          description: "",
                          stack: [],
                          tags: [],
                          github: "",
                          live: ""
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-[#07070d] rounded-xl font-bold transition-all text-[12px]"
                      >
                        <Plus size={14} />
                        <span>ADD NEW PROJECT</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="bg-[#0b0b14] border border-white/5 hover:border-[#00d4ff]/20 rounded-2xl p-6 transition-all flex flex-col justify-between gap-4"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[11px] uppercase tracking-widest text-[#00d4ff] font-bold">
                                  {proj.tags.join(" • ") || "No tags"}
                                </span>
                                <h3 className="text-[18px] font-syne font-bold text-white mt-1">
                                  {proj.title}
                                </h3>
                              </div>
                              {proj.badge && (
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${proj.badge.color}`}>
                                  {proj.badge.text}
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-white/50 line-clamp-2 mt-2 leading-relaxed">
                              {proj.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {proj.stack.map((tech) => (
                                <span key={tech} className="bg-white/5 text-white/60 text-[10px] px-2 py-0.5 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <div className="flex gap-2">
                              {proj.github && (
                                <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingProject(proj)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this project?")) {
                                    saveProjects(projects.filter(p => p.id !== proj.id));
                                  }
                                }}
                                className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const cleanStack = Array.isArray(editingProject.stack) 
                        ? editingProject.stack 
                        : (editingProject.stack as string).split(",").map(t => t.trim()).filter(Boolean);
                      const cleanTags = Array.isArray(editingProject.tags) 
                        ? editingProject.tags 
                        : (editingProject.tags as string).split(",").map(t => t.trim()).filter(Boolean);
                      
                      const updatedProject = {
                        ...editingProject,
                        stack: cleanStack,
                        tags: cleanTags
                      };

                      const alreadyExists = projects.find(p => p.id === updatedProject.id);
                      if (alreadyExists) {
                        saveProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
                      } else {
                        saveProjects([...projects, updatedProject]);
                      }
                      setEditingProject(null);
                    }}
                    className="bg-[#0b0b14] border border-white/5 rounded-3xl p-8 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <h3 className="text-[18px] font-syne font-bold text-white flex items-center gap-2">
                        <Edit2 size={16} className="text-[#00d4ff]" />
                        <span>{projects.find(p => p.id === editingProject.id) ? "EDIT" : "CREATE"} PROJECT</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="p-1.5 rounded-lg bg-white/5 text-white/55 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">PROJECT ID (UNIQUE KEY)</label>
                        <input
                          type="text"
                          value={editingProject.id}
                          onChange={(e) => setEditingProject({ ...editingProject, id: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">PROJECT TITLE</label>
                        <input
                          type="text"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">SUBTITLE / SLOGAN</label>
                        <input
                          type="text"
                          value={editingProject.subtitle}
                          onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">GRID SPAN / LAYOUT CLASS (CSS)</label>
                        <input
                          type="text"
                          value={editingProject.gridClass || ""}
                          placeholder="e.g. md:col-span-2 md:row-span-2"
                          onChange={(e) => setEditingProject({ ...editingProject, gridClass: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">DESCRIPTION</label>
                        <textarea
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          rows={4}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40 leading-relaxed font-sans"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">TECH STACK (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingProject.stack) ? editingProject.stack.join(", ") : editingProject.stack}
                          placeholder="e.g. Next.js, Tailwind, React, Node.js"
                          onChange={(e) => setEditingProject({ ...editingProject, stack: e.target.value as any })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">TAGS (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingProject.tags) ? editingProject.tags.join(", ") : editingProject.tags}
                          placeholder="e.g. ai, featured, systems"
                          onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value as any })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">GITHUB REPO URL</label>
                        <input
                          type="url"
                          value={editingProject.github}
                          onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">LIVE PREVIEW URL</label>
                        <input
                          type="url"
                          value={editingProject.live}
                          onChange={(e) => setEditingProject({ ...editingProject, live: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#00d4ff]/40"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[12px] font-bold transition-all"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-[#07070d] rounded-xl font-bold transition-all text-[12px]"
                      >
                        <Save size={14} />
                        <span>SAVE PROJECT</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === "blogs" && (
              <div className="space-y-6">
                {!editingBlog ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-[18px] font-syne font-bold text-white/80 flex items-center gap-2">
                        <BookOpen size={18} className="text-[#818cf8]" />
                        <span>CMS ARTICLES</span>
                      </h2>
                      <button
                        onClick={() => setEditingBlog({
                          id: Date.now(),
                          title: "",
                          url: "",
                          tag_list: [],
                          reading_time_minutes: 5,
                          published_at: new Date().toISOString()
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#818cf8] hover:bg-[#818cf8]/80 text-[#07070d] rounded-xl font-bold transition-all text-[12px]"
                      >
                        <Plus size={14} />
                        <span>WRITE ARTICLE</span>
                      </button>
                    </div>

                    <div className="bg-[#0b0b14] border border-white/5 rounded-2xl overflow-hidden">
                      <div className="min-w-full divide-y divide-white/5">
                        {blogs.map((blog) => (
                          <div
                            key={blog.id}
                            className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/2 transition-all"
                          >
                            <div className="space-y-1">
                              <h3 className="text-[14px] font-bold text-white line-clamp-1">{blog.title}</h3>
                              <div className="flex items-center gap-3 text-[11px] text-white/40">
                                <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{blog.reading_time_minutes} min read</span>
                                <span>•</span>
                                <span className="text-[#818cf8]">{blog.tag_list.join(", ")}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {blog.url && (
                                <a
                                  href={blog.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              )}
                              <button
                                onClick={() => setEditingBlog(blog)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this blog article?")) {
                                    saveBlogs(blogs.filter(b => b.id !== blog.id));
                                  }
                                }}
                                className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const cleanTags = Array.isArray(editingBlog.tag_list) 
                        ? editingBlog.tag_list 
                        : (editingBlog.tag_list as string).split(",").map(t => t.trim()).filter(Boolean);
                      
                      const updatedBlog = {
                        ...editingBlog,
                        tag_list: cleanTags
                      };

                      const alreadyExists = blogs.find(b => b.id === updatedBlog.id);
                      if (alreadyExists) {
                        saveBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b));
                      } else {
                        saveBlogs([updatedBlog, ...blogs]);
                      }
                      setEditingBlog(null);
                    }}
                    className="bg-[#0b0b14] border border-white/5 rounded-3xl p-8 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <h3 className="text-[18px] font-syne font-bold text-white flex items-center gap-2">
                        <Edit2 size={16} className="text-[#818cf8]" />
                        <span>{blogs.find(b => b.id === editingBlog.id) ? "EDIT" : "CREATE"} BLOG ARTICLE</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingBlog(null)}
                        className="p-1.5 rounded-lg bg-white/5 text-white/55 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">ARTICLE TITLE</label>
                        <input
                          type="text"
                          value={editingBlog.title}
                          onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#818cf8]/40"
                          required
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">ARTICLE URL (DEV.TO / MEDIUM / EXTERNAL)</label>
                        <input
                          type="url"
                          value={editingBlog.url}
                          onChange={(e) => setEditingBlog({ ...editingBlog, url: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#818cf8]/40"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">TAGS (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingBlog.tag_list) ? editingBlog.tag_list.join(", ") : editingBlog.tag_list}
                          placeholder="e.g. webdev, react, typescript"
                          onChange={(e) => setEditingBlog({ ...editingBlog, tag_list: e.target.value as any })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#818cf8]/40"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">READ TIME (MIN)</label>
                          <input
                            type="number"
                            value={editingBlog.reading_time_minutes}
                            onChange={(e) => setEditingBlog({ ...editingBlog, reading_time_minutes: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#818cf8]/40"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">PUBLISHED DATE</label>
                          <input
                            type="text"
                            value={editingBlog.published_at}
                            placeholder="e.g. 2026-05-18T05:40:00.000Z"
                            onChange={(e) => setEditingBlog({ ...editingBlog, published_at: e.target.value })}
                            className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#818cf8]/40"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingBlog(null)}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[12px] font-bold transition-all"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#818cf8] hover:bg-[#818cf8]/80 text-[#07070d] rounded-xl font-bold transition-all text-[12px]"
                      >
                        <Save size={14} />
                        <span>SAVE ARTICLE</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* EXPERIENCES TAB */}
            {activeTab === "experiences" && (
              <div className="space-y-6">
                {!editingExperience ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-[18px] font-syne font-bold text-white/80 flex items-center gap-2">
                        <Activity size={18} className="text-[#10b981]" />
                        <span>WORK EXPERIENCES</span>
                      </h2>
                      <button
                        onClick={() => setEditingExperience({
                          id: `exp-${Date.now()}`,
                          role: "",
                          company: "",
                          duration: "",
                          bullets: []
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#10b981] hover:bg-[#10b981]/80 text-[#07070d] rounded-xl font-bold transition-all text-[12px]"
                      >
                        <Plus size={14} />
                        <span>ADD NEW EXPERIENCE</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {experiences.map((exp, index) => {
                        const colorPalette = ["#00d4ff", "#a78bfa"];
                        const colorPaletteNames = ["Cyan Accent", "Purple Accent"];
                        const itemColor = colorPalette[index % colorPalette.length];
                        const itemColorName = colorPaletteNames[index % colorPaletteNames.length];

                        return (
                          <div
                            key={exp.id}
                            className="bg-[#0b0b14] border border-white/5 hover:border-[#10b981]/20 rounded-2xl p-6 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                          >
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-[18px] font-syne font-bold text-white">
                                  {exp.role}
                                </h3>
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border"
                                  style={{
                                    backgroundColor: `${itemColor}10`,
                                    borderColor: `${itemColor}30`,
                                    color: itemColor
                                  }}
                                >
                                  Auto Color: {itemColorName}
                                </span>
                              </div>
                              <p className="font-dm-sans text-[14px] text-white/60">
                                {exp.company}
                              </p>
                              <p className="font-mono text-[11px] text-white/45">
                                {exp.duration}
                              </p>
                            <ul className="list-disc pl-5 space-y-1 text-[12px] text-white/40 leading-relaxed font-sans mt-2">
                              {exp.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => setEditingExperience(exp)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this experience?")) {
                                  saveExperiences(experiences.filter(e => e.id !== exp.id));
                                }
                              }}
                              className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // bullets parsed line-by-line from a text area
                      const rawBullets = (document.getElementById("bullets-textarea") as HTMLTextAreaElement)?.value || "";
                      const cleanBullets = rawBullets.split("\n").map(b => b.trim()).filter(Boolean);

                      const updatedExperience = {
                        ...editingExperience,
                        bullets: cleanBullets
                      };

                      const alreadyExists = experiences.find(exp => exp.id === updatedExperience.id);
                      if (alreadyExists) {
                        saveExperiences(experiences.map(exp => exp.id === updatedExperience.id ? updatedExperience : exp));
                      } else {
                        saveExperiences([...experiences, updatedExperience]);
                      }
                      setEditingExperience(null);
                    }}
                    className="bg-[#0b0b14] border border-white/5 rounded-3xl p-8 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <h3 className="text-[18px] font-syne font-bold text-white flex items-center gap-2">
                        <Edit2 size={16} className="text-[#10b981]" />
                        <span>{experiences.find(exp => exp.id === editingExperience.id) ? "EDIT" : "CREATE"} EXPERIENCE</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingExperience(null)}
                        className="p-1.5 rounded-lg bg-white/5 text-white/55 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">EXPERIENCE ID (UNIQUE KEY)</label>
                        <input
                          type="text"
                          value={editingExperience.id}
                          onChange={(e) => setEditingExperience({ ...editingExperience, id: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#10b981]/40"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">ROLE / TITLE</label>
                        <input
                          type="text"
                          value={editingExperience.role}
                          onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#10b981]/40"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">COMPANY & SPONSORS</label>
                        <input
                          type="text"
                          value={editingExperience.company}
                          onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#10b981]/40"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">DURATION & LOCATION</label>
                        <input
                          type="text"
                          value={editingExperience.duration}
                          onChange={(e) => setEditingExperience({ ...editingExperience, duration: e.target.value })}
                          placeholder="e.g. Apr 2025 – Jun 2025 · Remote"
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#10b981]/40"
                          required
                        />
                      </div>



                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 font-bold">BULLET POINTS (ONE PER LINE)</label>
                        <textarea
                          id="bullets-textarea"
                          defaultValue={editingExperience.bullets.join("\n")}
                          rows={6}
                          placeholder="Type each description bullet point on a new line..."
                          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#10b981]/40 leading-relaxed font-sans"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingExperience(null)}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[12px] font-bold transition-all"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#10b981] hover:bg-[#10b981]/80 text-[#07070d] rounded-xl font-bold transition-all text-[12px]"
                      >
                        <Save size={14} />
                        <span>SAVE EXPERIENCE</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* RESUME TAB */}
            {activeTab === "resume" && (
              <div className="space-y-6">
                <div className="bg-[#0b0b14] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div>
                    <h2 className="text-[18px] font-syne font-bold text-white flex items-center gap-2">
                      <FileText size={18} className="text-[#c084fc]" />
                      <span>SECURE RESUME UPLOADER</span>
                    </h2>
                    <p className="text-[12px] text-white/45 mt-1">
                      Directly stream updated Resume binary blobs onto your public CDN network storage hosted via Vercel Blob.
                    </p>
                  </div>

                  {/* Active details */}
                  <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[12px]">
                    <div>
                      <span className="text-white/40 uppercase tracking-wider block text-[10px]">Active Production URL</span>
                      {currentResumeUrl ? (
                        <a
                          href={currentResumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c084fc] hover:underline font-bold mt-0.5 break-all flex items-center gap-1"
                        >
                          <span>{currentResumeUrl}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-white/60 italic">Fallback to static public/resume.pdf active</span>
                      )}
                    </div>
                  </div>

                  {/* Upload Form */}
                  <form onSubmit={handleResumeUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-white/10 hover:border-[#c084fc]/30 rounded-2xl p-8 text-center transition-all cursor-pointer relative bg-black/10">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file && file.type === "application/pdf") {
                            setResumeFile(file);
                            setError("");
                          } else {
                            showStatus("Only PDF files are acceptable for resume storage.", "error");
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/30 flex items-center justify-center text-[#c084fc]">
                          <Upload size={24} className={isUploading ? "animate-bounce" : ""} />
                        </div>
                        {resumeFile ? (
                          <div>
                            <span className="text-[14px] font-bold text-white">{resumeFile.name}</span>
                            <span className="block text-[11px] text-white/40 mt-1">{(resumeFile.size / 1024).toFixed(1)} KB</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[13px] font-bold text-white/80 block">Drag & Drop Resume PDF here</span>
                            <span className="text-[11px] text-white/40 mt-0.5 block">or click to browse local files (Max size: 5MB)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      {resumeFile && (
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[12px] font-bold"
                          disabled={isUploading}
                        >
                          CLEAR
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!resumeFile || isUploading}
                        className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-[12px] transition-all ${
                          !resumeFile || isUploading
                            ? "bg-white/5 border border-white/5 text-white/30 cursor-not-allowed"
                            : "bg-[#c084fc] hover:bg-[#c084fc]/80 text-[#07070d]"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-3.5 h-3.5 border border-indigo-950 border-t-white rounded-full animate-spin" />
                            <span>STREAMING BLOB...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>DEPOSIT RESUME</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
