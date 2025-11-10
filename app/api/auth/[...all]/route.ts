import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { checkAndElevateSuperAdmin } from "@/lib/services/system-admin.service";

const { GET: originalGET, POST: originalPOST } = toNextJsHandler(auth.handler);

// Wrap GET handler to check for system admin elevation after magic link verification
export async function GET(request: NextRequest) {
  try {
    const response = await originalGET(request);
    
    // After successful magic link verification, check if user should be elevated
    const url = new URL(request.url);
    if (url.pathname.includes("/magic-link/verify")) {
      try {
        // Get the session after verification
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        
        if (session?.user?.email && session?.user?.id) {
          // Check and elevate to super admin if authorized
          console.log(`Checking system admin elevation for ${session.user.email}`);
          const elevated = await checkAndElevateSuperAdmin(session.user.email, session.user.id);
          console.log(`System admin elevation result: ${elevated}`);
        }
      } catch (error) {
        console.error("Error checking system admin elevation:", error);
        // Don't fail the auth flow, just log the error
      }
    }
    
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