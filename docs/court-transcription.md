````markdown
# Court Transcript System

## Overview

This system provides comprehensive manual court transcription capabilities for your legal case management platform, designed specifically for Pacific Island court systems.

## Features

### 1. **Manual Court Transcription**
- Real-time manual entry during hearings
- Perfect for handling local dialects and accents
- Speaker identification and management
- Auto-save to database
- Keyboard shortcuts for efficiency
- Session timer and tracking

### 2. **Transcript Management**
- Create transcripts linked to hearings and cases
- Manage multiple speakers with roles (judge, prosecutor, defense attorney, witness, etc.)
- View and search complete transcripts
- Full-text search across all segments
- Export to PDF and DOCX formats

### 3. **Editing & Review**
- Edit individual transcript segments
- Track edit history (original vs edited text)
- Confidence scores from transcription service
- Mark transcripts as reviewed/approved
- Speaker assignment correction

### 4. **Annotations & Highlights**
- Add notes to specific segments
- Highlight important testimony
- Bookmark key moments
- Tag objections, key testimony, etc.
- Color-coded annotations

## Database Schema

### Tables

1. **transcripts** - Main transcript records
   - Links to case and hearing
   - Status tracking (draft, in-progress, completed, reviewed)
   - Recording metadata
   - Duration and timing info

2. **transcript_speakers** - Speaker definitions
   - Name and role
   - Link to system users (optional)
   - Speaker labels from transcription service

3. **transcript_segments** - Individual transcript segments
   - Timestamped text segments
   - Speaker attribution
   - Confidence scores
   - Edit tracking

4. **transcript_annotations** - User annotations
   - Notes, highlights, bookmarks
   - Time-based or segment-based
   - Type and color coding

## How Court Transcription Works

### Manual Transcription Flow

1. **Hearing Starts** → Transcriber opens manual transcription editor
2. **Speaker Selection** → Select who is speaking from dropdown
3. **Real-Time Typing** → Type what is being said
4. **Add Entry** → Save entry with timestamp (Ctrl+Enter)
5. **Auto-Save** → Background saving every 5 seconds
6. **Review & Edit** → Edit and review after completion

### Why Manual Transcription?

The system uses manual transcription instead of automated speech-to-text because:
- **Local Dialects**: Perfect for Fijian, iTaukei, and Pacific languages
- **Accents**: Handles diverse regional accents
- **Code-Switching**: Supports mixing multiple languages
- **No Cost**: No expensive AI API fees
- **Privacy**: No audio sent to external services
- **Accuracy**: Human transcribers understand local context
- **Offline Capable**: Works without internet connection

## Setup Instructions

### 1. Run Database Migration

```bash
# Apply the transcript tables migration
psql $DATABASE_URL -f migrations/004_create_transcripts.sql
```

### 2. Update Hearing Pages

Add transcript links to hearing detail pages by updating `/app/dashboard/hearings/[id]/page.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

// In your hearing detail page
<Link href={`/dashboard/hearings/transcripts/new?hearingId=${hearing.id}`}>
  <Button>
    <Mic className="w-4 h-4 mr-2" />
    Create Transcript
  </Button>
</Link>

// Show existing transcripts
{transcripts.map(transcript => (
  <Link key={transcript.id} href={`/dashboard/hearings/transcripts/${transcript.id}`}>
    {transcript.title}
  </Link>
))}
```

## Usage

### Creating a Transcript

1. Navigate to a hearing detail page
2. Click "Create Transcript"
3. Enter transcript title
4. (Optional) Add recording URL for reference
5. Click "Create Transcript"

### Manual Transcription

1. Start the session timer when hearing begins
2. Select the speaker from the dropdown
3. Type what they say in the text area
4. Add optional notes for clarification
5. Press Ctrl+Enter or click "Add Entry" to save
6. Repeat for each speaker's statement
7. Click "Complete Transcription" when done

### Editing Transcripts

1. View transcript
2. Click edit icon on any segment
3. Modify text
4. Click "Save" - original text preserved
5. Edits marked with "Edited" badge

### Adding Annotations

1. Hover over transcript segment
2. Click highlight, bookmark, or note icon
3. Add annotation content
4. Annotations appear below segment

### Searching Transcripts

1. Use search bar in transcript viewer
2. Full-text search across all segments
3. Filter by speaker
4. Results highlight matching segments

## API Endpoints

The manual transcription system uses server actions instead of API endpoints:
- `createTranscript` - Create new transcript
- `saveManualTranscriptEntries` - Save completed entries
- `autoSaveManualTranscript` - Background auto-save
- `updateSegment` - Edit existing segment
- `addAnnotation` - Add annotation to segment

## Export Formats

### PDF Export
Professional court transcript format with:
- Header with case information
- Timestamped segments
- Speaker names and roles
- Page numbers
- Signature lines

### DOCX Export
Editable Word document with:
- Standard court transcript formatting
- Paragraph styles for each speaker
- Timestamps
- Easy editing for final review

## Best Practices

### Transcriber Workflow
- Pre-add all expected speakers before starting
- Use keyboard shortcuts (Ctrl+Enter) for efficiency
- Add notes for unclear words or context
- Don't wait for perfection - type as you hear
- Use notes field for language translations
- Review and edit after hearing completion

### Speaker Management
- Add all expected speakers before recording
- Use clear, consistent speaker names
- Link speakers to system users when possible
- Update speaker assignments during review

### Editing Workflow
1. Complete manual transcription
2. Review for obvious errors
3. Verify speaker assignments
4. Edit text for accuracy
5. Add annotations for key moments
6. Mark as "reviewed" when complete
7. Export final version

### Efficiency Tips
- Learn keyboard shortcuts
- Use consistent speaker naming
- Add clarifying notes during transcription
- Take advantage of auto-save
- Export PDF for court filing
- Keep DOCX version for internal edits

## Troubleshooting

### Auto-Save Not Working
- Check browser console for errors
- Verify internet connection (for auto-save)
- Ensure transcript ID is valid
- Manual save available as backup

### Keyboard Shortcuts Not Working
- Ensure text area has focus
- Check for browser extension conflicts
- Verify browser supports shortcuts
- Use mouse as alternative

### Missing Entries
- Check auto-save is enabled
- Verify entries were submitted
- Review browser console for errors
- Use manual save frequently

### Performance Issues
- Close unnecessary browser tabs
- Clear browser cache
- Reduce number of entries per page
- Use modern browser version

## Cost Considerations

### Manual Transcription
- **No AI API Costs**: Zero external service fees
- **Staff Time**: Requires dedicated transcriber during hearing
- **Training**: Minimal training needed for basic typing
- **Equipment**: Only requires computer with keyboard
- **Total Cost**: Staff salary only, no per-minute fees

## Future Enhancements

- [ ] Text templates for common court phrases
- [ ] Multi-language keyboard support
- [ ] Collaborative transcription (multiple transcribers)
- [ ] Speech shortcuts and abbreviations
- [ ] Offline mode with sync
- [ ] Video synchronization
- [ ] Automated redaction tools
- [ ] Integration with court filing systems
- [ ] Transcript comparison/diff view
- [ ] Custom dictionaries for legal terms

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review [Manual Transcription Guide](./manual-transcription.md)
3. Check browser console for errors
4. Contact system administrator
5. Review existing transcripts for examples
