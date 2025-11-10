import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import {
  getSystemOverview,
  getSystemAdmins,
  getAllOrganizations,
} from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
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
    getAllOrganizations(),
  ]);

  if (!overviewResult.success || !adminsResult.success || !orgsResult.success) {
    return <div>Error loading dashboard</div>;
  }

  const { overview, currentAdmin } = overviewResult;
  const { admins } = adminsResult;
  const { organizations } = orgsResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h1" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            Super Admin Dashboard
          </Heading>
          <p className="text-muted-foreground mt-1">
            System-wide configuration and management
          </p>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          Super Admin
        </Badge>
      </div>

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
              <span className="text-muted-foreground">Current Organization:</span>{" "}
              <strong>{currentAdmin.currentOrganization}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Linked Organizations:</span>{" "}
              <strong>{currentAdmin.linkedOrganizations}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              {overview.activeOrganizations} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              {overview.activeAdmins} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalRoles}</div>
            <p className="text-xs text-muted-foreground">Across all organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalPermissions}</div>
            <p className="text-xs text-muted-foreground">System permissions</p>
          </CardContent>
        </Card>
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
          <Link href="/dashboard/system-admin/organizations">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Manage Organizations
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

      {/* Recent Organizations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organizations</CardTitle>
              <CardDescription>All registered organizations</CardDescription>
            </div>
            <Link href="/dashboard/system-admin/organizations/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {organizations.slice(0, 5).map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {org.code} • {org.type}
                    </div>
                  </div>
                </div>
                {org.isActive ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    <XCircle className="mr-1 h-3 w-3" />
                    Inactive
                  </Badge>
                )}
              </div>
            ))}
            {organizations.length > 5 && (
              <Link href="/dashboard/system-admin/organizations">
                <Button variant="link" className="w-full">
                  View all {organizations.length} organizations
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
            {admins
              .filter((a) => a.isActive)
              .map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">{admin.name || "Unnamed"}</div>
                      <div className="text-sm text-muted-foreground">
                        {admin.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {admin.userId ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Linked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
