import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import {
  getSystemOverview,
  getSystemAdmins,
  getAllOrganisations,
} from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard, DataRow } from "@/components/common";
import Link from "next/link";
import {
  Shield,
  Users,
  Building2,
  Key,
  Activity,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

export default async function SystemAdminDashboard() {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  const [overviewResult, adminsResult, orgsResult] = await Promise.all([
    getSystemOverview(),
    getSystemAdmins(),
    getAllOrganisations(),
  ]);

  if (!overviewResult.success || !adminsResult.success || !orgsResult.success) {
    return <div>Error loading dashboard</div>;
  }

  const { overview, currentAdmin } = overviewResult;
  const { admins } = adminsResult;
  const { organisations } = orgsResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Super Admin Dashboard"
        description="System-wide configuration and management"
        icon={Shield}
      >
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          Super Admin
        </Badge>
      </PageHeader>

      {/* Current Admin Info */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">Welcome, {currentAdmin.name}</CardTitle>
          <CardDescription>
            Logged in as <strong>{currentAdmin.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current Organisation:</span>{" "}
              <strong>{currentAdmin.currentOrganisation}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Linked Organisations:</span>{" "}
              <strong>{currentAdmin.linkedOrganisations}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Organisations"
          value={overview.totalOrganisations}
          description={`${overview.activeOrganisations} active`}
          icon={Building2}
        />
        <StatCard
          title="System Admins"
          value={overview.totalAdmins}
          description={`${overview.activeAdmins} active`}
          icon={Shield}
        />
        <StatCard
          title="Roles"
          value={overview.totalRoles}
          description="Across all organisations"
          icon={Users}
        />
        <StatCard
          title="Permissions"
          value={overview.totalPermissions}
          description="System permissions"
          icon={Key}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/system-admin/admins">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Manage System Admins
            </Button>
          </Link>
          <Link href="/dashboard/system-admin/organisations">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Manage Organisations
            </Button>
          </Link>
          <Link href="/dashboard/system-admin/roles">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              View Roles & Permissions
            </Button>
          </Link>
          <Link href="/dashboard/system-admin/audit">
            <Button variant="outline" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" />
              View Audit Log
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Organisations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organisations</CardTitle>
              <CardDescription>All registered organisations</CardDescription>
            </div>
            <Link href="/dashboard/system-admin/organisations/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Organisation
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {organisations.slice(0, 5).map((org) => (
              <DataRow
                key={org.id}
                icon={Building2}
                title={org.name}
                subtitle={`${org.code} • ${org.type}`}
                badge={
                  org.isActive
                    ? {
                      label: "Active",
                      variant: "outline",
                      color: "text-green-600 border-green-600",
                    }
                    : {
                      label: "Inactive",
                      variant: "outline",
                      color: "text-red-600 border-red-600",
                    }
                }
              >
                {org.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </DataRow>
            ))}
            {organisations.length > 5 && (
              <Link href="/dashboard/system-admin/organisations">
                <Button variant="link" className="w-full">
                  View all {organisations.length} organisations
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active System Admins */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Administrators</CardTitle>
              <CardDescription>Super admin team members</CardDescription>
            </div>
            <Link href="/dashboard/system-admin/admins">
              <Button size="sm" variant="outline">
                Manage Team
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {admins.map((admin) => (
              <DataRow
                key={admin.id}
                icon={Shield}
                title={admin.name || "Unnamed"}
                subtitle={admin.email}
                badge={{
                  label: "Active",
                  variant: "outline",
                  color: "text-green-600 border-green-600",
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
