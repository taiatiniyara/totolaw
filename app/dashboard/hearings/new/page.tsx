/**
 * Schedule New Hearing Page
 * 
 * Form to schedule a new court hearing
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

async function handleSubmit(formData: FormData) {
  "use server";
  
  const caseId = formData.get("caseId") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = formData.get("location") as string;
  const bailDecision = formData.get("bailDecision") as string;

  if (!caseId || !dateStr || !timeStr) {
    throw new Error("Missing required fields");
  }

  // Combine date and time
  const dateTime = new Date(`${dateStr}T${timeStr}`);

  const result = await createHearing({
    caseId,
    date: dateTime,
    location: location || undefined,
    bailDecision: bailDecision || undefined,
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

                  <FormField
                    label="Date"
                    name="date"
                    type="date"
                    required
                    helpText="Select the hearing date"
                    min={new Date().toISOString().split('T')[0]}
                  />

                  <FormField
                    label="Time"
                    name="time"
                    type="time"
                    required
                    helpText="Select the hearing time"
                  />

                  <FormField
                    label="Location"
                    name="location"
                    placeholder="e.g., Courtroom 3, High Court Building"
                    helpText="Optional: Specify the hearing location"
                  />

                  <FormField
                    label="Bail Decision"
                    name="bailDecision"
                    type="select"
                    placeholder="Select bail decision (optional)"
                    helpText="Optional: Record bail decision if applicable"
                    options={[
                      { value: "granted", label: "Granted" },
                      { value: "denied", label: "Denied" },
                      { value: "pending", label: "Pending" },
                      { value: "not-applicable", label: "Not Applicable" },
                    ]}
                  />

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
