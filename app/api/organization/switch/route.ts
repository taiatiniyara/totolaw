/**
 * Organisation Switch API Route
 * 
 * POST /api/organisation/switch
 * Switches the user's active organisation context
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { switchUserOrganisation } from "@/lib/services/tenant.service";

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
    const { organisationId } = body;

    if (!organisationId) {
      return NextResponse.json(
        { error: "Organisation ID is required" },
        { status: 400 }
      );
    }

    // Switch organisation
    await switchUserOrganisation(session.user.id, organisationId);

    return NextResponse.json({
      success: true,
      data: { organisationId }
    });

  } catch (error) {
    console.error("Organisation switch error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to switch organisation" 
      },
      { status: 500 }
    );
  }
}
