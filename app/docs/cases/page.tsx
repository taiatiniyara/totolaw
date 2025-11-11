/**
 * Public Case Management Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import { ArrowLeft, FileText, Plus, Search, Eye, Edit, CheckCircle2 } from "lucide-react";

export default function CasesGuidePage() {
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
                <Heading as="h1" className="text-4xl flex items-center gap-3">
                  <FileText className="h-10 w-10" />
                  Case Management
                </Heading>
                <p className="text-lg text-muted-foreground">
                  Learn how to create, manage, and track court cases
                </p>
              </div>
            </div>

            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What Are Cases?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Cases are the central unit of work in Totolaw. Each case represents a legal matter with its own:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Case number and title</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Parties involved</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Case status</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Related hearings</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Evidence and documents</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Notes and updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creating Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Plus className="h-6 w-6" />
                  Creating a New Case
                </CardTitle>
                <CardDescription>Step-by-step guide to creating a case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Navigate to Cases</h4>
                      <p className="text-sm text-muted-foreground">
                        Click "Cases" in the sidebar menu to open the cases page
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Click "New Case"</h4>
                      <p className="text-sm text-muted-foreground">
                        Look for the "New Case" button in the top right corner
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Fill in Case Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Enter the case number, title, description, and parties involved
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Set Case Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose the appropriate status: Open, In Progress, Closed, etc.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">Save</h4>
                      <p className="text-sm text-muted-foreground">
                        Click "Save" to create the case. You can always edit it later.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Viewing Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Viewing Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Cases List</h4>
                    <p className="text-sm text-muted-foreground">
                      The main Cases page shows all cases you have access to. You can sort, filter, and search through cases.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Case Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Click on any case to view its full details, including parties, hearings, evidence, and history.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Status Indicators</h4>
                    <p className="text-sm text-muted-foreground">
                      Cases are color-coded by status to help you quickly identify their current state.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editing Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Edit className="h-6 w-6" />
                  Editing Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To edit a case, open the case details page and click the "Edit" button. You can update:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Case title and description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Parties involved (plaintiff, defendant, attorneys)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Case status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Important dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Notes and additional information</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground pt-2">
                  Note: Some fields may be restricted based on your role and permissions.
                </p>
              </CardContent>
            </Card>

            {/* Common Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Common Case Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border space-y-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Add Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep track of case developments with timestamped notes
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border space-y-2">
                    <Search className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Link Evidence</h4>
                    <p className="text-sm text-muted-foreground">
                      Attach relevant documents and evidence to the case
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border space-y-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Schedule Hearings</h4>
                    <p className="text-sm text-muted-foreground">
                      Create hearings directly from the case page
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border space-y-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Update Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Change case status as it progresses through the court system
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Status Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Understanding Case Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
                  <p className="font-semibold">Open</p>
                  <p className="text-sm">Case has been filed but not yet assigned or started</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <p className="font-semibold">In Progress</p>
                  <p className="text-sm">Case is actively being worked on</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950">
                  <p className="font-semibold">Pending</p>
                  <p className="text-sm">Waiting for external action or information</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950">
                  <p className="font-semibold">Closed</p>
                  <p className="text-sm">Case has been resolved and is no longer active</p>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use clear, descriptive case titles that include key information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Keep case status updated to reflect current state</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Add detailed notes for important developments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Link all relevant evidence and documents to the case</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use the search feature to avoid creating duplicate cases</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Related Guides */}
            <Card className="border-primary">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Related Guides</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                      <Link href="/docs/hearings">Hearings</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/docs/evidence">Evidence</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/docs/search">Search</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
