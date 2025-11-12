/**
 * Schedule New Hearing Page (Enhanced for Fiji Court System)
 * 
 * Form to schedule a new court hearing with action types, courtrooms, and bail tracking
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { HearingFormServer } from "../hearing-form-server";
import { getCases } from "../../cases/actions";
import { getCourtRooms } from "../../settings/courtrooms/actions";
import { createHearing } from "../actions";

async function handleCreateHearing(formData: FormData) {
  "use server";

  const caseId = formData.get("caseId") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const scheduledTime = formData.get("scheduledTime") as string;
  const estimatedDuration = formData.get("estimatedDuration") as string;
  const courtRoomId = formData.get("courtRoomId") as string;
  const location = formData.get("location") as string;
  const actionType = formData.get("actionType") as string;
  const status = formData.get("status") as string;
  const judgeId = formData.get("judgeId") as string;
  const magistrateId = formData.get("magistrateId") as string;
  const clerkId = formData.get("clerkId") as string;
  const bailConsidered = formData.get("bailConsidered") === "on";
  const bailDecision = formData.get("bailDecision") as string;
  const bailAmount = formData.get("bailAmount") as string;
  const bailConditions = formData.get("bailConditions") as string;
  const outcome = formData.get("outcome") as string;
  const nextActionRequired = formData.get("nextActionRequired") as string;
  const notes = formData.get("notes") as string;

  const result = await createHearing({
    caseId,
    scheduledDate: new Date(scheduledDate),
    scheduledTime,
    estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
    courtRoomId: courtRoomId || undefined,
    location: location || undefined,
    actionType,
    status: status || "SCHEDULED",
    judgeId: judgeId || undefined,
    magistrateId: magistrateId || undefined,
    clerkId: clerkId || undefined,
    bailConsidered: bailConsidered || undefined,
    bailDecision: bailDecision || undefined,
    bailAmount: bailAmount ? parseFloat(bailAmount) : undefined,
    bailConditions: bailConditions || undefined,
    outcome: outcome || undefined,
    nextActionRequired: nextActionRequired || undefined,
    notes: notes || undefined,
  });

  if (result.success) {
    redirect("/dashboard/hearings");
  } else {
    throw new Error(result.error || "Failed to create hearing");
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
  const cases = casesResult.success && casesResult.data ? casesResult.data : [];

  // Get all courtrooms for selection
  const courtroomsResult = await getCourtRooms();
  const courtrooms = courtroomsResult.success && courtroomsResult.data ? courtroomsResult.data : [];

  return (
    <ProtectedRoute requiredPermission="hearings:create">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Schedule Hearing"
          description="Set up a new court hearing with comprehensive tracking"
          backButton={{ href: "/dashboard/hearings" }}
        />

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Hearing Details</CardTitle>
            <CardDescription>
              Fill in the required information to schedule a hearing with action types, courtroom assignments, and outcome tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HearingFormServer
              action={handleCreateHearing}
              mode="create"
              cases={cases}
              courtrooms={courtrooms}
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
