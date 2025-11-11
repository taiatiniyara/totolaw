/**
 * Settings Page
 * 
 * Organisation and user settings management
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, InfoCard } from "@/components/common";
import { Heading } from "@/components/ui/heading";
import { 
  Settings as SettingsIcon, 
  Building2, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);

  return (
    <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Settings"
          description="Manage your account and organisation preferences"
        />

        {/* Settings Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* User Profile */}
          <InfoCard
            title="User Profile"
            description="Manage your personal information and preferences"
            icon={User}
            clickable={false}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{session.user.name || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{session.user.email}</span>
              </div>
            </div>
          </InfoCard>

          {/* Organisation Settings */}
          <InfoCard
            title="Organisation"
            description="Organisation-wide settings and preferences"
            icon={Building2}
            clickable={false}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organisation ID</span>
                <span className="font-mono text-xs">
                  {context?.organisationId?.slice(0, 8) || "N/A"}...
                </span>
              </div>
              <Badge variant="outline" className="mt-2">
                Admin Access Required
              </Badge>
            </div>
          </InfoCard>

          {/* Notifications */}
          <InfoCard
            title="Notifications"
            description="Manage your notification preferences"
            icon={Bell}
            clickable={false}
          >
            <div className="text-sm text-muted-foreground">
              <p>Configure email notifications for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Case updates</li>
                <li>Hearing reminders</li>
                <li>System announcements</li>
              </ul>
            </div>
          </InfoCard>

          {/* Security */}
          <InfoCard
            title="Security"
            description="Manage security and authentication settings"
            icon={Shield}
            clickable={false}
          >
            <div className="text-sm text-muted-foreground">
              <p>Security features:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Magic link authentication</li>
                <li>Session management</li>
                <li>Access logs</li>
              </ul>
            </div>
          </InfoCard>

          {/* Appearance */}
          <InfoCard
            title="Appearance"
            description="Customize the look and feel of the application"
            icon={Palette}
            clickable={false}
          >
            <div className="text-sm text-muted-foreground">
              <p>Appearance options:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Theme selection</li>
                <li>Layout preferences</li>
                <li>Language settings</li>
              </ul>
            </div>
          </InfoCard>

          {/* Regional Settings */}
          <InfoCard
            title="Regional Settings"
            description="Configure timezone and localization"
            icon={Globe}
            clickable={false}
          >
            <div className="text-sm text-muted-foreground">
              <p>Regional preferences:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Timezone selection</li>
                <li>Date format</li>
                <li>Currency format</li>
              </ul>
            </div>
          </InfoCard>
        </div>

        {/* Coming Soon Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Settings Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <SettingsIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <Heading as="h3" className="mb-2">Settings Management</Heading>
              <p className="max-w-md mx-auto">
                Full settings configuration interface is under development. 
                Basic account information is displayed above.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground font-medium mb-1">Authentication Method</dt>
                <dd>Magic Link (Passwordless)</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium mb-1">Session Duration</dt>
                <dd>7 days</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium mb-1">Multi-Tenant Mode</dt>
                <dd>Enabled</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium mb-1">Role-Based Access Control</dt>
                <dd>Enabled</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
  );
}
