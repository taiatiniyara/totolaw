# Managed Lists System

## Overview

The Managed Lists system provides a flexible, database-driven way to manage dropdown options and categorized lists throughout the TotoLaw platform. Instead of hardcoding values like court levels, case statuses, offense types, and action types directly in the code, these are stored in the `managed_lists` table and can be customized per organization.

## Benefits

- **Flexibility**: Organizations can customize list items to match their specific needs
- **Maintainability**: No code changes required to add/modify list items
- **Consistency**: Central source of truth for all list items across the application
- **Localization**: Support for different languages and regional variations
- **Audit Trail**: Track when lists are created and modified

## Database Schema

### `managed_lists` Table

```typescript
{
  id: string;                    // Primary key
  organisationId: string | null; // NULL for system defaults
  category: string;              // List category (e.g., 'court_levels')
  name: string;                  // Display name
  description: string | null;    // Optional description
  items: ManagedListItem[];      // JSON array of list items
  isSystem: boolean;             // System lists can't be deleted
  createdBy: string | null;      // User who created the list
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

### `ManagedListItem` Structure

```typescript
interface ManagedListItem {
  id: string;           // Unique identifier within the list
  value: string;        // Code used in the system (e.g., "high_court")
  label: string;        // Display name (e.g., "High Court")
  description?: string; // Optional description
  sortOrder?: number;   // Display order
  isActive?: boolean;   // Whether item is active
}
```

## Available List Categories

### 1. Court Levels (`court_levels`)
Court hierarchy levels in the system.

**Default Items:**
- `high_court` - High Court
- `magistrates` - Magistrates Court
- `court_of_appeal` - Court of Appeal
- `tribunal` - Tribunal

### 2. Case Types (`case_types`)
Types/divisions of cases.

**Default Items:**
- `criminal` - Criminal
- `civil` - Civil
- `family` - Family
- `appeal` - Appeal
- `agricultural` - Agricultural
- `small_claims` - Small Claims

### 3. Case Statuses (`case_statuses`)
Status options for cases.

**Default Items:**
- `PENDING` - Pending
- `ACTIVE` - Active
- `IN_PROGRESS` - In Progress
- `CLOSED` - Closed
- `ARCHIVED` - Archived
- `APPEALED` - Appealed
- `DISMISSED` - Dismissed

### 4. Hearing Action Types (`action_types`)
Types of hearing actions based on Fiji court procedures.

**Default Items:**
- `MENTION` - Mention
- `HEARING` - Hearing
- `TRIAL` - Trial
- `CONTINUATION_OF_TRIAL` - Continuation of Trial
- `VOIR_DIRE_HEARING` - Voir Dire Hearing
- `PRE_TRIAL_CONFERENCE` - Pre-Trial Conference
- `RULING` - Ruling
- `FIRST_CALL` - First Call
- `BAIL_HEARING` - Bail Hearing
- `SENTENCING` - Sentencing
- `CASE_CONFERENCE` - Case Conference
- `OTHER` - Other

### 5. Offense Types (`offense_types`)
Common criminal offenses.

**Default Items:**
- Theft contrary to section 291 of the Crimes Act
- Assault Causing Actual Bodily Harm
- Aggravated Robbery
- Rape contrary to section 207 of the Crimes Act
- Murder contrary to section 237 of the Crimes Act
- Dangerous Driving Occasioning Death
- Possession of Illicit Drugs
- Breach of Trust
- Obtaining Financial Advantage by Deception
- Burglary

### 6. Bail Decisions (`bail_decisions`)
Bail decision options.

**Default Items:**
- `not_decided` - Not yet decided
- `granted` - Granted
- `denied` - Denied
- `continued` - Continued

### 7. Sentence Types (`sentence_types`)
Types of sentences that can be imposed.

**Default Items:**
- `imprisonment` - Imprisonment
- `fine` - Fine
- `community_service` - Community Service
- `suspended_sentence` - Suspended Sentence
- `probation` - Probation
- `life_imprisonment` - Life Imprisonment

### 8. Appeal Types (`appeal_types`)
Types of appeals.

**Default Items:**
- `criminal_appeal` - Criminal Appeal
- `civil_appeal` - Civil Appeal
- `bail_application` - Bail Application
- `leave_to_appeal` - Leave to Appeal

## Usage

### Fetching List Items in Server Components

```tsx
import { getManagedListOptions } from "@/app/dashboard/settings/managed-lists/actions";

export default async function MyPage() {
  const result = await getManagedListOptions("court_levels");
  const courtLevels = result.data || [];

  return (
    <select>
      {courtLevels.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Fetching List Items in Client Components

```tsx
"use client";

import { useEffect, useState } from "react";
import { getManagedListOptions } from "@/app/dashboard/settings/managed-lists/actions";

export function MyClientComponent() {
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    async function loadStatuses() {
      const result = await getManagedListOptions("case_statuses");
      if (result.success && result.data) {
        setStatuses(result.data);
      }
    }
    loadStatuses();
  }, []);

  return (
    <select>
      {statuses.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Using the Service Directly

```typescript
import { getListItems, listItemsToOptions } from "@/lib/services/managed-lists-service";

// Get active items
const items = await getListItems("case_statuses", organisationId);

// Convert to select options
const options = listItemsToOptions(items);
```

## Setup and Initialization

### 1. Run the Migration

```bash
# Apply the database migration
npm run db:push
# or
npx drizzle-kit push:pg
```

### 2. Seed Default Lists

```bash
# Run the seed script
npm run seed:managed-lists

# Or manually with environment variables:
source .env.local && npx tsx scripts/seed-managed-lists.ts
```

This will create system-level default lists that all organizations can use.

## Organization-Specific Lists

Organizations can create their own customized versions of lists:

```typescript
import { updateListItems } from "@/lib/services/managed-lists-service";

const customItems: ManagedListItem[] = [
  {
    id: "custom_1",
    value: "special_status",
    label: "Special Status",
    description: "Custom status for our org",
    sortOrder: 1,
    isActive: true
  }
];

await updateListItems(
  "case_statuses",
  customItems,
  organisationId,
  userId
);
```

When fetching list items, the system will automatically:
1. First check for organization-specific lists
2. Fall back to system default lists if none exist

## Admin UI (Future Enhancement)

A future enhancement will include an admin UI where users with appropriate permissions can:

- View all managed lists
- Add/edit/deactivate list items
- Reorder items
- Copy system lists to customize for their organization
- Export/import list configurations

## Migration from Hardcoded Lists

To migrate existing hardcoded dropdown values:

1. **Identify hardcoded arrays** in your components
2. **Replace with managed list calls**:

```typescript
// Before
const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
];

// After
const result = await getManagedListOptions("case_statuses");
const statusOptions = result.data || [];
```

3. **Update form components** to use the fetched data
4. **Test thoroughly** to ensure all dropdowns work correctly

## Best Practices

1. **Always check for success**: Handle the case where list fetching fails
2. **Provide fallbacks**: Have sensible defaults if lists are empty
3. **Cache appropriately**: Lists don't change often, consider caching
4. **Use consistent categories**: Don't create duplicate categories
5. **Maintain sort order**: Use `sortOrder` to control display order
6. **Document custom lists**: If adding new categories, document them

## API Reference

### Server Actions

#### `getManagedListOptions(category: ListCategory)`
Fetch active list items for dropdown/select components.

**Returns:** `{ success: boolean; data?: Option[]; error?: string }`

#### `getAllManagedListItems(category: ListCategory)`
Fetch all list items including inactive (admin use).

**Returns:** `{ success: boolean; data?: ManagedListItem[]; error?: string }`

#### `updateManagedList(category: ListCategory, items: ManagedListItem[])`
Update list items (requires admin permissions).

**Returns:** `{ success: boolean; error?: string }`

#### `addManagedListItem(category: ListCategory, item: Omit<ManagedListItem, "id">)`
Add a new item to a list (requires admin permissions).

**Returns:** `{ success: boolean; error?: string }`

### Service Functions

#### `getListItems(category: ListCategory, organisationId?: string)`
Get active list items with organization fallback logic.

#### `getAllListItems(category: ListCategory, organisationId?: string)`
Get all list items including inactive.

#### `updateListItems(category, items, organisationId?, userId?)`
Update or create a managed list.

#### `addListItem(category, item, organisationId?, userId?)`
Add a single item to a list.

#### `listItemsToOptions(items: ManagedListItem[])`
Convert list items to select option format.

## Troubleshooting

### Lists Not Appearing
- Verify the migration has been applied
- Run the seed script to create system defaults
- Check database for `managed_lists` table

### Organization-Specific Lists Not Working
- Ensure `organisationId` is correctly passed
- Verify user session contains organisation ID
- Check that custom lists are properly created

### Performance Issues
- Consider caching frequently accessed lists
- Use server components when possible
- Implement pagination for very large lists

## Future Enhancements

- [ ] Admin UI for managing lists
- [ ] Import/export functionality
- [ ] Multi-language support
- [ ] List versioning and history
- [ ] Bulk operations
- [ ] List templates
- [ ] Validation rules per list item
