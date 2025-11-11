/**
 * Permissions Reference Page
 * 
 * View all available permissions in the system
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { getAllPermissions } from "../actions";
import { PageHeader } from "@/components/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PermissionsSearch } from "./permissions-search";

export default async function PermissionsPage() {
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

  const permissionsResult = await getAllPermissions();

  if (!permissionsResult.success) {
    return <div>Error loading permissions</div>;
  }

  const { permissions, permissionsByResource } = permissionsResult;

  // Group permissions by action
  const permissionsByAction = permissions.reduce((acc, perm) => {
    if (!acc[perm.action]) {
      acc[perm.action] = [];
    }
    acc[perm.action].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const actionColors: Record<string, string> = {
    create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    read: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "read-all": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "read-own": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    update: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    assign: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    revoke: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    manage: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="System Permissions"
        description="Reference for all available permissions in the system"
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(permissionsByResource).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Types</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(permissionsByAction).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <PermissionsSearch 
        permissions={permissions}
        permissionsByResource={permissionsByResource}
        actionColors={actionColors}
      />

      {/* Permissions by Resource */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions by Resource</CardTitle>
          <CardDescription>
            All permissions grouped by the resource they control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(permissionsByResource)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([resource, resourcePerms]) => (
                <AccordionItem key={resource} value={resource}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{resourcePerms.length}</Badge>
                      <span className="font-semibold capitalize">{resource}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-3">
                      {resourcePerms
                        .sort((a, b) => a.action.localeCompare(b.action))
                        .map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <Key className="h-4 w-4 text-muted-foreground mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {perm.slug}
                                </code>
                                <Badge 
                                  variant="secondary"
                                  className={actionColors[perm.action] || ""}
                                >
                                  {perm.action}
                                </Badge>
                                {perm.isSystem && (
                                  <Badge variant="outline">System</Badge>
                                )}
                              </div>
                              {perm.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {perm.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Permissions by Action */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions by Action Type</CardTitle>
          <CardDescription>
            View permissions grouped by CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(permissionsByAction)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([action, actionPerms]) => (
                <div key={action} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={actionColors[action] || ""}>
                      {actionPerms.length}
                    </Badge>
                    <h3 className="font-semibold capitalize">{action}</h3>
                  </div>
                  <div className="space-y-1">
                    {actionPerms
                      .sort((a, b) => a.resource.localeCompare(b.resource))
                      .map((perm) => (
                        <div
                          key={perm.id}
                          className="text-sm p-2 border rounded bg-muted/30"
                        >
                          <code className="font-mono text-xs">{perm.slug}</code>
                          {perm.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {perm.description}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Format Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Format</CardTitle>
          <CardDescription>
            Understanding permission structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Format</h4>
            <code className="text-sm bg-muted px-3 py-2 rounded block">
              resource:action
            </code>
            <p className="text-sm text-muted-foreground mt-2">
              Permissions follow the <code>resource:action</code> format, where
              <strong> resource</strong> is the entity being accessed and
              <strong> action</strong> is the operation being performed.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Examples</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-1 rounded">
                  cases:create
                </code>
                <span className="text-sm text-muted-foreground">
                  → Create new cases
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-1 rounded">
                  users:manage
                </code>
                <span className="text-sm text-muted-foreground">
                  → Manage user accounts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-1 rounded">
                  evidence:submit
                </code>
                <span className="text-sm text-muted-foreground">
                  → Submit evidence
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common Actions</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(permissionsByAction)
                .sort()
                .map((action) => (
                  <Badge 
                    key={action}
                    variant="outline"
                    className={actionColors[action] || ""}
                  >
                    {action}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
