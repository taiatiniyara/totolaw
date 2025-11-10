/**
 * Live Transcription Page
 * Real-time recording and transcription
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { transcriptService } from "@/lib/services/transcript.service";
import { LiveTranscription } from "@/components/live-transcription";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

interface LiveTranscriptionPageProps {
  params: {
    id: string;
  };
}

export default async function LiveTranscriptionPage({
  params,
}: LiveTranscriptionPageProps) {
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

  // Fetch transcript details
  const transcript = await transcriptService.getTranscript(
    params.id,
    context.organizationId
  );

  if (!transcript) {
    notFound();
  }

  // Get speakers
  const speakers = await transcriptService.getSpeakersByTranscript(
    params.id,
    context.organizationId
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/hearings/${transcript.hearingId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hearing
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{transcript.title}</h1>
            <p className="text-sm text-gray-500">Live Recording Session</p>
          </div>
        </div>

        <Link href={`/dashboard/hearings/transcripts/${params.id}`}>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Full Transcript
          </Button>
        </Link>
      </div>

      {/* Live transcription component */}
      <LiveTranscription
        transcriptId={params.id}
        speakers={speakers}
        onTranscriptStart={async () => {
          "use server";
          // Could update transcript status or log start time
        }}
        onTranscriptStop={async () => {
          "use server";
          // Could update transcript status or trigger post-processing
        }}
      />
    </div>
  );
}
