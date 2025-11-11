/**
 * Public Hearings Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import { ArrowLeft, Calendar, CheckCircle2, Plus } from "lucide-react";

export default function HearingsGuidePage() {
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
                  <Calendar className="h-10 w-10" />
                  Hearings Management
                </Heading>
                <p className="text-lg text-muted-foreground">
                  Schedule and manage court hearings efficiently
                </p>
              </div>
            </div>

            {/* What are Hearings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What Are Hearings?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Hearings are scheduled court appearances linked to specific cases. Each hearing includes:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Date and time</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Location/courtroom</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Linked case</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Hearing type</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Participants</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Transcripts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduling Hearings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Plus className="h-6 w-6" />
                  Scheduling a Hearing
                </CardTitle>
                <CardDescription>Step-by-step guide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Navigate to Hearings</h4>
                      <p className="text-sm text-muted-foreground">
                        Click "Hearings" in the sidebar menu
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Click "New Hearing"</h4>
                      <p className="text-sm text-muted-foreground">
                        Look for the button in the top right corner
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Select the Case</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose which case this hearing is for
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Set Date and Time</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose when the hearing will take place
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">Add Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Specify location, type, and any notes
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      6
                    </div>
                    <div>
                      <h4 className="font-semibold">Save</h4>
                      <p className="text-sm text-muted-foreground">
                        The hearing will appear on the calendar
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Viewing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Viewing Hearings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Calendar View</h4>
                    <p className="text-sm text-muted-foreground">
                      See all hearings in a monthly calendar format. Click any hearing to view details.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">List View</h4>
                    <p className="text-sm text-muted-foreground">
                      View hearings in a sortable list with filtering options. Useful for finding specific hearings.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Case View</h4>
                    <p className="text-sm text-muted-foreground">
                      When viewing a case, all related hearings are displayed in chronological order.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managing Hearings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Managing Hearings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border space-y-2">
                    <h4 className="font-semibold">Reschedule</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit the hearing to change the date, time, or location
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border space-y-2">
                    <h4 className="font-semibold">Add Participants</h4>
                    <p className="text-sm text-muted-foreground">
                      Track who needs to attend the hearing
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border space-y-2">
                    <h4 className="font-semibold">Add Transcripts</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload or create transcripts for the hearing
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border space-y-2">
                    <h4 className="font-semibold">Mark Complete</h4>
                    <p className="text-sm text-muted-foreground">
                      Update status after the hearing concludes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hearing Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Common Hearing Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
                  <p className="font-semibold">Arraignment</p>
                  <p className="text-sm">Initial hearing where charges are read</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <p className="font-semibold">Pre-Trial Conference</p>
                  <p className="text-sm">Meeting to resolve issues before trial</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950">
                  <p className="font-semibold">Motion Hearing</p>
                  <p className="text-sm">Hearing on specific legal motions</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950">
                  <p className="font-semibold">Trial</p>
                  <p className="text-sm">Full court proceeding to determine outcome</p>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950">
                  <p className="font-semibold">Sentencing</p>
                  <p className="text-sm">Hearing to determine punishment</p>
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
                    <span>Schedule hearings as soon as dates are confirmed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Include detailed location information (courtroom, building)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Add all participants who need to attend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Update hearing status promptly after conclusion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Attach transcripts as soon as they're available</span>
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
                      <Link href="/docs/cases">Case Management</Link>
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
