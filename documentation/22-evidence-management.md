# Evidence Management

## Overview

The Evidence Management system handles the secure upload, storage, and tracking of evidence files for court cases. Evidence can be linked to cases and specific hearings with comprehensive metadata and access controls.

## Purpose

- **File Upload** - Upload evidence files with validation
- **Secure Storage** - Store files securely on the server
- **Case Linking** - Associate evidence with cases and hearings
- **Metadata Tracking** - Track file details, descriptions, and submitters
- **Access Control** - Permission-based access to evidence
- **File Management** - View, download, and delete evidence
- **Audit Trail** - Track who submitted evidence and when

## Database Schema

### Table: `evidence`

```sql
CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES cases(id),
  hearing_id TEXT REFERENCES hearings(id),
  
  -- File Information
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  
  -- Audit
  submitted_by TEXT REFERENCES user(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX evidence_org_idx ON evidence(organisation_id);
CREATE INDEX evidence_case_idx ON evidence(case_id);
CREATE INDEX evidence_hearing_idx ON evidence(hearing_id);
CREATE INDEX evidence_submitted_by_idx ON evidence(submitted_by);
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Unique identifier |
| `organisation_id` | TEXT | Court organisation |
| `case_id` | TEXT | Associated case (required) |
| `hearing_id` | TEXT | Optional specific hearing |
| `file_name` | TEXT | Original filename |
| `file_size` | INTEGER | File size in bytes |
| `file_type` | VARCHAR(100) | MIME type |
| `file_path` | TEXT | Server storage path |
| `description` | TEXT | Optional description |
| `submitted_by` | TEXT | User who uploaded evidence |
| `created_at` | TIMESTAMP | Upload timestamp |

## File Storage

### Storage Configuration

**Location:** Files stored in `/public/uploads/evidence/`

**Naming Convention:** `{timestamp}_{sanitized_filename}`

Example: `1731427200000_witness_statement.pdf`

### Allowed File Types

```typescript
const ALLOWED_FILE_TYPES = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  
  // Audio/Video
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
];
```

### File Size Limit

Maximum file size: **50MB**

```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
```

## Uploading Evidence

### Upload Evidence Action

**Server Action:**

```typescript
'use server';

import { db } from '@/lib/drizzle/connection';
import { evidence, cases } from '@/lib/drizzle/schema/db-schema';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'evidence');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function uploadEvidence(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // 1. Authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { success: false, error: 'No organisation context' };
  }

  // 3. Permission check
  const canCreate = await hasPermission(
    session.user.id,
    context.organisationId,
    'evidence:create',
    context.isSuperAdmin
  );

  if (!canCreate) {
    return { success: false, error: 'Permission denied' };
  }

  // 4. Extract form data
  const caseId = formData.get('caseId') as string;
  const hearingId = (formData.get('hearingId') as string) || null;
  const description = formData.get('description') as string;
  const file = formData.get('file') as File;

  if (!caseId || !file) {
    return { success: false, error: 'Case ID and file are required' };
  }

  // 5. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // 6. Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { success: false, error: 'File type not allowed' };
  }

  // 7. Verify case exists
  const [caseRecord] = await db
    .select()
    .from(cases)
    .where(
      withOrgFilter(context.organisationId, cases, [eq(cases.id, caseId)])
    )
    .limit(1);

  if (!caseRecord) {
    return { success: false, error: 'Case not found' };
  }

  // 8. Create upload directory if needed
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // 9. Generate unique filename
  const timestamp = Date.now();
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}_${sanitizedFilename}`;
  const filePath = join(UPLOAD_DIR, filename);
  const publicPath = `/uploads/evidence/${filename}`;

  // 10. Save file to disk
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // 11. Create evidence record
  const evidenceId = crypto.randomUUID();

  await db.insert(evidence).values({
    id: evidenceId,
    organisationId: context.organisationId,
    caseId,
    hearingId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    filePath: publicPath,
    description,
    submittedBy: session.user.id,
    createdAt: new Date(),
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  revalidatePath('/dashboard/evidence');

  return { success: true, data: { id: evidenceId } };
}
```

### Upload Evidence Form

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { uploadEvidence } from './actions';

export function UploadEvidenceForm({ 
  caseId, 
  hearingId 
}: { 
  caseId: string;
  hearingId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    if (hearingId) {
      formData.set('hearingId', hearingId);
    }

    const result = await uploadEvidence(formData);

    if (result.success) {
      router.push(`/dashboard/cases/${caseId}`);
    } else {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="caseId" value={caseId} />

      <div>
        <label className="text-sm font-medium">File</label>
        <input
          type="file"
          name="file"
          required
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90"
        />
        
        {selectedFile && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p>File: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {selectedFile.type}</p>
          </div>
        )}
        
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum file size: 50MB. Allowed types: PDF, Word, Excel, Images, Audio, Video
        </p>
      </div>

      <FormField
        label="Description"
        name="description"
        type="textarea"
        placeholder="Describe this piece of evidence..."
        rows={4}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !selectedFile}>
          {loading ? 'Uploading...' : 'Upload Evidence'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

## Retrieving Evidence

### Get Evidence for Case

```typescript
'use server';

export async function getEvidenceForCase(
  caseId: string
): Promise<ActionResult<Evidence[]>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canRead = await hasPermission(
    session.user.id,
    context.organisationId,
    'evidence:read',
    context.isSuperAdmin
  );

  if (!canRead) {
    return { success: false, error: 'Permission denied' };
  }

  // Get evidence
  const results = await db
    .select()
    .from(evidence)
    .where(
      withOrgFilter(context.organisationId, evidence, [
        eq(evidence.caseId, caseId),
      ])
    )
    .orderBy(desc(evidence.createdAt));

  return { success: true, data: results };
}
```

### Get Evidence by ID

```typescript
'use server';

export async function getEvidenceById(
  evidenceId: string
): Promise<ActionResult<Evidence>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canRead = await hasPermission(
    session.user.id,
    context.organisationId,
    'evidence:read',
    context.isSuperAdmin
  );

  if (!canRead) {
    return { success: false, error: 'Permission denied' };
  }

  // Get evidence
  const [result] = await db
    .select()
    .from(evidence)
    .where(
      withOrgFilter(context.organisationId, evidence, [
        eq(evidence.id, evidenceId),
      ])
    )
    .limit(1);

  if (!result) {
    return { success: false, error: 'Evidence not found' };
  }

  return { success: true, data: result };
}
```

### Get All Evidence

```typescript
'use server';

export async function getAllEvidence(options?: {
  limit?: number;
}): Promise<ActionResult<Array<Evidence & { caseTitle: string }>>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canRead = await hasPermission(
    session.user.id,
    context.organisationId,
    'evidence:read',
    context.isSuperAdmin
  );

  if (!canRead) {
    return { success: false, error: 'Permission denied' };
  }

  // Get evidence with case titles
  const results = await db
    .select({
      id: evidence.id,
      organisationId: evidence.organisationId,
      caseId: evidence.caseId,
      hearingId: evidence.hearingId,
      fileName: evidence.fileName,
      fileSize: evidence.fileSize,
      fileType: evidence.fileType,
      filePath: evidence.filePath,
      description: evidence.description,
      submittedBy: evidence.submittedBy,
      createdAt: evidence.createdAt,
      caseTitle: cases.title,
    })
    .from(evidence)
    .innerJoin(cases, eq(evidence.caseId, cases.id))
    .where(withOrgFilter(context.organisationId, evidence))
    .orderBy(desc(evidence.createdAt))
    .limit(options?.limit || 100);

  return { success: true, data: results };
}
```

## Displaying Evidence

### Evidence List Component

```tsx
import { formatDistanceToNow } from 'date-fns';
import { FileIcon, DownloadIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EvidenceList({ 
  evidence, 
  canDelete 
}: { 
  evidence: Evidence[];
  canDelete: boolean;
}) {
  if (evidence.length === 0) {
    return (
      <EmptyState
        title="No evidence uploaded"
        description="Upload evidence files for this case."
        action={{
          label: 'Upload Evidence',
          href: './evidence/upload',
        }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item) => (
        <EvidenceCard 
          key={item.id} 
          evidence={item} 
          canDelete={canDelete} 
        />
      ))}
    </div>
  );
}

function EvidenceCard({ 
  evidence, 
  canDelete 
}: { 
  evidence: Evidence;
  canDelete: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{evidence.fileName}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatFileSize(evidence.fileSize)}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(evidence.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {evidence.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {evidence.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <a href={evidence.filePath} download>
              <DownloadIcon className="h-4 w-4" />
            </a>
          </Button>

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(evidence.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
```

### Evidence Detail Page

```tsx
export default async function EvidenceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getEvidenceById(params.id);

  if (!result.success) {
    return <ErrorPage error={result.error} />;
  }

  const evidence = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{evidence.fileName}</h1>
          <p className="text-muted-foreground">
            Uploaded {formatDistanceToNow(new Date(evidence.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <a href={evidence.filePath} download>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(evidence.id)}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>File Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="font-medium">{evidence.fileName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="font-medium">{formatFileSize(evidence.fileSize)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">File Type</p>
              <p className="font-medium">{evidence.fileType}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Uploaded</p>
              <p className="font-medium">
                {format(new Date(evidence.createdAt), 'PPpp')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Case</p>
              <Link href={`/dashboard/cases/${evidence.caseId}`}>
                <p className="font-medium hover:underline">
                  View Case
                </p>
              </Link>
            </div>

            {evidence.hearingId && (
              <div>
                <p className="text-sm text-muted-foreground">Hearing</p>
                <Link href={`/dashboard/hearings/${evidence.hearingId}`}>
                  <p className="font-medium hover:underline">
                    View Hearing
                  </p>
                </Link>
              </div>
            )}

            {evidence.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm whitespace-pre-wrap">
                  {evidence.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* File Preview (if supported) */}
      {isPreviewSupported(evidence.fileType) && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <FilePreview evidence={evidence} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Deleting Evidence

### Delete Evidence Action

```typescript
'use server';

import { unlink } from 'fs/promises';
import { join } from 'path';

export async function deleteEvidence(
  evidenceId: string
): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const context = await getUserTenantContext(session.user.id);

  // Check permission
  const canDelete = await hasPermission(
    session.user.id,
    context.organisationId,
    'evidence:delete',
    context.isSuperAdmin
  );

  if (!canDelete) {
    return { success: false, error: 'Permission denied' };
  }

  // Get evidence to verify access and get file path
  const [evidenceRecord] = await db
    .select()
    .from(evidence)
    .where(
      withOrgFilter(context.organisationId, evidence, [
        eq(evidence.id, evidenceId),
      ])
    )
    .limit(1);

  if (!evidenceRecord) {
    return { success: false, error: 'Evidence not found' };
  }

  // Delete file from disk
  const fullPath = join(process.cwd(), 'public', evidenceRecord.filePath);
  try {
    await unlink(fullPath);
  } catch (fileError) {
    console.error('Error deleting file:', fileError);
    // Continue with database deletion even if file deletion fails
  }

  // Delete evidence record
  await db.delete(evidence).where(eq(evidence.id, evidenceId));

  revalidatePath(`/dashboard/cases/${evidenceRecord.caseId}`);
  revalidatePath('/dashboard/evidence');

  return { success: true };
}
```

### Delete Confirmation Dialog

```tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { deleteEvidence } from './actions';

export function DeleteEvidenceDialog({ 
  evidenceId, 
  fileName 
}: { 
  evidenceId: string;
  fileName: string;
}) {
  async function handleDelete() {
    const result = await deleteEvidence(evidenceId);
    
    if (!result.success) {
      alert(result.error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{fileName}"? This action cannot be undone.
            The file will be permanently removed from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## File Preview

### Preview Component

```tsx
'use client';

export function FilePreview({ evidence }: { evidence: Evidence }) {
  const fileType = evidence.fileType;

  // PDF Preview
  if (fileType === 'application/pdf') {
    return (
      <iframe
        src={evidence.filePath}
        className="w-full h-[600px] border rounded-md"
        title={evidence.fileName}
      />
    );
  }

  // Image Preview
  if (fileType.startsWith('image/')) {
    return (
      <img
        src={evidence.filePath}
        alt={evidence.fileName}
        className="max-w-full h-auto rounded-md"
      />
    );
  }

  // Audio Preview
  if (fileType.startsWith('audio/')) {
    return (
      <audio controls className="w-full">
        <source src={evidence.filePath} type={fileType} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  // Video Preview
  if (fileType.startsWith('video/')) {
    return (
      <video controls className="w-full rounded-md">
        <source src={evidence.filePath} type={fileType} />
        Your browser does not support the video element.
      </video>
    );
  }

  // No preview available
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>Preview not available for this file type.</p>
      <Button asChild className="mt-4">
        <a href={evidence.filePath} download>
          Download to view
        </a>
      </Button>
    </div>
  );
}

function isPreviewSupported(fileType: string): boolean {
  return (
    fileType === 'application/pdf' ||
    fileType.startsWith('image/') ||
    fileType.startsWith('audio/') ||
    fileType.startsWith('video/')
  );
}
```

## Access Control

### Permission-Based Access

Evidence access is controlled by permissions:

| Permission | Description | Who Has It |
|------------|-------------|------------|
| `evidence:create` | Upload evidence | Clerks, Judges, Magistrates |
| `evidence:read` | View and download evidence | All court staff |
| `evidence:delete` | Delete evidence | Judges, System Admins |

### Permission Check Example

```typescript
// Check if user can upload evidence
const canUpload = await hasPermission(
  userId,
  organisationId,
  'evidence:create',
  isSuperAdmin
);

// Check if user can delete evidence
const canDelete = await hasPermission(
  userId,
  organisationId,
  'evidence:delete',
  isSuperAdmin
);
```

## Best Practices

### DO

✅ Validate file types before upload
✅ Check file size limits
✅ Use descriptive filenames
✅ Add detailed descriptions
✅ Link evidence to specific hearings when applicable
✅ Verify case access before upload
✅ Use secure file storage
✅ Sanitize filenames

### DON'T

❌ Don't upload files without validation
❌ Don't store sensitive data without encryption
❌ Don't allow unlimited file sizes
❌ Don't skip permission checks
❌ Don't delete files without confirmation
❌ Don't expose direct file paths to users
❌ Don't allow dangerous file types

## Security Considerations

### File Upload Security

1. **Validation** - Validate file type and size
2. **Sanitization** - Sanitize filenames to prevent path traversal
3. **Storage** - Store files outside web root when possible
4. **Access Control** - Check permissions before serving files
5. **Scanning** - Consider virus scanning for uploads
6. **Rate Limiting** - Limit upload frequency per user

### File Storage Security

```typescript
// Generate secure filename
const timestamp = Date.now();
const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
const filename = `${timestamp}_${sanitizedFilename}`;

// Store in secure directory
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'evidence');
```

## Related Documentation

- [Case Management](07-case-management.md)
- [Hearing Management](19-hearing-management.md)
- [Document Management](23-document-management.md)
- [Search Functionality](24-search-functionality.md)
- [Database Schema - Evidence](03-database-schema.md#evidence)
