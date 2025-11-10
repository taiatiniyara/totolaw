# Court Transcript System

## Overview

This system provides comprehensive live and batch court transcription capabilities for your legal case management platform.

## Features

### 1. **Live Court Transcription**
- Real-time speech-to-text during hearings
- Multiple transcription service support (Deepgram, AssemblyAI, Whisper, Google)
- Speaker identification and diarization
- Live preview with interim results
- Pause/resume capability
- Auto-save to database

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

### Real-Time Transcription Flow

1. **Audio Capture** → Browser captures microphone audio
2. **Streaming** → Audio chunks sent to server via WebSocket/HTTP
3. **Speech-to-Text** → Transcription service processes audio
4. **Speaker ID** → Diarization identifies speakers
5. **Database** → Segments saved automatically
6. **Live Display** → UI updates in real-time

### Transcription Services

#### Deepgram (Recommended)
- **Best for:** Legal/court terminology
- **Features:** High accuracy, speaker diarization, fast processing
- **Cost:** Pay-as-you-go, ~$0.0125/min
- **Setup:** Sign up at https://deepgram.com

#### AssemblyAI
- **Best for:** Speaker identification accuracy
- **Features:** Good diarization, entity recognition
- **Cost:** ~$0.00025/second
- **Setup:** Sign up at https://www.assemblyai.com

#### OpenAI Whisper
- **Best for:** Self-hosted or API option
- **Features:** Open-source, multiple languages
- **Cost:** Free (self-hosted) or API pricing
- **Setup:** Use OpenAI API or run locally

#### Google Speech-to-Text
- **Best for:** Enterprise deployments
- **Features:** Reliable, multi-language, good accuracy
- **Cost:** ~$0.006-0.024/15 seconds
- **Setup:** Google Cloud console

## Setup Instructions

### 1. Run Database Migration

```bash
# Apply the transcript tables migration
psql $DATABASE_URL -f migrations/004_create_transcripts.sql
```

### 2. Install Transcription Service SDK

Choose one or more services:

```bash
# Deepgram (recommended)
npm install @deepgram/sdk

# AssemblyAI
npm install assemblyai

# OpenAI (for Whisper API)
npm install openai

# Google Speech-to-Text
npm install @google-cloud/speech
```

### 3. Set Environment Variables

Add to your `.env.local`:

```env
# Choose one or more transcription services

# Deepgram (recommended for legal)
DEEPGRAM_API_KEY=your_deepgram_api_key

# AssemblyAI
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# OpenAI Whisper
OPENAI_API_KEY=your_openai_api_key

# Google Speech-to-Text (requires service account JSON)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Or use a generic key name
TRANSCRIPTION_API_KEY=your_api_key
```

### 4. Configure WebSocket Support

For production deployments with real-time transcription:

#### Option A: Custom Server (Node.js)
Create `server.js`:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ server, path: '/api/transcription/ws' });

  wss.on('connection', (ws, req) => {
    // Handle WebSocket connections for live transcription
    console.log('Client connected');
    
    ws.on('message', (message) => {
      // Handle audio data
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

#### Option B: Vercel Deployment
Use Vercel's Edge Functions or integrate with a separate WebSocket service like Pusher or Ably.

### 5. Update Hearing Pages

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
4. (Optional) Add recording URL for batch processing
5. Click "Create & Start Recording"

### Live Recording

1. Select transcription service (Deepgram recommended)
2. Grant microphone permissions
3. Click "Start Recording"
4. Speak clearly - transcript appears in real-time
5. Use Pause/Resume as needed
6. Click "Stop & Save" when complete

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

- `POST /api/transcription/live/[transcriptId]` - Send audio data
- `DELETE /api/transcription/live/[transcriptId]` - Stop session
- WebSocket `/api/transcription/ws` - Real-time streaming (custom server)

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

### Recording Quality
- Use external microphone for better accuracy
- Minimize background noise
- Position mic near speakers
- Test audio levels before starting

### Speaker Management
- Add all expected speakers before recording
- Use clear, consistent speaker names
- Link speakers to system users when possible
- Update speaker assignments during review

### Editing Workflow
1. Complete live transcription
2. Review for obvious errors
3. Assign segments to correct speakers
4. Edit text for accuracy
5. Add annotations for key moments
6. Mark as "reviewed" when complete
7. Export final version

### Performance Tips
- Use Deepgram for best legal accuracy
- Enable speaker diarization
- Batch process long recordings overnight
- Export PDF for court filing
- Keep DOCX version for internal edits

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Verify microphone is selected
- Test in browser settings
- Use HTTPS (required for mic access)

### Poor Transcription Accuracy
- Improve audio quality
- Reduce background noise
- Speak clearly and at moderate pace
- Try different transcription service
- Use Deepgram's legal models

### WebSocket Connection Issues
- Verify WebSocket support enabled
- Check firewall settings
- Use custom server for production
- Consider HTTP fallback option

### Missing Segments
- Check internet connection
- Verify service API key valid
- Monitor console for errors
- Ensure segments saving to database

## Cost Estimates

### Deepgram (Recommended)
- $0.0125/minute
- 1-hour hearing = $0.75
- 100 hours/month = $75

### AssemblyAI
- $0.015/minute (async)
- $0.037/minute (real-time)
- 1-hour hearing = $2.22 (real-time)

### OpenAI Whisper
- $0.006/minute
- 1-hour hearing = $0.36
- Best value for budget-conscious

### Google Speech-to-Text
- $0.006-0.024/15 seconds
- 1-hour hearing = $1.44-5.76
- Free tier: 60 min/month

## Future Enhancements

- [ ] AI-powered transcript summarization
- [ ] Automatic key point extraction
- [ ] Multi-language support
- [ ] Real-time translation
- [ ] Video synchronization
- [ ] Automated redaction
- [ ] Voice biometrics for speaker ID
- [ ] Integration with court filing systems
- [ ] Transcript comparison/diff view
- [ ] Custom vocabulary for legal terms

## Support

For issues or questions:
1. Check troubleshooting section
2. Review transcription service docs
3. Verify environment configuration
4. Check browser console for errors
5. Test with different service providers
