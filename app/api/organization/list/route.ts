/**
 * Organisation List API Route
 * 
 * GET /api/organisation/list
 * Returns all organisations the user has access to
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserOrganisations, getUserTenantContext } from "@/lib/services/tenant.service";

export async function GET(request: NextRequest) {
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

    // Get user's organisations
    const organisations = await getUserOrganisations(session.user.id);
    
    // Get current organisation
    const context = await getUserTenantContext(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        organisations,
        currentOrganisationId: context?.organisationId
      }
    });

  } catch (error) {
    console.error("Error fetching organisations:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to fetch organisations" 
      },
      { status: 500 }
    );
  }
}
