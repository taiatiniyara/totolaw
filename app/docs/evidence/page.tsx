/**
 * Public Evidence & Documents Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import { ArrowLeft, Upload, CheckCircle2, Shield, FileText, Image, Video, Music } from "lucide-react";

export default function EvidenceGuidePage() {
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
                  <Upload className="h-10 w-10" />
                  Evidence & Documents
                </Heading>
                <p className="text-lg text-muted-foreground">
                  Manage and secure case evidence and documents
                </p>
              </div>
            </div>

            {/* What is Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What is Evidence?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Evidence section allows you to upload, organize, and securely store all documents and media related to your cases:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Legal documents</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Photos and images</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Audio recordings</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Video files</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Transcripts</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Other files</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploading Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Uploading Evidence
                </CardTitle>
                <CardDescription>How to add files to cases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Navigate to Evidence</h4>
                      <p className="text-sm text-muted-foreground">
                        Click "Evidence" or "Documents" in the sidebar menu
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Click "Upload Evidence"</h4>
                      <p className="text-sm text-muted-foreground">
                        Look for the upload button in the top right corner
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Select Files</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose files from your computer or drag and drop them
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Link to Case</h4>
                      <p className="text-sm text-muted-foreground">
                        Select which case the evidence relates to (required)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">Add Description</h4>
                      <p className="text-sm text-muted-foreground">
                        Add a description to provide context about the evidence file
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      6
                    </div>
                    <div>
                      <h4 className="font-semibold">Upload</h4>
                      <p className="text-sm text-muted-foreground">
                        Files are securely uploaded and encrypted
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported File Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Supported File Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border space-y-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">Documents</h4>
                      <p className="text-sm text-muted-foreground">
                        PDF, DOC, DOCX, TXT, RTF
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border space-y-3">
                    <Image className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold">Images</h4>
                      <p className="text-sm text-muted-foreground">
                        JPG, JPEG, PNG, GIF, WEBP
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border space-y-3">
                    <Video className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold">Video</h4>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV, AVI, WEBM
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border space-y-3">
                    <Music className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Audio</h4>
                      <p className="text-sm text-muted-foreground">
                        MP3, WAV, M4A, OGG
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Maximum file size: 100MB per file. Contact your administrator for larger files.
                </p>
              </CardContent>
            </Card>

            {/* Viewing Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Viewing Evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Evidence List</h4>
                    <p className="text-sm text-muted-foreground">
                      Browse all evidence with filtering, sorting, and search capabilities. Filter by case, type, or date.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Case View</h4>
                    <p className="text-sm text-muted-foreground">
                      When viewing a case, see all related evidence in one place. Click any item to view or download.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-1">Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Preview documents, images, and videos directly in the browser without downloading.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="border-yellow-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-yellow-600" />
                  Security Features
                </CardTitle>
                <CardDescription>How your evidence is protected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Encrypted Storage</p>
                      <p className="text-sm text-muted-foreground">
                        All files are encrypted at rest and in transit using industry-standard encryption
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Access Control</p>
                      <p className="text-sm text-muted-foreground">
                        Only authorized users with proper permissions can view or download evidence
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Audit Trail</p>
                      <p className="text-sm text-muted-foreground">
                        All access and modifications are logged for security and compliance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Secure Deletion</p>
                      <p className="text-sm text-muted-foreground">
                        Deleted files are securely removed and cannot be recovered
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizing Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Organizing Evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border">
                    <h4 className="font-semibold">Case Linking</h4>
                    <p className="text-sm text-muted-foreground">
                      Each evidence file is linked to a specific case. View all evidence for a case on the case details page.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border">
                    <h4 className="font-semibold">Descriptions</h4>
                    <p className="text-sm text-muted-foreground">
                      Add detailed descriptions to provide context for each piece of evidence
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border">
                    <h4 className="font-semibold">File Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Evidence includes file name, size, type, upload date, and who submitted it
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border">
                    <h4 className="font-semibold">Searchable</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the global search feature to find evidence by file name or description
                    </p>
                  </div>
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
                    <span>Use clear, descriptive filenames before uploading</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Add detailed descriptions to provide context</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tag evidence consistently for easy searching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Link evidence to the correct case(s) immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Verify sensitive files are properly secured</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Regularly review and organize uploaded evidence</span>
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
                      <Link href="/docs/security">Security</Link>
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
