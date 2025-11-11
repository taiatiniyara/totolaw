import { Metadata } from "next";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getOrganisationById, getAllOrganisations } from "../../../actions";
import { PageHeader } from "@/components/common/page-header";
import { EditOrganisationForm } from "./edit-organisation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Edit Organisation | System Admin",
  description: "Edit organisation details",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditOrganisationPage({ params }: PageProps) {
  // Require super admin access
  await requireSuperAdmin();

  // Await params (Next.js 15+)
  const { id } = await params;

  // Fetch the organisation
  const orgResult = await getOrganisationById(id);
  
  if (orgResult.error || !orgResult.organisation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/system-admin/organisations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Organisations
            </Link>
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {orgResult.error || "Organisation not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch all organisations for parent selection
  const orgsResult = await getAllOrganisations();
  const organisations = orgsResult.success ? orgsResult.organisations : [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/system-admin/organisations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organisations
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Edit Organisation"
        description={`Update details for ${orgResult.organisation.name}`}
      />

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Organisation Details</CardTitle>
          <CardDescription>
            Update the organisation&apos;s information. Note that the organisation code cannot be changed after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditOrganisationForm
            organisation={orgResult.organisation}
            organisations={organisations}
          />
        </CardContent>
      </Card>
    </div>
  );
}
