/**
 * Organization List API Route
 * 
 * GET /api/organization/list
 * Returns all organizations the user has access to
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserOrganizations, getUserTenantContext } from "@/lib/services/tenant.service";

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

    // Get user's organizations
    const organizations = await getUserOrganizations(session.user.id);
    
    // Get current organization
    const context = await getUserTenantContext(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        organizations,
        currentOrganizationId: context?.organizationId
      }
    });

  } catch (error) {
    console.error("Error fetching organizations:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to fetch organizations" 
      },
      { status: 500 }
    );
  }
}
