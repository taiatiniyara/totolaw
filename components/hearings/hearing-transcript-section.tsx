/**
 * Hearing Transcript Section Component
 * Displays transcript information and provides actions for creating/viewing transcripts
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit } from "lucide-react";
import { PermissionGate } from "@/components/auth/permission-gate";

interface TranscriptData {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  completedAt?: Date | null;
  segmentCount?: number;
}

interface HearingTranscriptSectionProps {
  hearingId: string;
  transcripts: TranscriptData[];
}

export function HearingTranscriptSection({ 
  hearingId, 
  transcripts 
}: HearingTranscriptSectionProps) {
  const hasTranscripts = transcripts.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Hearing Transcripts
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {hasTranscripts 
                ? `${transcripts.length} transcript${transcripts.length > 1 ? 's' : ''} available`
                : 'No transcripts yet'
              }
            </p>
          </div>
          <PermissionGate permission="transcripts:create">
            <Button asChild size="sm">
              <Link href={`/dashboard/hearings/transcripts/new?hearingId=${hearingId}`}>
                <Plus className="h-4 w-4 mr-2" />
                New Transcript
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </CardHeader>
      <CardContent>
        {hasTranscripts ? (
          <div className="space-y-3">
            {transcripts.map((transcript) => (
              <div
                key={transcript.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transcript.title}</p>
                    <Badge variant={
                      transcript.status === 'completed' ? 'default' :
                      transcript.status === 'reviewed' ? 'default' :
                      transcript.status === 'in-progress' ? 'secondary' :
                      'outline'
                    }>
                      {transcript.status.replace('_', ' ').replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Created: {new Date(transcript.createdAt).toLocaleDateString()}
                    </span>
                    {transcript.segmentCount !== undefined && (
                      <span>{transcript.segmentCount} segments</span>
                    )}
                    {transcript.completedAt && (
                      <span>
                        Completed: {new Date(transcript.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <PermissionGate permission="transcripts:read">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/hearings/transcripts/${transcript.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </PermissionGate>
                  {(transcript.status === 'draft' || transcript.status === 'in-progress') && (
                    <PermissionGate permission="transcripts:update">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/hearings/transcripts/${transcript.id}/manual`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </PermissionGate>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No transcripts available for this hearing yet.
            </p>
            <PermissionGate permission="transcripts:create">
              <Button asChild variant="outline">
                <Link href={`/dashboard/hearings/transcripts/new?hearingId=${hearingId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Transcript
                </Link>
              </Button>
            </PermissionGate>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
