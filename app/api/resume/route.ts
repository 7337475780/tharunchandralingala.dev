import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const ADMIN_PIN = process.env.ADMIN_SECRET_PIN ?? "7337";

/**
 * GET /api/resume — Returns the current resume blob URL
 */
export async function GET() {
  try {
    const { blobs } = await list({ prefix: "resume/" });
    // Sort by uploadedAt descending — latest resume first
    const sorted = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    if (sorted.length === 0) {
      // Fall back to local public file
      return NextResponse.json({ success: true, url: "/resume.pdf", source: "local" });
    }
    return NextResponse.json({ success: true, url: sorted[0].url, source: "blob" });
  } catch (err) {
    console.error("Blob list error:", err);
    // Fallback to local static file
    return NextResponse.json({ success: true, url: "/resume.pdf", source: "local" });
  }
}

/**
 * POST /api/resume — Upload a new resume PDF (admin only)
 */
export async function POST(req: Request) {
  // Auth check
  const auth = req.headers.get("Authorization");
  const pin = auth?.replace("Bearer ", "").trim();
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("resume") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "A valid PDF file is required." },
        { status: 400 }
      );
    }

    const blob = await put(`resume/${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err: any) {
    console.error("Resume upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Upload failed." },
      { status: 500 }
    );
  }
}
