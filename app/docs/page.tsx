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
                    <div className="p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-1">Multi-Tenant Security</p>
                      <p className="text-xs text-muted-foreground">
                        Each organisation's data is completely isolated and secure
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-1">Role-Based Access</p>
                      <p className="text-xs text-muted-foreground">
                        Admins, Managers, Staff, and Viewers have different permission levels
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-1">Passwordless Login</p>
                      <p className="text-xs text-muted-foreground">
                        Secure magic link authentication via email
                      </p>
                    </div>
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
