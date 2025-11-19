/**
 * Public Documentation Hub
 * 
 * Accessible to all users, even unauthenticated
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  BookOpen,
  FileText,
  Calendar,
  Upload,
  Shield,
  HelpCircle,
  ArrowRight,
  Home,
  Users,
  Crown,
  Briefcase,
  UserCheck,
  Eye,
} from "lucide-react";

export default function PublicDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Heading as="h1" className="text-4xl md:text-5xl">
                Documentation & User Guides
              </Heading>
              <p className="text-lg font-semibold text-primary max-w-2xl mx-auto">
                Totolo - Fast, Efficient Justice for the Pacific
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn how to use Totolaw effectively with our comprehensive guides
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/login">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Access for Common Tasks */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  ⚡ Quick Access: Common Tasks
                </CardTitle>
                <CardDescription className="text-base">
                  Jump straight to what you need to do right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  <Link 
                    href="/auth/login" 
                    className="block p-4 rounded-lg bg-white border-2 border-green-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base mb-1">🔑 Sign In / Log In</p>
                        <p className="text-xs text-muted-foreground">Get into the system to start work</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-green-600" />
                    </div>
                  </Link>
                  
                  <Link 
                    href="/docs/cases" 
                    className="block p-4 rounded-lg bg-white border hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base mb-1">📁 How to Create a Case</p>
                        <p className="text-xs text-muted-foreground">Step-by-step guide to filing cases</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>

                  <Link 
                    href="/docs/evidence" 
                    className="block p-4 rounded-lg bg-white border hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base mb-1">📄 How to Upload Documents</p>
                        <p className="text-xs text-muted-foreground">Add files to your cases</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>

                  <Link 
                    href="/docs/hearings" 
                    className="block p-4 rounded-lg bg-white border hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base mb-1">📅 How to Schedule Hearings</p>
                        <p className="text-xs text-muted-foreground">Put court dates on the calendar</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription className="text-base">
                  New to Totolaw? Start here to learn the basics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link 
                    href="/docs/getting-started" 
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">Getting Started</p>
                        <p className="text-sm text-muted-foreground">Learn the basics and set up your account</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* User Manuals - NEW SECTION */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-blue-600" />
                  User Manuals by Role
                </CardTitle>
                <CardDescription className="text-base">
                  Step-by-step guides tailored to your role in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Link 
                    href="/docs/user-manual/super-admin" 
                    className="block p-4 rounded-lg bg-white border border-purple-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-5 w-5 text-purple-600" />
                      <p className="font-semibold">Super Administrator</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Platform-wide system management
                    </p>
                  </Link>

                  <Link 
                    href="/docs/user-manual/administrator" 
                    className="block p-4 rounded-lg bg-white border border-red-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      <p className="font-semibold">Administrator</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Organisation-level management
                    </p>
                  </Link>

                  <Link 
                    href="/docs/user-manual/judge" 
                    className="block p-4 rounded-lg bg-white border border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <p className="font-semibold">Judge / Manager</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Case and hearing management
                    </p>
                  </Link>

                  <Link 
                    href="/docs/user-manual/staff" 
                    className="block p-4 rounded-lg bg-white border border-green-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      <p className="font-semibold">Staff / Court Clerk</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Daily operations and administration
                    </p>
                  </Link>

                  <Link 
                    href="/docs/user-manual/viewer" 
                    className="block p-4 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="h-5 w-5 text-gray-600" />
                      <p className="font-semibold">Viewer</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Read-only case access
                    </p>
                  </Link>

                  <Link 
                    href="/docs/user-manual" 
                    className="block p-4 rounded-lg bg-white border-2 border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <p className="font-semibold text-blue-600">View All Manuals</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Complete guide with all roles
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Feature Guides */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Core Features</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/cases">
                    <CardHeader>
                      <FileText className="h-10 w-10 text-primary mb-3" />
                      <CardTitle className="text-xl">Case Management</CardTitle>
                      <CardDescription className="text-base">
                        Create, track, and manage court cases
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/hearings">
                    <CardHeader>
                      <Calendar className="h-10 w-10 text-primary mb-3" />
                      <CardTitle className="text-xl">Hearings</CardTitle>
                      <CardDescription className="text-base">
                        Schedule and manage court hearings
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/evidence">
                    <CardHeader>
                      <Upload className="h-10 w-10 text-primary mb-3" />
                      <CardTitle className="text-xl">Evidence & Documents</CardTitle>
                      <CardDescription className="text-base">
                        Upload and organize case evidence
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="h-6 w-6" />
                    Security & Access
                  </CardTitle>
                  <CardDescription className="text-base">
                    Understanding security and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link 
                      href="/docs/rbac" 
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm mb-1">Roles & Permissions (Who Can Do What)</p>
                          <p className="text-xs text-muted-foreground">
                            Understand what different people can do in the system
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                    <Link 
                      href="/docs/security" 
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm mb-1">Data Privacy & Security</p>
                          <p className="text-xs text-muted-foreground">
                            How we keep your court&apos;s information private and safe
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                    <Link 
                      href="/docs/authentication" 
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm mb-1">How to Sign In (No Password Needed)</p>
                          <p className="text-xs text-muted-foreground">
                            Login using a link sent to your email - no password to remember!
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <HelpCircle className="h-6 w-6" />
                    Support
                  </CardTitle>
                  <CardDescription className="text-base">
                    Get help when you need it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/docs/faq" className="block text-sm text-primary hover:underline">
                      Frequently Asked Questions
                    </Link>
                    <div className="pt-2 mt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Need more help?</p>
                      <p className="text-xs text-muted-foreground">
                        Contact your system administrator or email{" "}
                        <a href="mailto:support@totolaw.org" className="text-primary hover:underline">
                          support@totolaw.org
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center space-y-4">
                <Heading as="h2" className="text-2xl md:text-3xl">
                  Ready to Get Started?
                </Heading>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Sign in to access all features and start managing your court cases efficiently.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="/auth/login">
                    Sign In Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Made with ❤️ for Pacific Island Court Systems</p>
          <p className="mt-2">© 2025 Totolaw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
