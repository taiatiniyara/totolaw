/**
 * Edit Case Page
 * 
 * Form to edit an existing court case with validation and permission checks
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/ui/heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCaseById, updateCase } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditCasePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function handleSubmit(caseId: string, formData: FormData) {
  "use server";
  
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;

  if (!title || !type || !status) {
    throw new Error("Missing required fields");
  }

  const result = await updateCase(caseId, {
    title,
    type,
    status,
  });

  if (result.success) {
    redirect(`/dashboard/cases/${caseId}`);
  } else {
    throw new Error(result.error || "Failed to update case");
  }
}

export default async function EditCasePage({ params }: EditCasePageProps) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const result = await getCaseById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const caseItem = result.data;

  return (
    <ProtectedRoute requiredPermission="cases:update">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/cases/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <Heading as="h1">Edit Case</Heading>
            <p className="text-muted-foreground">
              Update the details for this case
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
            <CardDescription>
              Modify the case information as needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit.bind(null, id)} className="space-y-6">
              {/* Case Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Case Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={caseItem.title}
                  placeholder="e.g., State vs. John Doe"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter a descriptive title for the case
                </p>
              </div>

              {/* Case Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Case Type <span className="text-destructive">*</span>
                </Label>
                <Select name="type" defaultValue={caseItem.type} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="appeal">Appeal</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the type of legal case
                </p>
              </div>

              {/* Case Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select name="status" defaultValue={caseItem.status} required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Update the current status of the case
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/dashboard/cases/${id}`}>Cancel</Link>
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
