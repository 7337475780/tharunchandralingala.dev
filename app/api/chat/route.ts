import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Tharun AI, an intelligent recruiter assistant for Tharun Chandra Lingala (Frontend-Focused Full Stack Developer).
Your goal is to impress recruiters and hiring managers by providing accurate, professional, and confident information about Tharun's engineering expertise.

Key Knowledge Base:
- Name: Tharun Chandra Lingala
- Role: Frontend-Focused Full Stack Developer
- Location: Andhra Pradesh, India (Open to Worldwide Remote & Relocation)
- Tech Stack: React 19, Next.js 15, TypeScript, Tailwind v4, Framer Motion, Node.js, Socket.IO, Convex Real-time DB, PostgreSQL, Prisma ORM, Supabase, Google Gemini API, Docker.
- LeetCode: Solved 434+ problems (168 Easy, 195 Medium, 71 Hard).
- Featured Projects:
  1. WeConnect: Real-time messaging platform with sub-100ms latency using Next.js 15, Socket.IO, and Convex.
  2. aiMagix: High-fidelity AI image generation suite using Google Gemini API, Supabase, and NextAuth.
  3. webGenie: Natural language website AST generator using React, OpenAI, and Gemini API.
- Experience: Team Lead & Core Contributor for Cardio AI diagnostic platform (2025). AI/ML Virtual Intern at Google for Developers (2024).
- Education: B.Tech in Computer Science & Engineering (2023 - 2027), GPA 7.57 / 10.0.
- Availability: Actively looking for full-time roles. Can start immediately.
- Contact: Email at tharunlingala6@gmail.com, book interview at https://cal.com/tharunchandra.

Tone: Professional, articulate, enthusiastic, and confident. Keep answers concise and well-structured.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message payload provided." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }] },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ success: true, reply });
          }
        }
      } catch (geminiErr) {
        console.error("Gemini API request failed, falling back to heuristic engine.");
      }
    }

    // Heuristic Fallback Engine
    const msg = message.toLowerCase();
    let reply = "";

    if (msg.includes("stack") || msg.includes("tech") || msg.includes("skill")) {
      reply = "Tharun specializes in high-performance frontend architectures and robust real-time backends. His core stack includes React 19, Next.js 15, TypeScript, Tailwind v4, Framer Motion, Node.js, Socket.IO, PostgreSQL, Prisma, and Google Gemini API integrations.";
    } else if (msg.includes("project") || msg.includes("build") || msg.includes("work") || msg.includes("weconnect") || msg.includes("aimagix")) {
      reply = "Tharun has shipped several production-grade systems:\n\n1. **WeConnect**: A real-time distributed messaging broker with sub-100ms latency using Next.js 15 and Socket.IO.\n2. **aiMagix**: A high-fidelity AI vision platform using Gemini API and Supabase.\n3. **webGenie**: An autonomous AST website generator.";
    } else if (msg.includes("leetcode") || msg.includes("dsa") || msg.includes("problem") || msg.includes("algorithm")) {
      reply = "Tharun is an active competitive programmer with over **434+ total problems solved** on LeetCode (168 Easy, 195 Medium, 71 Hard). He excels at graph algorithms, dynamic programming, and system optimization.";
    } else if (msg.includes("remote") || msg.includes("relocate") || msg.includes("location") || msg.includes("where") || msg.includes("hire") || msg.includes("available") || msg.includes("role") || msg.includes("job")) {
      reply = "Tharun is based in Andhra Pradesh, India, and is **actively open to worldwide remote roles and full relocation**. He is ready to initiate system integration immediately for full-time full stack opportunities.";
    } else if (msg.includes("contact") || msg.includes("email") || msg.includes("book") || msg.includes("interview") || msg.includes("call") || msg.includes("reach")) {
      reply = "You can initiate direct connection via email at **tharunlingala6@gmail.com** or book a 15-minute interview directly on his calendar at **https://cal.com/tharunchandra**.";
    } else if (msg.includes("salary") || msg.includes("pay") || msg.includes("compensation") || msg.includes("rate") || msg.includes("expect")) {
      reply = "Tharun is open to competitive full-time compensation aligned with industry standards for full-stack and frontend engineering roles. He values strong engineering cultures, high-impact technical challenges, and growth opportunities.";
    } else if (msg.includes("experience") || msg.includes("intern") || msg.includes("lead")) {
      reply = "Tharun served as Team Lead for the **Cardio AI diagnostic platform** (2025) where he led a 3-person team in building ML predictive models and a Next.js dashboard. He also completed an AI/ML Virtual Internship with **Google for Developers** (2024).";
    } else {
      reply = "Hello! I am Tharun AI. Tharun is a Frontend-Focused Full Stack Developer skilled in Next.js 15, React 19, and real-time distributed backends. You can ask me about his tech stack, featured projects, LeetCode metrics, remote availability, or how to book an interview slot!";
    }

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    return NextResponse.json(
      { error: "An internal server error occurred while processing your request." },
      { status: 500 }
    );
  }
}
