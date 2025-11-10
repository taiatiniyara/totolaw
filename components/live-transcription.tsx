"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Square, Mic, MicOff } from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  role: string;
}

interface LiveTranscriptSegment {
  text: string;
  speaker?: string;
  startTime: number;
  isFinal: boolean;
}

interface LiveTranscriptionProps {
  transcriptId: string;
  speakers: Speaker[];
  onTranscriptStart?: () => void;
  onTranscriptStop?: () => void;
  apiEndpoint?: string;
}

export function LiveTranscription({
  transcriptId,
  speakers,
  onTranscriptStart,
  onTranscriptStop,
  apiEndpoint = "/api/transcription/live",
}: LiveTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegments, setCurrentSegments] = useState<LiveTranscriptSegment[]>([]);
  const [duration, setDuration] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<string>("deepgram");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create WebSocket connection for live transcription
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}${apiEndpoint}/${transcriptId}?provider=${selectedProvider}`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === "transcript") {
          setCurrentSegments((prev) => {
            // If this is a final segment, add it
            if (data.isFinal) {
              return [...prev, data];
            }
            // If interim, update the last segment
            const newSegments = [...prev];
            if (newSegments.length > 0 && !newSegments[newSegments.length - 1].isFinal) {
              newSegments[newSegments.length - 1] = data;
            } else {
              newSegments.push(data);
            }
            return newSegments;
          });
        } else if (data.type === "error") {
          console.error("Transcription error:", data.error);
          stopRecording();
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        stopRecording();
      };

      // Create MediaRecorder to capture audio
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          // Send audio data to server
          wsRef.current.send(event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      mediaRecorderRef.current.start(250); // Send data every 250ms
      setIsRecording(true);
      setIsPaused(false);
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      onTranscriptStart?.();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to access microphone. Please check permissions.");
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (durationIntervalRef.current) {
          durationIntervalRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
          }, 1000);
        }
      } else {
        mediaRecorderRef.current.pause();
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      onTranscriptStop?.();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Provider selection */}
          {!isRecording && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Transcription Service:</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepgram">Deepgram (Recommended)</SelectItem>
                  <SelectItem value="assemblyai">AssemblyAI</SelectItem>
                  <SelectItem value="whisper">OpenAI Whisper</SelectItem>
                  <SelectItem value="google">Google Speech-to-Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status and controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"}`} />
                  <span className="font-semibold">
                    {isPaused ? "PAUSED" : "RECORDING"}
                  </span>
                  <span className="text-2xl font-mono">{formatTime(duration)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MicOff className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500">Ready to record</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button onClick={togglePause} variant="outline" size="lg">
                    {isPaused ? (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button onClick={stopRecording} variant="destructive" size="lg">
                    <Square className="w-5 h-5 mr-2" />
                    Stop & Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Live transcript preview */}
      {isRecording && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Transcript</h3>
            <Badge variant="secondary">
              {currentSegments.filter((s) => s.isFinal).length} segments
            </Badge>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {currentSegments.map((segment, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  segment.isFinal
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-gray-300 border-dashed"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {segment.speaker && (
                    <Badge variant="outline" className="text-xs">
                      {segment.speaker}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTime(Math.floor(segment.startTime / 1000))}
                  </span>
                  {!segment.isFinal && (
                    <span className="text-xs text-gray-400 italic">
                      (interim)
                    </span>
                  )}
                </div>
                <p className="text-sm">{segment.text}</p>
              </div>
            ))}

            {currentSegments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Listening... speak into your microphone</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Info card */}
      {!isRecording && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-900">Live Transcription Tips</h3>
          <ul className="text-sm space-y-1 text-blue-800">
            <li>• Ensure your microphone is properly connected and permissions are granted</li>
            <li>• Speak clearly and at a moderate pace for best accuracy</li>
            <li>• Use Deepgram for best results with legal/court terminology</li>
            <li>• The transcript will be saved automatically when you stop recording</li>
            <li>• You can edit and review the transcript after recording</li>
          </ul>
        </Card>
      )}
    </div>
  );
}
