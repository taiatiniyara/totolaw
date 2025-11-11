/**
 * Users Management Page
 * 
 * Admin interface to view and manage organization users
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Badge } from "@/components/ui/badge";
import { PageHeader, ListItemCard, EmptyState } from "@/components/common";
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
        <PageHeader
          title="Users"
          description="Manage organization members and roles"
          action={{
            label: "Invite User",
            href: "/dashboard/users/invite",
            icon: Plus,
          }}
        />

        {/* Users List */}
        {!result.success ? (
          <EmptyState
            icon={UsersIcon}
            title="Error loading users"
            description={result.error || "An error occurred"}
          />
        ) : result.data && result.data.length > 0 ? (
          <div className="grid gap-4">
            {result.data.map((user) => (
              <ListItemCard
                key={user.id}
                title={user.name || user.email}
                description={
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                }
                icon={UsersIcon}
                action={{
                  label: "View Details",
                  href: `/dashboard/users/${user.id}`,
                  variant: "outline",
                }}
              >
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
              </ListItemCard>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="Invite team members to your organization"
            action={{
              label: "Invite User",
              href: "/dashboard/users/invite",
              icon: Plus,
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
