import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nvidia: !!process.env.NVIDIA_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      tavily: !!process.env.TAVILY_API_KEY,
    }
  });
}
