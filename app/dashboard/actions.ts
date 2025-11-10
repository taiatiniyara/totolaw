"use server";

/**
 * Dashboard Actions
 * 
 * General dashboard actions including logout and organization switching.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { 
  getUserTenantContext, 
  getUserOrganizations,
  switchUserOrganization 
} from "@/lib/services/tenant.service";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Logout the current user
 */
export async function logoutAction() {
  try {
    await authClient.signOut();
    redirect("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to logout");
  }
}

/**
 * Get current organization context
 */
export async function getCurrentOrganization(): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    
    return { 
      success: true, 
      data: context 
    };
  } catch (error) {
    console.error("Error getting organization context:", error);
    return { 
      success: false, 
      error: "Failed to get organization context" 
    };
  }
}

/**
 * Get all organizations the user has access to
 */
export async function getAvailableOrganizations(): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const organizations = await getUserOrganizations(session.user.id);
    
    return { 
      success: true, 
      data: organizations 
    };
  } catch (error) {
    console.error("Error getting organizations:", error);
    return { 
      success: false, 
      error: "Failed to get organizations" 
    };
  }
}

/**
 * Switch to a different organization
 */
export async function switchOrganization(
  organizationId: string
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({ 
      headers: await import("next/headers").then(m => m.headers()) 
    });
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await switchUserOrganization(session.user.id, organizationId);
    
    // Revalidate all dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/cases");
    
    return { 
      success: true, 
      data: { organizationId } 
    };
  } catch (error) {
    console.error("Error switching organization:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to switch organization" 
    };
  }
}
