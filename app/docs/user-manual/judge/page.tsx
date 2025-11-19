/**
 * Judge/Manager User Manual
 * 
 * Public documentation page for Judge/Manager role
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Briefcase,
  Calendar,
  FileText,
  Folder,
  Gavel,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  BookOpen,
  Search,
  Users,
  Clock,
  Eye,
} from "lucide-react";

export default function JudgeManualPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Briefcase className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Judge/Manager Guide
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete guide to managing cases, scheduling hearings, and making rulings
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role Overview</Heading>
              </div>

              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-base">
                      As a <strong>Judge/Manager</strong>, you have comprehensive access to case management, 
                      hearing scheduling, and evidence handling. You can create cases, schedule hearings, 
                      upload evidence, and make rulings.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        Your Capabilities
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-green-700">✓ You Can:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Create and manage cases</li>
                            <li>• Schedule and conduct hearings</li>
                            <li>• Upload and view evidence</li>
                            <li>• Make rulings and orders</li>
                            <li>• Assign cases to other judges</li>
                            <li>• Generate daily cause lists</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-red-700">✗ You Cannot:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Invite or manage users</li>
                            <li>• Assign roles</li>
                            <li>• Configure system settings</li>
                            <li>• Access other organisations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Case Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Folder className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">Case Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Creating a New Case</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">1.</span>
                        <div>
                          <p className="font-medium">Navigate to Cases</p>
                          <p className="text-xs text-muted-foreground">Go to <strong>Dashboard → Cases</strong></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">2.</span>
                        <div>
                          <p className="font-medium">Click "Create Case"</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">3.</span>
                        <div>
                          <p className="font-medium">Enter Case Details</p>
                          <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                            <li>• Case Type (Civil, Criminal, Family, etc.)</li>
                            <li>• Case Title</li>
                            <li>• Filing Date</li>
                            <li>• Parties (Plaintiff, Defendant, etc.)</li>
                            <li>• Description</li>
                          </ul>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">4.</span>
                        <div>
                          <p className="font-medium">Assign Judge (Optional)</p>
                          <p className="text-xs text-muted-foreground">Assign to yourself or another judge</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">5.</span>
                        <div>
                          <p className="font-medium">Save Case</p>
                          <p className="text-xs text-muted-foreground">Case number is auto-generated</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Viewing and Updating Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Eye className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">View Case Details</p>
                          <p className="text-xs text-muted-foreground">
                            Click on any case to see full details, parties, hearings, documents, and evidence
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Update Case Status</p>
                          <p className="text-xs text-muted-foreground">
                            Change status to Active, Pending, Closed, etc.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Add Case Notes</p>
                          <p className="text-xs text-muted-foreground">
                            Add internal notes, rulings, or updates to the case
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Hearing Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">Hearing Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scheduling a Hearing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">1.</span>
                        <div>
                          <p className="font-medium">Open Case</p>
                          <p className="text-xs text-muted-foreground">Navigate to the relevant case</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">2.</span>
                        <div>
                          <p className="font-medium">Go to Hearings Tab</p>
                          <p className="text-xs text-muted-foreground">Click "Schedule Hearing"</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">3.</span>
                        <div>
                          <p className="font-medium">Enter Hearing Details</p>
                          <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                            <li>• Date and Time</li>
                            <li>• Hearing Type (Mention, Trial, Sentencing, etc.)</li>
                            <li>• Courtroom</li>
                            <li>• Presiding Judge</li>
                            <li>• Duration</li>
                            <li>• Notes or Special Instructions</li>
                          </ul>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">4.</span>
                        <div>
                          <p className="font-medium">Save Hearing</p>
                          <p className="text-xs text-muted-foreground">
                            Hearing appears in daily cause list and calendar
                          </p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Cause Lists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        View your daily schedule and all hearings:
                      </p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="font-semibold mb-2">Accessing Cause Lists:</p>
                        <ul className="space-y-1 ml-4 text-muted-foreground">
                          <li>• Go to <strong>Dashboard → Calendar</strong></li>
                          <li>• Select date to view hearings</li>
                          <li>• Filter by courtroom or judge</li>
                          <li>• Export to PDF for printing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Documents & Evidence */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <Heading as="h2" className="text-3xl">Documents & Evidence</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uploading Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <ol className="space-y-2">
                        <li>1. Open case and go to <strong>Documents</strong> tab</li>
                        <li>2. Click <strong>"Upload Document"</strong></li>
                        <li>3. Select document type (Affidavit, Motion, Order, etc.)</li>
                        <li>4. Add description and metadata</li>
                        <li>5. Upload file (PDF, Word, images supported)</li>
                      </ol>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-xs text-blue-900">
                          <strong>Tip:</strong> Documents are automatically timestamped and logged for audit trail
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Managing Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Upload className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Upload Evidence</p>
                          <p className="text-xs text-muted-foreground">
                            Go to Evidence tab → Upload → Select type (Physical, Documentary, Digital)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Chain of Custody</p>
                          <p className="text-xs text-muted-foreground">
                            System automatically tracks who uploaded, viewed, or modified evidence
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Making Rulings */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Gavel className="h-6 w-6 text-amber-600" />
                </div>
                <Heading as="h2" className="text-3xl">Making Rulings</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Record rulings and orders directly in the case:
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <ol className="space-y-2 text-sm">
                        <li>1. Open case details</li>
                        <li>2. Go to <strong>Rulings</strong> section</li>
                        <li>3. Click <strong>"Add Ruling"</strong></li>
                        <li>4. Enter ruling text or upload judgment document</li>
                        <li>5. Set effective date</li>
                        <li>6. Save ruling</li>
                      </ol>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <p className="text-xs text-amber-900">
                        <strong>Note:</strong> Rulings are permanently logged and cannot be deleted, only amended with new entries
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Search & Reporting */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Search className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">Search & Reporting</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Search className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Advanced Search</p>
                        <p className="text-xs text-muted-foreground">
                          Search cases by number, party name, judge, date range, or case type
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Generate Reports</p>
                        <p className="text-xs text-muted-foreground">
                          Create reports on case statistics, hearing schedules, and workload
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <Heading as="h2" className="text-3xl">Best Practices</Heading>
              </div>

              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Update Cases Promptly</p>
                        <p className="text-xs text-muted-foreground">
                          Record rulings and updates as soon as hearings conclude
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Review Daily Cause List</p>
                        <p className="text-xs text-muted-foreground">
                          Check your schedule each morning to prepare for hearings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Maintain Evidence Chain</p>
                        <p className="text-xs text-muted-foreground">
                          Always document evidence uploads and viewing for audit purposes
                        </p>
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
                    <Link href="/docs/cases" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Folder className="h-8 w-8 text-green-600" />
                      <h3 className="font-semibold">Case Management</h3>
                      <p className="text-xs text-muted-foreground">
                        Detailed case management guide
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Read more <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/hearings" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Calendar className="h-8 w-8 text-purple-600" />
                      <h3 className="font-semibold">Hearing Guide</h3>
                      <p className="text-xs text-muted-foreground">
                        Scheduling and managing hearings
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        Learn more <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/user-manual" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Users className="h-8 w-8 text-blue-600" />
                      <h3 className="font-semibold">Other Manuals</h3>
                      <p className="text-xs text-muted-foreground">
                        Guides for other roles
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        View all <ArrowRight className="ml-1 h-3 w-3" />
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
                      Contact your administrator or system support for assistance.
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/help">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Get Support
                      </Link>
                    </Button>
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
