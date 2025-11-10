/**
 * Schedule New Hearing Page
 * 
 * Form to schedule a new court hearing
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/ui/heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createHearing } from "../actions";
import { getCases } from "../../cases/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/hearings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <Heading as="h1">Schedule Hearing</Heading>
            <p className="text-muted-foreground">
              Set up a new court hearing for a case
            </p>
          </div>
        </div>

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
              {/* Case Selection */}
              <div className="space-y-2">
                <Label htmlFor="caseId">
                  Case <span className="text-destructive">*</span>
                </Label>
                {cases && cases.length > 0 ? (
                  <Select name="caseId" required>
                    <SelectTrigger id="caseId">
                      <SelectValue placeholder="Select a case" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No cases available. <Link href="/dashboard/cases/new" className="text-primary hover:underline">Create a case first</Link>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Select the case for this hearing
                </p>
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
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Select the hearing date
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
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Select the hearing time
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Courtroom 3, High Court Building"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Specify the hearing location
                </p>
              </div>

              {/* Bail Decision */}
              <div className="space-y-2">
                <Label htmlFor="bailDecision">Bail Decision</Label>
                <Select name="bailDecision">
                  <SelectTrigger id="bailDecision">
                    <SelectValue placeholder="Select bail decision (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="granted">Granted</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Optional: Record bail decision if applicable
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/hearings">Cancel</Link>
                </Button>
                <Button type="submit" disabled={!cases || cases.length === 0}>
                  Schedule Hearing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
