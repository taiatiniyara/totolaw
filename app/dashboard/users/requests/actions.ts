"use server";

import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import {
  createJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  listJoinRequestsForOrganisation,
  listAllJoinRequests,
  getUserJoinRequests,
  cancelJoinRequest,
} from "@/lib/services/join-request.service";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ========================================
// User Actions (Creating Requests)
// ========================================

/**
 * Create a join request to an organisation
 */
export async function requestToJoinOrganisation(
  organisationId: string,
  message?: string
): Promise<ActionResult<any>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const request = await createJoinRequest(
      session.user.id,
      organisationId,
      message
    );

    return { success: true, data: request };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create request" };
  }
}

/**
 * Get current user's join requests
 */
export async function getMyJoinRequests(): Promise<ActionResult<any[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const requests = await getUserJoinRequests(session.user.id);

    return { success: true, data: requests };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch requests" };
  }
}

/**
 * Cancel a join request
 */
export async function cancelMyJoinRequest(requestId: string): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await cancelJoinRequest(requestId, session.user.id);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to cancel request" };
  }
}

// ========================================
// Admin Actions (Reviewing Requests)
// ========================================

/**
 * Get join requests for current organisation (admin only)
 * Requires users:read permission
 */
export async function getOrganisationJoinRequests(
  status?: string
): Promise<ActionResult<any[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:read",
      context.isSuperAdmin
    );

    if (!canView) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Super admins can see all requests
    const requests = context.isSuperAdmin
      ? await listAllJoinRequests(status)
      : await listJoinRequestsForOrganisation(context.organisationId, status);

    return { success: true, data: requests };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch join requests",
    };
  }
}

/**
 * Approve a join request (admin only)
 * Requires users:manage permission
 */
export async function approveJoinRequestAction(
  requestId: string,
  roleIds: string[] = []
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canManage = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:manage",
      context.isSuperAdmin
    );

    if (!canManage) {
      return { success: false, error: "Insufficient permissions" };
    }

    await approveJoinRequest(requestId, session.user.id, roleIds);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to approve request",
    };
  }
}

/**
 * Reject a join request (admin only)
 * Requires users:manage permission
 */
export async function rejectJoinRequestAction(
  requestId: string,
  reason?: string
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organisationId) {
      return { success: false, error: "No organisation context" };
    }

    // Check permission
    const canManage = await hasPermission(
      session.user.id,
      context.organisationId,
      "users:manage",
      context.isSuperAdmin
    );

    if (!canManage) {
      return { success: false, error: "Insufficient permissions" };
    }

    await rejectJoinRequest(requestId, session.user.id, reason);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to reject request",
    };
  }
}
