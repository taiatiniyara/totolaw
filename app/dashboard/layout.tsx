export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganizations, getUserTenantContext } from "@/lib/services/tenant.service";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { NavLink } from "@/components/nav-link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Bell,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

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
  let isSuperAdmin = false;
  
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
      
      // Check if user is super admin
      const { user } = await import("@/lib/drizzle/schema/auth-schema");
      const { db } = await import("@/lib/drizzle/connection");
      const { eq } = await import("drizzle-orm");
      const userData = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
      isSuperAdmin = userData[0]?.isSuperAdmin || false;
      
      // Super admins see all organizations
      if (isSuperAdmin && currentOrganizationId === "*") {
        // Show a special "All Organizations" option for super admins
        organizations = [
          {
            id: "*",
            name: "All Organizations (Super Admin)",
            code: "*",
            type: "system",
            isPrimary: true,
          },
          ...organizations,
        ];
      }
    } catch (error) {
      console.error("Error loading organization data:", error);
    }
  }

  const currentOrg = organizations.find(org => org.id === currentOrganizationId);
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo & Branding */}
          <div className="border-b p-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Logo width={140} height={45} className="h-11" />
            </Link>
          </div>

          {/* Organization Switcher */}
          <div className="border-b p-4">
            <OrganizationSwitcher
              organizations={organizations}
              currentOrganizationId={currentOrganizationId}
            />
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-1">
              <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                MAIN MENU
              </div>
              <NavLink href="/dashboard" icon="LayoutDashboard">
                Dashboard
              </NavLink>
              <NavLink href="/dashboard/cases" icon="FolderOpen">
                Cases
              </NavLink>
              <NavLink href="/dashboard/hearings" icon="Calendar">
                Hearings
              </NavLink>
              <NavLink href="/dashboard/documents" icon="FileText">
                Documents
              </NavLink>
              <NavLink href="/dashboard/search" icon="Search">
                Search
              </NavLink>

              <div className="mb-2 mt-4 px-3 text-xs font-semibold text-muted-foreground">
                MANAGEMENT
              </div>
              <NavLink href="/dashboard/users" icon="Users">
                Users
              </NavLink>
              <NavLink href="/dashboard/settings" icon="Settings">
                Settings
              </NavLink>
              
              {isSuperAdmin && (
                <>
                  <div className="mb-2 mt-4 px-3 text-xs font-semibold text-muted-foreground">
                    SYSTEM ADMIN
                  </div>
                  <NavLink href="/dashboard/system-admin" icon="Shield">
                    Super Admin
                  </NavLink>
                </>
              )}

              <div className="mb-2 mt-4 px-3 text-xs font-semibold text-muted-foreground">
                SUPPORT
              </div>
              <NavLink href="/dashboard/help" icon="HelpCircle">
                Help & Docs
              </NavLink>
            </div>
          </ScrollArea>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {session?.user?.name || session?.user?.email}
                </p>
                {currentOrg && (
                  <p className="truncate text-xs text-muted-foreground">
                    {currentOrg.name}
                  </p>
                )}
              </div>
            </div>
            <LogoutButton variant="outline" size="sm" fullWidth />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full flex-col">
              <div className="border-b p-6">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <Logo width={140} height={45} className="h-11" />
                </Link>
              </div>

              <div className="border-b p-4">
                <OrganizationSwitcher
                  organizations={organizations}
                  currentOrganizationId={currentOrganizationId}
                />
              </div>

              <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-1">
                  <NavLink href="/dashboard" icon="LayoutDashboard">
                    Dashboard
                  </NavLink>
                  <NavLink href="/dashboard/cases" icon="FolderOpen">
                    Cases
                  </NavLink>
                  <NavLink href="/dashboard/hearings" icon="Calendar">
                    Hearings
                  </NavLink>
                  <NavLink href="/dashboard/documents" icon="FileText">
                    Documents
                  </NavLink>
                  <NavLink href="/dashboard/search" icon="Search">
                    Search
                  </NavLink>
                  <NavLink href="/dashboard/users" icon="Users">
                    Users
                  </NavLink>
                  <NavLink href="/dashboard/settings" icon="Settings">
                    Settings
                  </NavLink>
                  
                  {isSuperAdmin && (
                    <>
                      <div className="mb-2 mt-4 px-3 text-xs font-semibold text-muted-foreground">
                        SYSTEM ADMIN
                      </div>
                      <NavLink href="/dashboard/system-admin" icon="Shield">
                        Super Admin
                      </NavLink>
                    </>
                  )}

                  <div className="mb-2 mt-4 px-3 text-xs font-semibold text-muted-foreground">
                    SUPPORT
                  </div>
                  <NavLink href="/dashboard/help" icon="HelpCircle">
                    Help & Docs
                  </NavLink>
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <LogoutButton variant="outline" fullWidth />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center flex-1">
          <Logo width={120} height={40} className="h-10" />
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:overflow-auto">
        <div className="lg:p-8 p-4 pt-20 lg:pt-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
