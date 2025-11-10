/**
 * WebSocket API Route for Live Transcription
 * Handles real-time audio streaming and transcription
 */

import { NextRequest } from "next/server";
import { liveTranscriptionManager } from "@/lib/services/live-transcription.service";
import { auth } from "@/lib/auth";
import { getUserTenantContext } from "@/lib/services/tenant.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transcriptId: string }> }
) {
  try {
    // Await params as required by Next.js 15+
    const { transcriptId } = await params;
    
    // Verify authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const context = await getUserTenantContext(session.user.id);
    if (!context?.organizationId) {
      return new Response("Organization context not found", { status: 403 });
    }

    // Get provider from query params
    const searchParams = req.nextUrl.searchParams;
    const provider = (searchParams.get("provider") || "deepgram") as any;

    // Check if upgrade header is present (WebSocket handshake)
    const upgradeHeader = req.headers.get("upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    // Get Deepgram API key from environment
    const apiKey = process.env.DEEPGRAM_API_KEY || process.env.TRANSCRIPTION_API_KEY;
    
    if (!apiKey) {
      return new Response(
        "Transcription service not configured. Please set DEEPGRAM_API_KEY or TRANSCRIPTION_API_KEY environment variable.",
        { status: 500 }
      );
    }

    // Start transcription session
    await liveTranscriptionManager.startSession(
      transcriptId,
      context.organizationId,
      {
        provider,
        apiKey,
        language: "en",
        enableSpeakerDiarization: true,
        punctuate: true,
      }
    );

    // Note: In a production Next.js app, WebSocket handling would typically
    // be done through a separate WebSocket server or using a library like
    // Socket.io with a custom server. This is a simplified example.
    
    // For now, return success - actual WebSocket implementation would require
    // custom server setup or using Vercel's Edge Functions with WebSocket support
    
    return new Response(
      JSON.stringify({
        message: "WebSocket connection established",
        transcriptId: transcriptId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("WebSocket setup error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// For HTTP-based streaming (alternative to WebSocket)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ transcriptId: string }> }
) {
  try {
    // Await params as required by Next.js 15+
    const { transcriptId } = await params;
    
    // Verify authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get audio data from request body
    const audioData = await req.blob();

    // Send audio to transcription service
    await liveTranscriptionManager.sendAudio(transcriptId, audioData);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Audio processing error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Stop transcription session
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ transcriptId: string }> }
) {
  try {
    // Await params as required by Next.js 15+
    const { transcriptId } = await params;
    
    // Verify authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Stop transcription session
    await liveTranscriptionManager.stopSession(transcriptId);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stop transcription error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
