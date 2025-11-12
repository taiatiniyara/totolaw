# Document Management

## Overview

The Document Management system in Totolaw handles all case-related documents and files through the Evidence Management system. Documents are uploaded, stored, and managed as evidence items linked to specific cases and hearings.

## Purpose

- **Unified Storage** - All case documents stored as evidence
- **Case Association** - Documents linked to specific cases
- **File Organization** - Browse documents by case or category
- **Search & Discovery** - Search across all documents
- **Access Control** - Permission-based document access
- **File Types** - Support for PDFs, images, audio, video, and office documents

## Document Categories

### Common Document Types

| Category | File Types | Examples |
|----------|------------|----------|
| **Evidence Documents** | PDF, Word, Excel | Witness statements, affidavits, reports |
| **Court Filings** | PDF | Applications, submissions, pleadings |
| **Audio Recordings** | MP3, WAV | Hearing recordings, interviews |
| **Video Evidence** | MP4, MOV | CCTV footage, recorded testimonies |
| **Images & Photos** | JPG, PNG, GIF | Crime scene photos, exhibit images |
| **Other Documents** | TXT, various | Miscellaneous supporting documents |

## Architecture

### Storage Model

Documents are implemented as evidence records with additional metadata:

```
Case
  ├── Evidence/Documents
  │     ├── File 1 (PDF - Court Filing)
  │     ├── File 2 (MP4 - Video Evidence)
  │     ├── File 3 (JPG - Photo Evidence)
  │     └── File 4 (DOCX - Witness Statement)
  └── Hearings
        └── Evidence/Documents
              ├── File 5 (PDF - Hearing Minutes)
              └── File 6 (MP3 - Audio Recording)
```

### Database Structure

Documents use the same `evidence` table:

```sql
CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  hearing_id TEXT,           -- Optional hearing link
  
  -- File Information
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,          -- Document description/notes
  
  -- Audit
  submitted_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Uploading Documents

### Upload Process

Documents are uploaded through the evidence upload interface:

**URL:** `/dashboard/evidence/upload`

**Required Information:**
- Case ID (required)
- File (required)
- Description (optional but recommended)
- Hearing ID (optional - link to specific hearing)

### Upload Form

```tsx
'use client';

export function UploadDocumentForm({ caseId }: { caseId: string }) {
  return (
    <form action={uploadEvidence} className="space-y-6">
      <input type="hidden" name="caseId" value={caseId} />

      <div>
        <label className="text-sm font-medium">Document File</label>
        <input
          type="file"
          name="file"
          required
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4,.mov"
          className="mt-1 block w-full"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum 50MB. Supported: PDF, Word, Excel, Images, Audio, Video
        </p>
      </div>

      <FormField
        label="Document Description"
        name="description"
        type="textarea"
        placeholder="Brief description of this document (e.g., 'Police Report - Incident 2024/123')"
        rows={3}
        hint="Add notes to help identify this document later"
      />

      <Button type="submit">Upload Document</Button>
    </form>
  );
}
```

### Supported File Types

```typescript
const ALLOWED_FILE_TYPES = [
  // Documents
  "application/pdf",                    // PDF
  "application/msword",                 // Word (.doc)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word (.docx)
  "application/vnd.ms-excel",           // Excel (.xls)
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (.xlsx)
  "text/plain",                         // Text files
  
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  
  // Audio
  "audio/mpeg",                         // MP3
  "audio/wav",                          // WAV
  
  // Video
  "video/mp4",                          // MP4
  "video/quicktime",                    // MOV
];
```

## Browsing Documents

### Documents Dashboard

**Location:** `/dashboard/documents`

The documents page provides:
- Quick access to all evidence files
- Browse by case
- Search functionality
- Document categories overview

```tsx
export default async function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage all case documents and evidence files"
        action={{
          label: "Upload Document",
          href: "/dashboard/evidence/upload",
        }}
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="All Evidence"
          description="View all evidence files across all cases"
          href="/dashboard/evidence"
        />
        <InfoCard
          title="Browse by Case"
          description="View documents organized by case"
          href="/dashboard/cases"
        />
        <InfoCard
          title="Search Documents"
          description="Search for specific documents"
          href="/dashboard/search"
        />
      </div>

      {/* Document Categories */}
      <DocumentCategories />
    </div>
  );
}
```

### Browse by Case

Navigate to a case to view all associated documents:

**URL:** `/dashboard/cases/{caseId}`

```tsx
export default async function CasePage({ params }: { params: { id: string } }) {
  const evidence = await getEvidenceForCase(params.id);

  return (
    <div className="space-y-6">
      {/* Case details... */}

      <Card>
        <CardHeader>
          <CardTitle>Documents & Evidence</CardTitle>
          <CardDescription>
            {evidence.length} files uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EvidenceList evidence={evidence} />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Viewing Documents

### Document List

```tsx
export function DocumentList({ documents }: { documents: Evidence[] }) {
  // Group by file type
  const grouped = groupByFileType(documents);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, files]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3">
            {category} ({files.length})
          </h3>
          <div className="grid gap-3">
            {files.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByFileType(documents: Evidence[]) {
  return documents.reduce((acc, doc) => {
    const category = getFileCategory(doc.fileType);
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, Evidence[]>);
}

function getFileCategory(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'PDF Documents';
  if (mimeType.startsWith('image/')) return 'Images';
  if (mimeType.startsWith('audio/')) return 'Audio Files';
  if (mimeType.startsWith('video/')) return 'Video Files';
  if (mimeType.includes('word')) return 'Word Documents';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Spreadsheets';
  return 'Other Documents';
}
```

### Document Card

```tsx
function DocumentCard({ document }: { document: Evidence }) {
  const icon = getFileIcon(document.fileType);

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{document.fileName}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatFileSize(document.fileSize)}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(document.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {document.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {document.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/evidence/${document.id}`}>
              View
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href={document.filePath} download>
              <DownloadIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getFileIcon(mimeType: string) {
  if (mimeType === 'application/pdf') return <FileTextIcon className="h-6 w-6" />;
  if (mimeType.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
  if (mimeType.startsWith('audio/')) return <MusicIcon className="h-6 w-6" />;
  if (mimeType.startsWith('video/')) return <VideoIcon className="h-6 w-6" />;
  return <FileIcon className="h-6 w-6" />;
}
```

## Searching Documents

### Global Search

Search across all documents in your organisation:

**URL:** `/dashboard/search`

```typescript
'use server';

export async function searchDocuments(
  query: string
): Promise<ActionResult<Evidence[]>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  const searchPattern = `%${query.toLowerCase()}%`;

  const results = await db
    .select()
    .from(evidence)
    .where(
      withOrgFilter(context.organisationId, evidence, [
        or(
          sql`LOWER(${evidence.fileName}) LIKE ${searchPattern}`,
          sql`LOWER(${evidence.description}) LIKE ${searchPattern}`
        ),
      ])
    )
    .orderBy(desc(evidence.createdAt))
    .limit(50);

  return { success: true, data: results };
}
```

### Search Interface

```tsx
'use client';

export function DocumentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await searchDocuments(query);
    if (result.success) {
      setResults(result.data);
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          placeholder="Search documents by filename or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {results.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Found {results.length} documents
          </p>
          <DocumentList documents={results} />
        </div>
      )}
    </div>
  );
}
```

## Document Preview

### Preview Modal

```tsx
'use client';

export function DocumentPreviewDialog({ 
  document 
}: { 
  document: Evidence;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Preview</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{document.fileName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <DocumentPreview document={document} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DocumentPreview({ document }: { document: Evidence }) {
  // PDF Preview
  if (document.fileType === 'application/pdf') {
    return (
      <iframe
        src={document.filePath}
        className="w-full h-full"
        title={document.fileName}
      />
    );
  }

  // Image Preview
  if (document.fileType.startsWith('image/')) {
    return (
      <img
        src={document.filePath}
        alt={document.fileName}
        className="max-w-full h-auto"
      />
    );
  }

  // Audio Preview
  if (document.fileType.startsWith('audio/')) {
    return (
      <div className="flex items-center justify-center h-full">
        <audio controls>
          <source src={document.filePath} type={document.fileType} />
        </audio>
      </div>
    );
  }

  // Video Preview
  if (document.fileType.startsWith('video/')) {
    return (
      <video controls className="w-full h-auto">
        <source src={document.filePath} type={document.fileType} />
      </video>
    );
  }

  // No preview available
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <FileIcon className="h-16 w-16 mb-4" />
      <p>Preview not available for this file type</p>
      <Button asChild className="mt-4">
        <a href={document.filePath} download>
          Download to view
        </a>
      </Button>
    </div>
  );
}
```

## Document Organization

### Best Practices

#### Naming Conventions

Use descriptive filenames:

✅ **Good:**
- `Police_Report_HAC179_2024.pdf`
- `Witness_Statement_John_Doe.pdf`
- `CCTV_Footage_Location_A.mp4`
- `Medical_Report_Dr_Smith.pdf`

❌ **Bad:**
- `document.pdf`
- `file1.pdf`
- `untitled.jpg`

#### Descriptions

Add clear descriptions:

✅ **Good:**
- "Police report for incident dated 15 Nov 2024 at Queen Street"
- "Witness statement from John Doe, recorded 20 Nov 2024"
- "CCTV footage from Main Street camera, 14 Nov 2024 18:30-19:00"

❌ **Bad:**
- "document"
- "file"
- ""

### Organizing by Hearing

Link documents to specific hearings when applicable:

```typescript
// Upload evidence for a specific hearing
await uploadEvidence({
  caseId: "case-123",
  hearingId: "hearing-456",  // Links to specific hearing
  file: file,
  description: "Hearing minutes for mention on 20 Nov 2024",
});
```

## Access Control

### Document Permissions

| Permission | Description | Actions |
|------------|-------------|---------|
| `evidence:create` | Upload documents | Create new documents |
| `evidence:read` | View documents | View, download, preview |
| `evidence:delete` | Delete documents | Remove documents |

### Permission Checks

```typescript
// Check if user can upload documents
const canUpload = await hasPermission(
  userId,
  organisationId,
  'evidence:create',
  isSuperAdmin
);

// Check if user can view documents
const canView = await hasPermission(
  userId,
  organisationId,
  'evidence:read',
  isSuperAdmin
);

// Check if user can delete documents
const canDelete = await hasPermission(
  userId,
  organisationId,
  'evidence:delete',
  isSuperAdmin
);
```

## Document Lifecycle

### Workflow

```
UPLOAD
  ↓
┌──────────────────┐
│ File Validation  │
│ - Size check     │
│ - Type check     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Save to Storage  │
│ - Generate name  │
│ - Store on disk  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Create Record    │
│ - DB entry       │
│ - Link to case   │
└────────┬─────────┘
         ↓
    AVAILABLE
    (View, Download)
         ↓
┌──────────────────┐
│ Delete (optional)│
│ - Remove file    │
│ - Delete record  │
└──────────────────┘
```

## Storage Management

### File Storage Location

```bash
/public
  └── /uploads
        └── /evidence
              ├── 1731427200000_police_report.pdf
              ├── 1731427300000_witness_statement.pdf
              └── 1731427400000_cctv_footage.mp4
```

### Cleanup Considerations

**Orphaned Files:**
- Files on disk without database records
- Database records without files

**Storage Limits:**
- Monitor disk space usage
- Implement file retention policies
- Archive old cases

```typescript
// Check for orphaned files (admin task)
async function findOrphanedFiles() {
  // Get all files from disk
  const filesOnDisk = await readdir(UPLOAD_DIR);
  
  // Get all file paths from database
  const dbFiles = await db.select({ filePath: evidence.filePath }).from(evidence);
  const dbFilenames = dbFiles.map(f => basename(f.filePath));
  
  // Find files on disk not in database
  const orphaned = filesOnDisk.filter(f => !dbFilenames.includes(f));
  
  return orphaned;
}
```

## Best Practices

### DO

✅ Use descriptive filenames
✅ Add detailed descriptions
✅ Link documents to hearings when relevant
✅ Organize by document type
✅ Check file sizes before upload
✅ Use appropriate file formats
✅ Maintain consistent naming conventions

### DON'T

❌ Don't upload without descriptions
❌ Don't use generic filenames
❌ Don't exceed file size limits
❌ Don't upload unsupported file types
❌ Don't delete documents without confirmation
❌ Don't share documents outside the system
❌ Don't upload sensitive data without encryption

## Related Documentation

- [Evidence Management](22-evidence-management.md)
- [Case Management](07-case-management.md)
- [Search Functionality](24-search-functionality.md)
- [Access Control](04-auth-and-security.md)
- [Database Schema](03-database-schema.md#evidence)
