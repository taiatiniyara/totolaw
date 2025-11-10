"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  Edit,
  Save,
  X,
  MessageSquare,
  Bookmark,
  Highlighter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  role: string;
  speakerLabel?: string;
}

interface Segment {
  id: string;
  speakerId?: string;
  segmentNumber: number;
  startTime: number;
  endTime: number;
  text: string;
  confidence?: number;
  isEdited: boolean;
}

interface Annotation {
  id: string;
  segmentId?: string;
  type: string;
  content?: string;
  color?: string;
  startTime?: number;
  endTime?: number;
}

interface TranscriptViewerProps {
  transcriptId: string;
  transcript: {
    id: string;
    title: string;
    status: string;
    duration?: number;
    recordingUrl?: string;
  };
  speakers: Speaker[];
  segments: Segment[];
  annotations: Annotation[];
  onUpdateSegment?: (segmentId: string, newText: string) => Promise<void>;
  onAddAnnotation?: (data: {
    segmentId?: string;
    type: string;
    content?: string;
    color?: string;
  }) => Promise<void>;
  onDeleteAnnotation?: (annotationId: string) => Promise<void>;
}

export function TranscriptViewer({
  transcriptId,
  transcript,
  speakers,
  segments,
  annotations,
  onUpdateSegment,
  onAddAnnotation,
  onDeleteAnnotation,
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("all");
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [annotationMode, setAnnotationMode] = useState<string | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Filter segments
  const filteredSegments = segments.filter((segment) => {
    if (selectedSpeaker !== "all" && segment.speakerId !== selectedSpeaker) {
      return false;
    }
    if (searchQuery && !segment.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Get speaker name
  const getSpeakerName = (speakerId?: string) => {
    if (!speakerId) return "Unknown Speaker";
    const speaker = speakers.find((s) => s.id === speakerId);
    return speaker?.name || "Unknown Speaker";
  };

  // Get speaker role
  const getSpeakerRole = (speakerId?: string) => {
    if (!speakerId) return "";
    const speaker = speakers.find((s) => s.id === speakerId);
    return speaker?.role || "";
  };

  // Format time
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle edit
  const handleStartEdit = (segment: Segment) => {
    setEditingSegmentId(segment.id);
    setEditText(segment.text);
  };

  const handleSaveEdit = async () => {
    if (editingSegmentId && onUpdateSegment) {
      await onUpdateSegment(editingSegmentId, editText);
      setEditingSegmentId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingSegmentId(null);
    setEditText("");
  };

  // Handle annotation
  const handleAddAnnotation = async (segmentId: string, type: string) => {
    if (onAddAnnotation) {
      await onAddAnnotation({
        segmentId,
        type,
        color: type === "highlight" ? "yellow" : undefined,
      });
    }
    setAnnotationMode(null);
  };

  // Get segment annotations
  const getSegmentAnnotations = (segmentId: string) => {
    return annotations.filter((a) => a.segmentId === segmentId);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{transcript.title}</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant={
              transcript.status === "completed" ? "default" :
              transcript.status === "in-progress" ? "secondary" :
              "outline"
            }>
              {transcript.status}
            </Badge>
            {transcript.duration && (
              <Badge variant="outline">{formatTime(transcript.duration)}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export DOCX
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Speaker filter */}
          <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All speakers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All speakers</SelectItem>
              {speakers.map((speaker) => (
                <SelectItem key={speaker.id} value={speaker.id}>
                  {speaker.name} ({speaker.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Annotation toggle */}
          <Button
            variant={showAnnotations ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAnnotations(!showAnnotations)}
          >
            {showAnnotations ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            Annotations
          </Button>
        </div>
      </Card>

      {/* Transcript content */}
      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-6 space-y-4">
            {filteredSegments.map((segment) => {
              const isEditing = editingSegmentId === segment.id;
              const segmentAnnotations = getSegmentAnnotations(segment.id);
              const hasHighlight = segmentAnnotations.some((a) => a.type === "highlight");

              return (
                <div
                  key={segment.id}
                  className={`group relative p-4 rounded-lg border transition-colors ${
                    hasHighlight ? "bg-yellow-50 border-yellow-200" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Segment header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {getSpeakerName(segment.speakerId)}
                        </span>
                        {getSpeakerRole(segment.speakerId) && (
                          <Badge variant="outline" className="text-xs">
                            {getSpeakerRole(segment.speakerId)}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(segment.startTime)}
                        </span>
                        {segment.confidence && (
                          <span className="text-xs text-gray-400">
                            {segment.confidence}% confidence
                          </span>
                        )}
                        {segment.isEdited && (
                          <Badge variant="secondary" className="text-xs">
                            Edited
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isEditing && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(segment)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddAnnotation(segment.id, "highlight")}
                          >
                            <Highlighter className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddAnnotation(segment.id, "bookmark")}
                          >
                            <Bookmark className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAnnotationMode(segment.id)}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Segment content */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="w-3 h-3 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="w-3 h-3 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{segment.text}</p>
                  )}

                  {/* Annotations */}
                  {showAnnotations && segmentAnnotations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {segmentAnnotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200 text-sm"
                        >
                          <MessageSquare className="w-4 h-4 mt-0.5 text-blue-600" />
                          <span className="flex-1">{annotation.content || annotation.type}</span>
                          {onDeleteAnnotation && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteAnnotation(annotation.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add annotation form */}
                  {annotationMode === segment.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border">
                      <Textarea
                        placeholder="Add a note..."
                        rows={2}
                        className="mb-2"
                        id={`annotation-${segment.id}`}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              `annotation-${segment.id}`
                            ) as HTMLTextAreaElement;
                            if (onAddAnnotation && input?.value) {
                              onAddAnnotation({
                                segmentId: segment.id,
                                type: "note",
                                content: input.value,
                              });
                              input.value = "";
                            }
                            setAnnotationMode(null);
                          }}
                        >
                          Add Note
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAnnotationMode(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredSegments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchQuery || selectedSpeaker !== "all"
                  ? "No segments match your filters"
                  : "No transcript segments yet"}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
