/**
 * Schedule New Hearing Page (Enhanced for Fiji Court System)
 * 
 * Form to schedule a new court hearing with action types, courtrooms, and bail tracking
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { FormField, FormActions } from "@/components/forms";
import { createHearing } from "../actions";
import { getCases } from "../../cases/actions";
import { getCourtRooms } from "../../settings/courtrooms/actions";

async function handleSubmit(formData: FormData) {
  "use server";
  
  const caseId = formData.get("caseId") as string;
  const dateStr = formData.get("scheduledDate") as string;
  const timeStr = formData.get("scheduledTime") as string;
  const actionType = formData.get("actionType") as string;
  const courtRoomId = formData.get("courtRoomId") as string;
  const status = formData.get("status") as string;
  const bailConsidered = formData.get("bailConsidered") === "on";
  const bailDecision = formData.get("bailDecision") as string;
  const bailAmount = formData.get("bailAmount") as string;
  const bailConditions = formData.get("bailConditions") as string;

  if (!caseId || !dateStr || !actionType) {
    throw new Error("Missing required fields");
  }

  const result = await createHearing({
    caseId,
    scheduledDate: new Date(dateStr),
    scheduledTime: timeStr ? timeStr : undefined,
    actionType,
    courtRoomId: courtRoomId || undefined,
    status: status || "SCHEDULED",
    bailConsidered: bailConsidered || undefined,
    bailDecision: bailDecision || undefined,
    bailAmount: bailAmount ? parseFloat(bailAmount) : undefined,
    bailConditions: bailConditions || undefined,
  });

  if (result.success) {
    redirect("/dashboard/hearings");
  } else {
    throw new Error(result.error || "Failed to schedule hearing");
  }
}

export default async function NewHearingPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get all cases for selection
  const casesResult = await getCases({ limit: 100 });
  const cases = casesResult.success ? casesResult.data : [];

  // Get all courtrooms for selection
  const courtroomsResult = await getCourtRooms();
  const courtrooms = courtroomsResult.success ? courtroomsResult.data : [];

  return (
    <ProtectedRoute requiredPermission="hearings:create">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Schedule Hearing"
          description="Set up a new court hearing for a case"
          backButton={{ href: "/dashboard/hearings" }}
        />

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Hearing Details</CardTitle>
            <CardDescription>
              Fill in the required information to schedule a hearing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              {cases && cases.length > 0 ? (
                <>
                  <FormField
                    label="Case"
                    name="caseId"
                    type="select"
                    placeholder="Select a case"
                    required
                    helpText="Select the case for this hearing"
                    options={cases.map((c) => ({ value: c.id, label: c.title }))}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Date"
                      name="scheduledDate"
                      type="date"
                      required
                      helpText="Select the hearing date"
                      min={new Date().toISOString().split('T')[0]}
                    />

                    <FormField
                      label="Time"
                      name="scheduledTime"
                      type="time"
                      helpText="Select the hearing time"
                    />
                  </div>

                  <FormField
                    label="Action Type"
                    name="actionType"
                    type="select"
                    placeholder="Select action type"
                    required
                    helpText="Select the type of hearing action"
                    options={[
                      { value: "MENTION", label: "Mention" },
                      { value: "TRIAL", label: "Trial" },
                      { value: "RULING", label: "Ruling" },
                      { value: "SENTENCING", label: "Sentencing" },
                      { value: "BAIL_APPLICATION", label: "Bail Application" },
                      { value: "PRE_TRIAL", label: "Pre-Trial Conference" },
                      { value: "CASE_CONFERENCE", label: "Case Conference" },
                      { value: "VOIR_DIRE", label: "Voir Dire" },
                      { value: "OTHER", label: "Other" },
                    ]}
                  />

                  {courtrooms && courtrooms.length > 0 && (
                    <FormField
                      label="Courtroom"
                      name="courtRoomId"
                      type="select"
                      placeholder="Select courtroom (optional)"
                      helpText="Optional: Assign a specific courtroom"
                      options={courtrooms.map((cr) => ({ 
                        value: cr.id, 
                        label: `${cr.name} - ${cr.code} (${cr.courtLevel})` 
                      }))}
                    />
                  )}

                  <FormField
                    label="Status"
                    name="status"
                    type="select"
                    placeholder="Select status"
                    defaultValue="SCHEDULED"
                    helpText="Set the initial status"
                    options={[
                      { value: "SCHEDULED", label: "Scheduled" },
                      { value: "ADJOURNED", label: "Adjourned" },
                      { value: "COMPLETED", label: "Completed" },
                      { value: "CANCELLED", label: "Cancelled" },
                    ]}
                  />

                  {/* Bail Section */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium">Bail Considerations</h3>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="bailConsidered"
                        name="bailConsidered"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="bailConsidered" className="text-sm font-medium">
                        Bail will be considered at this hearing
                      </label>
                    </div>

                    <FormField
                      label="Bail Decision"
                      name="bailDecision"
                      type="select"
                      placeholder="Select bail decision (optional)"
                      helpText="Optional: Record bail decision if already known"
                      options={[
                        { value: "GRANTED", label: "Granted" },
                        { value: "DENIED", label: "Denied" },
                        { value: "PENDING", label: "Pending" },
                        { value: "NOT_APPLICABLE", label: "Not Applicable" },
                      ]}
                    />

                    <FormField
                      label="Bail Amount"
                      name="bailAmount"
                      type="number"
                      placeholder="e.g., 5000"
                      helpText="Optional: Bail amount in FJD"
                    />

                    <FormField
                      label="Bail Conditions"
                      name="bailConditions"
                      type="textarea"
                      placeholder="Enter any bail conditions..."
                      helpText="Optional: Record any specific bail conditions"
                    />
                  </div>

                  <FormActions
                    cancelHref="/dashboard/hearings"
                    submitLabel="Schedule Hearing"
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    No cases available.{" "}
                    <Link href="/dashboard/cases/new" className="text-primary hover:underline">
                      Create a case first
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
