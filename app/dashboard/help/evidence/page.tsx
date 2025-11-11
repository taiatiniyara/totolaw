/**
 * Evidence & Documents Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  Film,
  File,
  Download,
  Eye,
  Trash2,
  Shield,
  Info,
} from "lucide-react";

export default function EvidenceHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1">Evidence & Documents Guide</Heading>
          <p className="text-muted-foreground">
            Upload and manage case evidence
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            What is Evidence?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Evidence consists of documents, photos, videos, and other files related to cases. All evidence is securely stored and associated with specific cases for easy access.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Uploading Evidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold">Access Upload Form</p>
                <p className="text-sm text-muted-foreground">Click <strong>Documents</strong> → <strong>Upload Document</strong> or use upload button on case page</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold">Select File & Case</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Choose file from your device</li>
                  <li>• Select associated case</li>
                  <li>• Optionally link to specific hearing</li>
                  <li>• Add description of the evidence</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold">Upload</p>
                <p className="text-sm text-muted-foreground">Click <strong>Upload Evidence</strong> to save</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong>Supported Files:</strong> PDF, Word documents, images (JPG, PNG), videos (MP4), audio files, and more</span>
            </p>
          </div>

          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/evidence/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Evidence
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Type Icons</CardTitle>
          <CardDescription>How different file types are displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 p-2 border rounded">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Documents (PDF, Word)</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Image className="h-4 w-4 text-green-500" />
              <span className="text-sm">Images (JPG, PNG)</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Film className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Videos (MP4, AVI)</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <File className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Other Files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Viewing Evidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Evidence List</h4>
              <p className="text-muted-foreground mb-2">Browse all evidence showing:</p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• File name and type</li>
                <li>• Associated case</li>
                <li>• File size and upload date</li>
                <li>• Download and view options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Evidence by Case</h4>
              <p className="text-muted-foreground">View all evidence for a specific case on the case details page</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Evidence Search</h4>
              <p className="text-muted-foreground">Use global search to find evidence by file name or case</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Download className="h-4 w-4 text-primary" />
                <strong className="text-sm">Download</strong>
              </div>
              <p className="text-xs text-muted-foreground">Save evidence file to your device</p>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-primary" />
                <strong className="text-sm">View Details</strong>
              </div>
              <p className="text-xs text-muted-foreground">See file information and metadata</p>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary" />
                <strong className="text-sm">View Case</strong>
              </div>
              <p className="text-xs text-muted-foreground">Navigate to associated case</p>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trash2 className="h-4 w-4 text-destructive" />
                <strong className="text-sm">Delete</strong>
              </div>
              <p className="text-xs text-muted-foreground">Remove evidence (requires permission)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🔒</span>
              <span>All evidence is encrypted during upload and storage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🔒</span>
              <span>Only users with proper permissions can access evidence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🔒</span>
              <span>Evidence is isolated by organisation - no cross-organisation access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🔒</span>
              <span>All downloads and access are logged for audit purposes</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Use descriptive file names before uploading</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Add detailed descriptions to help identify evidence later</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Upload evidence as soon as it's available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Link evidence to specific hearings when relevant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Verify files are complete and readable after upload</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/cases">Case Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/hearings">Hearings</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/search">Searching</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/security">Security</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
