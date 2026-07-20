import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }

    // Log the contact submission server-side (stored safely in server logs)
    console.log("[Contact Form Submission]", {
      name,
      email,
      message: message.substring(0, 100),
      timestamp: new Date().toISOString(),
    });

    // In production: wire to Resend/Postmark/SendGrid here
    // e.g. await resend.emails.send({ from: "...", to: "hello@venturelens.ai", subject: `Contact from ${name}`, ... })

    return NextResponse.json(
      { success: true, message: "Contact submission received" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
