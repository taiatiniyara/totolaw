/**
 * Protected Route Component
 * 
 * Wraps page content to ensure user has required permission.
 * Redirects to access denied page if permission is missing.
 */

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission: string;
  redirectTo?: string;
}

/**
 * Protected Route - Ensures user has permission to access page
 * 
 * @example
 * // In a page component
 * export default async function CreateCasePage() {
 *   return (
 *     <ProtectedRoute requiredPermission="cases:create">
 *       <CreateCaseForm />
 *     </ProtectedRoute>
 *   );
 * }
 */
export async function ProtectedRoute({
  children,
  requiredPermission,
  redirectTo = "/dashboard/access-denied",
}: ProtectedRouteProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);

  if (!context?.organisationId) {
    redirect("/dashboard/no-organisation");
  }

  const hasAccess = await hasPermission(
    session.user.id,
    context.organisationId,
    requiredPermission,
    context.isSuperAdmin
  );

  if (!hasAccess) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
