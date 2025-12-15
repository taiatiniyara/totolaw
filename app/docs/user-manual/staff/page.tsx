/**
 * Staff/Clerk User Manual
 * 
 * Public documentation page for Staff/Clerk role
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  UserCheck,
  FileText,
  Upload,
  Calendar,
  Folder,
  Edit,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  BookOpen,
  Clock,
  Users,
  Search,
  XCircle,
} from "lucide-react";

export default function StaffManualPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <UserCheck className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Staff/Clerk Guide
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete guide to daily court operations and case administration
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

            {/* Quick Reference */}
            <section className="space-y-6">
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-4 text-center">🔖 Quick Reference: Most Common Tasks</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-semibold text-green-700 mb-1">📁 Create a New Case</p>
                      <p className="text-xs text-muted-foreground">Left menu → <strong>Cases</strong> → <strong>"Create Case"</strong> button (top right)</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-semibold text-blue-700 mb-1">📄 Upload a Document</p>
                      <p className="text-xs text-muted-foreground">Open case → <strong>Documents</strong> tab → <strong>"Upload"</strong> button</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-semibold text-purple-700 mb-1">📅 Schedule a Hearing</p>
                      <p className="text-xs text-muted-foreground">Open case → <strong>Hearings</strong> tab → <strong>"Schedule Hearing"</strong></p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-semibold text-amber-700 mb-1">🔍 Find a Case</p>
                      <p className="text-xs text-muted-foreground">Left menu → <strong>Search</strong> → Type case number or name</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Role Overview */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role Overview</Heading>
              </div>

              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-base">
                      As <strong>Court Staff or Clerk</strong>, you handle the day-to-day administrative operations 
                      of the court. You create cases, upload documents, schedule hearings, and maintain records.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Your Responsibilities
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-green-700">✓ You Can:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Create new cases</li>
                            <li>• Update case details</li>
                            <li>• Upload documents</li>
                            <li>• Schedule hearings</li>
                            <li>• Record transcripts</li>
                            <li>• Search and view cases</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-red-700">✗ You Cannot:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Delete cases</li>
                            <li>• Make rulings</li>
                            <li>• Manage users or roles</li>
                            <li>• Change system settings</li>
                            <li>• Access other organisations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Daily Tasks */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <Heading as="h2" className="text-3xl">Daily Tasks</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Starting Your Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <ol className="space-y-2 ml-4">
                        <li>1. <strong>Review Daily Cause List</strong> - Check scheduled hearings for the day</li>
                        <li>2. <strong>Prepare Case Files</strong> - Ensure all documents are ready for hearings</li>
                        <li>3. <strong>Check New Filings</strong> - Process any new case submissions</li>
                        <li>4. <strong>Update Case Statuses</strong> - Mark cases as needed based on outcomes</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Creating Cases */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Folder className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">Creating Cases</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How to Create a New Case</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">1.</span>
                        <div>
                          <p className="font-medium">Go to Cases Page</p>
                          <p className="text-xs text-muted-foreground">
                            👉 Look at the <strong>left side of your screen</strong>. Click the button that says <strong>"Cases"</strong> 📁
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">2.</span>
                        <div>
                          <p className="font-medium">Click "Create Case"</p>
                          <p className="text-xs text-muted-foreground">
                            👉 Look at the <strong>top right corner</strong>. You&apos;ll see a button. Click it.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">3.</span>
                        <div>
                          <p className="font-medium">Fill in Required Information</p>
                          <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                            <li>• <strong>Case Type:</strong> Civil, Criminal, Family, etc.</li>
                            <li>• <strong>Case Title:</strong> Brief description</li>
                            <li>• <strong>Filing Date:</strong> Date case was filed</li>
                            <li>• <strong>Parties:</strong> Add plaintiff, defendant, and other parties</li>
                            <li>• <strong>Legal Representatives:</strong> Add lawyers if known</li>
                          </ul>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 font-semibold">4.</span>
                        <div>
                          <p className="font-medium">Save Case</p>
                          <p className="text-xs text-muted-foreground">
                            🆗 Click the <strong>"Save"</strong> button. The system will automatically create a case number like 
                            <strong>HC-CV-2024-001</strong> (you don&apos;t need to type this yourself!)
                          </p>
                        </div>
                      </li>
                    </ol>

                    <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xs text-blue-900">
                        <strong>Tip:</strong> Case numbers are auto-generated based on your organisation's format. 
                        You don't need to manually enter case numbers.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Updating Case Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Edit className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Edit Case Details</p>
                          <p className="text-xs text-muted-foreground">
                            Click on case → <strong>"Edit"</strong> button → Update information
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Add Parties</p>
                          <p className="text-xs text-muted-foreground">
                            In case details, go to Parties section → <strong>"Add Party"</strong>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Update Status</p>
                          <p className="text-xs text-muted-foreground">
                            Change status to Active, Pending, Closed, etc. as case progresses
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Document Management */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <Heading as="h2" className="text-3xl">Document Management</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5 text-green-600" />
                      Uploading Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Upload case-related documents to keep everything organized:
                      </p>
                      
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
                            <p className="font-medium">Go to Documents Tab</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">3.</span>
                          <div>
                            <p className="font-medium">Click "Upload Document"</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">4.</span>
                          <div>
                            <p className="font-medium">Select Document Details</p>
                            <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                              <li>• Document Type (Affidavit, Motion, Order, etc.)</li>
                              <li>• Document Title/Description</li>
                              <li>• Filed By (Party name)</li>
                              <li>• Filed Date</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">5.</span>
                          <div>
                            <p className="font-medium">Choose File and Upload</p>
                            <p className="text-xs text-muted-foreground">
                              PDF, Word documents, and images are supported
                            </p>
                          </div>
                        </li>
                      </ol>

                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-900">
                            <strong>Important:</strong> Always double-check you're uploading to the correct case. 
                            Documents cannot be moved between cases once uploaded.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Managing Existing Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">View Documents</p>
                          <p className="text-xs text-muted-foreground">
                            Click on any document to view or download
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Update Metadata</p>
                          <p className="text-xs text-muted-foreground">
                            Edit document description or categorization if needed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Cannot Delete</p>
                          <p className="text-xs text-muted-foreground">
                            You don't have permission to delete documents. Contact an administrator if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Scheduling Hearings */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <Heading as="h2" className="text-3xl">Scheduling Hearings</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Schedule hearings for cases:
                    </p>
                    
                    <ol className="space-y-3 text-sm">
                      <li>1. Open the case (click on it from your list), then look for tabs near the top. Click the <strong>"Hearings"</strong> tab</li>
                      <li>2. Click <strong>"Schedule Hearing"</strong></li>
                      <li>3. Enter hearing details:
                        <ul className="ml-6 mt-1 space-y-1 text-xs text-muted-foreground">
                          <li>• Date and time</li>
                          <li>• Hearing type</li>
                          <li>• Courtroom</li>
                          <li>• Presiding judge (if known)</li>
                          <li>• Expected duration</li>
                        </ul>
                      </li>
                      <li>4. Save hearing</li>
                    </ol>

                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xs text-blue-900">
                        <strong>Tip:</strong> Hearings automatically appear in the daily cause list for the selected date
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Transcription */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Edit className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">Recording Transcripts</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Record hearing transcripts manually or upload audio recordings:
                    </p>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2 text-sm">Manual Transcription:</p>
                      <ol className="space-y-1 text-sm ml-4 text-muted-foreground">
                        <li>1. Go to hearing details</li>
                        <li>2. Click <strong>"Add Transcript"</strong></li>
                        <li>3. Type or paste transcript text</li>
                        <li>4. Use the editor to format speaker names and timestamps</li>
                        <li>5. Save transcript</li>
                      </ol>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2 text-sm">Audio Recording:</p>
                      <ol className="space-y-1 text-sm ml-4 text-muted-foreground">
                        <li>1. Go to hearing details</li>
                        <li>2. Click <strong>"Upload Recording"</strong></li>
                        <li>3. Select audio file (MP3, WAV supported)</li>
                        <li>4. Add notes about recording quality or gaps</li>
                        <li>5. Upload</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Searching */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Search className="h-6 w-6 text-pink-600" />
                </div>
                <Heading as="h2" className="text-3xl">Finding Cases</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Quickly find cases using the search function:
                    </p>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p className="font-semibold">Search by:</p>
                      <ul className="ml-4 space-y-1 text-muted-foreground">
                        <li>• Case number</li>
                        <li>• Party names</li>
                        <li>• Judge name</li>
                        <li>• Date range</li>
                        <li>• Case type or status</li>
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      🔍 <strong>Where to find it:</strong> Look at the left menu and click <strong>"Search"</strong>, 
                      OR look at the very top of your screen for a search box (it looks like a text box with a magnifying glass icon)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <Heading as="h2" className="text-3xl">Best Practices</Heading>
              </div>

              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Double-Check Case Numbers</p>
                        <p className="text-xs text-muted-foreground">
                          Always verify you're working on the correct case before making changes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Organize Documents Properly</p>
                        <p className="text-xs text-muted-foreground">
                          Use correct document types and clear descriptions for easy retrieval
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Keep Information Current</p>
                        <p className="text-xs text-muted-foreground">
                          Update case statuses promptly after hearings or significant events
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Verify Party Details</p>
                        <p className="text-xs text-muted-foreground">
                          Ensure names and contact information for parties are accurate
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
                <div className="p-2 bg-rose-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-rose-600" />
                </div>
                <Heading as="h2" className="text-3xl">Related Resources</Heading>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <Link href="/docs/cases" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Folder className="h-8 w-8 text-green-600" />
                      <h3 className="font-semibold">Case Guide</h3>
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

                <Card>
                  <CardContent className="pt-6">
                    <Link href="/dashboard/help" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                      <h3 className="font-semibold">Get Help</h3>
                      <p className="text-xs text-muted-foreground">
                        Contact support or FAQs
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
                      Contact your supervisor or administrator for assistance with any questions.
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
