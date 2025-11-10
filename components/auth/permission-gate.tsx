/**
 * Permission Gate Component
 * 
 * Conditionally renders children based on user permissions.
 * Use this for component-level permission checks.
 */

import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/services/authorization.service";

interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  fallback?: ReactNode;
}

/**
 * Permission Gate - Shows content only if user has required permission(s)
 * 
 * @example
 * // Single permission
 * <PermissionGate permission="cases:create">
 *   <CreateCaseButton />
 * </PermissionGate>
 * 
 * @example
 * // Any of multiple permissions
 * <PermissionGate anyPermissions={["cases:update", "cases:delete"]}>
 *   <EditCaseButton />
 * </PermissionGate>
 * 
 * @example
 * // All permissions required
 * <PermissionGate allPermissions={["cases:read", "cases:update"]}>
 *   <AdvancedEditor />
 * </PermissionGate>
 */
export async function PermissionGate({
  children,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
}: PermissionGateProps) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return <>{fallback}</>;
    }

    const context = await getUserTenantContext(session.user.id);
    
    if (!context?.organizationId) {
      return <>{fallback}</>;
    }

    let hasAccess = false;

    // Check single permission
    if (permission) {
      hasAccess = await hasPermission(
        session.user.id,
        context.organizationId,
        permission,
        context.isSuperAdmin
      );
    }
    // Check any of multiple permissions
    else if (anyPermissions && anyPermissions.length > 0) {
      hasAccess = await hasAnyPermission(
        session.user.id,
        context.organizationId,
        anyPermissions,
        context.isSuperAdmin
      );
    }
    // Check all permissions
    else if (allPermissions && allPermissions.length > 0) {
      hasAccess = await hasAllPermissions(
        session.user.id,
        context.organizationId,
        allPermissions,
        context.isSuperAdmin
      );
    }
    // No permissions specified - allow access
    else {
      hasAccess = true;
    }

    if (!hasAccess) {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  } catch (error) {
    console.error("PermissionGate error:", error);
    return <>{fallback}</>;
  }
}
