/**
 * Viewer User Manual
 * 
 * Public documentation page for Viewer role
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Eye,
  FileText,
  Folder,
  Calendar,
  Search,
  Download,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  BookOpen,
  Users,
  Filter,
} from "lucide-react";

export default function ViewerManualPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Eye className="h-12 w-12 text-gray-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Viewer Guide
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete guide to viewing and searching case information
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
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Eye className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">Role Overview</Heading>
              </div>

              <Card className="border-gray-200 bg-gray-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-base">
                      As a <strong>Viewer</strong>, you have read-only access to case information. You can view 
                      cases, hearings, documents, and evidence, but cannot create, modify, or delete anything.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-gray-600" />
                        Your Access Level
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-green-700">✓ You Can:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• View all cases</li>
                            <li>• View hearings and schedules</li>
                            <li>• View documents</li>
                            <li>• View evidence</li>
                            <li>• Search records</li>
                            <li>• Download documents (if permitted)</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-red-700">✗ You Cannot:</p>
                          <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                            <li>• Create cases</li>
                            <li>• Update case information</li>
                            <li>• Delete anything</li>
                            <li>• Upload documents or evidence</li>
                            <li>• Schedule hearings</li>
                            <li>• Make rulings</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">Purpose of Viewer Role</p>
                          <p className="text-sm text-blue-800">
                            This role is ideal for legal representatives, auditors, external observers, or anyone 
                            who needs to monitor cases without making changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Viewing Cases */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Folder className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">Viewing Cases</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Browsing Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Access the cases list to browse all available cases:
                      </p>
                      
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
                            <p className="font-medium">Browse Case List</p>
                            <p className="text-xs text-muted-foreground">
                              Cases are displayed with case number, title, type, and status
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">3.</span>
                          <div>
                            <p className="font-medium">Click on Any Case</p>
                            <p className="text-xs text-muted-foreground">Opens detailed case information</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Case Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        When viewing a case, you can see:
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Basic Information</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Case number</li>
                            <li>• Case type and status</li>
                            <li>• Filing date</li>
                            <li>• Assigned judge</li>
                            <li>• Case description</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Parties & Representatives</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Plaintiff/Prosecutor</li>
                            <li>• Defendant/Accused</li>
                            <li>• Other parties</li>
                            <li>• Legal representatives</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Hearing Information</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Scheduled hearings</li>
                            <li>• Past hearings</li>
                            <li>• Hearing outcomes</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Documents & Evidence</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Filed documents</li>
                            <li>• Court orders</li>
                            <li>• Evidence items</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Viewing Documents */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <Heading as="h2" className="text-3xl">Viewing Documents</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Accessing Case Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">1.</span>
                          <div>
                            <p className="font-medium">Open Case Details</p>
                            <p className="text-xs text-muted-foreground">Navigate to the relevant case</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">2.</span>
                          <div>
                            <p className="font-medium">Go to Documents Tab</p>
                            <p className="text-xs text-muted-foreground">View list of all filed documents</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold">3.</span>
                          <div>
                            <p className="font-medium">Click on Document</p>
                            <p className="text-xs text-muted-foreground">
                              Opens document viewer or downloads file
                            </p>
                          </div>
                        </li>
                      </ol>

                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold mb-2 text-sm">Document Information Displayed:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                          <li>• Document type (Affidavit, Motion, Order, etc.)</li>
                          <li>• Document title and description</li>
                          <li>• Filed by (party name)</li>
                          <li>• Filing date</li>
                          <li>• File size and format</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="h-5 w-5 text-green-600" />
                      Downloading Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        If permitted, you can download documents for offline viewing:
                      </p>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Click download icon or button on document</p>
                          <p className="text-xs text-muted-foreground">
                            Document is saved to your device
                          </p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-900">
                            <strong>Note:</strong> Download permissions depend on organisation settings. 
                            Some sensitive documents may be view-only.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Viewing Hearings */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">Viewing Hearings</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hearing Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        View hearing schedules in multiple ways:
                      </p>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-1">Calendar View</p>
                          <p className="text-xs text-muted-foreground">
                            Go to <strong>Dashboard → Calendar</strong> to see all hearings by date
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-1">Daily Cause List</p>
                          <p className="text-xs text-muted-foreground">
                            View scheduled hearings for a specific date, organized by courtroom
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold mb-1">Case Hearings</p>
                          <p className="text-xs text-muted-foreground">
                            In case details, view all hearings related to that specific case
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hearing Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        When viewing a hearing, you can see:
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <ul className="space-y-1 ml-4 text-muted-foreground">
                          <li>• Date and time</li>
                          <li>• Hearing type (Mention, Trial, Sentencing, etc.)</li>
                          <li>• Courtroom location</li>
                          <li>• Presiding judge</li>
                          <li>• Related case information</li>
                          <li>• Hearing outcome (if completed)</li>
                          <li>• Transcript (if available)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Searching */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Search className="h-6 w-6 text-indigo-600" />
                </div>
                <Heading as="h2" className="text-3xl">Searching Cases</Heading>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Using Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Quickly find cases using the search functionality:
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold mb-2 text-sm">Search Options:</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Search className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Quick Search:</strong> Use search box in top navigation
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Filter className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Advanced Search:</strong> Go to Dashboard → Search for filters
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold mb-2 text-sm">Search By:</p>
                        <div className="grid md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <ul className="space-y-1">
                            <li>• Case number</li>
                            <li>• Party names</li>
                            <li>• Judge name</li>
                          </ul>
                          <ul className="space-y-1">
                            <li>• Date range</li>
                            <li>• Case type</li>
                            <li>• Status</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-xs text-blue-900">
                          <strong>Tip:</strong> Use filters to narrow down results when searching large case databases
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Tips & Best Practices */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <Heading as="h2" className="text-3xl">Tips for Viewers</Heading>
              </div>

              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Use Bookmarks</p>
                        <p className="text-xs text-muted-foreground">
                          Bookmark frequently accessed cases in your browser for quick access
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Check for Updates Regularly</p>
                        <p className="text-xs text-muted-foreground">
                          Case information is updated in real-time as staff make changes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Save Document Links</p>
                        <p className="text-xs text-muted-foreground">
                          Keep track of important documents by copying their links or downloading them
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Request Additional Access</p>
                        <p className="text-xs text-muted-foreground">
                          If you need to make changes or upload documents, contact your administrator about role changes
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
                    <Link href="/docs/search" className="block space-y-2 hover:opacity-75 transition-opacity">
                      <Search className="h-8 w-8 text-indigo-600" />
                      <h3 className="font-semibold">Search Guide</h3>
                      <p className="text-xs text-muted-foreground">
                        Advanced search techniques
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
                      If you need additional permissions or have questions, contact your organisation's administrator.
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
