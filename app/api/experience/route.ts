import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "experience.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const experiences = JSON.parse(data);
    return NextResponse.json({ success: true, experiences });
  } catch (err) {
    console.error("Error reading experience.json:", err);
    return NextResponse.json({ success: false, error: "Failed to load experiences." }, { status: 500 });
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

    const { experiences } = await req.json();

    if (!Array.isArray(experiences)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload format. Expected an array of experiences." },
        { status: 400 }
      );
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(experiences, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Experience database updated successfully." });
  } catch (err) {
    console.error("Error writing experience.json:", err);
    return NextResponse.json({ success: false, error: "Internal server error while saving experiences." }, { status: 500 });
  }
}
