/**
 * Create Organization Page
 * 
 * Super admin page to create new organizations
 */

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getAllOrganizations } from "../../actions";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateOrganizationForm } from "./create-organization-form";

export default async function NewOrganizationPage() {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  // Get existing organizations for parent selection
  const orgsResult = await getAllOrganizations();
  const organizations = orgsResult.success ? orgsResult.organizations : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/system-admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Create New Organization
          </Heading>
          <p className="text-muted-foreground mt-1">
            Add a new organization to the system
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Enter the information for the new organization. The organization code must be unique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm organizations={organizations} />
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>What happens after creating an organization?</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>The organization will be created with a unique code</li>
              <li>Standard roles will be automatically set up (Judge, Magistrate, Clerk, etc.)</li>
              <li>Standard permissions will be assigned to each role</li>
              <li>You can then add users and assign them to roles</li>
              <li>Organization admins can manage their organization settings</li>
            </ul>
          </div>
          <div>
            <strong>Organization Types:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li><strong>Court:</strong> Judicial court systems (High Court, Magistrates Court, etc.)</li>
              <li><strong>Tribunal:</strong> Specialized tribunals (Employment Tribunal, Land Court, etc.)</li>
              <li><strong>Commission:</strong> Legal commissions and inquiry bodies</li>
              <li><strong>Registry:</strong> Court registries and administrative offices</li>
              <li><strong>Department:</strong> Government legal departments</li>
              <li><strong>Other:</strong> Other legal entities</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
