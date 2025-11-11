/**
 * Roles & Permissions Page
 * 
 * Super admin page to view all roles and permissions across organisations
 */

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getRolesAndPermissions, getAllOrganisations } from "../actions";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Key, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function RolesAndPermissionsPage() {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  const [rolesResult, orgsResult] = await Promise.all([
    getRolesAndPermissions(),
    getAllOrganisations(),
  ]);

  if (!rolesResult.success || !orgsResult.success) {
    return <div>Error loading data</div>;
  }

  const { roles, rolesByOrg, permissions, permissionsByResource } = rolesResult;
  const { organisations } = orgsResult;

  // Create org lookup map
  const orgMap = new Map(organisations.map((org) => [org.id, org]));

  // Group permissions by action
  const permissionsByAction = permissions.reduce((acc, perm) => {
    if (!acc[perm.action]) acc[perm.action] = [];
    acc[perm.action].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

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
            <Shield className="h-8 w-8 text-purple-600" />
            Roles & Permissions
          </Heading>
          <p className="text-muted-foreground mt-1">
            System-wide role and permission configuration
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(rolesByOrg).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
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
      </div>

      {/* Roles by Organisation */}
      <Card>
        <CardHeader>
          <CardTitle>Roles by Organisation</CardTitle>
          <CardDescription>
            View all roles configured in each organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(rolesByOrg).map(([orgId, orgRoles]) => {
              const org = orgMap.get(orgId);
              return (
                <AccordionItem key={orgId} value={orgId}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{orgRoles.length} roles</Badge>
                      <span className="font-semibold">
                        {org?.name || "Unknown Organisation"}
                      </span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {org?.code || orgId}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 pt-3">
                      {orgRoles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{role.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {role.slug}
                              </Badge>
                            </div>
                            {role.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {role.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Permissions by Resource */}
      <Card>
        <CardHeader>
          <CardTitle>System Permissions</CardTitle>
          <CardDescription>
            All permissions available in the system, grouped by resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(permissionsByResource).map(([resource, resourcePerms]) => (
              <AccordionItem key={resource} value={resource}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{resourcePerms.length} permissions</Badge>
                    <span className="font-semibold capitalize">{resource}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 pt-3">
                    {resourcePerms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <Key className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{perm.slug}</span>
                            <Badge variant="outline" className="text-xs">
                              {perm.action}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {perm.resource}
                            </Badge>
                          </div>
                          {perm.description && (
                            <p className="text-sm text-muted-foreground mt-1">
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
            View permissions grouped by CRUD actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(permissionsByAction).map(([action, actionPerms]) => (
              <div key={action} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>{actionPerms.length}</Badge>
                  <h3 className="font-semibold capitalize">{action}</h3>
                </div>
                <div className="space-y-1">
                  {actionPerms.map((perm) => (
                    <div
                      key={perm.id}
                      className="text-sm p-2 border rounded bg-muted/50"
                    >
                      <span className="font-mono text-xs">{perm.slug}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
