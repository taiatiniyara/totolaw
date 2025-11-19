/**
 * RBAC Help Page
 * 
 * Dashboard help page explaining Role-Based Access Control
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Shield,
  Users,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  BookOpen,
  Home,
  AlertCircle,
  Crown,
  Briefcase,
  UserCheck,
  Eye,
  Settings,
} from "lucide-react";

export default function RBACHelpPage() {
  return (
    <div className="flex-1 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Shield className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <Heading as="h1" className="text-4xl md:text-5xl">
              Role-Based Access Control (RBAC)
            </Heading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding permissions, roles, and access control in Totolaw
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" asChild size="sm">
                <Link href="/dashboard/help">
                  <BookOpen className="mr-2 h-4 w-4" />
                  All Help
                </Link>
              </Button>
              <Button variant="outline" asChild size="sm">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* What is RBAC */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <Heading as="h2" className="text-3xl">What is RBAC?</Heading>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg mb-4">
                  <strong>Role-Based Access Control (RBAC)</strong> is a security system that controls who can access what in Totolaw. 
                  Instead of giving permissions to individual users one by one, we group permissions into <strong>roles</strong>, 
                  and then assign those roles to users.
                </p>
                
                <div className="bg-muted p-6 rounded-lg space-y-3">
                  <p className="font-semibold text-lg">Think of it like this:</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>A <strong>Judge</strong> role has permissions to manage cases, schedule hearings, and make rulings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>A <strong>Court Clerk</strong> role can create cases, upload documents, but cannot make rulings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>A <strong>Viewer</strong> role can only view cases and hearings, not make changes</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Key Concepts */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <Heading as="h2" className="text-3xl">Key Concepts</Heading>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Permissions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-6 w-6 text-amber-600" />
                    <CardTitle className="text-xl">Permissions</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Specific actions you can perform in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Permissions are specific abilities to perform actions in the system
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">Create Cases</span>
                      <span className="text-muted-foreground">- Add new cases to the system</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">View Cases</span>
                      <span className="text-muted-foreground">- See case information</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">Schedule Hearings</span>
                      <span className="text-muted-foreground">- Set up court hearings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">Manage Users</span>
                      <span className="text-muted-foreground">- Add and manage team members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Roles */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl">Roles</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Collections of permissions grouped together
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    A role is like a job title that comes with specific access rights
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold text-sm">Judge Role</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Includes: View cases, create cases, schedule hearings, make rulings, manage evidence
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm">Court Clerk</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Includes: View cases, create cases, upload documents, schedule hearings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-xl">Users</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    People who use the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Each user is assigned one or more roles within an organisation
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-700">JD</span>
                      </div>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-xs text-muted-foreground">Role: Judge</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-green-700">JS</span>
                      </div>
                      <div>
                        <p className="font-semibold">Jane Smith</p>
                        <p className="text-xs text-muted-foreground">Role: Court Clerk</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organisations */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-6 w-6 text-orange-600" />
                    <CardTitle className="text-xl">Organisations</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Courts or departments that use Totolaw
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Roles and permissions are scoped to each organisation
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-900">
                        <strong>Important:</strong> Your role in one organisation (e.g., High Court) 
                        is separate from your role in another organisation (e.g., Magistrates Court). 
                        You might be a Judge in one and a Viewer in another.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Common Roles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <Heading as="h2" className="text-3xl">Common Roles in Totolaw</Heading>
            </div>

            <div className="grid gap-6">
              {/* Super Admin */}
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-xl">Super Administrator</CardTitle>
                      <CardDescription className="text-base">System-wide access across all organisations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Super Admins have complete control over the entire Totolaw system. They can access any organisation 
                      and perform any action without needing specific role assignments.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          What they can do:
                        </p>
                        <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                          <li>• Access all organisations</li>
                          <li>• Create/delete organisations</li>
                          <li>• Manage all users and roles</li>
                          <li>• Override any permission</li>
                          <li>• System configuration</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          Who gets this role:
                        </p>
                        <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                          <li>• System administrators</li>
                          <li>• IT support staff</li>
                          <li>• Platform managers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Administrator */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-7 w-7 text-red-600" />
                    <div>
                      <CardTitle className="text-xl">Administrator</CardTitle>
                      <CardDescription className="text-base">Full control within an organisation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Can Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Manage users</li>
                        <li>• Assign roles</li>
                        <li>• All case operations</li>
                        <li>• Configure settings</li>
                        <li>• Approve join requests</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cannot Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Access other organisations</li>
                        <li>• Delete the organisation</li>
                        <li>• Grant Super Admin</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Typical Users:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Court Registrars</li>
                        <li>• Senior Administrators</li>
                        <li>• Department Heads</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manager/Judge */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-7 w-7 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl">Manager / Judge</CardTitle>
                      <CardDescription className="text-base">Manage cases and hearings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Can Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Create cases</li>
                        <li>• Schedule hearings</li>
                        <li>• Upload evidence</li>
                        <li>• Make rulings</li>
                        <li>• Assign cases</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cannot Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Manage users</li>
                        <li>• Assign roles</li>
                        <li>• Configure system</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Typical Users:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Judges</li>
                        <li>• Magistrates</li>
                        <li>• Case Managers</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Staff/Clerk */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-7 w-7 text-green-600" />
                    <div>
                      <CardTitle className="text-xl">Staff / Court Clerk</CardTitle>
                      <CardDescription className="text-base">Daily case and document operations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Can Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Create cases</li>
                        <li>• Update case details</li>
                        <li>• Upload documents</li>
                        <li>• Schedule hearings</li>
                        <li>• Record transcripts</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cannot Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Delete cases</li>
                        <li>• Make rulings</li>
                        <li>• Manage users</li>
                        <li>• Change settings</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Typical Users:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Court Clerks</li>
                        <li>• Registry Staff</li>
                        <li>• Administrative Staff</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Viewer */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Eye className="h-7 w-7 text-gray-600" />
                    <div>
                      <CardTitle className="text-xl">Viewer</CardTitle>
                      <CardDescription className="text-base">Read-only access to cases and hearings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Can Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• View cases</li>
                        <li>• View hearings</li>
                        <li>• View documents</li>
                        <li>• View evidence</li>
                        <li>• Search records</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cannot Do:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Create anything</li>
                        <li>• Update anything</li>
                        <li>• Delete anything</li>
                        <li>• Upload files</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Typical Users:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Legal Representatives</li>
                        <li>• Auditors</li>
                        <li>• External Observers</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How Permissions Work */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <Heading as="h2" className="text-3xl">How Permission Checking Works</Heading>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Permission Evaluation Flow</CardTitle>
                <CardDescription>
                  When you try to perform an action, the system checks your permissions in this order:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Are you a Super Admin?</p>
                      <p className="text-sm text-muted-foreground">
                        If yes → <span className="text-green-600 font-semibold">Access Granted</span> (all permissions automatically)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Do you have an explicit DENY?</p>
                      <p className="text-sm text-muted-foreground">
                        If yes → <span className="text-red-600 font-semibold">Access Denied</span> (deny overrides everything)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Do you have an explicit GRANT?</p>
                      <p className="text-sm text-muted-foreground">
                        If yes → <span className="text-green-600 font-semibold">Access Granted</span> (direct permission grant)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Does your role include this permission?</p>
                      <p className="text-sm text-muted-foreground">
                        If yes → <span className="text-green-600 font-semibold">Access Granted</span> (from role)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                      5
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Default: None of the above</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-red-600 font-semibold">Access Denied</span> (fail-safe default)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Common Scenarios */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <Heading as="h2" className="text-3xl">Common Scenarios</Heading>
            </div>

            <div className="space-y-4">
              {/* Scenario 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 1: Creating a Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>Action:</strong> You click the "Create Case" button
                    </p>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p className="text-sm font-semibold">System checks:</p>
                      <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                        <li>✓ Are you logged in?</li>
                        <li>✓ Do you belong to an organisation?</li>
                        <li>✓ Do you have permission to create cases?</li>
                      </ul>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-700">If you have permission:</p>
                        <p className="text-muted-foreground">You see the create case form and can submit it</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-700">If you don't have permission:</p>
                        <p className="text-muted-foreground">The button is hidden or you see an "Access Denied" message</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 2: Managing Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>Action:</strong> You navigate to Settings → Users
                    </p>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p className="text-sm font-semibold">System checks:</p>
                      <ul className="text-sm space-y-1 ml-6 text-muted-foreground">
                        <li>✓ Do you have the <code className="bg-background px-1 rounded">users:read</code> permission?</li>
                        <li>✓ Do you have the <code className="bg-background px-1 rounded">users:manage</code> permission?</li>
                        <li>✓ Do you have the <code className="bg-background px-1 rounded">roles:assign</code> permission?</li>
                      </ul>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p><strong className="text-green-700">users:read</strong> → You can see the user list</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p><strong className="text-green-700">users:manage</strong> → You can invite/deactivate users</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p><strong className="text-green-700">roles:assign</strong> → You can assign roles to users</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scenario 3: Multiple Organisations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>Situation:</strong> You belong to both High Court and Magistrates Court
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="font-semibold text-sm mb-2 text-blue-900">High Court (Current)</p>
                        <p className="text-xs text-blue-700 mb-2">Your role: Judge</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>✓ Can create cases</li>
                          <li>✓ Can schedule hearings</li>
                          <li>✓ Can make rulings</li>
                          <li>✓ Can manage evidence</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="font-semibold text-sm mb-2">Magistrates Court</p>
                        <p className="text-xs text-muted-foreground mb-2">Your role: Viewer</p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>✓ Can view cases</li>
                          <li>✗ Cannot create cases</li>
                          <li>✗ Cannot schedule hearings</li>
                          <li>✗ Cannot make changes</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-900">
                          <strong>Remember:</strong> Your permissions change when you switch organisations. 
                          Use the organisation switcher in the top navigation to change context.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* What Users See */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <Heading as="h2" className="text-3xl">What You See Based on Your Role</Heading>
            </div>

            <Card>
              <CardContent className="pt-6">
                <p className="mb-6 text-sm text-muted-foreground">
                  The interface automatically adapts to show only features you have permission to use. 
                  Buttons and menu items you can't access are either hidden or disabled.
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="font-semibold text-sm mb-1">✓ What You CAN Do</p>
                    <p className="text-xs text-muted-foreground">
                      Buttons are visible and clickable, menu items are accessible
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-300 pl-4 py-2">
                    <p className="font-semibold text-sm mb-1 text-muted-foreground">✗ What You CANNOT Do</p>
                    <p className="text-xs text-muted-foreground">
                      Buttons are hidden, menu items don't appear, or you see "Access Denied" messages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How to Request Access */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-orange-600" />
              </div>
              <Heading as="h2" className="text-3xl">How to Get Access or Change Roles</Heading>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Need More Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need More Permissions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">If you need access to something you can't currently do:</p>
                    <ol className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <span>Contact your organisation's <strong>Administrator</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <span>Explain what you need to do and why</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <span>They can either:</span>
                      </li>
                      <ul className="ml-8 mt-1 space-y-1 text-muted-foreground">
                        <li>• Assign you a different role with more permissions</li>
                        <li>• Grant you specific additional permissions</li>
                        <li>• Create a custom role that fits your needs</li>
                      </ul>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Join New Organisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Join Another Organisation?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">If you need access to a different court or department:</p>
                    <ol className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <span>Navigate to <strong>Organisations</strong> page</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <span>Browse available organisations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <span>Click <strong>"Request to Join"</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">4.</span>
                        <span>An administrator will review your request</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">5.</span>
                        <span>You'll receive an email when approved</span>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* For Administrators */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <Heading as="h2" className="text-3xl">For Administrators: Managing Roles</Heading>
            </div>

            <Card className="border-red-200 bg-red-50/30">
              <CardHeader>
                <CardTitle>Admin Responsibilities</CardTitle>
                <CardDescription>
                  As an Administrator, you're responsible for managing user access in your organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2 text-sm">Key Tasks:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Invite Users:</strong> Bring new people into your organisation</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Assign Roles:</strong> Give users appropriate access levels</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Review Requests:</strong> Approve or deny join requests</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Create Custom Roles:</strong> Tailor roles to your needs</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Audit Access:</strong> Review who has what permissions</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Deactivate Users:</strong> Remove access when needed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-lg border">
                    <p className="font-semibold text-sm mb-2">Where to Manage Roles:</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>• <strong>Settings → Users</strong> - Manage user accounts</p>
                      <p>• <strong>Settings → Roles</strong> - Create and configure roles</p>
                      <p>• <strong>Dashboard → Join Requests</strong> - Review pending requests</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-900">
                        <strong>Best Practice:</strong> Follow the principle of "least privilege" - 
                        give users only the permissions they need to do their job. You can always grant more access later.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Security Best Practices */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lock className="h-6 w-6 text-gray-600" />
              </div>
              <Heading as="h2" className="text-3xl">Security Best Practices</Heading>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Do This
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Log out when you finish working</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Report suspicious activity to your admin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Request only the access you need</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Notify admin when your role changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Keep your email secure (used for login)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Don't Do This
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Share your magic link with others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Stay logged in on shared computers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Try to access things you don't need</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Grant excessive permissions when you become admin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Ignore "Access Denied" messages (report them)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-teal-600" />
              </div>
              <Heading as="h2" className="text-3xl">Frequently Asked Questions</Heading>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Why can't I see the "Create Case" button?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  You don't have permission to create cases. 
                  This ability is typically included in Judge, Manager, and Staff roles, but not in Viewer roles. 
                  Contact your administrator if you need this access.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Can I have different roles in different organisations?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Yes! Your roles are specific to each organisation. You might be a Judge in the High Court 
                  and a Viewer in the Magistrates Court. When you switch organisations, your permissions change automatically.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What's the difference between Super Admin and Administrator?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <strong>Super Admins</strong> have access to the entire Totolaw platform across all organisations. 
                  They're typically IT staff or platform managers. <strong>Administrators</strong> have full control 
                  within their specific organisation but cannot access other organisations.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Can roles be customized?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Yes! Administrators can create custom roles with specific combinations of permissions. 
                  This allows organisations to tailor access control to their specific workflows and requirements.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What happens if I'm assigned multiple roles?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  You get the combined permissions from all your assigned roles. For example, if you're both 
                  a "Staff" and a "Viewer", you have all permissions from both roles. However, if you have an 
                  explicit DENY permission, it overrides all role permissions.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How long do permissions last?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Permissions from roles last as long as you have that role assigned. Administrators can optionally 
                  set expiration dates on specific permission grants or role assignments for temporary access.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Getting Help */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-pink-600" />
              </div>
              <Heading as="h2" className="text-3xl">Need Help?</Heading>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <Users className="h-8 w-8 mx-auto text-blue-600" />
                    <p className="font-semibold">Contact Your Admin</p>
                    <p className="text-sm text-muted-foreground">
                      Your organisation's administrator can help with role assignments and access issues
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <BookOpen className="h-8 w-8 mx-auto text-green-600" />
                    <p className="font-semibold">Read More Help</p>
                    <p className="text-sm text-muted-foreground">
                      Check out other help pages for detailed guides
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/help">View All Help</Link>
                    </Button>
                  </div>
                  <div className="text-center space-y-2">
                    <AlertCircle className="h-8 w-8 mx-auto text-purple-600" />
                    <p className="font-semibold">Technical Support</p>
                    <p className="text-sm text-muted-foreground">
                      For system issues, contact support
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="mailto:support@totolaw.org">Email Support</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
