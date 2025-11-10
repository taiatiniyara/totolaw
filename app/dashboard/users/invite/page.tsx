/**
 * User Invite Page
 * 
 * Invite new users to the organization
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ArrowLeft, UserPlus, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function InviteUserPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <ProtectedRoute requiredPermission="users:manage">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <Heading as="h1">Invite User</Heading>
            <p className="text-muted-foreground">
              Add a new member to your organization
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Coming Soon:</strong> User invitation functionality is currently under development.
            Users can currently be added directly through the database or by signing up and being
            assigned to the organization by an administrator.
          </AlertDescription>
        </Alert>

        {/* Placeholder Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite New User
            </CardTitle>
            <CardDescription>
              Send an invitation email to add a new member to your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <UserPlus className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <Heading as="h3" className="mb-2">Feature In Development</Heading>
              <p className="mb-4">
                User invitation functionality will be available soon.
              </p>
              <p className="text-sm max-w-md mx-auto">
                In the meantime, users can create accounts through the login page and be
                assigned roles by administrators through the user management interface.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Temporary Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Process for Adding Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>User creates an account by signing in with their email</li>
              <li>User receives a magic link to verify their email</li>
              <li>Administrator assigns the user to the organization</li>
              <li>Administrator assigns appropriate roles to the user</li>
            </ol>
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
