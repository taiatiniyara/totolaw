# Manual Transcription Feature

## Overview

The Manual Transcription feature addresses the unique challenges faced by court transcribers in Fiji and other Pacific Island nations where automated speech-to-text systems struggle with:

- **Local Dialects**: Fijian, iTaukei, and other Pacific languages
- **Accents**: Diverse accents across different regions
- **Code-Switching**: Speakers mixing multiple languages in one conversation
- **Legal Terminology**: Local legal terms and expressions

## Features

### 1. **Real-Time Manual Entry**
- Type proceedings as they happen in court
- Select the speaker before each statement
- Built-in timer to track session duration
- Automatic timestamping of each entry

### 2. **Speaker Management**
- Pre-loaded speakers (Judge, Prosecutor, Defense Attorney, Witness)
- Easy speaker selection via dropdown
- Visual indicators showing speaker name and role

### 3. **Note-Taking**
- Optional notes field for each entry
- Add clarifications, corrections, or context
- Helps with post-transcription review

### 4. **Auto-Save**
- Automatic saving every 5 seconds
- Prevents data loss
- Works in background without interrupting typing

### 5. **Keyboard Shortcuts**
- `Ctrl + Enter`: Quickly add new entry
- `Ctrl + S`: Manual save
- Optimized for fast transcription workflow

### 6. **Session Management**
- Start/pause timer for accurate time tracking
- Word count tracking
- Entry counter
- Visual progress indicators

## How to Use

### Starting a Manual Transcription

1. Navigate to a hearing: `/dashboard/hearings/[id]`
2. Click "New Transcript"
3. Select **"Manual Transcription"** mode (recommended for Fiji)
4. Fill in transcript title
5. Click "Create Transcript"

### During Transcription

1. **Start the Timer** when hearing begins
2. **Select the Speaker** from the dropdown
3. **Type** what they say in the text area
4. **Add Notes** (optional) if clarification is needed
5. **Press Ctrl+Enter** or click "Add Entry" to save
6. Repeat for each speaker's statement

### Tips for Transcribers

- Start typing immediately - don't wait for perfection
- Use the notes field for:
  - Words you're uncertain about
  - Non-verbal context (e.g., "witness crying")
  - Language translations
  - Legal term clarifications
- The transcript auto-saves, so you won't lose work
- You can pause the timer during breaks
- Review and edit entries after the hearing if needed

## Technical Implementation

### Components

**`ManualTranscriptionEditor`** (`/components/manual-transcription-editor.tsx`)
- Client-side React component
- Manages local state for entries
- Handles keyboard shortcuts
- Auto-save functionality

### Pages

**Manual Transcription Page** (`/app/dashboard/hearings/transcripts/[id]/manual/page.tsx`)
- Server-rendered page
- Loads existing transcript data
- Provides speaker information
- Server actions for saving

### Actions

**`saveManualTranscriptEntries`** - Saves completed transcript
**`autoSaveManualTranscript`** - Background auto-save

### Database

Entries are stored as transcript segments with:
- `text`: The actual spoken words
- `speakerId`: Who said it
- `timestamp`: When it was said (relative to hearing start)
- `metadata.notes`: Optional notes
- `metadata.manualEntry`: Flag indicating manual entry
- `confidence`: Set to 1.0 (100%) for manual entries

## Why Manual Transcription?

Manual transcription is the chosen approach for this system because it offers:

| Feature | Benefit |
|---------|---------|
| **Accuracy with dialects** | ✅ Excellent - understands local Fijian accents |
| **Handles code-switching** | ✅ Yes - seamlessly handles mixed languages |
| **Local terminology** | ✅ Perfect - captures context and legal terms |
| **Cost** | ✅ No AI fees - no per-minute charges |
| **Privacy** | ✅ No audio sent to external services |
| **Internet** | ✅ Works offline with periodic sync |
| **Training** | ✅ Basic typing skills sufficient |

## Future Enhancements

### Possible Additions
- **Templates**: Pre-defined phrases for common court statements
- **Multi-language support**: Toggle between Fijian/English keyboards
- **Voice commands**: "Next speaker" without touching keyboard
- **Collaboration**: Multiple transcribers working simultaneously
- **Speech shortcuts**: Abbreviations that auto-expand
- **Offline mode**: Work without internet, sync later

## Benefits for Fiji Courts

1. **Accuracy**: Transcribers understand local context better than AI
2. **Cost-Effective**: No expensive AI transcription services
3. **Privacy**: No audio sent to external services
4. **Flexibility**: Works with any language or dialect
5. **Cultural Sensitivity**: Captures nuances AI might miss
6. **Reliable**: No dependency on internet connectivity
7. **Legal Compliance**: Human verification built-in

## Support

For issues or questions about manual transcription:
- Check the in-app help cards
- Review existing transcripts for examples
- Contact your system administrator

---

**Built specifically for Pacific Island court systems** 🌺
