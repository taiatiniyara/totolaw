/**
 * User Invite Page
 * 
 * Invite new users to the organisation
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { getOrganisationRoles, getAvailablePermissions } from "../actions";
import { getAllOrganisations } from "@/app/dashboard/system-admin/actions";
import InviteUserForm from "./invite-user-form";

export const dynamic = 'force-dynamic';

export default async function InviteUserPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);
  
  // Get roles for the organisation
  const rolesResult = await getOrganisationRoles();
  const roles = rolesResult.success ? rolesResult.data || [] : [];

  // Get organisations (for super admins)
  let organisations: any[] = [];
  if (context?.isSuperAdmin) {
    const orgsResult = await getAllOrganisations();
    organisations = orgsResult.success ? orgsResult.organisations || [] : [];
  }

  // Get all permissions (for super admins)
  let permissions: any[] = [];
  if (context?.isSuperAdmin) {
    const permsResult = await getAvailablePermissions();
    permissions = permsResult.success ? permsResult.data || [] : [];
  }

  return (
    <ProtectedRoute requiredPermission="users:manage">
      <InviteUserForm 
        roles={roles}
        organisations={organisations}
        permissions={permissions}
        isSuperAdmin={context?.isSuperAdmin || false}
        currentOrganisationId={context?.organisationId || ""}
      />
    </ProtectedRoute>
  );
}
