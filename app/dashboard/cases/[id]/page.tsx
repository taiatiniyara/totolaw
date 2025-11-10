/**
 * Case Details Page
 * 
 * View and manage individual case details
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PermissionGate } from "@/components/auth/permission-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { getCaseById, deleteCase } from "../actions";
import { getEvidenceForCase } from "../../evidence/actions";
import { getHearings } from "../../hearings/actions";
import { ArrowLeft, Edit, Trash2, Calendar, User, FileText, Upload, Download, Clock } from "lucide-react";
import Link from "next/link";

interface CasePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function handleDelete(caseId: string) {
  "use server";
  
  const result = await deleteCase(caseId);
  
  if (result.success) {
    redirect("/dashboard/cases");
  } else {
    throw new Error(result.error || "Failed to delete case");
  }
}

export default async function CaseDetailsPage({ params }: CasePageProps) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const [caseResult, evidenceResult, hearingsResult] = await Promise.all([
    getCaseById(id),
    getEvidenceForCase(id),
    getHearings({ caseId: id }),
  ]);

  if (!caseResult.success || !caseResult.data) {
    notFound();
  }

  const caseItem = caseResult.data;
  const evidenceList = evidenceResult.success ? evidenceResult.data || [] : [];
  const hearingsList = hearingsResult.success ? hearingsResult.data || [] : [];

  // Map status to badge variant
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "closed":
      case "dismissed":
        return "secondary";
      case "active":
      case "in-progress":
        return "default";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <ProtectedRoute requiredPermission="cases:read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/cases">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <Heading as="h1">{caseItem.title}</Heading>
              <p className="text-muted-foreground">
                {caseItem.type} • Created {new Date(caseItem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <PermissionGate permission="cases:update">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/cases/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </PermissionGate>
            <PermissionGate permission="cases:delete">
              <form action={handleDelete.bind(null, id)}>
                <Button type="submit" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </form>
            </PermissionGate>
          </div>
        </div>

        {/* Case Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Case Overview</CardTitle>
            <CardDescription>Basic information about this case</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Case ID</span>
                </div>
                <p className="font-mono text-sm">{caseItem.id}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Case Type</span>
                </div>
                <p className="font-medium capitalize">{caseItem.type}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <Badge variant={getStatusVariant(caseItem.status)} className="capitalize">
                  {caseItem.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Filed Date</span>
                </div>
                <p className="font-medium">
                  {new Date(caseItem.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {caseItem.filedBy && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Filed By</span>
                  </div>
                  <p className="font-medium">{caseItem.filedBy}</p>
                </div>
              )}

              {caseItem.assignedTo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Assigned To</span>
                  </div>
                  <p className="font-medium">{caseItem.assignedTo}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hearings</CardTitle>
                  <CardDescription>Scheduled court hearings ({hearingsList.length})</CardDescription>
                </div>
                <PermissionGate permission="hearings:create">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/hearings/new?caseId=${id}`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Link>
                  </Button>
                </PermissionGate>
              </div>
            </CardHeader>
            <CardContent>
              {hearingsList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hearings scheduled yet
                </p>
              ) : (
                <div className="space-y-3">
                  {hearingsList.slice(0, 3).map((hearing: any) => (
                    <Link
                      key={hearing.id}
                      href={`/dashboard/hearings/${hearing.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {new Date(hearing.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          {hearing.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {hearing.location}
                            </p>
                          )}
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                  {hearingsList.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href="/dashboard/hearings">
                        View all {hearingsList.length} hearings
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Evidence</CardTitle>
                  <CardDescription>Case evidence and documents ({evidenceList.length})</CardDescription>
                </div>
                <PermissionGate permission="evidence:create">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/evidence/upload?caseId=${id}`}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Link>
                  </Button>
                </PermissionGate>
              </div>
            </CardHeader>
            <CardContent>
              {evidenceList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No evidence submitted yet
                </p>
              ) : (
                <div className="space-y-3">
                  {evidenceList.slice(0, 3).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 p-3 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.fileName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(item.fileSize / 1024).toFixed(1)} KB • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={item.filePath} target="_blank" download>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {evidenceList.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href="/dashboard/evidence">
                        View all {evidenceList.length} files
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Case Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Case Timeline</CardTitle>
            <CardDescription>History of case events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-full w-px bg-border mt-2" />
                </div>
                <div className="flex-1 pb-8">
                  <p className="font-medium">Case Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(caseItem.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
