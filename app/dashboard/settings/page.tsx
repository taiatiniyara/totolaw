/**
 * Settings Page
 * 
 * Organization and user settings management
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and organization preferences
          </p>
        </div>

        {/* Settings Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* User Profile */}
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Organization Settings */}
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization
              </CardTitle>
              <CardDescription>
                Organization-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization ID</span>
                  <span className="font-mono text-xs">
                    {context?.organizationId?.slice(0, 8) || "N/A"}...
                  </span>
                </div>
                <Badge variant="outline" className="mt-2">
                  Admin Access Required
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Configure email notifications for:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Case updates</li>
                  <li>Hearing reminders</li>
                  <li>System announcements</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Security features:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Magic link authentication</li>
                  <li>Session management</li>
                  <li>Access logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Appearance options:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Theme selection</li>
                  <li>Layout preferences</li>
                  <li>Language settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Settings
              </CardTitle>
              <CardDescription>
                Configure timezone and localization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Regional preferences:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Timezone selection</li>
                  <li>Date format</li>
                  <li>Currency format</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
              <h3 className="text-lg font-semibold mb-2">Settings Management</h3>
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
