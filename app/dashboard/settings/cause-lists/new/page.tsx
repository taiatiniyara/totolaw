/**
 * Generate Daily Cause List Page
 * 
 * Form to generate a new daily cause list from scheduled hearings
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { FormField, FormActions } from "@/components/forms";
import { generateDailyCauseList } from "../actions";
import { getCourtRooms } from "../../courtrooms/actions";

async function handleSubmit(formData: FormData) {
  "use server";

  const dateStr = formData.get("date") as string;
  const courtRoomId = formData.get("courtRoomId") as string;
  const judgeId = formData.get("judgeId") as string;

  if (!dateStr) {
    throw new Error("Date is required");
  }

  const result = await generateDailyCauseList({
    date: new Date(dateStr),
    courtRoomId: courtRoomId || undefined,
    judgeId: judgeId || undefined,
  });

  if (result.success) {
    redirect("/dashboard/settings/cause-lists");
  } else {
    throw new Error(result.error || "Failed to generate cause list");
  }
}

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
    <ProtectedRoute requiredPermission="hearings:read">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Generate Daily Cause List"
          description="Create a new daily court schedule from scheduled hearings"
          backButton={{ href: "/dashboard/settings/cause-lists" }}
        />

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Cause List Parameters</CardTitle>
            <CardDescription>
              Select the date and optional filters for the cause list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              <FormField
                label="Date"
                name="date"
                type="date"
                required
                helpText="Select the date for the cause list"
                min={new Date().toISOString().split("T")[0]}
              />

              {courtrooms && courtrooms.length > 0 && (
                <FormField
                  label="Courtroom (Optional)"
                  name="courtRoomId"
                  type="select"
                  placeholder="All courtrooms"
                  helpText="Filter by specific courtroom, or leave empty for all courtrooms"
                  options={courtrooms.map((cr: any) => ({
                    value: cr.id,
                    label: `${cr.name} - ${cr.code} (${cr.courtLevel})`,
                  }))}
                />
              )}

              <FormField
                label="Judge (Optional)"
                name="judgeId"
                placeholder="Judge ID or name"
                helpText="Filter by assigned judge, or leave empty for all judges"
              />

              <div className="rounded-md bg-muted p-4">
                <h4 className="text-sm font-medium mb-2">Note</h4>
                <p className="text-sm text-muted-foreground">
                  The cause list will be generated from all hearings scheduled for the
                  selected date. Apply filters to narrow down the list by courtroom or
                  judge. The generated list will be in DRAFT status and can be edited
                  before publishing.
                </p>
              </div>

              <FormActions
                cancelHref="/dashboard/settings/cause-lists"
                submitLabel="Generate Cause List"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
