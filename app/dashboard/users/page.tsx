/**
 * Users Management Page
 * 
 * Admin interface to view and manage organization users
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUsersForOrganization } from "./actions";
import { Plus, Users as UsersIcon, Mail } from "lucide-react";

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const result = await getUsersForOrganization();

  return (
    <ProtectedRoute requiredPermission="users:read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage organization members and roles
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/users/invite">
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Link>
          </Button>
        </div>

        {/* Users List */}
        {!result.success ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">{result.error}</p>
            </CardContent>
          </Card>
        ) : result.data && result.data.length > 0 ? (
          <div className="grid gap-4">
            {result.data.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <UsersIcon className="h-5 w-5" />
                        {user.name || user.email}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/users/${user.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No roles assigned</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invite team members to your organization
              </p>
              <Button asChild>
                <Link href="/dashboard/users/invite">
                  <Plus className="mr-2 h-4 w-4" />
                  Invite User
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
