/**
 * Create New Case Page
 * 
 * Form to create a new court case with validation and permission checks
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCase } from "../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/cases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Case</h1>
            <p className="text-muted-foreground">
              Enter the details for the new court case
            </p>
          </div>
        </div>

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
              {/* Case Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Case Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
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
                <Select name="type" required>
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
                  Initial Status <span className="text-destructive">*</span>
                </Label>
                <Select name="status" defaultValue="pending" required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Set the initial status of the case
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/cases">Cancel</Link>
                </Button>
                <Button type="submit">Create Case</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
