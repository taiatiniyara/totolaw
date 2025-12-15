/**
 * Hearing Details Page
 * 
 * View and manage individual hearing details
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PermissionGate } from "@/components/auth/permission-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { getHearingById, deleteHearing, getHearingTranscripts } from "../actions";
import { HearingTranscriptSection } from "@/components/hearings/hearing-transcript-section";
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Clock, FileText } from "lucide-react";
import Link from "next/link";

interface HearingPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function handleDelete(hearingId: string) {
  "use server";
  
  const result = await deleteHearing(hearingId);
  
  if (result.success) {
    redirect("/dashboard/hearings");
  } else {
    throw new Error(result.error || "Failed to delete hearing");
  }
}

export default async function HearingDetailsPage({ params }: HearingPageProps) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const result = await getHearingById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const hearing = result.data;
  
  // Fetch transcripts for this hearing
  const transcriptsResult = await getHearingTranscripts(id);
  const transcripts = transcriptsResult.success && transcriptsResult.data ? transcriptsResult.data : [];
  
  const isPast = new Date(hearing.scheduledDate) < new Date();
  const isToday = () => {
    const today = new Date();
    const hearingDate = new Date(hearing.scheduledDate);
    return (
      hearingDate.getDate() === today.getDate() &&
      hearingDate.getMonth() === today.getMonth() &&
      hearingDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <ProtectedRoute requiredPermission="hearings:read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/hearings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <Heading as="h1">Hearing Details</Heading>
              <p className="text-muted-foreground">
                {hearing.caseTitle}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <PermissionGate permission="hearings:update">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/hearings/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </PermissionGate>
            <PermissionGate permission="hearings:delete">
              <form action={handleDelete.bind(null, id)}>
                <Button type="submit" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </form>
            </PermissionGate>
          </div>
        </div>

        {/* Hearing Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Hearing Information</CardTitle>
            <CardDescription>Details about this court hearing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date & Time</span>
                </div>
                <p className="font-medium">
                  {new Date(hearing.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {hearing.scheduledTime && ` at ${hearing.scheduledTime}`}
                </p>
                {isToday() && (
                  <Badge variant="default">Today</Badge>
                )}
                {isPast && !isToday() && (
                  <Badge variant="secondary">Past</Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Action Type</span>
                </div>
                <p className="font-medium">
                  {hearing.actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <Badge variant={
                  hearing.status === 'completed' ? 'default' :
                  hearing.status === 'cancelled' ? 'destructive' :
                  hearing.status === 'in_progress' ? 'secondary' : 'outline'
                }>
                  {hearing.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>

              {hearing.estimatedDuration && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated Duration</span>
                  </div>
                  <p className="font-medium">{hearing.estimatedDuration} minutes</p>
                </div>
              )}

              {hearing.location && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                  <p className="font-medium">{hearing.location}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Related Case</span>
                </div>
                <Link 
                  href={`/dashboard/cases/${hearing.caseId}`}
                  className="font-medium text-primary hover:underline"
                >
                  {hearing.caseTitle}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bail Information */}
        {hearing.bailConsidered && (
          <Card>
            <CardHeader>
              <CardTitle>Bail Information</CardTitle>
              <CardDescription>Bail considerations and decisions for this hearing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {hearing.bailDecision && hearing.bailDecision !== 'not_decided' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Bail Decision</span>
                    </div>
                    <Badge variant={
                      hearing.bailDecision === 'granted' ? 'default' :
                      hearing.bailDecision === 'denied' ? 'destructive' : 'outline'
                    }>
                      {hearing.bailDecision.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                )}

                {hearing.bailAmount && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Bail Amount</span>
                    </div>
                    <p className="font-medium">FJD {hearing.bailAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {hearing.bailConditions && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Bail Conditions</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{hearing.bailConditions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hearing Transcripts */}
        <HearingTranscriptSection 
          hearingId={id}
          transcripts={transcripts}
        />

        {/* Outcome & Next Actions */}
        {(hearing.outcome || hearing.nextActionRequired) && (
          <Card>
            <CardHeader>
              <CardTitle>Outcome & Next Steps</CardTitle>
              <CardDescription>Hearing results and required follow-up actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hearing.outcome && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Outcome</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{hearing.outcome}</p>
                </div>
              )}

              {hearing.nextActionRequired && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Next Action Required</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{hearing.nextActionRequired}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {hearing.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{hearing.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks related to this hearing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/dashboard/cases/${hearing.caseId}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Related Case
              </Link>
            </Button>
            <PermissionGate permission="hearings:update">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/hearings/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Reschedule Hearing
                </Link>
              </Button>
            </PermissionGate>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
