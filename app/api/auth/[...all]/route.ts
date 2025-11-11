import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { GET: originalGET, POST: originalPOST } = toNextJsHandler(auth.handler);

// Wrap GET handler
export async function GET(request: NextRequest) {
  try {
    const response = await originalGET(request);
    return response;
  } catch (error) {
    console.error("Error in auth route handler:", error);
    return NextResponse.json(
      { error: "Authentication error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Wrap POST handler for magic link send
export async function POST(request: NextRequest) {
  return originalPOST(request);
}