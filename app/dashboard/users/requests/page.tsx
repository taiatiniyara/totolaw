/**
 * Join Requests Management Page
 * 
 * For admins to review and approve/reject join requests
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { getOrganisationJoinRequests } from "./actions";
import { getOrganisationRoles } from "@/app/dashboard/users/actions";
import JoinRequestsClient from "./join-requests-client";

export const dynamic = 'force-dynamic';

export default async function JoinRequestsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);

  // Get join requests
  const requestsResult = await getOrganisationJoinRequests();
  const requests = requestsResult.success ? requestsResult.data || [] : [];

  // Get roles for assigning when approving
  const rolesResult = await getOrganisationRoles();
  const roles = rolesResult.success ? rolesResult.data || [] : [];

  return (
    <ProtectedRoute requiredPermission="users:read">
      <JoinRequestsClient
        requests={requests}
        roles={roles}
        isSuperAdmin={context?.isSuperAdmin || false}
      />
    </ProtectedRoute>
  );
}
