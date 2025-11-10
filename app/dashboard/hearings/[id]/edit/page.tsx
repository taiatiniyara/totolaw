/**
 * Edit Hearing Page
 * 
 * Form to reschedule or update a hearing
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
import { getHearingById, updateHearing } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditHearingPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function handleSubmit(hearingId: string, formData: FormData) {
  "use server";
  
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = formData.get("location") as string;
  const bailDecision = formData.get("bailDecision") as string;

  if (!dateStr || !timeStr) {
    throw new Error("Missing required fields");
  }

  // Combine date and time
  const dateTime = new Date(`${dateStr}T${timeStr}`);

  const result = await updateHearing(hearingId, {
    date: dateTime,
    location: location || undefined,
    bailDecision: bailDecision || undefined,
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
  
  // Extract date and time from hearing.date
  const hearingDate = new Date(hearing.date);
  const dateValue = hearingDate.toISOString().split('T')[0];
  const timeValue = hearingDate.toTimeString().slice(0, 5);

  return (
    <ProtectedRoute requiredPermission="hearings:update">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/hearings/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <Heading as="h1">Edit Hearing</Heading>
            <p className="text-muted-foreground">
              Reschedule or update hearing details
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Hearing Details</CardTitle>
            <CardDescription>
              Update the hearing information as needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit.bind(null, id)} className="space-y-6">
              {/* Case (readonly) */}
              <div className="space-y-2">
                <Label>Case</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-medium">{hearing.caseTitle}</p>
                  <Link 
                    href={`/dashboard/cases/${hearing.caseId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Case
                  </Link>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={dateValue}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Update the hearing date
                </p>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue={timeValue}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Update the hearing time
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={hearing.location || ""}
                  placeholder="e.g., Courtroom 3, High Court Building"
                />
                <p className="text-xs text-muted-foreground">
                  Specify the hearing location
                </p>
              </div>

              {/* Bail Decision */}
              <div className="space-y-2">
                <Label htmlFor="bailDecision">Bail Decision</Label>
                <Select name="bailDecision" defaultValue={hearing.bailDecision || ""}>
                  <SelectTrigger id="bailDecision">
                    <SelectValue placeholder="Select bail decision (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="granted">Granted</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Update bail decision if applicable
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/dashboard/hearings/${id}`}>Cancel</Link>
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
