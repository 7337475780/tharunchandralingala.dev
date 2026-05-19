import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "blogs.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const blogs = JSON.parse(data);
    return NextResponse.json({ success: true, blogs });
  } catch (err) {
    console.error("Error reading blogs.json:", err);
    return NextResponse.json({ success: false, error: "Failed to load blogs." }, { status: 500 });
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

    const { blogs } = await req.json();

    if (!Array.isArray(blogs)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload format. Expected an array of blog articles." },
        { status: 400 }
      );
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(blogs, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Blog articles successfully synchronized with database." });
  } catch (err) {
    console.error("Error writing blogs.json:", err);
    return NextResponse.json({ success: false, error: "Internal server error while saving blogs." }, { status: 500 });
  }
}
