-- Create transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES cases(id),
  hearing_id TEXT NOT NULL REFERENCES hearings(id),
  title TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration INTEGER,
  recording_url TEXT,
  transcription_service VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  accuracy INTEGER,
  created_by TEXT REFERENCES "user"(id),
  reviewed_by TEXT REFERENCES "user"(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_org_idx ON transcripts(organization_id);
CREATE INDEX IF NOT EXISTS transcript_case_idx ON transcripts(case_id);
CREATE INDEX IF NOT EXISTS transcript_hearing_idx ON transcripts(hearing_id);
CREATE INDEX IF NOT EXISTS transcript_status_idx ON transcripts(status);
CREATE INDEX IF NOT EXISTS transcript_created_by_idx ON transcripts(created_by);

-- Create transcript speakers table
CREATE TABLE IF NOT EXISTS transcript_speakers (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role VARCHAR(50) NOT NULL,
  user_id TEXT REFERENCES "user"(id),
  speaker_label VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_speaker_org_idx ON transcript_speakers(organization_id);
CREATE INDEX IF NOT EXISTS transcript_speaker_transcript_idx ON transcript_speakers(transcript_id);
CREATE INDEX IF NOT EXISTS transcript_speaker_role_idx ON transcript_speakers(role);

-- Create transcript segments table
CREATE TABLE IF NOT EXISTS transcript_segments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  speaker_id TEXT REFERENCES transcript_speakers(id),
  segment_number INTEGER NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  text TEXT NOT NULL,
  original_text TEXT,
  confidence INTEGER,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_by TEXT REFERENCES "user"(id),
  edited_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_segment_org_idx ON transcript_segments(organization_id);
CREATE INDEX IF NOT EXISTS transcript_segment_transcript_idx ON transcript_segments(transcript_id);
CREATE INDEX IF NOT EXISTS transcript_segment_speaker_idx ON transcript_segments(speaker_id);
CREATE INDEX IF NOT EXISTS transcript_segment_number_idx ON transcript_segments(transcript_id, segment_number);
CREATE INDEX IF NOT EXISTS transcript_segment_start_time_idx ON transcript_segments(transcript_id, start_time);

-- Create transcript annotations table
CREATE TABLE IF NOT EXISTS transcript_annotations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  segment_id TEXT REFERENCES transcript_segments(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT,
  start_time INTEGER,
  end_time INTEGER,
  color VARCHAR(20),
  created_by TEXT NOT NULL REFERENCES "user"(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transcript_annotation_org_idx ON transcript_annotations(organization_id);
CREATE INDEX IF NOT EXISTS transcript_annotation_transcript_idx ON transcript_annotations(transcript_id);
CREATE INDEX IF NOT EXISTS transcript_annotation_segment_idx ON transcript_annotations(segment_id);
CREATE INDEX IF NOT EXISTS transcript_annotation_type_idx ON transcript_annotations(type);
CREATE INDEX IF NOT EXISTS transcript_annotation_created_by_idx ON transcript_annotations(created_by);

-- Add full-text search to transcript segments
CREATE INDEX IF NOT EXISTS transcript_segment_text_search_idx ON transcript_segments USING GIN (to_tsvector('english', text));
