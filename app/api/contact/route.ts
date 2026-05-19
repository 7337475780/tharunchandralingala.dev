import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend API client
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface RateLimitData {
  count: number;
  timestamp: number;
}

// In-memory rate limiter: Max 3 submissions per IP per hour
const ipRateLimitMap = new Map<string, RateLimitData>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 3;

// Helper to set CORS headers
function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/**
 * Handle preflight OPTIONS request for CORS
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: getCorsHeaders() });
}

/**
 * POST handler for Contact Form submissions
 */
export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") ?? "unknown-ip";
    const now = Date.now();
    const rateRecord = ipRateLimitMap.get(ip);

    if (rateRecord) {
      if (now - rateRecord.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateRecord.count >= MAX_SUBMISSIONS_PER_WINDOW) {
          console.warn(`Rate limit exceeded for IP: ${ip}`);
          return NextResponse.json(
            { success: false, error: "Too many requests. Please try again in an hour." },
            { status: 429, headers: getCorsHeaders() }
          );
        }
        rateRecord.count += 1;
      } else {
        // Reset window if elapsed
        ipRateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      ipRateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // 2. Parse Request Payload
    const body = await req.json();
    const { name, email, subject = "Portfolio Inquiry", message } = body;

    // 3. Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 10 characters long." },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Check if Resend API key is configured
    if (!resend) {
      console.warn("RESEND_API_KEY is not defined in environment variables. Simulating email send for development.");
      return NextResponse.json(
        { success: true, message: "Email sent successfully (Development Mock)!" },
        { status: 200, headers: getCorsHeaders() }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim() || "Portfolio Inquiry";
    const cleanMessage = message.trim();

    // 4. Craft HTML Email to Tharun (Dark Themed Premium Template)
    const notificationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b12; color: #ffffff; padding: 30px 15px; margin: 0; }
          .container { max-w: 600px; margin: 0 auto; background-color: #161622; border: 1px solid #2e2e3e; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { font-size: 24px; font-weight: 800; color: #00d4ff; margin-bottom: 24px; border-bottom: 1px solid #2e2e3e; padding-bottom: 16px; }
          .meta-box { background-color: #0b0b12; border-left: 4px solid #00d4ff; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; color: #cbd5e1; }
          .meta-row { margin-bottom: 8px; }
          .meta-label { font-weight: bold; color: #ffffff; width: 80px; display: inline-block; }
          .message-body { font-size: 16px; line-height: 1.6; color: #e2e8f0; background-color: #0b0b12; padding: 24px; border-radius: 12px; border: 1px solid #2e2e3e; white-space: pre-wrap; margin-bottom: 32px; }
          .btn { display: inline-block; background-color: #00d4ff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; text-align: center; margin-bottom: 24px; font-size: 15px; }
          .footer { font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #2e2e3e; padding-top: 16px; margin-top: 32px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">New Portfolio Inquiry ✨</div>
          <div class="meta-box">
            <div class="meta-row"><span class="meta-label">From:</span> ${cleanName}</div>
            <div class="meta-row"><span class="meta-label">Email:</span> <a href="mailto:${cleanEmail}" style="color: #00d4ff;">${cleanEmail}</a></div>
            <div class="meta-row"><span class="meta-label">Subject:</span> ${cleanSubject}</div>
          </div>
          <h3 style="margin-bottom: 12px; color: #00d4ff; font-size: 16px;">Message Content:</h3>
          <div class="message-body">${cleanMessage}</div>
          <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanSubject)}" class="btn">Reply to ${cleanName} &rarr;</a>
          <div class="footer">Sent from your portfolio contact form (tharunchandralingala.dev)</div>
        </div>
      </body>
      </html>
    `;

    // 5. Craft Confirmation Email to Sender (Warm, Professional Template)
    const confirmationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0b12; color: #ffffff; padding: 30px 15px; margin: 0; }
          .container { max-w: 600px; margin: 0 auto; background-color: #161622; border: 1px solid #2e2e3e; border-radius: 16px; padding: 32px; }
          .header { font-size: 22px; font-weight: bold; color: #10b981; margin-bottom: 20px; }
          .body-text { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
          .quote-box { background-color: #0b0b12; border-left: 3px solid #10b981; padding: 16px; border-radius: 8px; font-style: italic; color: #94a3b8; margin-bottom: 28px; }
          .signature { font-size: 16px; font-weight: bold; color: #ffffff; }
          .sub-sig { font-size: 14px; color: #64748b; margin-bottom: 32px; }
          .footer { font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #2e2e3e; padding-top: 16px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Message Received! 🚀</div>
          <div class="body-text">
            Hi ${cleanName},<br><br>
            Thank you for reaching out! I have successfully received your inquiry regarding <strong>"${cleanSubject}"</strong>.<br><br>
            I am currently reviewing my inbox and will get back to you within <strong>24 hours</strong>. If your request is urgent, feel free to schedule a quick call directly via my <a href="https://cal.com/tharunchandra" style="color: #10b981;">Cal.com link</a>.
          </div>
          <div class="quote-box">"${cleanMessage}"</div>
          <div class="signature">Tharun Chandra Lingala</div>
          <div class="sub-sig">Frontend-Focused Full Stack Developer</div>
          <div class="footer">&copy; ${new Date().getFullYear()} Tharun Chandra Lingala &bull; tharunchandralingala.dev</div>
        </div>
      </body>
      </html>
    `;

    // 6. Execute Dual Email Dispatch
    // Sending from onboarding@resend.dev (or standard default) to tharunlingala6@gmail.com
    const myEmail = "tharunlingala6@gmail.com";
    
    const [notifyRes, confirmRes] = await Promise.all([
      resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: myEmail,
        replyTo: cleanEmail,
        subject: `PORTFOLIO INQUIRY: ${cleanSubject}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: "Tharun Chandra Lingala <onboarding@resend.dev>",
        to: cleanEmail,
        subject: "Got your message, Tharun will reply soon!",
        html: confirmationHtml,
      }),
    ]);

    if (notifyRes.error) {
      console.error("Resend notification error:", notifyRes.error);
      return NextResponse.json(
        { success: false, error: "Failed to dispatch email notification." },
        { status: 500, headers: getCorsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200, headers: getCorsHeaders() }
    );
  } catch (serverErr) {
    console.error("Contact API internal server error:", serverErr);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred while sending your message." },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
