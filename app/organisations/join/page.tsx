/**
 * Join Organisation Page
 * 
 * Browse organisations and request to join them
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllOrganisations } from "@/app/dashboard/system-admin/actions";
import { getMyJoinRequests } from "@/app/dashboard/users/requests/actions";
import { getUserOrganisations } from "@/lib/services/tenant.service";
import JoinOrganisationClient from "./join-organisation-client";

export const dynamic = 'force-dynamic';

export default async function JoinOrganisationPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get all active organisations
  const orgsResult = await getAllOrganisations();
  const organisations = orgsResult.success 
    ? (orgsResult.organisations || []).filter((org: any) => org.isActive)
    : [];

  // Get user's join requests
  const requestsResult = await getMyJoinRequests();
  const myRequests = requestsResult.success ? requestsResult.data || [] : [];

  // Get user's current organisations
  const userOrgs = await getUserOrganisations(session.user.id);

  return (
    <JoinOrganisationClient
      organisations={organisations}
      myRequests={myRequests}
      userOrganisations={userOrgs}
    />
  );
}
