/**
 * Roles Management Page
 * 
 * Manage roles and their permissions within the organisation
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { getOrganisationRoles, getAllPermissions } from "../actions";
import { PageHeader } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Settings } from "lucide-react";
import { RoleCard } from "./role-card";
import { CreateRoleDialog } from "./create-role-dialog";

export default async function RolesPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context) {
    redirect("/dashboard/no-organisation");
  }

  // Check if user can manage roles
  const canManageRoles = await hasPermission(
    session.user.id,
    context.organisationId,
    "roles:create",
    context.isSuperAdmin
  );

  const [rolesResult, permissionsResult] = await Promise.all([
    getOrganisationRoles(),
    getAllPermissions(),
  ]);

  if (!rolesResult.success || !permissionsResult.success) {
    return <div>Error loading roles and permissions</div>;
  }

  const { roles } = rolesResult;
  const { permissions, permissionsByResource } = permissionsResult;

  // Separate system and custom roles
  const systemRoles = roles.filter(r => r.isSystem);
  const customRoles = roles.filter(r => !r.isSystem);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Roles & Permissions"
        description="Manage roles and their permissions within your organisation"
      >
        {canManageRoles && (
          <CreateRoleDialog 
            permissions={permissions}
            permissionsByResource={permissionsByResource}
          />
        )}
      </PageHeader>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {systemRoles.length} system, {customRoles.length} custom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Object.keys(permissionsByResource).length} resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Access</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {canManageRoles ? "Admin" : "User"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {canManageRoles ? "Can manage roles" : "View only"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Roles */}
      {systemRoles.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              System Roles
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Built-in roles managed by the system
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {systemRoles.map((role) => (
              <RoleCard 
                key={role.id} 
                role={role} 
                canManage={false}
                permissions={permissions}
                permissionsByResource={permissionsByResource}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Roles */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Custom Roles
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Roles created for your organisation
          </p>
        </div>

        {customRoles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Custom Roles</h3>
              <p className="text-muted-foreground mb-4">
                Create custom roles to define specific permissions for your team
              </p>
              {canManageRoles && (
                <CreateRoleDialog 
                  permissions={permissions}
                  permissionsByResource={permissionsByResource}
                  variant="default"
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {customRoles.map((role) => (
              <RoleCard 
                key={role.id} 
                role={role} 
                canManage={canManageRoles}
                permissions={permissions}
                permissionsByResource={permissionsByResource}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
