# Search Functionality

## Overview

The Search system provides comprehensive search capabilities across cases, hearings, and evidence/documents. Users can perform global searches or filtered searches within specific categories.

## Purpose

- **Global Search** - Search across all entities in one query
- **Case Search** - Find cases by title, number, type, or status
- **Hearing Search** - Locate hearings by location or case
- **Document Search** - Find evidence and documents by filename or description
- **Real-time Results** - Fast, responsive search interface
- **Organisation Scoped** - Results limited to user's organisation

## Search Architecture

### Search Entities

```
Global Search
    ├── Cases
    │     └── Searchable: title, caseNumber, type, status
    ├── Hearings
    │     └── Searchable: location, associated case title
    └── Evidence/Documents
          └── Searchable: fileName, description
```

### Search Flow

```
User Input
    ↓
Validate Query (min 2 chars)
    ↓
┌─────────────────────┐
│ Execute Searches    │
│ - Cases (async)     │
│ - Hearings (async)  │
│ - Evidence (async)  │
└──────────┬──────────┘
           ↓
Filter by Organisation
    ↓
Return Results (max 10 per type)
    ↓
Display to User
```

## Global Search

### Search Action

**Server Action:**

```typescript
'use server';

import { db } from '@/lib/drizzle/connection';
import { cases, hearings, evidence } from '@/lib/drizzle/schema/db-schema';
import { sql, eq } from 'drizzle-orm';

export interface SearchResults {
  cases: Array<{
    id: string;
    title: string;
    caseNumber: string;
    type: string;
    status: string;
    createdAt: Date;
  }>;
  hearings: Array<{
    id: string;
    caseId: string;
    caseTitle: string;
    scheduledDate: Date;
    scheduledTime: string;
    location: string | null;
  }>;
  evidence: Array<{
    id: string;
    caseId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }>;
}

export async function globalSearch(
  query: string
): Promise<ActionResult<SearchResults>> {
  // 1. Validate query
  if (!query || query.trim().length < 2) {
    return {
      success: true,
      data: { cases: [], hearings: [], evidence: [] },
    };
  }

  // 2. Authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 3. Tenant context
  const context = await getUserTenantContext(session.user.id);
  if (!context?.organisationId) {
    return { success: false, error: 'No organisation context' };
  }

  // 4. Prepare search pattern
  const searchPattern = `%${query.toLowerCase()}%`;
  const isSuperAdmin = context.organisationId === '*';

  // 5. Search cases
  const casesResults = await db
    .select({
      id: cases.id,
      title: cases.title,
      caseNumber: cases.caseNumber,
      type: cases.type,
      status: cases.status,
      createdAt: cases.createdAt,
    })
    .from(cases)
    .where(
      isSuperAdmin
        ? sql`(
            LOWER(${cases.title}) LIKE ${searchPattern} OR
            LOWER(${cases.caseNumber}) LIKE ${searchPattern} OR
            LOWER(${cases.type}) LIKE ${searchPattern} OR
            LOWER(${cases.status}) LIKE ${searchPattern}
          )`
        : sql`${cases.organisationId} = ${context.organisationId} AND (
            LOWER(${cases.title}) LIKE ${searchPattern} OR
            LOWER(${cases.caseNumber}) LIKE ${searchPattern} OR
            LOWER(${cases.type}) LIKE ${searchPattern} OR
            LOWER(${cases.status}) LIKE ${searchPattern}
          )`
    )
    .limit(10);

  // 6. Search hearings
  const hearingsResults = await db
    .select({
      id: hearings.id,
      caseId: hearings.caseId,
      caseTitle: cases.title,
      scheduledDate: hearings.scheduledDate,
      scheduledTime: hearings.scheduledTime,
      location: hearings.location,
    })
    .from(hearings)
    .innerJoin(cases, eq(hearings.caseId, cases.id))
    .where(
      isSuperAdmin
        ? sql`(
            LOWER(${hearings.location}) LIKE ${searchPattern} OR
            LOWER(${cases.title}) LIKE ${searchPattern}
          )`
        : sql`${hearings.organisationId} = ${context.organisationId} AND (
            LOWER(${hearings.location}) LIKE ${searchPattern} OR
            LOWER(${cases.title}) LIKE ${searchPattern}
          )`
    )
    .limit(10);

  // 7. Search evidence
  const evidenceResults = await db
    .select({
      id: evidence.id,
      caseId: evidence.caseId,
      fileName: evidence.fileName,
      fileType: evidence.fileType,
      fileSize: evidence.fileSize,
      createdAt: evidence.createdAt,
    })
    .from(evidence)
    .where(
      isSuperAdmin
        ? sql`(
            LOWER(${evidence.fileName}) LIKE ${searchPattern} OR
            LOWER(${evidence.description}) LIKE ${searchPattern}
          )`
        : sql`${evidence.organisationId} = ${context.organisationId} AND (
            LOWER(${evidence.fileName}) LIKE ${searchPattern} OR
            LOWER(${evidence.description}) LIKE ${searchPattern}
          )`
    )
    .limit(10);

  // 8. Return results
  return {
    success: true,
    data: {
      cases: casesResults,
      hearings: hearingsResults,
      evidence: evidenceResults,
    },
  };
}
```

### Search Interface

**Page:** `/dashboard/search`

```tsx
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { globalSearch } from './actions';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce search to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.trim().length < 2) {
        setResults(null);
        return;
      }

      setLoading(true);
      const result = await globalSearch(debouncedQuery);
      
      if (result.success) {
        setResults(result.data);
      }
      
      setLoading(false);
    }

    performSearch();
  }, [debouncedQuery]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search cases, hearings, or documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Searching...
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <SearchResults results={results} query={query} />
      )}

      {/* No Results */}
      {query.trim().length >= 2 && results && !loading && (
        !results.cases.length && 
        !results.hearings.length && 
        !results.evidence.length
      ) && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results found for "{query}"</p>
          <p className="text-sm mt-2">Try different keywords or check spelling</p>
        </div>
      )}
    </div>
  );
}
```

### Search Results Display

```tsx
function SearchResults({ 
  results, 
  query 
}: { 
  results: SearchResults;
  query: string;
}) {
  const totalResults = 
    results.cases.length + 
    results.hearings.length + 
    results.evidence.length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Found {totalResults} results for "{query}"
        </p>
      </div>

      {/* Cases */}
      {results.cases.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cases ({results.cases.length})
          </h3>
          <div className="space-y-2">
            {results.cases.map((caseItem) => (
              <CaseSearchResult key={caseItem.id} case={caseItem} />
            ))}
          </div>
        </div>
      )}

      {/* Hearings */}
      {results.hearings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Hearings ({results.hearings.length})
          </h3>
          <div className="space-y-2">
            {results.hearings.map((hearing) => (
              <HearingSearchResult key={hearing.id} hearing={hearing} />
            ))}
          </div>
        </div>
      )}

      {/* Evidence/Documents */}
      {results.evidence.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Documents ({results.evidence.length})
          </h3>
          <div className="space-y-2">
            {results.evidence.map((doc) => (
              <EvidenceSearchResult key={doc.id} evidence={doc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Result Card Components

```tsx
function CaseSearchResult({ case: caseItem }: { case: SearchResults['cases'][0] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Link href={`/dashboard/cases/${caseItem.id}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium hover:underline">
                {caseItem.caseNumber}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {caseItem.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{caseItem.type}</Badge>
                <Badge variant={
                  caseItem.status === 'open' ? 'default' :
                  caseItem.status === 'closed' ? 'secondary' :
                  'outline'
                }>
                  {caseItem.status}
                </Badge>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

function HearingSearchResult({ hearing }: { hearing: SearchResults['hearings'][0] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Link href={`/dashboard/hearings/${hearing.id}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium hover:underline">
                {format(new Date(hearing.scheduledDate), 'MMMM d, yyyy')} at{' '}
                {hearing.scheduledTime}
              </p>
              <p className="text-sm text-muted-foreground">
                Case: {hearing.caseTitle}
              </p>
              {hearing.location && (
                <p className="text-sm text-muted-foreground">
                  Location: {hearing.location}
                </p>
              )}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

function EvidenceSearchResult({ evidence }: { evidence: SearchResults['evidence'][0] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Link href={`/dashboard/evidence/${evidence.id}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium hover:underline truncate">
                  {evidence.fileName}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(evidence.fileSize)}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(evidence.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
```

## Advanced Search

### Case Advanced Search

```tsx
'use client';

export function CaseAdvancedSearch() {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    courtLevel: '',
    dateFrom: '',
    dateTo: '',
  });

  async function handleSearch() {
    const result = await searchCases(filters);
    // Handle results...
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <FormField
        label="Case Type"
        name="type"
        type="select"
        options={[
          { value: '', label: 'All Types' },
          { value: 'criminal', label: 'Criminal' },
          { value: 'civil', label: 'Civil' },
          { value: 'appeal', label: 'Appeal' },
        ]}
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        options={[
          { value: '', label: 'All Status' },
          { value: 'open', label: 'Open' },
          { value: 'active', label: 'Active' },
          { value: 'closed', label: 'Closed' },
        ]}
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      />

      <FormField
        label="Court Level"
        name="courtLevel"
        type="select"
        options={[
          { value: '', label: 'All Courts' },
          { value: 'high_court', label: 'High Court' },
          { value: 'magistrates', label: 'Magistrates Court' },
          { value: 'court_of_appeal', label: 'Court of Appeal' },
        ]}
        value={filters.courtLevel}
        onChange={(e) => setFilters({ ...filters, courtLevel: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Filed From"
          name="dateFrom"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
        />

        <FormField
          label="Filed To"
          name="dateTo"
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
        />
      </div>

      <Button type="submit">Search Cases</Button>
    </form>
  );
}
```

## Search Optimization

### Debouncing

Reduce API calls with debounced search:

```typescript
// Custom hook for debouncing
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search component
const debouncedQuery = useDebounce(query, 300); // 300ms delay
```

### Database Indexing

Ensure proper indexes for search performance:

```sql
-- Case search indexes
CREATE INDEX case_title_idx ON cases(LOWER(title));
CREATE INDEX case_number_idx ON cases(LOWER(case_number));

-- Hearing search indexes
CREATE INDEX hearing_location_idx ON hearings(LOWER(location));

-- Evidence search indexes
CREATE INDEX evidence_filename_idx ON evidence(LOWER(file_name));
CREATE INDEX evidence_description_idx ON evidence(LOWER(description));
```

### Result Limits

Limit results to prevent performance issues:

```typescript
// Limit to 10 results per category
.limit(10)

// Total max results across all categories: 30
```

## Search Features

### Highlight Matching Text

```tsx
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
```

### Recent Searches

Store and display recent searches:

```typescript
'use client';

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setSearches(JSON.parse(stored));
    }
  }, []);

  function addSearch(query: string) {
    const updated = [query, ...searches.filter(s => s !== query)].slice(0, 5);
    setSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }

  return { searches, addSearch };
}
```

### Search Suggestions

Provide search suggestions based on common queries:

```tsx
const SEARCH_SUGGESTIONS = [
  'HAC 179/2024',
  'trial hearings',
  'police reports',
  'witness statements',
  'open cases',
  'court room 1',
];

function SearchSuggestions({ onSelect }: { onSelect: (query: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

### DO

✅ Use debouncing to reduce API calls
✅ Show loading states during search
✅ Provide clear "no results" messages
✅ Highlight matching text in results
✅ Limit result counts for performance
✅ Add relevant metadata to results
✅ Make results clickable
✅ Support keyboard navigation

### DON'T

❌ Don't search on every keystroke
❌ Don't return unlimited results
❌ Don't expose sensitive data in previews
❌ Don't search without minimum character count
❌ Don't forget to handle errors
❌ Don't show stale results
❌ Don't ignore search performance

## Related Documentation

- [Case Management](07-case-management.md)
- [Hearing Management](19-hearing-management.md)
- [Evidence Management](22-evidence-management.md)
- [Document Management](23-document-management.md)
- [Database Schema](03-database-schema.md)
