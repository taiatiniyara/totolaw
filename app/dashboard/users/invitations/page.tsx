/**
 * User Invitations Page
 * 
 * List and manage pending user invitations
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { getInvitations } from "../actions";
import InvitationsClient from "./invitations-client";

export const dynamic = 'force-dynamic';

export default async function InvitationsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);
  
  // Get all invitations
  const result = await getInvitations();
  const invitations = result.success ? result.data || [] : [];

  return (
    <ProtectedRoute requiredPermission="users:read">
      <InvitationsClient 
        invitations={invitations}
        isSuperAdmin={context?.isSuperAdmin || false}
      />
    </ProtectedRoute>
  );
}
