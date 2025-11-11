import { Metadata } from "next";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getOrganizationById, getAllOrganizations } from "../../../actions";
import { PageHeader } from "@/components/common/page-header";
import { EditOrganizationForm } from "./edit-organization-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Edit Organization | System Admin",
  description: "Edit organization details",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditOrganizationPage({ params }: PageProps) {
  // Require super admin access
  await requireSuperAdmin();

  // Await params (Next.js 15+)
  const { id } = await params;

  // Fetch the organization
  const orgResult = await getOrganizationById(id);
  
  if (orgResult.error || !orgResult.organization) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/system-admin/organizations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Organizations
            </Link>
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {orgResult.error || "Organization not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch all organizations for parent selection
  const orgsResult = await getAllOrganizations();
  const organizations = orgsResult.success ? orgsResult.organizations : [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/system-admin/organizations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Edit Organization"
        description={`Update details for ${orgResult.organization.name}`}
      />

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Update the organization&apos;s information. Note that the organization code cannot be changed after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditOrganizationForm
            organization={orgResult.organization}
            organizations={organizations}
          />
        </CardContent>
      </Card>
    </div>
  );
}
