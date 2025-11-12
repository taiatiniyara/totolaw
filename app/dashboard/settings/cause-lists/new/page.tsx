/**
 * Generate Daily Cause List Page
 * 
 * Form to generate a new daily cause list from scheduled hearings
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/common";
import { getCourtRooms } from "../../courtrooms/actions";
import { CauseListForm } from "./cause-list-form";

export default async function NewCauseListPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get courtrooms for selection
  const courtroomsResult = await getCourtRooms();
  const courtrooms = courtroomsResult.success ? courtroomsResult.data : [];

  return (
    <ProtectedRoute requiredPermission="hearings:manage">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Generate Daily Cause List"
          description="Create a new daily court schedule from scheduled hearings"
          backButton={{ href: "/dashboard/settings/cause-lists" }}
        />

        {/* Form */}
        <CauseListForm courtrooms={courtrooms || []} />
      </div>
    </ProtectedRoute>
  );
}
