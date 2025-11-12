/**
 * Edit Hearing Page
 * 
 * Form to reschedule or update a hearing with comprehensive Fiji court tracking
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { HearingFormServer } from "../../hearing-form-server";
import { getHearingById, updateHearing } from "../../actions";
import { getCases } from "../../../cases/actions";
import { getCourtRooms } from "../../../settings/courtrooms/actions";

interface EditHearingPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function handleUpdateHearing(hearingId: string, formData: FormData) {
  "use server";

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

  const result = await updateHearing(hearingId, {
    scheduledDate: new Date(scheduledDate),
    scheduledTime,
    estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
    courtRoomId: courtRoomId || undefined,
    location: location || undefined,
    actionType,
    status,
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
    redirect(`/dashboard/hearings/${hearingId}`);
  } else {
    throw new Error(result.error || "Failed to update hearing");
  }
}

export default async function EditHearingPage({ params }: EditHearingPageProps) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const result = await getHearingById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const hearing = result.data;
  
  // Get all cases for selection
  const casesResult = await getCases({ limit: 100 });
  const cases = casesResult.success && casesResult.data ? casesResult.data : [];

  // Get all courtrooms for selection
  const courtroomsResult = await getCourtRooms();
  const courtrooms = courtroomsResult.success && courtroomsResult.data ? courtroomsResult.data : [];

  // Prepare initial form data
  const initialData = {
    caseId: hearing.caseId,
    scheduledDate: new Date(hearing.scheduledDate).toISOString().split('T')[0],
    scheduledTime: hearing.scheduledTime,
    estimatedDuration: hearing.estimatedDuration,
    courtRoomId: hearing.courtRoomId,
    location: hearing.location,
    actionType: hearing.actionType,
    status: hearing.status,
    judgeId: hearing.judgeId,
    magistrateId: hearing.magistrateId,
    clerkId: hearing.clerkId,
    bailConsidered: hearing.bailConsidered,
    bailDecision: hearing.bailDecision,
    bailAmount: hearing.bailAmount,
    bailConditions: hearing.bailConditions,
    outcome: hearing.outcome,
    nextActionRequired: hearing.nextActionRequired,
    notes: hearing.notes,
  };

  return (
    <ProtectedRoute requiredPermission="hearings:update">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Edit Hearing"
          description={`Update hearing details for ${hearing.caseTitle}`}
          backButton={{ href: `/dashboard/hearings/${id}` }}
        />

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Hearing Details</CardTitle>
            <CardDescription>
              Update the hearing information including action types, outcomes, and bail decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HearingFormServer
              action={handleUpdateHearing.bind(null, id)}
              mode="edit"
              initialData={initialData}
              cases={cases}
              courtrooms={courtrooms}
              cancelHref={`/dashboard/hearings/${id}`}
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
