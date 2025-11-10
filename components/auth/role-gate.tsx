/**
 * Role Gate Component
 * 
 * Conditionally renders children based on user roles.
 * Use this for role-based visibility control.
 */

import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasRole, hasAnyRole, hasAllRoles } from "@/lib/services/authorization.service";

interface RoleGateProps {
  children: ReactNode;
  role?: string;
  anyRoles?: string[];
  allRoles?: string[];
  fallback?: ReactNode;
}

/**
 * Role Gate - Shows content only if user has required role(s)
 * 
 * @example
 * // Single role
 * <RoleGate role="judge">
 *   <JudgePanel />
 * </RoleGate>
 * 
 * @example
 * // Any of multiple roles
 * <RoleGate anyRoles={["judge", "magistrate"]}>
 *   <CourtActions />
 * </RoleGate>
 * 
 * @example
 * // All roles required
 * <RoleGate allRoles={["administrator", "senior-clerk"]}>
 *   <SystemSettings />
 * </RoleGate>
 */
export async function RoleGate({
  children,
  role,
  anyRoles,
  allRoles,
  fallback = null,
}: RoleGateProps) {
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

    // Check single role
    if (role) {
      hasAccess = await hasRole(
        session.user.id,
        context.organizationId,
        role,
        context.isSuperAdmin
      );
    }
    // Check any of multiple roles
    else if (anyRoles && anyRoles.length > 0) {
      hasAccess = await hasAnyRole(
        session.user.id,
        context.organizationId,
        anyRoles,
        context.isSuperAdmin
      );
    }
    // Check all roles
    else if (allRoles && allRoles.length > 0) {
      hasAccess = await hasAllRoles(
        session.user.id,
        context.organizationId,
        allRoles,
        context.isSuperAdmin
      );
    }
    // No roles specified - allow access
    else {
      hasAccess = true;
    }

    if (!hasAccess) {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  } catch (error) {
    console.error("RoleGate error:", error);
    return <>{fallback}</>;
  }
}
