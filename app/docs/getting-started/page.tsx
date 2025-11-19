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

            {/* Quick Start for Busy Users */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  🚀 Need to Start Right Away?
                </CardTitle>
                <CardDescription className="text-base">The 3 things you need to do first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white p-4 rounded-lg border-l-4 border-l-green-600">
                  <p className="font-semibold text-lg mb-2">1️⃣ Sign In</p>
                  <p className="text-sm">Click the <strong>"Sign In"</strong> button → Enter your email → Check your email inbox → Click the link in the email</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-l-blue-600">
                  <p className="font-semibold text-lg mb-2">2️⃣ Look Around</p>
                  <p className="text-sm">After signing in, you&apos;ll see the main menu on the left side. Click on <strong>"Cases"</strong> to see all cases.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-l-purple-600">
                  <p className="font-semibold text-lg mb-2">3️⃣ Try Creating Something</p>
                  <p className="text-sm">In the Cases page, click the <strong>"New Case"</strong> button to practice creating a case.</p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">💡 That&apos;s it! Keep reading below to learn more details.</p>
              </CardContent>
            </Card>

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
                  <strong>Totolaw</strong> (pronounced "TOH-toh-law") comes from the Fijian word <strong>"Totolo"</strong> meaning "fast". 
                  Think of it as a <strong>digital filing system for your court</strong>. Instead of keeping everything in paper folders, 
                  you can organize cases, schedule hearings, store documents, and find information quickly on your computer or phone.
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
                      <h3 className="font-semibold text-lg">Sign In (Log In to the System)</h3>
                      <p className="text-muted-foreground">
                        <strong>What to do:</strong> Enter your email address, then check your email inbox. You&apos;ll receive an email with a link to click. 
                        That&apos;s how you get in - <strong>no password needed!</strong> (This is called a "login link" or "magic link".)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">Explore the Dashboard (Your Home Page)</h3>
                      <p className="text-muted-foreground">
                        <strong>What you&apos;ll see:</strong> On the left side of your screen, there&apos;s a menu with buttons. The main ones are:
                        <strong> Cases</strong> (📁 view all court cases), 
                        <strong> Hearings</strong> (📅 court dates), 
                        <strong> Documents</strong> (📄 files), and 
                        <strong> Search</strong> (🔍 find anything). Click each one to see what&apos;s inside.
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
                    <h4 className="font-semibold mb-1">Organisations (Your Court or Office)</h4>
                    <p className="text-sm text-muted-foreground">
                      Think of an organisation like a separate building. Each court has its own organisation, and you can only see 
                      the cases and information from <strong>your court</strong>. Other courts can&apos;t see your data, and you can&apos;t see theirs. 
                      You join an organisation when someone invites you via email.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Roles & Permissions (What You Can Do)</h4>
                    <p className="text-sm text-muted-foreground">
                      Your "role" determines what buttons you can click. Like job titles:
                      <br/>• <strong>Admin</strong> = Boss (can do everything, add/remove people)
                      <br/>• <strong>Staff</strong> = Court clerk (can create cases, upload files, schedule hearings)
                      <br/>• <strong>Viewer</strong> = Guest (can only look, can&apos;t change anything)
                      <br/>Your administrator assigns your role when they invite you.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Cases</h4>
                    <p className="text-sm text-muted-foreground">
                      The central unit of work. Each case has a title, type, status, and can be assigned to specific users.
                      Cases track all related information in one place.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Hearings</h4>
                    <p className="text-sm text-muted-foreground">
                      Court appearances scheduled for specific dates and locations. Each hearing is linked to a case.
                      View hearings in a calendar or list format.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Evidence</h4>
                    <p className="text-sm text-muted-foreground">
                      Documents, images, audio files, and other materials linked to cases. All evidence is encrypted
                      and stored securely with access controls.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Global search lets you quickly find cases, hearings, and evidence across your organisation's data.
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
                  <p>Use the sidebar menu to navigate between Cases, Hearings, Evidence, and Search</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>The Dashboard shows a summary of recent activity and statistics</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>Use the Organisation Switcher (if you belong to multiple organisations)</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>Click your profile to access Settings and Logout</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>The Search feature lets you quickly find anything across your organisation</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <p>On mobile, tap the menu icon to open the navigation sidebar</p>
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
