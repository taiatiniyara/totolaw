/**
 * Organisations Management Page
 * 
 * Super admin page to view and manage all organisations
 */

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getAllOrganisations } from "../actions";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, CheckCircle, XCircle, ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { OrganisationStatusToggle } from "./organisation-status-toggle";

export default async function OrganisationsPage() {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  const orgsResult = await getAllOrganisations();
  
  if (!orgsResult.success) {
    return <div>Error loading organisations</div>;
  }

  const { organisations } = orgsResult;
  const activeOrgs = organisations.filter((org) => org.isActive);
  const inactiveOrgs = organisations.filter((org) => !org.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/system-admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <Heading as="h1" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Organisations Management
          </Heading>
          <p className="text-muted-foreground mt-1">
            View and manage all organisations in the system
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/system-admin/organisations/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Organisation
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organisations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organisations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrgs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveOrgs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Organisations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Organisations</CardTitle>
          <CardDescription>
            Currently operational organisations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeOrgs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active organisations
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <Building2 className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{org.name}</h3>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {org.code}
                        </Badge>
                        <Badge variant="outline">{org.type}</Badge>
                      </div>
                      {org.description && (
                        <p className="text-sm text-muted-foreground">
                          {org.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(org.createdAt).toLocaleDateString()}</span>
                        {org.updatedAt && (
                          <span>Updated: {new Date(org.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/system-admin/organisations/${org.id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <OrganisationStatusToggle
                      organisationId={org.id}
                      currentStatus={org.isActive}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Organisations */}
      {inactiveOrgs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive Organisations</CardTitle>
            <CardDescription>
              Organisations that have been deactivated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactiveOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <Building2 className="h-6 w-6 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{org.name}</h3>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {org.code}
                        </Badge>
                        <Badge variant="outline">{org.type}</Badge>
                      </div>
                      {org.description && (
                        <p className="text-sm text-muted-foreground">
                          {org.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      <XCircle className="mr-1 h-3 w-3" />
                      Inactive
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/system-admin/organisations/${org.id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <OrganisationStatusToggle
                      organisationId={org.id}
                      currentStatus={org.isActive}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
