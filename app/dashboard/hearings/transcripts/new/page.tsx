/**
 * New Transcript Page
 * Create and start live transcription for a hearing
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { db } from "@/lib/drizzle/connection";
import { hearings } from "@/lib/drizzle/schema/db-schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createTranscript, addSpeaker } from "../actions";

interface NewTranscriptPageProps {
  searchParams: {
    hearingId?: string;
  };
}

export default async function NewTranscriptPage({
  searchParams,
}: NewTranscriptPageProps) {
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

  if (!searchParams.hearingId) {
    notFound();
  }

  // Fetch hearing details
  const [hearing] = await db
    .select()
    .from(hearings)
    .where(
      and(
        eq(hearings.id, searchParams.hearingId),
        eq(hearings.organizationId, context.organizationId)
      )
    );

  if (!hearing) {
    notFound();
  }

  // Handle form submission
  async function handleCreateTranscript(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const recordingUrl = formData.get("recordingUrl") as string;
    const mode = formData.get("mode") as string;

    if (!title) {
      return;
    }

    // Create transcript
    const result = await createTranscript({
      caseId: hearing.caseId,
      hearingId: hearing.id,
      title,
      recordingUrl: recordingUrl || undefined,
    });

    if (result.error || !result.transcript) {
      return;
    }

    // Add default speakers (judge, prosecutor, defense)
    const defaultSpeakers = [
      { name: "Judge", role: "judge" },
      { name: "Prosecutor", role: "prosecutor" },
      { name: "Defense Attorney", role: "defense_attorney" },
      { name: "Witness", role: "witness" },
    ];

    for (const speaker of defaultSpeakers) {
      await addSpeaker({
        transcriptId: result.transcript.id,
        ...speaker,
      });
    }

    // Redirect based on selected mode
    if (mode === "manual") {
      redirect(`/dashboard/hearings/transcripts/${result.transcript.id}/manual`);
    } else {
      redirect(`/dashboard/hearings/transcripts/${result.transcript.id}/live`);
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/hearings/${hearing.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hearing
          </Button>
        </Link>
      </div>

      {/* Create transcript form */}
      <Card className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create New Transcript</h1>

        <form action={handleCreateTranscript} className="space-y-4">
          <div>
            <Label htmlFor="title">Transcript Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Preliminary Hearing - January 15, 2025"
              required
              defaultValue={`${hearing.location || "Hearing"} - ${new Date(hearing.date).toLocaleDateString()}`}
            />
          </div>

          <div>
            <Label>Transcription Mode</Label>
            <div className="space-y-3 mt-2">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  defaultChecked
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Manual Transcription (Recommended for Fiji)
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Type the proceedings as you hear them. Perfect for handling Fijian
                    dialects, accents, and multiple languages. No audio processing required.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="mode"
                  value="live"
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Live Audio Transcription
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically transcribe speech using AI. Works best with clear audio
                    and standard English. May struggle with accents and local dialects.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="recordingUrl">
              Recording URL (Optional)
            </Label>
            <Input
              id="recordingUrl"
              name="recordingUrl"
              type="url"
              placeholder="https://..."
            />
            <p className="text-sm text-gray-500 mt-1">
              If you have a pre-recorded audio/video file, provide the URL here
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Default Speakers
            </h3>
            <p className="text-sm text-blue-800 mb-2">
              The following speakers will be automatically added to your transcript:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Judge</li>
              <li>• Prosecutor</li>
              <li>• Defense Attorney</li>
              <li>• Witness</li>
            </ul>
            <p className="text-sm text-blue-700 mt-2">
              You can add more speakers or edit these during transcription.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" size="lg">
              Create Transcript
            </Button>
            <Link href={`/dashboard/hearings/${hearing.id}`}>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
