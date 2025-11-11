/**
 * Public Getting Started Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export default function GettingStartedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/docs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Documentation
                </Link>
              </Button>
              
              <div className="space-y-2">
                <Heading as="h1" className="text-4xl">
                  Getting Started with Totolaw
                </Heading>
                <p className="text-lg text-muted-foreground">
                  Everything you need to know to start managing court cases effectively
                </p>
              </div>
            </div>

            {/* What is Totolaw */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  What is Totolaw?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  <strong>Totolaw</strong> comes from the Fijian word <strong>"Totolo"</strong> meaning "fast" or "quick". 
                  It's a comprehensive case management system designed specifically for Pacific Island court systems, 
                  enabling faster, more efficient justice delivery. It helps you organize cases, schedule hearings, 
                  manage evidence, and collaborate with your team.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Case Management</p>
                      <p className="text-sm text-muted-foreground">Track all case details in one place</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Court Hearings</p>
                      <p className="text-sm text-muted-foreground">Schedule and manage hearings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Evidence Storage</p>
                      <p className="text-sm text-muted-foreground">Secure document management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Team Collaboration</p>
                      <p className="text-sm text-muted-foreground">Work together seamlessly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your First Steps</CardTitle>
                <CardDescription>Follow these steps to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">Sign In</h3>
                      <p className="text-muted-foreground">
                        Use your email to receive a magic link and sign in securely. No passwords to remember.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">Explore the Dashboard</h3>
                      <p className="text-muted-foreground">
                        Familiarize yourself with the main navigation menu. Key sections include Cases, Hearings, Evidence, and Search.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">Create Your First Case</h3>
                      <p className="text-muted-foreground">
                        Navigate to Cases and click "New Case" to create your first case entry. Fill in the case details and save.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      4
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">Schedule a Hearing</h3>
                      <p className="text-muted-foreground">
                        Go to Hearings to schedule court hearings linked to your cases. Set the date, time, and location.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      5
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">Upload Evidence</h3>
                      <p className="text-muted-foreground">
                        Use the Evidence section to upload and organize documents related to your cases.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Concepts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Concepts</CardTitle>
                <CardDescription>Important terms and features to understand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Organizations</h4>
                    <p className="text-sm text-muted-foreground">
                      Totolaw is multi-tenant. Each court or legal organization has its own space with isolated data.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Roles & Permissions</h4>
                    <p className="text-sm text-muted-foreground">
                      Users have different roles (Admin, Manager, Staff, Viewer) with varying levels of access to features.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Cases</h4>
                    <p className="text-sm text-muted-foreground">
                      The central unit of work. Each case represents a legal matter with its own details, hearings, and evidence.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Hearings</h4>
                    <p className="text-sm text-muted-foreground">
                      Court appearances scheduled for specific dates. Each hearing is linked to a case and can have transcripts.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Evidence</h4>
                    <p className="text-sm text-muted-foreground">
                      Documents, images, audio files, and other materials relevant to a case. Securely stored and organized.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Navigation Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>Use the sidebar menu to navigate between main sections</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>Click your profile icon to access settings and logout</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>Use the Search feature to quickly find cases, hearings, or documents</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>On mobile, tap the menu icon to open the navigation sidebar</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>Look for the "Help & Docs" link in the sidebar for quick access to guides</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-primary">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Next: Explore Feature Guides</h3>
                  <p className="text-muted-foreground">
                    Now that you understand the basics, dive deeper into specific features:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                      <Link href="/docs/cases">Case Management</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/docs/hearings">Hearings</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/docs/evidence">Evidence</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/docs/faq">FAQ</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/auth/login">
                  Sign In to Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
