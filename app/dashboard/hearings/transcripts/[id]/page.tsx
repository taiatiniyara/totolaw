/**
 * Transcript Detail Page
 * View and edit court transcript
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { transcriptService } from "@/lib/services/transcript.service";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  updateSegment,
  addAnnotation,
  deleteAnnotation,
} from "../actions";

interface TranscriptPageProps {
  params: {
    id: string;
  };
}

export default async function TranscriptPage({ params }: TranscriptPageProps) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    redirect("/dashboard/no-organization");
  }

  // Fetch transcript with all details
  const details = await transcriptService.getTranscriptWithDetails(
    params.id,
    context.organizationId
  );

  if (!details) {
    notFound();
  }

  const { transcript, speakers, segments, annotations } = details;

  // Create client-side action wrappers
  const handleUpdateSegment = async (segmentId: string, newText: string) => {
    "use server";
    await updateSegment(segmentId, newText);
  };

  const handleAddAnnotation = async (data: any) => {
    "use server";
    await addAnnotation({
      transcriptId: params.id,
      ...data,
    });
  };

  const handleDeleteAnnotation = async (annotationId: string) => {
    "use server";
    await deleteAnnotation(annotationId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/hearings/${transcript.hearingId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hearing
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/hearings/transcripts/${params.id}/manual`}>
            <Button variant="outline">
              Manual Transcription
            </Button>
          </Link>
          <Link href={`/dashboard/hearings/transcripts/${params.id}/live`}>
            <Button variant="outline">
              Live Transcription
            </Button>
          </Link>
        </div>
      </div>

      {/* Transcript Viewer */}
      <TranscriptViewer
        transcriptId={params.id}
        transcript={{
          id: transcript.id,
          title: transcript.title,
          status: transcript.status,
          duration: transcript.duration ?? undefined,
          recordingUrl: transcript.recordingUrl ?? undefined,
        }}
        speakers={speakers.map(s => ({
          id: s.id,
          name: s.name,
          role: s.role,
          speakerLabel: s.speakerLabel ?? undefined,
        }))}
        segments={segments.map(seg => ({
          id: seg.id,
          speakerId: seg.speakerId ?? undefined,
          segmentNumber: seg.segmentNumber,
          startTime: seg.startTime,
          endTime: seg.endTime,
          text: seg.text,
          confidence: seg.confidence ?? undefined,
          isEdited: seg.isEdited ?? false,
        }))}
        annotations={annotations.map(ann => ({
          id: ann.id,
          segmentId: ann.segmentId ?? undefined,
          type: ann.type,
          content: ann.content ?? undefined,
          color: ann.color ?? undefined,
          startTime: ann.startTime ?? undefined,
          endTime: ann.endTime ?? undefined,
        }))}
        onUpdateSegment={handleUpdateSegment}
        onAddAnnotation={handleAddAnnotation}
        onDeleteAnnotation={handleDeleteAnnotation}
      />
    </div>
  );
}
