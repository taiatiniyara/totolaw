# Transcription System

## Overview

The Totolaw transcription system provides a comprehensive solution for recording and managing court proceedings. It's specifically designed for Pacific Island court systems, with particular emphasis on handling the unique challenges of Fiji courts including multiple languages, dialects, and accents.

## Key Features

- **Manual Transcription** - Real-time typing of proceedings as they happen
- **Multi-Speaker Support** - Track different speakers (judges, lawyers, witnesses)
- **Auto-Save** - Automatic saving every 5 seconds to prevent data loss
- **Session Timer** - Track duration of transcription sessions
- **Keyboard Shortcuts** - Rapid entry with Ctrl+Enter and Ctrl+S
- **Contextual Notes** - Add clarifications and corrections alongside transcripts
- **Flexible Architecture** - Designed to support future automated transcription

## Why Manual Transcription?

### Designed for Fiji Courts

The manual transcription system was purpose-built to address specific challenges in Pacific Island court systems:

1. **Dialect Handling** - Fijian and Pacific languages have many dialects that automated systems struggle with
2. **Accent Diversity** - Multiple accents and pronunciation variations across regions
3. **Language Mixing** - Court proceedings often mix English with local languages
4. **Technical Context** - Legal terminology specific to Pacific legal systems
5. **Audio Quality** - Variable audio quality in different courtrooms
6. **Immediate Availability** - Transcripts available in real-time without processing delays

### Benefits Over Automated Systems

- **Accuracy** - Human transcribers understand context and local dialects
- **Real-Time** - No processing delays or waiting for AI transcription
- **Flexibility** - Transcribers can handle code-switching and unclear audio
- **Cost-Effective** - No expensive automated transcription services required
- **Offline Capable** - Can transcribe without internet connectivity
- **Quality Control** - Immediate error correction and clarification

## Architecture

### Database Schema

#### Transcripts Table

```typescript
{
  id: string;                    // Primary key
  caseId: string;                // Associated case
  hearingId: string;             // Associated hearing
  organisationId: string;        // Organisation isolation
  title: string;                 // Transcript title
  status: string;                // draft, in-progress, completed, reviewed
  recordingUrl?: string;         // Optional audio/video URL
  transcriptionService?: string; // Service used (manual, automated)
  startedAt?: Date;             // When transcription started
  completedAt?: Date;           // When completed
  createdBy: string;            // User who created
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update
}
```

**Status Values:**
- `draft` - Newly created, not started
- `in-progress` - Currently being transcribed
- `completed` - Transcription finished
- `reviewed` - Reviewed and approved by supervisor

#### Transcript Speakers Table

```typescript
{
  id: string;                   // Primary key
  transcriptId: string;         // Parent transcript
  organisationId: string;       // Organisation isolation
  name: string;                 // Speaker name
  role: string;                 // Speaker role
  userId?: string;              // Linked user account (optional)
  metadata?: object;            // Additional speaker data
  createdAt: Date;
  updatedAt: Date;
}
```

**Common Roles:**
- `judge` - Presiding judge or magistrate
- `prosecutor` - Prosecution counsel
- `defense` - Defense attorney
- `witness` - Witness giving testimony
- `defendant` - Defendant speaking
- `clerk` - Court clerk
- `interpreter` - Court interpreter
- `other` - Other participants

#### Transcript Segments Table

```typescript
{
  id: string;                   // Primary key
  transcriptId: string;         // Parent transcript
  speakerId: string;            // Who spoke
  organisationId: string;       // Organisation isolation
  startTime: number;            // Start time in milliseconds
  endTime?: number;             // End time (optional)
  text: string;                 // Transcript text
  confidence?: number;          // Confidence score (for automated)
  metadata?: object;            // Additional data (notes, corrections)
  createdAt: Date;
  updatedAt: Date;
}
```

**Metadata Structure (Manual Transcription):**
```typescript
{
  notes?: string;               // Contextual notes
  timestamp: string;            // Human-readable timestamp
  isCorrection?: boolean;       // Marks as correction
  originalText?: string;        // Original text if corrected
}
```

#### Transcript Annotations Table

```typescript
{
  id: string;                   // Primary key
  transcriptId: string;         // Parent transcript
  segmentId?: string;           // Specific segment (optional)
  organisationId: string;       // Organisation isolation
  type: string;                 // Annotation type
  content?: string;             // Annotation content
  color?: string;               // Highlight color
  createdBy: string;            // User who created
  createdAt: Date;
  updatedAt: Date;
}
```

**Annotation Types:**
- `highlight` - Important text highlight
- `comment` - Comment or note
- `correction` - Error correction
- `clarification` - Clarification note
- `redaction` - Text redaction marker

## Manual Transcription Component

### ManualTranscriptionEditor

**File:** `components/manual-transcription-editor.tsx`

A sophisticated React component for real-time manual transcription.

#### Component Interface

```typescript
interface ManualTranscriptionEditorProps {
  transcriptId: string;          // Transcript being edited
  hearingId: string;             // Associated hearing
  caseTitle: string;             // Case title for display
  speakers: Speaker[];           // Available speakers
  existingEntries?: TranscriptEntry[]; // Pre-existing entries
  onSave?: (entries: TranscriptEntry[]) => Promise<void>;
  onAutoSave?: (entries: TranscriptEntry[]) => Promise<void>;
}

interface Speaker {
  id: string;
  name: string;
  role: string;
}

interface TranscriptEntry {
  id: string;
  speakerId: string;
  text: string;
  timestamp: string;             // HH:MM:SS format
  notes?: string;
}
```

#### Key Features

##### 1. Session Timer

Tracks the duration of the transcription session:

```typescript
const [isTimerRunning, setIsTimerRunning] = useState(false);
const [elapsedTime, setElapsedTime] = useState(0);

// Format: HH:MM:SS or MM:SS
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};
```

**Usage:**
- Click "Start Timer" when hearing begins
- Timer runs continuously in background
- Pause when needed
- Timestamps are relative to session start

##### 2. Entry Management

Each entry consists of:
- **Speaker** - Who is speaking
- **Text** - What they said
- **Timestamp** - When they said it (from session timer)
- **Notes** - Optional contextual notes

```typescript
const addEntry = () => {
  if (!currentText.trim()) {
    toast.error("Please enter some text");
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
  textareaRef.current?.focus();
  
  toast.success("Entry added");
};
```

##### 3. Auto-Save Functionality

Automatically saves entries every 5 seconds:

```typescript
useEffect(() => {
  if (entries.length > 0 && onAutoSave) {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      onAutoSave(entries).catch((error) => {
        console.error("Auto-save failed:", error);
      });
    }, 5000); // 5 second delay
  }

  return () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  };
}, [entries, onAutoSave]);
```

**Benefits:**
- Prevents data loss from browser crashes
- No manual save needed during transcription
- Non-blocking (doesn't interrupt typing)
- Debounced to avoid excessive saves

##### 4. Keyboard Shortcuts

Efficient keyboard navigation for rapid entry:

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Enter to add entry
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      addEntry();
    }
    
    // Ctrl+S to save all
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [currentText, currentSpeakerId, entries]);
```

**Shortcuts:**
- `Ctrl + Enter` - Add current entry and continue
- `Ctrl + S` - Save all entries immediately
- Tab navigation through fields

##### 5. Word Count Tracking

Real-time word count for both current entry and total:

```typescript
// Current entry word count
const currentWordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

// Total word count
useEffect(() => {
  const words = entries.reduce((count, entry) => {
    return count + entry.text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  setWordCount(words);
}, [entries]);
```

##### 6. Contextual Notes

Optional notes for each entry to add:
- Clarifications (e.g., "Speaker had strong accent")
- Corrections (e.g., "Corrected from original")
- Context (e.g., "Witness became emotional")
- Observations (e.g., "Pause for document review")

```typescript
const [showNotes, setShowNotes] = useState(false);

// Toggle notes field visibility
<button onClick={() => setShowNotes(!showNotes)}>
  Add notes (optional)
</button>

{showNotes && (
  <Textarea
    placeholder="Add contextual notes, corrections, or observations..."
    value={currentNotes}
    onChange={(e) => setCurrentNotes(e.target.value)}
  />
)}
```

## Manual Transcription Workflow

### Step 1: Create Transcript

Navigate to a hearing and click "Create Transcript":

```typescript
// app/dashboard/hearings/transcripts/new/page.tsx

async function handleCreateTranscript(formData: FormData) {
  "use server";
  
  const title = formData.get("title") as string;
  const recordingUrl = formData.get("recordingUrl") as string;
  
  // Create transcript
  const result = await createTranscript({
    caseId: hearing.caseId,
    hearingId: hearing.id,
    title,
    recordingUrl: recordingUrl || undefined,
  });
  
  // Add default speakers
  const defaultSpeakers = [
    { name: "Judge", role: "judge" },
    { name: "Prosecutor", role: "prosecutor" },
    { name: "Defense Attorney", role: "defense" },
    { name: "Witness", role: "witness" },
  ];
  
  for (const speaker of defaultSpeakers) {
    await addSpeaker({
      transcriptId: result.transcript.id,
      ...speaker,
    });
  }
  
  // Redirect to manual transcription page
  redirect(`/dashboard/hearings/transcripts/${result.transcript.id}/manual`);
}
```

**Default Speakers Added:**
- Judge
- Prosecutor
- Defense Attorney
- Witness

Additional speakers can be added during transcription.

### Step 2: Manual Transcription Page

The manual transcription page loads the transcript and displays the editor:

```typescript
// app/dashboard/hearings/transcripts/[id]/manual/page.tsx

export default async function ManualTranscriptionPage({ params }: PageProps) {
  // Load transcript, speakers, and existing segments
  const details = await transcriptService.getTranscriptWithDetails(
    params.id,
    context.organisationId
  );
  
  // Convert existing segments to entry format
  const existingEntries = segments.map((segment) => ({
    id: segment.id,
    speakerId: segment.speakerId || speakers[0]?.id || "",
    text: segment.text,
    timestamp: formatMsToTimestamp(segment.startTime),
    notes: (segment.metadata as any)?.notes,
  }));
  
  return (
    <ManualTranscriptionEditor
      transcriptId={params.id}
      hearingId={transcript.hearingId}
      caseTitle={caseRecord.title}
      speakers={speakers}
      existingEntries={existingEntries}
      onSave={handleSave}
      onAutoSave={handleAutoSave}
    />
  );
}
```

### Step 3: Transcribing

#### Basic Workflow

1. **Start Timer** - Click "Start Timer" when hearing begins
2. **Select Speaker** - Choose who is speaking from dropdown
3. **Type Statement** - Type what the speaker says
4. **Add Entry** - Press Ctrl+Enter to add and continue
5. **Repeat** - Continue for each statement
6. **Auto-Save** - System saves automatically every 5 seconds
7. **Manual Save** - Press Ctrl+S to force save at any time

#### Advanced Features

**Adding Notes:**
```
1. Click "Add notes (optional)"
2. Enter contextual information
3. Notes are saved with the entry
```

**Editing Speakers:**
```
- Change speaker between entries
- Add new speakers as needed (future feature)
```

**Pausing:**
```
- Pause timer during breaks
- Resume when hearing continues
- Entries continue from current timestamp
```

### Step 4: Saving

#### Auto-Save

Automatically triggered every 5 seconds after any change:

```typescript
async function handleAutoSave(entries: any[]) {
  "use server";
  await autoSaveManualTranscript({
    transcriptId: params.id,
    entries,
  });
}
```

**Behavior:**
- Silent save in background
- Updates transcript status to `in-progress`
- Doesn't block transcription
- Provides data loss protection

#### Manual Save

Triggered by user clicking "Save All" or pressing Ctrl+S:

```typescript
async function handleSave(entries: any[]) {
  "use server";
  const result = await saveManualTranscriptEntries({
    transcriptId: params.id,
    entries,
  });
  
  if (result.success) {
    revalidatePath(`/dashboard/hearings/transcripts/${params.id}`);
    revalidatePath(`/dashboard/hearings/${hearing.id}`);
  }
  
  return result;
}
```

**Behavior:**
- Saves all entries to database as segments
- Updates transcript status to `completed`
- Revalidates related pages
- Shows success/error toast

### Step 5: Review and Export

After saving, transcripts can be:
- **Viewed** - Read-only view of completed transcript
- **Searched** - Full-text search through transcript
- **Annotated** - Add highlights and comments
- **Exported** - Export to PDF or other formats (future)
- **Reviewed** - Mark as reviewed by supervisor

## Data Storage

### Conversion Process

Manual entries are converted to transcript segments on save:

```typescript
// Entry format (UI)
{
  id: "entry-1699876543",
  speakerId: "speaker-uuid",
  text: "The defendant was present at the scene.",
  timestamp: "10:35",
  notes: "Witness seemed uncertain"
}

// Converted to segment (Database)
{
  id: "segment-uuid",
  transcriptId: "transcript-uuid",
  speakerId: "speaker-uuid",
  organisationId: "org-uuid",
  startTime: 635000,  // 10:35 in milliseconds
  endTime: null,
  text: "The defendant was present at the scene.",
  confidence: null,
  metadata: {
    notes: "Witness seemed uncertain",
    timestamp: "10:35",
    manualEntry: true
  },
  createdAt: "2025-11-15T00:00:00Z",
  updatedAt: "2025-11-15T00:00:00Z"
}
```

### Timestamp Conversion

```typescript
function parseTimestampToMs(timestamp: string): number {
  const parts = timestamp.split(':');
  
  if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts.map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  } else if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts.map(Number);
    return (minutes * 60 + seconds) * 1000;
  }
  
  return 0;
}

function formatMsToTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
```

## Service Layer

### TranscriptService

**File:** `lib/services/transcript.service.ts`

Centralized service for transcript operations:

```typescript
class TranscriptService {
  // Create transcript
  async createTranscript(
    organisationId: string,
    userId: string,
    data: CreateTranscriptData
  ): Promise<Transcript>;
  
  // Get transcript with all related data
  async getTranscriptWithDetails(
    transcriptId: string,
    organisationId: string
  ): Promise<{
    transcript: Transcript;
    speakers: TranscriptSpeaker[];
    segments: TranscriptSegment[];
  } | null>;
  
  // Update transcript status
  async updateTranscriptStatus(
    transcriptId: string,
    organisationId: string,
    status: string,
    userId?: string
  ): Promise<Transcript>;
  
  // Add speaker
  async addSpeaker(
    organisationId: string,
    data: CreateSpeakerData
  ): Promise<TranscriptSpeaker>;
  
  // Add segment
  async addSegment(
    organisationId: string,
    data: CreateSegmentData
  ): Promise<TranscriptSegment>;
  
  // Get segments for transcript
  async getSegmentsByTranscript(
    transcriptId: string,
    organisationId: string
  ): Promise<TranscriptSegment[]>;
  
  // Search segments
  async searchSegments(
    transcriptId: string,
    organisationId: string,
    query: string
  ): Promise<TranscriptSegment[]>;
}
```

### Server Actions

**File:** `app/dashboard/hearings/transcripts/actions.ts`

Server actions wrap the service layer and handle auth/permissions:

```typescript
export async function saveManualTranscriptEntries(data: {
  transcriptId: string;
  entries: Array<{
    id: string;
    speakerId: string;
    text: string;
    timestamp: string;
    notes?: string;
  }>;
}) {
  // 1. Validate session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  
  // 2. Get organisation context
  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { error: "Organisation context not found" };
  }
  
  // 3. Verify transcript access
  const transcript = await transcriptService.getTranscriptWithDetails(
    data.transcriptId,
    context.organisationId
  );
  
  if (!transcript) {
    return { error: "Transcript not found" };
  }
  
  try {
    // 4. Convert entries to segments
    for (const entry of data.entries) {
      await transcriptService.addSegment(context.organisationId, {
        transcriptId: data.transcriptId,
        speakerId: entry.speakerId,
        startTime: parseTimestampToMs(entry.timestamp),
        text: entry.text,
        metadata: {
          notes: entry.notes,
          timestamp: entry.timestamp,
          manualEntry: true,
        },
      });
    }
    
    // 5. Update transcript status to completed
    await transcriptService.updateTranscriptStatus(
      data.transcriptId,
      context.organisationId,
      "completed",
      session.user.id
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error saving transcript entries:", error);
    return { error: "Failed to save transcript entries" };
  }
}
```

## UI Components

### Header Section

Shows case title and session statistics:

```tsx
<Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-bold">{caseTitle}</h2>
      <p className="text-sm text-gray-600">Manual Transcription</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-sm text-gray-600">Total Words</div>
        <div className="text-2xl font-bold">{wordCount}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Entries</div>
        <div className="text-2xl font-bold">{entries.length}</div>
      </div>
    </div>
  </div>
</Card>
```

### Timer Section

Session timer with start/pause controls:

```tsx
<Card className="p-6 bg-gray-50">
  <div className="flex items-center justify-between">
    <div className="text-center flex-1">
      <div className="text-sm text-gray-600">Session Time</div>
      <div className="text-2xl font-mono font-bold">
        {formatTime(elapsedTime)}
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
```

### Input Section

Entry form with speaker, text, and optional notes:

```tsx
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
        className="flex items-center gap-2 text-sm"
      >
        {showNotes ? <ChevronUp /> : <ChevronDown />}
        Add notes (optional)
      </button>
      {showNotes && (
        <Textarea
          placeholder="Add contextual notes, corrections, or observations..."
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          rows={2}
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
```

### Entries List

Display of all saved entries:

```tsx
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
```

### Help Section

Tips and shortcuts:

```tsx
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
```

## Best Practices

### For Transcribers

1. **Preparation**
   - Familiarize yourself with speakers before hearing
   - Test keyboard shortcuts
   - Ensure stable browser and internet connection

2. **During Transcription**
   - Start timer when hearing begins
   - Type verbatim what is said
   - Use notes field for unclear audio or dialect issues
   - Take advantage of Ctrl+Enter for speed
   - Don't worry about minor typos initially

3. **Quality Assurance**
   - Review entries after completion
   - Add clarification notes where needed
   - Check speaker assignments
   - Verify timestamps are reasonable

4. **Tips for Dialects**
   - Transcribe phonetically if standard spelling unclear
   - Add note explaining pronunciation
   - Use square brackets [unclear] for inaudible sections
   - Add note identifying which language/dialect

### For Administrators

1. **Setup**
   - Create transcripts immediately after scheduling hearings
   - Pre-populate speakers when known
   - Assign transcribers to specific hearings

2. **Training**
   - Train transcribers on keyboard shortcuts
   - Establish guidelines for dialect handling
   - Create style guide for consistency

3. **Quality Control**
   - Review completed transcripts
   - Provide feedback to transcribers
   - Mark transcripts as "reviewed" when approved

4. **Backup**
   - Auto-save provides protection
   - Encourage manual saves at breaks
   - Keep audio recordings as backup

## Future Enhancements

### Planned Features

1. **Enhanced Speaker Management**
   - Add new speakers during transcription
   - Edit speaker details
   - Speaker autocomplete

2. **Collaboration**
   - Multiple transcribers on same hearing
   - Real-time sync between transcribers
   - Role assignments (primary, backup)

3. **Automated Transcription Integration**
   - Upload audio/video files
   - Use automated transcription as draft
   - Human review and correction workflow
   - Hybrid manual + automated approach

4. **Export Options**
   - PDF export with formatting
   - Word document export
   - Timestamped transcript format
   - Official court transcript template

5. **Advanced Search**
   - Full-text search across all transcripts
   - Filter by speaker, date, case
   - Highlight search terms
   - Jump to specific segments

6. **Audio Sync**
   - Link transcript to audio recording
   - Click timestamp to play audio
   - Audio waveform visualization
   - Playback controls in transcript view

7. **Annotations & Highlights**
   - Highlight important statements
   - Add bookmarks
   - Color-code by topic
   - Export annotations separately

8. **Quality Metrics**
   - Words per minute tracking
   - Completion time statistics
   - Error rate monitoring
   - Transcriber performance dashboard

## Technical Considerations

### Performance

- Entries stored in React state until save
- Auto-save debounced to prevent excessive requests
- Large transcripts (>1000 entries) may need pagination
- Consider virtualized list for very long transcripts

### Browser Compatibility

- Tested on Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled
- LocalStorage for emergency backup (future)
- Service workers for offline mode (future)

### Security

- All data isolated by organisation
- Only assigned users can transcribe
- Transcripts tied to specific hearings
- Audit trail of who transcribed what

### Accessibility

- Keyboard navigation supported
- ARIA labels on all interactive elements
- Screen reader compatible
- High contrast mode support

---

**Related Documentation:**
- [API Documentation - Transcript Actions](05-api-documentation.md#transcript-management-actions)
- [Case Management](07-case-management.md)
- [Service Layer](10-services.md)
- [Database Schema](03-database-schema.md)
