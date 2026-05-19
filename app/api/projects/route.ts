import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const projects = JSON.parse(data);
    return NextResponse.json({ success: true, projects });
  } catch (err) {
    console.error("Error reading projects.json:", err);
    return NextResponse.json({ success: false, error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const adminPin = process.env.ADMIN_SECRET_PIN || "7337";

    if (!authHeader || authHeader !== `Bearer ${adminPin}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Invalid Admin PIN." },
        { status: 401 }
      );
    }

    const { projects } = await req.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload format. Expected an array of projects." },
        { status: 400 }
      );
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Projects successfully synchronized with database." });
  } catch (err) {
    console.error("Error writing projects.json:", err);
    return NextResponse.json({ success: false, error: "Internal server error while saving projects." }, { status: 500 });
  }
}
