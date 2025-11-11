/**
 * User Detail Page
 * 
 * View and manage individual user details and roles
 */

export const dynamic = 'force-dynamic';

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { hasPermission } from "@/lib/services/authorization.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserById } from "../actions";
import { getUserRoles } from "@/lib/services/authorization.service";
import { ManageUserRolesDialog } from "@/components/auth/manage-user-roles-dialog";
import { ArrowLeft, Mail, User, Shield, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
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
    "roles:assign",
    context.isSuperAdmin
  );

  const { id } = await params;
  const result = await getUserById(id);

  if (!result.success || !result.data) {
    if (result.error === "User not found" || result.error === "User not in organisation") {
      notFound();
    }
    return (
      <ProtectedRoute requiredPermission="users:read">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">{result.error}</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const user = result.data;
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  // Get detailed role information
  const userRolesData = await getUserRoles(user.id, context.organisationId);

  return (
    <ProtectedRoute requiredPermission="users:read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <Heading as="h1">User Details</Heading>
            <p className="text-muted-foreground">View user information and roles</p>
          </div>
          {canManageRoles && (
            <ManageUserRolesDialog
              userId={user.id}
              userName={user.name || user.email}
              organisationId={context.organisationId}
              variant="default"
            />
          )}
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name || "Unnamed User"}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Roles Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>
                  Roles assigned to this user in the current organisation
                </CardDescription>
              </div>
              {canManageRoles && userRolesData.length > 0 && (
                <ManageUserRolesDialog
                  userId={user.id}
                  userName={user.name || user.email}
                  organisationId={context.organisationId}
                  variant="outline"
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {userRolesData.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Roles Assigned</h3>
                <p className="text-muted-foreground mb-4">
                  This user doesn't have any roles assigned yet
                </p>
                {canManageRoles && (
                  <ManageUserRolesDialog
                    userId={user.id}
                    userName={user.name || user.email}
                    organisationId={context.organisationId}
                    variant="default"
                  />
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {userRolesData.map(({ role, userRole }) => (
                  <div
                    key={userRole.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{role.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {role.slug}
                        </Badge>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      {role.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {role.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Assigned {new Date(userRole.assignedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {userRole.expiresAt && (
                          <div>
                            Expires {new Date(userRole.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
                <dd className="mt-1 font-mono text-sm">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="mt-1">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Display Name</dt>
                <dd className="mt-1">{user.name || "Not set"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
