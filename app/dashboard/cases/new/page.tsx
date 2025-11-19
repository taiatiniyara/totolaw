/**
 * Create New Case Page (Enhanced for Fiji Court System)
 * 
 * Form to create a new court case with court level, parties, and offences
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/common";
import { createCase, getCourtOrganisations } from "../actions";
import { getManagedListOptions } from "@/app/dashboard/settings/managed-lists/actions";
import { CaseForm } from "./case-form";

async function handleSubmit(formData: FormData) {
  "use server";
  
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const courtLevel = formData.get("courtLevel") as string;
  const caseType = formData.get("caseType") as string;
  const status = formData.get("status") as string;

  // Parse parties JSON
  const partiesJson = formData.get("parties") as string;
  let parties;
  try {
    parties = JSON.parse(partiesJson || "{}");
  } catch {
    parties = {};
  }

  // Parse offences
  const offencesStr = formData.get("offences") as string;
  const offences = offencesStr ? offencesStr.split(",").map((o: string) => o.trim()).filter(Boolean) : [];

  const assignedJudgeId = formData.get("assignedJudgeId") as string;

  if (!title || !type || !courtLevel) {
    throw new Error("Missing required fields");
  }

  const result = await createCase({
    title,
    type,
    courtLevel,
    caseType: caseType || undefined,
    status,
    parties,
    offences: offences.length > 0 ? offences : undefined,
    assignedJudgeId: assignedJudgeId || undefined,
  });

  if (result.success) {
    redirect("/dashboard/cases");
  } else {
    throw new Error(result.error || "Failed to create case");
  }
}

export default async function NewCasePage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const courtsResult = await getCourtOrganisations();
  const courts = courtsResult.success ? courtsResult.data : [];

  // Fetch managed lists
  const [courtLevelsResult, caseTypesResult, caseStatusesResult, offenseTypesResult] = await Promise.all([
    getManagedListOptions("court_levels"),
    getManagedListOptions("case_types"),
    getManagedListOptions("case_statuses"),
    getManagedListOptions("offense_types"),
  ]);

  const courtLevels = courtLevelsResult.data || [];
  const caseTypes = caseTypesResult.data || [];
  const caseStatuses = caseStatusesResult.data || [];
  const offenseTypes = offenseTypesResult.data || [];

  return (
    <ProtectedRoute requiredPermission="cases:create">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Create New Case"
          description="Enter the details for the new court case"
          backButton={{ href: "/dashboard/cases" }}
        />

        {/* Form */}
        <form action={handleSubmit}>
          <CaseForm 
            courts={courts || []} 
            courtLevels={courtLevels}
            caseTypes={caseTypes}
            caseStatuses={caseStatuses}
            offenseTypes={offenseTypes}
          />
        </form>
      </div>
    </ProtectedRoute>
  );
}
