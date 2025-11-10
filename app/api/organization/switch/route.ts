/**
 * Organization Switch API Route
 * 
 * POST /api/organization/switch
 * Switches the user's active organization context
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { switchUserOrganization } from "@/lib/services/tenant.service";

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Switch organization
    await switchUserOrganization(session.user.id, organizationId);

    return NextResponse.json({
      success: true,
      data: { organizationId }
    });

  } catch (error) {
    console.error("Organization switch error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to switch organization" 
      },
      { status: 500 }
    );
  }
}
