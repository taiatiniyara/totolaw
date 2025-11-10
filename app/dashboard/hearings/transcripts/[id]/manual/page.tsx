/**
 * Manual Transcription Page
 * Page for manually transcribing court hearings
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { transcriptService } from "@/lib/services/transcript.service";
import { db } from "@/lib/drizzle/connection";
import { cases, hearings } from "@/lib/drizzle/schema/db-schema";
import { eq } from "drizzle-orm";
import { ManualTranscriptionEditor } from "@/components/manual-transcription-editor";
import { saveManualTranscriptEntries, autoSaveManualTranscript } from "../../actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ManualTranscriptionPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const context = await getUserTenantContext(session.user.id);
  if (!context?.organizationId) {
    redirect("/dashboard/no-organization");
  }

  // Get transcript details
  const details = await transcriptService.getTranscriptWithDetails(
    params.id,
    context.organizationId
  );

  if (!details) {
    notFound();
  }

  const { transcript, speakers, segments } = details;

  // Get hearing details
  const [hearing] = await db
    .select()
    .from(hearings)
    .where(eq(hearings.id, transcript.hearingId))
    .limit(1);

  if (!hearing) {
    notFound();
  }

  // Get case details
  const [caseRecord] = await db
    .select()
    .from(cases)
    .where(eq(cases.id, transcript.caseId))
    .limit(1);

  if (!caseRecord) {
    notFound();
  }

  // Convert existing segments to entry format (if any)
  const existingEntries = segments.map((segment) => ({
    id: segment.id,
    speakerId: segment.speakerId || speakers[0]?.id || "",
    text: segment.text,
    timestamp: formatMsToTimestamp(segment.startTime),
    notes: (segment.metadata as any)?.notes,
  }));

  // Format milliseconds to timestamp string
  function formatMsToTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // Wrapper functions for client component
  async function handleSave(entries: any[]) {
    "use server";
    await saveManualTranscriptEntries({
      transcriptId: params.id,
      entries,
    });
  }

  async function handleAutoSave(entries: any[]) {
    "use server";
    await autoSaveManualTranscript({
      transcriptId: params.id,
      entries,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/hearings/transcripts/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transcript
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Manual Transcription</h1>
            <p className="text-gray-600">
              {caseRecord.title} - Hearing on{" "}
              {new Date(hearing.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex gap-4">
          <FileText className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-2">
              Manual Transcription Mode
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              This mode is designed for Fiji's court transcribers to manually type proceedings
              as they happen, overcoming challenges with dialect, accent, and language barriers
              that automated transcription can't handle effectively.
            </p>
            <ul className="text-sm space-y-1 text-amber-800">
              <li>
                • Type exactly what you hear in the courtroom, using the language as spoken
              </li>
              <li>• Select the correct speaker before each statement</li>
              <li>
                • Add notes for clarifications, corrections, or context that may be needed
                later
              </li>
              <li>• Your work is automatically saved every 5 seconds</li>
              <li>• Use the timer to track how long each session takes</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <ManualTranscriptionEditor
        transcriptId={params.id}
        hearingId={transcript.hearingId}
        caseTitle={caseRecord.title}
        speakers={speakers}
        existingEntries={existingEntries}
        onSave={handleSave}
        onAutoSave={handleAutoSave}
      />
    </div>
  );
}
