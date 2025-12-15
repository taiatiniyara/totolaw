/**
 * Super Administrator User Manual
 * 
 * Public documentation page for Super Admin role
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Crown,
  Shield,
  Building2,
  Users,
  Settings,
  Database,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Home,
  BookOpen,
  Lock,
  Eye,
  Trash2,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function SuperAdminManualPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <Crown className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Super Administrator Guide
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete guide to platform-wide administration and system management
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild variant="outline">
                  <Link href="/docs/user-manual">
                    <BookOpen className="mr-2 h-4 w-4" />
                    All User Manuals
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/docs">
                    <Home className="mr-2 h-4 w-4" />
                    Documentation Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* Role Overview */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role Overview</Heading>
              </div>

              <Card className="border-purple-200 bg-purple-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-base">
                      As a <strong>Super Administrator</strong>, you have the highest level of access in the Totolaw system. 
                      You can access all organisations, manage system-wide settings, and perform any action without needing 
                      specific role assignments.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        Key Privileges
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-green-700">✓ Platform-Wide Access</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Access all organisations</li>
                            <li>• No membership required</li>
                            <li>• All permissions automatically granted</li>
                            <li>• Bypass permission checks</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-green-700">✓ System Administration</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Create/delete organisations</li>
                            <li>• Manage all users and roles</li>
                            <li>• System configuration</li>
                            <li>• Grant/revoke Super Admin status</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">With Great Power...</p>
                          <p className="text-sm text-amber-800">
                            Super Admin access should be granted sparingly and only to trusted platform administrators. 
                            All Super Admin actions are logged for security auditing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Getting Started */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <Heading as="h2" className="text-3xl">Getting Started</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      Understanding the Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      As a Super Admin, your dashboard includes additional features not visible to other users:
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">System Admin Menu Item</p>
                        <p className="text-xs text-muted-foreground">
                          Navigate to <strong>Dashboard → System Admin</strong> to access platform-wide administration tools.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">Organisation Switcher</p>
                        <p className="text-xs text-muted-foreground">
                          Top navigation bar includes organisation switcher - you can access any organisation instantly 
                          without needing to be a member.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">All Data Visibility</p>
                        <p className="text-xs text-muted-foreground">
                          You can view and manage all cases, hearings, documents, and evidence across all organisations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      Accessing System Admin Panel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                            1
                          </span>
                          <div>
                            <p className="font-medium text-sm">Login to Totolaw</p>
                            <p className="text-xs text-muted-foreground">Use your Super Admin credentials</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                            2
                          </span>
                          <div>
                            <p className="font-medium text-sm">Navigate to System Admin</p>
                            <p className="text-xs text-muted-foreground">Click <strong>System Admin</strong> in the left sidebar</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                            3
                          </span>
                          <div>
                            <p className="font-medium text-sm">Access Admin Features</p>
                            <p className="text-xs text-muted-foreground">
                              Manage organisations, users, and system settings
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Organisation Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">Organisation Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Creating a New Organisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold">1.</span>
                          <span>Go to <strong>System Admin → Organisations</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold">2.</span>
                          <span>Click <strong>"Create Organisation"</strong> button</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold">3.</span>
                          <div>
                            <p>Fill in organisation details:</p>
                            <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                              <li>• <strong>Name:</strong> Full organisation name (e.g., "High Court of Fiji")</li>
                              <li>• <strong>Code:</strong> Unique identifier (e.g., "HC", "MC")</li>
                              <li>• <strong>Type:</strong> Court level or organisation type</li>
                              <li>• <strong>Parent Organisation:</strong> If part of hierarchy</li>
                              <li>• <strong>Contact Details:</strong> Email, phone, address</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold">4.</span>
                          <span>Click <strong>"Create"</strong> to save</span>
                        </li>
                      </ol>

                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-xs text-blue-900">
                          <strong>Tip:</strong> The organisation code is used in case number generation 
                          (e.g., "HC-CV-2024-001" for High Court Civil case).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Managing Existing Organisations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">View Organisation Details</p>
                          <p className="text-xs text-muted-foreground">
                            Click on any organisation to view members, cases, settings, and activity.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Edit Organisation Settings</p>
                          <p className="text-xs text-muted-foreground">
                            Update name, contact info, hierarchy, or activation status.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Deactivate Organisation</p>
                          <p className="text-xs text-muted-foreground">
                            Temporarily disable an organisation without deleting data. Users cannot access deactivated organisations.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-red-700">Delete Organisation</p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-red-600">Use with extreme caution!</strong> Deleting an organisation 
                            permanently removes all cases, hearings, documents, and member associations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Organisation Hierarchy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Totolaw supports multi-level organisation hierarchies for court systems:
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="font-mono text-xs space-y-1">
                        <div>Supreme Court (Root)</div>
                        <div className="ml-4">└── Court of Appeal</div>
                        <div className="ml-8">└── High Court</div>
                        <div className="ml-12">├── High Court (Suva)</div>
                        <div className="ml-12">├── High Court (Lautoka)</div>
                        <div className="ml-12">└── High Court (Labasa)</div>
                        <div className="ml-4">└── Magistrates Court</div>
                        <div className="ml-8">├── Suva Magistrates</div>
                        <div className="ml-8">└── Lautoka Magistrates</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Set parent organisation when creating or editing an organisation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* User Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <Heading as="h2" className="text-3xl">User Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Viewing All Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        As a Super Admin, you can see <strong>all users</strong> from <strong>all organisations</strong> in the system.
                      </p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="font-semibold mb-2">To view users:</p>
                        <ol className="space-y-1 ml-4">
                          <li>1. Go to <strong>System Admin → Users</strong></li>
                          <li>2. Browse all users or search by name/email</li>
                          <li>3. Filter by organisation, role, or status</li>
                          <li>4. Click on any user to view their full profile</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Managing Super Admin Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-amber-900 mb-1">Critical Security Feature</p>
                            <p className="text-sm text-amber-800">
                              Only grant Super Admin status to trusted platform administrators. This privilege 
                              grants unrestricted access to all data and settings.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Granting Super Admin:</p>
                          <ol className="space-y-1 ml-4 text-muted-foreground">
                            <li>1. Go to <strong>System Admin → Users</strong></li>
                            <li>2. Find the user you want to promote</li>
                            <li>3. Click on their profile</li>
                            <li>4. Click <strong>"Grant Super Admin"</strong> button</li>
                            <li>5. Confirm the action (this is logged)</li>
                          </ol>
                        </div>

                        <div>
                          <p className="font-semibold mb-2">Revoking Super Admin:</p>
                          <ol className="space-y-1 ml-4 text-muted-foreground">
                            <li>1. Navigate to the Super Admin user's profile</li>
                            <li>2. Click <strong>"Revoke Super Admin"</strong> button</li>
                            <li>3. Confirm revocation (this is logged)</li>
                            <li>4. User returns to normal access levels</li>
                          </ol>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-xs text-blue-900">
                            <strong>Note:</strong> All Super Admin grants and revocations are permanently logged 
                            in the audit trail for security and compliance purposes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Adding Users to Organisations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        You can add any user to any organisation and assign roles:
                      </p>
                      <ol className="space-y-2 ml-4">
                        <li>
                          <strong>1. Navigate to target organisation</strong>
                          <p className="text-xs text-muted-foreground ml-3">
                            Use organisation switcher or System Admin panel
                          </p>
                        </li>
                        <li>
                          <strong>2. Go to Settings → Users</strong>
                          <p className="text-xs text-muted-foreground ml-3">
                            View organisation's current members
                          </p>
                        </li>
                        <li>
                          <strong>3. Click "Invite User" or "Add User"</strong>
                          <p className="text-xs text-muted-foreground ml-3">
                            Choose existing user or send email invitation
                          </p>
                        </li>
                        <li>
                          <strong>4. Assign roles and permissions</strong>
                          <p className="text-xs text-muted-foreground ml-3">
                            Select appropriate roles for the user's responsibilities
                          </p>
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* System Configuration */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Database className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">System Configuration</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Managed Lists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Managed Lists are system-wide dropdown options used across all organisations:
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold mb-2">Available Lists:</p>
                        <ul className="space-y-1 ml-4 text-muted-foreground">
                          <li>• <strong>Case Types:</strong> Civil, Criminal, Family, etc.</li>
                          <li>• <strong>Case Statuses:</strong> Active, Closed, Pending, etc.</li>
                          <li>• <strong>Hearing Types:</strong> Mention, Trial, Sentencing, etc.</li>
                          <li>• <strong>Document Types:</strong> Affidavit, Motion, Order, etc.</li>
                          <li>• <strong>Evidence Types:</strong> Physical, Documentary, Digital, etc.</li>
                          <li>• <strong>Party Roles:</strong> Plaintiff, Defendant, Witness, etc.</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold">Managing Lists:</p>
                        <ol className="space-y-1 ml-4 text-muted-foreground">
                          <li>1. Go to <strong>System Admin → Managed Lists</strong></li>
                          <li>2. Select the list you want to edit</li>
                          <li>3. Add, edit, or deactivate list items</li>
                          <li>4. Changes apply system-wide immediately</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Email Configuration</p>
                          <p className="text-xs text-muted-foreground">
                            Configure SMTP settings for magic link authentication and notifications.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Storage Configuration</p>
                          <p className="text-xs text-muted-foreground">
                            Manage file storage settings for documents and evidence uploads.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Security Settings</p>
                          <p className="text-xs text-muted-foreground">
                            Configure session timeouts, rate limits, and security policies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Monitoring & Reporting */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <Heading as="h2" className="text-3xl">Monitoring & Reporting</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Audit Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        All administrative actions are logged for security and compliance:
                      </p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="font-semibold mb-2">Logged Actions:</p>
                        <ul className="space-y-1 ml-4 text-muted-foreground">
                          <li>• Super Admin grants/revocations</li>
                          <li>• Organisation creation/deletion</li>
                          <li>• User role assignments</li>
                          <li>• Permission changes</li>
                          <li>• System configuration updates</li>
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Access audit logs from <strong>System Admin → Audit Logs</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">User Activity</p>
                          <p className="text-xs text-muted-foreground">
                            Monitor active users, login patterns, and session activity.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">System Performance</p>
                          <p className="text-xs text-muted-foreground">
                            View database performance, API response times, and error rates.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Storage Usage</p>
                          <p className="text-xs text-muted-foreground">
                            Track document and evidence storage across organisations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <Heading as="h2" className="text-3xl">Best Practices & Security</Heading>
              </div>

              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Limit Super Admin Access</p>
                          <p className="text-xs text-muted-foreground">
                            Only grant Super Admin status to 2-3 trusted platform administrators. More is not better.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Regular Audit Reviews</p>
                          <p className="text-xs text-muted-foreground">
                            Review audit logs monthly to ensure no unauthorized or suspicious activity.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Document Changes</p>
                          <p className="text-xs text-muted-foreground">
                            Keep records of why Super Admin access was granted or major configuration changes were made.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Test Before Production</p>
                          <p className="text-xs text-muted-foreground">
                            Test system-wide changes in a staging environment before applying to production.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Backup Strategy</p>
                          <p className="text-xs text-muted-foreground">
                            Ensure regular database backups before making major structural changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Related Resources */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-pink-600" />
                </div>
                <Heading as="h2" className="text-3xl">Related Resources</Heading>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/rbac" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Shield className="h-8 w-8 text-purple-600" />
                      <h3 className="font-semibold">RBAC System</h3>
                      <p className="text-xs text-muted-foreground">
                        Learn about the permission and role system
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Read more <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/user-manual" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Users className="h-8 w-8 text-blue-600" />
                      <h3 className="font-semibold">Other User Manuals</h3>
                      <p className="text-xs text-muted-foreground">
                        Guides for other roles in the system
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        View all <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/security" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Lock className="h-8 w-8 text-red-600" />
                      <h3 className="font-semibold">Security Guide</h3>
                      <p className="text-xs text-muted-foreground">
                        Security best practices and policies
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Learn more <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Support */}
            <section>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-lg">Need Help?</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                      If you encounter issues or have questions about Super Admin features, 
                      contact the platform development team or refer to the technical documentation.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild variant="outline">
                        <Link href="/docs">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Documentation
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/dashboard/help">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Get Support
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
