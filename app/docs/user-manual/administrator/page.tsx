/**
 * Administrator User Manual
 * 
 * Public documentation page for Administrator role
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Shield,
  Users,
  UserPlus,
  Settings,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  BookOpen,
  Mail,
  UserCheck,
  FileText,
  Lock,
  Eye,
  Edit,
  XCircle,
} from "lucide-react";

export default function AdministratorManualPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <Shield className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Administrator Guide
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete guide to managing users, roles, and organisation settings
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
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role Overview</Heading>
              </div>

              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-base">
                      As an <strong>Administrator</strong>, you have full control over your organisation. You can 
                      manage users, assign roles, configure settings, and handle all operational aspects of your 
                      organisation in Totolaw.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-red-600" />
                        Administrator Capabilities
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-green-700">✓ You Can:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Invite and manage users</li>
                            <li>• Assign and revoke roles</li>
                            <li>• Approve join requests</li>
                            <li>• Configure organisation settings</li>
                            <li>• Manage all cases and hearings</li>
                            <li>• Access all documents and evidence</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-red-700">✗ You Cannot:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Access other organisations</li>
                            <li>• Delete your organisation</li>
                            <li>• Grant Super Admin status</li>
                            <li>• Modify system-wide settings</li>
                            <li>• Access System Admin panel</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">Organisation Scope</p>
                          <p className="text-sm text-blue-800">
                            Your administrator privileges are limited to your current organisation. If you're a 
                            member of multiple organisations, switch between them using the organisation switcher 
                            in the top navigation.
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
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <Heading as="h2" className="text-3xl">Getting Started</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      Your Admin Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      As an Administrator, you have access to additional menu items and features:
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">Settings Menu</p>
                        <p className="text-xs text-muted-foreground">
                          Navigate to <strong>Dashboard → Settings</strong> to access user management, roles, 
                          and organisation configuration.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">Users Section</p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Settings → Users</strong> shows all users in your organisation, pending invitations, 
                          and join requests awaiting approval.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-1">Roles Section</p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Settings → Roles</strong> allows you to create custom roles and configure permissions 
                          specific to your organisation's needs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* User Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">User Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-green-600" />
                      Inviting New Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Invite new users to join your organisation with pre-assigned roles:
                      </p>
                      
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                            1
                          </span>
                          <div>
                            <p className="font-medium">Navigate to Users</p>
                            <p className="text-xs text-muted-foreground">Go to <strong>Settings → Users</strong></p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                            2
                          </span>
                          <div>
                            <p className="font-medium">Click "Invite User"</p>
                            <p className="text-xs text-muted-foreground">Opens the invitation form</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                            3
                          </span>
                          <div>
                            <p className="font-medium">Enter User Details</p>
                            <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                              <li>• <strong>Email:</strong> User's email address (required)</li>
                              <li>• <strong>Role:</strong> Select appropriate role(s) for the user</li>
                              <li>• <strong>Message:</strong> Optional welcome message</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                            4
                          </span>
                          <div>
                            <p className="font-medium">Send Invitation</p>
                            <p className="text-xs text-muted-foreground">
                              User receives email with magic link to accept invitation
                            </p>
                          </div>
                        </li>
                      </ol>

                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-900">
                            <strong>Email Notification:</strong> Invited users receive a magic link email. 
                            The invitation expires in 7 days. You can resend or revoke pending invitations 
                            from the Users page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      Reviewing Join Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Users can browse organisations and request to join. You review and approve/reject these requests:
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <div>
                          <p className="font-semibold text-sm mb-1">Viewing Requests</p>
                          <p className="text-xs text-muted-foreground">
                            Go to <strong>Settings → Users → Join Requests</strong> to see pending requests
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-sm mb-1">Approving a Request</p>
                          <ol className="text-xs text-muted-foreground ml-4 space-y-1">
                            <li>1. Review user's profile and request message</li>
                            <li>2. Select appropriate role(s) for the user</li>
                            <li>3. Click <strong>"Approve"</strong></li>
                            <li>4. User is notified and gains access immediately</li>
                          </ol>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-sm mb-1">Rejecting a Request</p>
                          <ol className="text-xs text-muted-foreground ml-4 space-y-1">
                            <li>1. Click <strong>"Reject"</strong> on the request</li>
                            <li>2. Optionally provide a reason</li>
                            <li>3. User is notified of the decision</li>
                          </ol>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-900">
                            <strong>Tip:</strong> Review user profiles carefully before approving. Check their email 
                            domain and any provided context about why they need access.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Edit className="h-5 w-5 text-indigo-600" />
                      Managing Existing Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        You can modify user details, roles, and access status:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">Assign/Revoke Roles</p>
                            <p className="text-xs text-muted-foreground">
                              Click on a user → <strong>"Manage Roles"</strong> → Add or remove role assignments
                            </p>
                          </div>
                        </div>
                        
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Set Judicial Titles or Designations</p>
                          <p className="text-xs text-muted-foreground">
                            Judicial titles (e.g., "Magistrate", "Justice") and court designations (e.g., "Registrar", "Court Clerk") 
                            can be set for users. These appear in daily cause lists and formal documents. The full user profile editor 
                            interface is under development - contact Super Admin for assistance.
                          </p>
                        </div>
                      </div>                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">Deactivate User</p>
                            <p className="text-xs text-muted-foreground">
                              Temporarily disable access without removing the user. User can be reactivated later.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">Remove from Organisation</p>
                            <p className="text-xs text-muted-foreground">
                              Permanently remove user from your organisation. Use this when someone leaves permanently.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Role Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Understanding Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Roles are collections of permissions that determine what users can do in the system.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold mb-2 text-sm">Common Roles:</p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Judge/Manager:</strong> Full case management, hearing scheduling, evidence handling
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Staff/Clerk:</strong> Daily operations, case creation, document uploads
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Viewer:</strong> Read-only access to cases, hearings, and documents
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Creating Custom Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Create custom roles tailored to your organisation's specific needs:
                      </p>
                      
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                            1
                          </span>
                          <div>
                            <p className="font-medium">Go to Roles Settings</p>
                            <p className="text-xs text-muted-foreground">
                              Navigate to <strong>Settings → Roles</strong>
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                            2
                          </span>
                          <div>
                            <p className="font-medium">Click "Create Role"</p>
                            <p className="text-xs text-muted-foreground">Opens role creation form</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                            3
                          </span>
                          <div>
                            <p className="font-medium">Configure Role</p>
                            <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                              <li>• <strong>Name:</strong> Descriptive role name</li>
                              <li>• <strong>Description:</strong> Purpose and responsibilities</li>
                              <li>• <strong>Permissions:</strong> Select specific capabilities</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                            4
                          </span>
                          <div>
                            <p className="font-medium">Save and Assign</p>
                            <p className="text-xs text-muted-foreground">
                              New role is immediately available for user assignment
                            </p>
                          </div>
                        </li>
                      </ol>

                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-900">
                            <strong>Note:</strong> System roles (like Administrator) cannot be edited or deleted. 
                            You can only modify custom roles created by your organisation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Permission Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Permissions are grouped by resource type:
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Case Permissions</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• cases:read</li>
                            <li>• cases:create</li>
                            <li>• cases:update</li>
                            <li>• cases:delete</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Hearing Permissions</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• hearings:read</li>
                            <li>• hearings:schedule</li>
                            <li>• hearings:update</li>
                            <li>• hearings:cancel</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Document Permissions</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• documents:read</li>
                            <li>• documents:upload</li>
                            <li>• documents:update</li>
                            <li>• documents:delete</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">User Management</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• users:read</li>
                            <li>• users:invite</li>
                            <li>• users:manage</li>
                            <li>• roles:assign</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Organisation Settings */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">Organisation Settings</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuring Your Organisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Roles & Permissions</p>
                          <p className="text-xs text-muted-foreground">
                            Create custom roles and manage permissions from <strong>Settings → Roles & Permissions</strong>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Case Number Format</p>
                          <p className="text-xs text-muted-foreground">
                            Case numbers are automatically generated based on court level and type. Format is managed by system administrators.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Organisation Profile Settings</p>
                          <p className="text-xs text-muted-foreground">
                            Full organisation profile editing (name, contact info, logo) is currently managed by Super Administrators. Additional settings features are under development.
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
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <Heading as="h2" className="text-3xl">Best Practices</Heading>
              </div>

              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Principle of Least Privilege</p>
                          <p className="text-xs text-muted-foreground">
                            Grant users only the permissions they need to perform their job. Start with minimal 
                            access and add more as needed.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Regular Access Reviews</p>
                          <p className="text-xs text-muted-foreground">
                            Quarterly, review user access and remove permissions for users who have changed roles 
                            or left the organisation.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Document Role Changes</p>
                          <p className="text-xs text-muted-foreground">
                            Keep records of why roles were assigned or modified, especially for sensitive positions.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Onboard Properly</p>
                          <p className="text-xs text-muted-foreground">
                            When inviting new users, provide clear instructions about their role and what they 
                            can access in the system.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Monitor Activity</p>
                          <p className="text-xs text-muted-foreground">
                            Regularly review audit logs for unusual activity or potential security issues.
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
                      <Lock className="h-8 w-8 text-purple-600" />
                      <h3 className="font-semibold">RBAC System</h3>
                      <p className="text-xs text-muted-foreground">
                        Learn about permissions and roles
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
                        Guides for other roles
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        View all <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/dashboard/help" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                      <h3 className="font-semibold">Get Help</h3>
                      <p className="text-xs text-muted-foreground">
                        Contact support or view FAQs
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Get support <ArrowRight className="ml-1 h-3 w-3" />
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
                      If you have questions about managing your organisation or need assistance with 
                      user management, we're here to help.
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
