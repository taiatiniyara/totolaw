/**
 * Documents Management Page
 * 
 * View and manage all documents and evidence files
 */

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, InfoCard } from "@/components/common";
import { FileText, Upload, FolderOpen, Search } from "lucide-react";
import { Heading } from "@/components/ui/heading";

export default async function DocumentsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <ProtectedRoute requiredPermission="evidence:read">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Documents"
          description="Manage all case documents and evidence files"
          action={{
            label: "Upload Document",
            href: "/dashboard/evidence/upload",
            icon: Upload,
          }}
        />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="All Evidence"
            description="View all evidence files across all cases"
            icon={FileText}
            href="/dashboard/evidence"
          />
          <InfoCard
            title="Browse by Case"
            description="View documents organized by case"
            icon={FolderOpen}
            href="/dashboard/cases"
          />
          <InfoCard
            title="Search Documents"
            description="Search for specific documents"
            icon={Search}
            href="/dashboard/search"
          />
        </div>

        {/* Document Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
            <CardDescription>
              Common document types in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Evidence Documents</span>
                </div>
                <Badge variant="secondary">All Types</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Court Filings</span>
                </div>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Audio Recordings</span>
                </div>
                <Badge variant="secondary">MP3, WAV</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Video Evidence</span>
                </div>
                <Badge variant="secondary">MP4, MOV</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Images & Photos</span>
                </div>
                <Badge variant="secondary">JPG, PNG</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Other Documents</span>
                </div>
                <Badge variant="secondary">Various</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <Heading as="h4" className="font-medium mb-1">Uploading Documents</Heading>
                <p className="text-muted-foreground">
                  All documents must be associated with a specific case. Upload evidence
                  through the evidence management section or directly from a case page.
                </p>
              </div>
              <div>
                <Heading as="h4" className="font-medium mb-1">Document Security</Heading>
                <p className="text-muted-foreground">
                  All documents are secured with organization-level access control.
                  Only members of your organization can view these files.
                </p>
              </div>
              <div>
                <Heading as="h4" className="font-medium mb-1">File Storage</Heading>
                <p className="text-muted-foreground">
                  File metadata is stored in the database. Ensure your storage system
                  is properly configured for file uploads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
