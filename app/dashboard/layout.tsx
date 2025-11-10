export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganizations, getUserTenantContext } from "@/lib/services/tenant.service";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "./actions";

interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
  isPrimary?: boolean;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  let organizations: Organization[] = [];
  let currentOrganizationId: string | null = null;
  
  if (session?.user) {
    try {
      const userOrgs = await getUserOrganizations(session.user.id);
      organizations = userOrgs.map((item) => ({
        id: item.organization.id,
        name: item.organization.name,
        code: item.organization.code,
        type: item.organization.type,
        isPrimary: item.membership.isPrimary,
      }));
      const context = await getUserTenantContext(session.user.id);
      currentOrganizationId = context?.organizationId || null;
    } catch (error) {
      console.error("Error loading organization data:", error);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b p-6">
            <Logo />
          </div>

          {/* Organization Switcher */}
          <div className="border-b p-4">
            <OrganizationSwitcher
              organizations={organizations}
              currentOrganizationId={currentOrganizationId}
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <NavLink href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/cases" icon={FolderOpen}>
              Cases
            </NavLink>
            <NavLink href="/dashboard/users" icon={Users}>
              Users
            </NavLink>
            <NavLink href="/dashboard/settings" icon={Settings}>
              Settings
            </NavLink>
          </nav>

          {/* User Menu */}
          <div className="border-t p-4">
            <div className="mb-3 text-sm">
              <p className="font-medium">{session?.user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.name || "User"}
              </p>
            </div>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
