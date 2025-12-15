/**
 * User Manual Index Page
 * 
 * Public documentation hub for all user role manuals
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Crown,
  Shield,
  Briefcase,
  UserCheck,
  Eye,
  Users,
  BookOpen,
  ArrowRight,
  Home,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function UserManualIndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                User Manuals
              </Heading>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Complete guides for every role in Totolaw. Select your role below to access 
                detailed instructions and best practices.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild>
                  <Link href="/docs">
                    <Home className="mr-2 h-4 w-4" />
                    Documentation Home
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/docs/getting-started">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Getting Started
                  </Link>
                </Button>
              </div>
            </div>

            {/* Introduction */}
            <section className="space-y-6">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      About These Manuals
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Different people in your court have different jobs. Totolaw gives you access to only the features 
                      you need for <strong>your job</strong>. For example, a court clerk can create cases, but only an 
                      administrator can add new staff members. These manuals show you exactly what you can do in your role.
                    </p>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="font-semibold text-sm mb-2">What you'll find in each manual:</p>
                      <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                        <li>• Overview of role capabilities and limitations</li>
                        <li>• Step-by-step instructions for common tasks</li>
                        <li>• Best practices and tips</li>
                        <li>• Related documentation and resources</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Role Manuals */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role-Specific Manuals</Heading>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Super Admin */}
                <Card className="border-purple-200 bg-purple-50/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Crown className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Super Administrator</CardTitle>
                        <CardDescription>Platform-wide system management</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Complete guide for platform administrators with unrestricted access across 
                      all organisations and system settings.
                    </p>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-2">You'll Learn:</p>
                      <ul className="text-xs space-y-1 ml-4 text-muted-foreground">
                        <li>• Creating and managing organisations</li>
                        <li>• Granting/revoking Super Admin status</li>
                        <li>• System configuration and settings</li>
                        <li>• Monitoring and audit logs</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/docs/user-manual/super-admin">
                        View Super Admin Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Administrator */}
                <Card className="border-red-200 bg-red-50/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Administrator</CardTitle>
                        <CardDescription>Organisation-level management</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Guide for administrators - the people who manage the court&apos;s Totolaw account, 
                      add new staff members, and control who can do what.
                    </p>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-2">You\'ll Learn:</p>
                      <ul className="text-xs space-y-1 ml-4 text-muted-foreground">
                        <li>• How to invite new staff to use Totolaw</li>
                        <li>• How to give people the right level of access</li>
                        <li>• How to approve or reject access requests</li>
                        <li>• How to change your court&apos;s settings</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/docs/user-manual/administrator">
                        View Administrator Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Judge/Manager */}
                <Card className="border-blue-200 bg-blue-50/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Judge / Manager</CardTitle>
                        <CardDescription>Case and hearing management</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Guide for judges, magistrates, and case managers - the people who oversee cases, 
                      make decisions, and manage court hearings.
                    </p>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-2">You\'ll Learn:</p>
                      <ul className="text-xs space-y-1 ml-4 text-muted-foreground">
                        <li>• How to view and update case information</li>
                        <li>• How to set hearing dates and times</li>
                        <li>• How to access case documents and evidence</li>
                        <li>• How to record decisions and orders</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/docs/user-manual/judge">
                        View Judge/Manager Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Staff/Clerk */}
                <Card className="border-green-200 bg-green-50/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Staff / Court Clerk</CardTitle>
                        <CardDescription>Daily operations and administration</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Guide for court staff and clerks - the people who handle day-to-day work like 
                      filing new cases, uploading paperwork, and organizing court schedules.
                    </p>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-2">You\'ll Learn:</p>
                      <ul className="text-xs space-y-1 ml-4 text-muted-foreground">
                        <li>• How to file a new case in the system</li>
                        <li>• How to add documents to a case</li>
                        <li>• How to put hearings on the calendar</li>
                        <li>• How to type up what was said in court</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/docs/user-manual/staff">
                        View Staff/Clerk Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Viewer */}
                <Card className="border-gray-200 bg-gray-50/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Eye className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Viewer</CardTitle>
                        <CardDescription>Read-only case access</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Guide for viewers - people who can <strong>look but not touch</strong>. You can see cases 
                      and read documents, but you can&apos;t create new cases or change anything.
                    </p>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-2">You\'ll Learn:</p>
                      <ul className="text-xs space-y-1 ml-4 text-muted-foreground">
                        <li>• How to look up case details</li>
                        <li>• How to open and read documents</li>
                        <li>• How to see the hearing calendar</li>
                        <li>• How to search for specific cases</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/docs/user-manual/viewer">
                        View Viewer Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Quick Reference */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-amber-600" />
                </div>
                <Heading as="h2" className="text-3xl">Not Sure Which Manual?</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Choose your manual based on your role and what you need to do:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold text-sm mb-3">I need to...</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Manage users and settings</strong>
                              <p className="text-xs text-muted-foreground">→ Administrator Guide</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Manage cases and make rulings</strong>
                              <p className="text-xs text-muted-foreground">→ Judge/Manager Guide</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Create cases and upload documents</strong>
                              <p className="text-xs text-muted-foreground">→ Staff/Clerk Guide</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Only view and search cases</strong>
                              <p className="text-xs text-muted-foreground">→ Viewer Guide</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          Check Your Role
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>To see what role you have:</p>
                          <ol className="space-y-1 ml-4 text-xs">
                            <li>1. Log in to Totolaw</li>
                            <li>2. Go to your profile (click your name in top right)</li>
                            <li>3. View your assigned roles</li>
                          </ol>
                          <p className="mt-3 text-xs">
                            <strong>Note:</strong> You may have multiple roles. If so, review the manuals 
                            for all your assigned roles.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Related Documentation */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-pink-600" />
                </div>
                <Heading as="h2" className="text-3xl">Related Documentation</Heading>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/getting-started" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <h3 className="font-semibold">Getting Started</h3>
                      <p className="text-xs text-muted-foreground">
                        New to Totolaw? Start here
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Read guide <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/rbac" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Shield className="h-8 w-8 text-purple-600" />
                      <h3 className="font-semibold">RBAC System</h3>
                      <p className="text-xs text-muted-foreground">
                        Understand roles and permissions
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Learn more <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/faq" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <HelpCircle className="h-8 w-8 text-amber-600" />
                      <h3 className="font-semibold">FAQ</h3>
                      <p className="text-xs text-muted-foreground">
                        Frequently asked questions
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        View FAQs <ArrowRight className="ml-1 h-3 w-3" />
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
                    <h3 className="font-semibold text-lg">Need Additional Help?</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                      If you can't find what you're looking for in these manuals, contact your 
                      organisation's administrator or access our support resources.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild variant="outline">
                        <Link href="/docs">
                          <BookOpen className="mr-2 h-4 w-4" />
                          All Documentation
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
