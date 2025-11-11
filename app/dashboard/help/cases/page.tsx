/**
 * Case Management Guide
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Calendar,
  Upload,
  User,
  Info,
} from "lucide-react";

export default function CasesHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1">Case Management Guide</Heading>
          <p className="text-muted-foreground">
            Learn how to create, track, and manage court cases
          </p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            What is Case Management?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            The Case Management feature allows you to track legal matters from filing through resolution. Each case contains important information like case number, parties involved, type, status, hearings, and evidence.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-3">
              <strong className="text-sm">Case Types:</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Civil, Criminal, Family, Land, Traffic, Administrative
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <strong className="text-sm">Case Statuses:</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Pending, Active, In Progress, Closed, Dismissed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creating a Case */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Creating a New Case
          </CardTitle>
          <CardDescription>Step-by-step guide to creating a case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">Navigate to Cases</p>
              <p className="text-sm text-muted-foreground">
                Click <strong>Cases</strong> in the sidebar menu
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">Click "Create Case"</p>
              <p className="text-sm text-muted-foreground">
                Look for the button in the top right corner
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">Fill in Required Information</p>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>• <strong>Case Number:</strong> Unique identifier (e.g., CIVIL-2024-001)</p>
                <p>• <strong>Title:</strong> Brief description of the case</p>
                <p>• <strong>Type:</strong> Select case category</p>
                <p>• <strong>Status:</strong> Current case status</p>
                <p>• <strong>Description:</strong> Detailed case information</p>
                <p>• <strong>Plaintiff:</strong> Person/entity filing the case</p>
                <p>• <strong>Defendant:</strong> Person/entity being sued</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">Submit the Form</p>
              <p className="text-sm text-muted-foreground">
                Click <strong>Create Case</strong> to save. You'll be redirected to the case details page.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong>Tip:</strong> Make sure the case number follows your organization's format. It should be unique within your organization.</span>
            </p>
          </div>

          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Case
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Viewing Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Viewing and Managing Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Cases List
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                The cases list shows all cases you have access to. Each case displays:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Case number and title</li>
                <li>• Case type and status (with colored badges)</li>
                <li>• Plaintiff and defendant names</li>
                <li>• Date created</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Finding Cases
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                You can find cases using:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Search:</strong> Type case number, title, or party names</li>
                <li>• <strong>Filter:</strong> Filter by type or status</li>
                <li>• <strong>Sort:</strong> Order by date, case number, or title</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Case Details Page
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Click on any case to view its details. The details page shows:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                <div className="border rounded p-2">
                  <strong>Case Information:</strong>
                  <p className="text-muted-foreground text-xs">Number, type, status, dates, parties</p>
                </div>
                <div className="border rounded p-2">
                  <strong>Hearings:</strong>
                  <p className="text-muted-foreground text-xs">All scheduled hearings</p>
                </div>
                <div className="border rounded p-2">
                  <strong>Evidence:</strong>
                  <p className="text-muted-foreground text-xs">Uploaded documents and files</p>
                </div>
                <div className="border rounded p-2">
                  <strong>Quick Actions:</strong>
                  <p className="text-muted-foreground text-xs">Edit, schedule hearing, upload evidence</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updating Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editing a Case
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>To update case information:</p>
            <ol className="space-y-2 ml-4">
              <li>1. Open the case details page</li>
              <li>2. Click the <strong>Edit</strong> button (top right)</li>
              <li>3. Modify the information you need to change</li>
              <li>4. Click <strong>Save Changes</strong></li>
            </ol>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                <strong>Common Updates:</strong> Changing case status (e.g., from Pending to Active, or Active to Closed), updating description as case progresses, or correcting party information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Common Case Actions</CardTitle>
          <CardDescription>What you can do with a case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <strong className="text-sm">Schedule Hearing</strong>
              </div>
              <p className="text-xs text-muted-foreground">
                Create a hearing for this case from the case details page
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                <Link href="/dashboard/help/hearings">Learn More</Link>
              </Button>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-primary" />
                <strong className="text-sm">Upload Evidence</strong>
              </div>
              <p className="text-xs text-muted-foreground">
                Add documents, photos, and files related to the case
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                <Link href="/dashboard/help/evidence">Learn More</Link>
              </Button>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <strong className="text-sm">Assign Case</strong>
              </div>
              <p className="text-xs text-muted-foreground">
                Assign case to a specific judge or court officer
              </p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-4 w-4 text-destructive" />
                <strong className="text-sm">Delete Case</strong>
              </div>
              <p className="text-xs text-muted-foreground">
                Remove case (requires special permission, cannot be undone)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Status Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Case Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 border rounded">
              <Badge>Pending</Badge>
              <span className="text-sm text-muted-foreground">Case filed but not yet active</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Badge>Active</Badge>
              <span className="text-sm text-muted-foreground">Case is currently being processed</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Badge>In Progress</Badge>
              <span className="text-sm text-muted-foreground">Hearings ongoing, actively working</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Badge variant="secondary">Closed</Badge>
              <span className="text-sm text-muted-foreground">Case resolved and finalized</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Badge variant="destructive">Dismissed</Badge>
              <span className="text-sm text-muted-foreground">Case dismissed by court</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Use consistent case numbering format across your organization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Keep case descriptions detailed and up-to-date</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Update case status as it progresses through the system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Attach relevant documents and evidence as early as possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Schedule hearings promptly to keep cases moving</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Related Help */}
      <Card>
        <CardHeader>
          <CardTitle>Related Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/hearings">
                Scheduling Hearings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/evidence">
                Managing Evidence
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/search">
                Searching Cases
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/roles-permissions">
                Permissions Guide
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
