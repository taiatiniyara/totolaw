/**
 * Create New Case Page
 * 
 * Form to create a new court case with validation and permission checks
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { FormField, FormActions } from "@/components/forms";
import { createCase } from "../actions";

async function handleSubmit(formData: FormData) {
  "use server";
  
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;

  if (!title || !type || !status) {
    throw new Error("Missing required fields");
  }

  const result = await createCase({
    title,
    type,
    status,
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
        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
            <CardDescription>
              Fill in the required information to create a new case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              <FormField
                label="Case Title"
                name="title"
                placeholder="e.g., State vs. John Doe"
                required
                helpText="Enter a descriptive title for the case"
              />

              <FormField
                label="Case Type"
                name="type"
                type="select"
                placeholder="Select case type"
                required
                helpText="Select the type of legal case"
                options={[
                  { value: "criminal", label: "Criminal" },
                  { value: "civil", label: "Civil" },
                  { value: "family", label: "Family" },
                  { value: "traffic", label: "Traffic" },
                  { value: "administrative", label: "Administrative" },
                  { value: "appeal", label: "Appeal" },
                ]}
              />

              <FormField
                label="Initial Status"
                name="status"
                type="select"
                placeholder="Select status"
                required
                defaultValue="pending"
                helpText="Set the initial status of the case"
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "active", label: "Active" },
                  { value: "under-review", label: "Under Review" },
                ]}
              />

              <FormActions
                cancelHref="/dashboard/cases"
                submitLabel="Create Case"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
