"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Plus,
  Trash2,
  Clock,
  User,
  Play,
  Pause,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface Speaker {
  id: string;
  name: string;
  role: string;
}

interface TranscriptEntry {
  id: string;
  speakerId: string;
  text: string;
  timestamp: string;
  notes?: string;
}

interface ManualTranscriptionEditorProps {
  transcriptId: string;
  hearingId: string;
  caseTitle: string;
  speakers: Speaker[];
  existingEntries?: TranscriptEntry[];
  onSave?: (entries: TranscriptEntry[]) => Promise<void>;
  onAutoSave?: (entries: TranscriptEntry[]) => Promise<void>;
}

export function ManualTranscriptionEditor({
  transcriptId,
  hearingId,
  caseTitle,
  speakers,
  existingEntries = [],
  onSave,
  onAutoSave,
}: ManualTranscriptionEditorProps) {
  const [entries, setEntries] = useState<TranscriptEntry[]>(existingEntries);
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string>(
    speakers[0]?.id || ""
  );
  const [currentText, setCurrentText] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate word count
  useEffect(() => {
    const words = entries.reduce((count, entry) => {
      return count + entry.text.trim().split(/\s+/).filter(Boolean).length;
    }, 0);
    setWordCount(words);
  }, [entries]);

  // Auto-save functionality
  useEffect(() => {
    if (entries.length > 0 && onAutoSave) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for auto-save after 5 seconds of inactivity
      autoSaveTimerRef.current = setTimeout(() => {
        onAutoSave(entries).catch((error) => {
          console.error("Auto-save failed:", error);
        });
      }, 5000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [entries, onAutoSave]);

  // Timer for elapsed time
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Get current timestamp
  const getCurrentTimestamp = () => {
    return formatTime(elapsedTime);
  };

  // Add new entry
  const addEntry = () => {
    if (!currentText.trim()) {
      toast.error("Please enter some text before adding an entry");
      return;
    }

    const newEntry: TranscriptEntry = {
      id: `entry-${Date.now()}`,
      speakerId: currentSpeakerId,
      text: currentText.trim(),
      timestamp: getCurrentTimestamp(),
      notes: currentNotes.trim() || undefined,
    };

    setEntries((prev) => [...prev, newEntry]);
    setCurrentText("");
    setCurrentNotes("");
    
    // Focus back on textarea
    textareaRef.current?.focus();
    
    toast.success("Entry added");
  };

  // Delete entry
  const deleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    toast.success("Entry deleted");
  };

  // Get speaker name
  const getSpeakerName = (speakerId: string) => {
    const speaker = speakers.find((s) => s.id === speakerId);
    return speaker?.name || "Unknown";
  };

  // Get speaker role
  const getSpeakerRole = (speakerId: string) => {
    const speaker = speakers.find((s) => s.id === speakerId);
    return speaker?.role || "";
  };

  // Save all entries
  const handleSave = async () => {
    if (entries.length === 0) {
      toast.error("No entries to save");
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(entries);
      toast.success("Transcript saved successfully");
    } catch (error) {
      console.error("Error saving transcript:", error);
      toast.error("Failed to save transcript");
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to add entry
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        addEntry();
      }
      // Ctrl+S to save
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentText, currentSpeakerId, entries]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{caseTitle}</h2>
            <p className="text-sm text-gray-600">Manual Transcription</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Words</div>
              <div className="text-2xl font-bold text-indigo-600">
                {wordCount.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Entries</div>
              <div className="text-2xl font-bold text-blue-600">
                {entries.length}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Timer Control */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-600">Session Time</div>
              <div className="text-2xl font-mono font-bold">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            variant={isTimerRunning ? "destructive" : "default"}
            size="lg"
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Timer
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">New Entry</h3>
            <Badge variant="outline">
              Current Time: {getCurrentTimestamp()}
            </Badge>
          </div>

          {/* Speaker Selection */}
          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker</Label>
            <Select value={currentSpeakerId} onValueChange={setCurrentSpeakerId}>
              <SelectTrigger id="speaker">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {speakers.map((speaker) => (
                  <SelectItem key={speaker.id} value={speaker.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{speaker.name}</span>
                      <span className="text-xs text-gray-500">({speaker.role})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="transcript-text">Transcript Text</Label>
            <Textarea
              ref={textareaRef}
              id="transcript-text"
              placeholder="Type what the speaker is saying... Press Ctrl+Enter to add entry"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              rows={6}
              className="text-base resize-none"
            />
            <div className="text-xs text-gray-500">
              {currentText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {showNotes ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Add notes (optional)
            </button>
            {showNotes && (
              <Textarea
                placeholder="Add contextual notes, corrections, or observations..."
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                rows={2}
                className="text-sm"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={addEntry} size="lg" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry (Ctrl+Enter)
            </Button>
            <Button
              onClick={handleSave}
              variant="outline"
              size="lg"
              disabled={isSaving || entries.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save All (Ctrl+S)"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Entries List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transcript Entries</h3>
          <Badge variant="secondary">{entries.length} entries</Badge>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="group p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-700">
                      {index + 1}. {getSpeakerName(entry.speakerId)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getSpeakerRole(entry.speakerId)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-900">
                    {entry.text}
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">
                      Note: {entry.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No entries yet. Start transcribing above.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Help Card */}
      <Card className="p-4 bg-green-50 border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">
          💡 Manual Transcription Tips
        </h4>
        <ul className="text-sm space-y-1 text-green-800">
          <li>• Start the timer when the hearing begins</li>
          <li>• Select the speaker before typing their statement</li>
          <li>• Use Ctrl+Enter to quickly add entries</li>
          <li>• Add notes for context, corrections, or clarifications</li>
          <li>• The transcript auto-saves every 5 seconds</li>
          <li>• Press Ctrl+S to manually save at any time</li>
        </ul>
      </Card>
    </div>
  );
}
