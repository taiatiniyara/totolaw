# Calendar View Component

## Overview

The CalendarView component provides a monthly calendar interface for visualizing and managing court hearings. It displays all scheduled hearings in a traditional calendar grid format, making it easy to see hearing schedules at a glance.

## Purpose

- **Visual Scheduling** - See all hearings in monthly calendar format
- **Quick Navigation** - Jump between months and return to today
- **Hearing Details** - Click hearings to view full details
- **Capacity Planning** - Identify busy/free days at a glance
- **Statistics** - Track total, monthly, and upcoming hearings

## Component Location

**File:** `components/calendar-view.tsx`

**Usage:** `/dashboard/hearings/calendar`

## Features

### 1. Monthly Calendar Grid

Displays a standard calendar with:
- Days of the week (Sun-Sat)
- All days in the current month
- Proper padding for month start/end
- Responsive grid layout

### 2. Hearing Display

Each day shows:
- Up to 3 hearings (with case titles)
- Hearing location (if specified)
- Count badge for days with multiple hearings
- "+X more" indicator for days with >3 hearings

### 3. Visual Indicators

**Today:**
- Blue border (`border-primary`)
- Light blue background (`bg-primary/5`)
- Bold date number

**Past Days:**
- Muted background (`bg-muted/50`)
- Grayed out date numbers

**Future Days:**
- Normal background (`bg-background`)
- Standard styling

**Hearing Cards:**
- Blue tinted background (`bg-primary/10`)
- Hover effect (`hover:bg-primary/20`)
- Clickable link to hearing details

### 4. Navigation Controls

- **Previous Month** - ChevronLeft button
- **Next Month** - ChevronRight button
- **Today** - Jump to current date

### 5. Statistics Cards

Three summary cards showing:
1. **Total Hearings** - All hearings (all months)
2. **This Month** - Hearings in currently displayed month
3. **Upcoming** - Future hearings (from today onwards)

### 6. Legend

Color-coded legend explaining:
- Today's date styling
- Past days styling
- Future days styling

## Interface

### Props

```typescript
interface CalendarViewProps {
  hearings: Hearing[];
}

interface Hearing {
  id: string;              // Hearing UUID
  caseId: string;          // Associated case UUID
  caseTitle: string;       // Case title for display
  date: Date;             // Hearing date/time
  location: string | null; // Courtroom or location
}
```

### State

```typescript
const [currentDate, setCurrentDate] = useState<Date>(new Date());
```

Tracks the currently displayed month.

## Usage

### Basic Implementation

```tsx
import { CalendarView } from "@/components/calendar-view";

export default async function HearingsCalendarPage() {
  // Fetch hearings
  const result = await getHearings({ limit: 1000 });
  
  if (!result.success) {
    return <ErrorState error={result.error} />;
  }

  const hearings = result.data || [];

  return (
    <div className="p-6">
      <CalendarView hearings={hearings} />
    </div>
  );
}
```

### With Navigation Controls

```tsx
import { CalendarView } from "@/components/calendar-view";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus } from "lucide-react";
import Link from "next/link";

export default async function HearingsCalendarPage() {
  const result = await getHearings({ limit: 1000 });
  const hearings = result.data || [];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1>Hearings Calendar</h1>
            <p className="text-muted-foreground">
              View all scheduled hearings in calendar format
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/hearings">
              <List className="w-4 h-4 mr-2" />
              List View
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/hearings/new">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Hearing
            </Link>
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <CalendarView hearings={hearings} />
    </div>
  );
}
```

## Data Fetching

### Server-Side Fetching

```typescript
// app/dashboard/hearings/calendar/page.tsx

import { getHearings } from "../actions";
import { CalendarView } from "@/components/calendar-view";

export default async function HearingsCalendarPage() {
  // Fetch all hearings (or filter by date range)
  const result = await getHearings({ limit: 1000 });

  if (!result.success) {
    return <ErrorPage error={result.error} />;
  }

  const hearings = result.data || [];

  // Transform to CalendarView format
  const calendarHearings = hearings.map(hearing => ({
    id: hearing.id,
    caseId: hearing.caseId,
    caseTitle: hearing.case?.title || "Untitled Case",
    date: new Date(hearing.scheduledDate),
    location: hearing.location || hearing.courtRoom?.name || null,
  }));

  return <CalendarView hearings={calendarHearings} />;
}
```

### Optimized Date Range Fetching

For better performance with large datasets:

```typescript
export default async function HearingsCalendarPage({
  searchParams
}: {
  searchParams: { month?: string; year?: string }
}) {
  const currentDate = new Date();
  const month = searchParams.month 
    ? parseInt(searchParams.month) 
    : currentDate.getMonth();
  const year = searchParams.year 
    ? parseInt(searchParams.year) 
    : currentDate.getFullYear();

  // Calculate date range (e.g., ±3 months)
  const startDate = new Date(year, month - 3, 1);
  const endDate = new Date(year, month + 4, 0);

  // Fetch hearings in date range
  const result = await getHearings({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const hearings = result.data || [];

  return <CalendarView hearings={hearings} />;
}
```

## Internal Functions

### Date Calculations

```typescript
// Get first day of current month
const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);

// Get last day of current month
const lastDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
);

// Get starting day of week (0=Sunday, 6=Saturday)
const startingDayOfWeek = firstDayOfMonth.getDay();

// Calculate total days to display
const daysInMonth = lastDayOfMonth.getDate();
const totalDays = startingDayOfWeek + daysInMonth;
const weeksToShow = Math.ceil(totalDays / 7);
```

### Filtering Hearings by Date

```typescript
const getHearingsForDate = (date: Date) => {
  return hearings.filter((hearing) => {
    const hearingDate = new Date(hearing.date);
    return (
      hearingDate.getFullYear() === date.getFullYear() &&
      hearingDate.getMonth() === date.getMonth() &&
      hearingDate.getDate() === date.getDate()
    );
  });
};
```

### Date Comparison Utilities

```typescript
// Check if date is today
const isToday = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

// Check if date is in the past
const isPast = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};
```

### Navigation Functions

```typescript
// Go to previous month
const goToPreviousMonth = () => {
  setCurrentDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  );
};

// Go to next month
const goToNextMonth = () => {
  setCurrentDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  );
};

// Return to today's month
const goToToday = () => {
  setCurrentDate(new Date());
};
```

## Rendering Logic

### Calendar Grid Structure

```
┌──────────────────────────────────────────┐
│  Sun   Mon   Tue   Wed   Thu   Fri   Sat │  ← Day names header
├──────────────────────────────────────────┤
│ [Empty] [Empty] [1] [2] [3] [4] [5]      │  ← Week 1
├──────────────────────────────────────────┤
│ [6] [7] [8] [9] [10] [11] [12]           │  ← Week 2
├──────────────────────────────────────────┤
│ [13] [14] [15] [16] [17] [18] [19]       │  ← Week 3
├──────────────────────────────────────────┤
│ [20] [21] [22] [23] [24] [25] [26]       │  ← Week 4
├──────────────────────────────────────────┤
│ [27] [28] [29] [30] [31] [Empty] [Empty] │  ← Week 5
└──────────────────────────────────────────┘
```

### Day Cell Rendering

Each day cell contains:

```tsx
<div className="min-h-[120px] border p-2">
  {/* Header: Date number + Hearing count */}
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium">{dayNumber}</span>
    {dayHearings.length > 0 && (
      <Badge variant="secondary">{dayHearings.length}</Badge>
    )}
  </div>

  {/* Hearing cards (max 3 visible) */}
  <div className="space-y-1">
    {dayHearings.slice(0, 3).map((hearing) => (
      <Link href={`/dashboard/hearings/${hearing.id}`}>
        <div className="text-xs p-1.5 rounded bg-primary/10 hover:bg-primary/20">
          <p className="font-medium truncate">{hearing.caseTitle}</p>
          {hearing.location && (
            <p className="text-muted-foreground truncate">
              {hearing.location}
            </p>
          )}
        </div>
      </Link>
    ))}
    
    {/* Overflow indicator */}
    {dayHearings.length > 3 && (
      <p className="text-xs text-muted-foreground text-center">
        +{dayHearings.length - 3} more
      </p>
    )}
  </div>
</div>
```

## Styling

### Calendar Grid Layout

```css
/* Day names header */
.grid-cols-7 {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

/* Responsive calendar */
@media (max-width: 768px) {
  /* Consider switching to list view on mobile */
}
```

### Day Cell States

```tsx
// Today
className="bg-primary/5 border-primary"

// Past
className="bg-muted/50"

// Future (default)
className="bg-background"

// Empty (padding cells)
className="bg-muted/30"
```

### Hearing Card Styling

```tsx
className="
  text-xs p-1.5 rounded 
  bg-primary/10 
  hover:bg-primary/20 
  transition-colors 
  truncate 
  border border-primary/20
"
```

## Customization

### Custom Date Range

Display a specific date range instead of full month:

```typescript
interface CalendarViewProps {
  hearings: Hearing[];
  startDate?: Date;  // Optional custom start
  endDate?: Date;    // Optional custom end
}
```

### Filter by Court/Type

Show only specific hearings:

```tsx
// Filter hearings before passing to CalendarView
const filteredHearings = hearings.filter(h => 
  h.courtLevel === "high_court" && 
  h.actionType === "TRIAL"
);

<CalendarView hearings={filteredHearings} />
```

### Custom Hearing Display

Modify the hearing card rendering:

```tsx
{/* Show action type badge */}
<div className="flex items-center gap-1">
  <Badge variant="outline">{hearing.actionType}</Badge>
  <p className="truncate">{hearing.caseTitle}</p>
</div>

{/* Show time */}
<p className="text-xs">
  {format(new Date(hearing.date), "h:mm a")}
</p>
```

### Color Coding by Type

```tsx
// Get color based on action type
const getHearingColor = (actionType: string) => {
  switch (actionType) {
    case "TRIAL": return "bg-red-100 hover:bg-red-200";
    case "MENTION": return "bg-blue-100 hover:bg-blue-200";
    case "SENTENCING": return "bg-purple-100 hover:bg-purple-200";
    case "RULING": return "bg-green-100 hover:bg-green-200";
    default: return "bg-gray-100 hover:bg-gray-200";
  }
};

// Apply to hearing card
<div className={`${getHearingColor(hearing.actionType)} ...`}>
  {/* ... */}
</div>
```

## Performance Considerations

### Large Datasets

For courts with many hearings:

1. **Limit data fetched**
   ```typescript
   // Only fetch ±3 months of hearings
   const startDate = subMonths(currentDate, 3);
   const endDate = addMonths(currentDate, 3);
   ```

2. **Pagination**
   ```typescript
   // Load hearings on month change
   useEffect(() => {
     fetchHearings(currentDate);
   }, [currentDate]);
   ```

3. **Virtual scrolling**
   - Consider `react-window` for very large calendars

### Rendering Optimization

```typescript
// Memoize hearing lookups
const hearingsByDate = useMemo(() => {
  const map = new Map<string, Hearing[]>();
  hearings.forEach(hearing => {
    const key = format(new Date(hearing.date), "yyyy-MM-dd");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(hearing);
  });
  return map;
}, [hearings]);

// Fast lookup
const getHearingsForDate = (date: Date) => {
  const key = format(date, "yyyy-MM-dd");
  return hearingsByDate.get(key) || [];
};
```

## Accessibility

### Keyboard Navigation

```tsx
// Add keyboard support
<button
  onClick={() => goToPreviousMonth()}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      goToPreviousMonth();
    }
  }}
  aria-label="Previous month"
>
  <ChevronLeft />
</button>
```

### Screen Readers

```tsx
// Add ARIA labels
<div role="grid" aria-label="Calendar of hearings">
  <div role="row">
    {dayNames.map(day => (
      <div key={day} role="columnheader">
        {day}
      </div>
    ))}
  </div>
  
  {weeks.map(week => (
    <div role="row">
      {week.map(day => (
        <div role="gridcell" aria-label={`${day.date.toLocaleDateString()}, ${day.hearings.length} hearings`}>
          {/* ... */}
        </div>
      ))}
    </div>
  ))}
</div>
```

### Focus Management

```tsx
// Allow focusing on hearing cards
<Link
  href={`/dashboard/hearings/${hearing.id}`}
  className="focus:ring-2 focus:ring-primary focus:outline-none"
>
  {/* ... */}
</Link>
```

## Integration Examples

### With Filters

```tsx
export default function HearingsCalendarPage() {
  const [courtLevel, setCourtLevel] = useState("all");
  const [actionType, setActionType] = useState("all");

  // Fetch and filter
  const result = await getHearings({ limit: 1000 });
  const filteredHearings = result.data.filter(h => {
    if (courtLevel !== "all" && h.courtLevel !== courtLevel) return false;
    if (actionType !== "all" && h.actionType !== actionType) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={courtLevel} onValueChange={setCourtLevel}>
          <option value="all">All Courts</option>
          <option value="high_court">High Court</option>
          <option value="magistrates">Magistrates</option>
        </Select>
        
        <Select value={actionType} onValueChange={setActionType}>
          <option value="all">All Types</option>
          <option value="TRIAL">Trial</option>
          <option value="MENTION">Mention</option>
        </Select>
      </div>

      <CalendarView hearings={filteredHearings} />
    </div>
  );
}
```

### With Export

```tsx
import { exportToICS } from "@/lib/utils/calendar";

<Button onClick={() => exportToICS(hearings)}>
  Export to Calendar
</Button>
```

### With Print View

```tsx
<Button onClick={() => window.print()}>
  Print Calendar
</Button>

<style>
  @media print {
    .no-print { display: none; }
    .calendar-grid { break-inside: avoid; }
  }
</style>
```

## Testing

### Component Tests

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { CalendarView } from "@/components/calendar-view";

describe("CalendarView", () => {
  const mockHearings = [
    {
      id: "1",
      caseId: "case-1",
      caseTitle: "State vs John Doe",
      date: new Date("2025-11-15"),
      location: "Court Room 1",
    },
    {
      id: "2",
      caseId: "case-2",
      caseTitle: "Smith vs Jones",
      date: new Date("2025-11-15"),
      location: "Court Room 2",
    },
  ];

  it("renders calendar with hearings", () => {
    render(<CalendarView hearings={mockHearings} />);
    
    // Check for hearing titles
    expect(screen.getByText("State vs John Doe")).toBeInTheDocument();
    expect(screen.getByText("Smith vs Jones")).toBeInTheDocument();
  });

  it("shows correct hearing count badge", () => {
    render(<CalendarView hearings={mockHearings} />);
    
    // Should show "2" for days with 2 hearings
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("navigates to previous month", () => {
    render(<CalendarView hearings={mockHearings} />);
    
    const prevButton = screen.getByLabelText("Previous month");
    fireEvent.click(prevButton);
    
    // Check month changed (would need to verify month name)
  });

  it("navigates to next month", () => {
    render(<CalendarView hearings={mockHearings} />);
    
    const nextButton = screen.getByLabelText("Next month");
    fireEvent.click(nextButton);
  });

  it("returns to today", () => {
    render(<CalendarView hearings={mockHearings} />);
    
    const todayButton = screen.getByText("Today");
    fireEvent.click(todayButton);
    
    // Current month should be displayed
  });

  it("truncates overflow hearings", () => {
    const manyHearings = Array.from({ length: 5 }, (_, i) => ({
      id: `hearing-${i}`,
      caseId: `case-${i}`,
      caseTitle: `Case ${i}`,
      date: new Date("2025-11-15"),
      location: "Court Room 1",
    }));

    render(<CalendarView hearings={manyHearings} />);
    
    // Should show "+2 more" for 5 hearings (3 visible + 2 more)
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });
});
```

## Best Practices

### DO

✅ Fetch hearings for a reasonable date range (±3 months)
✅ Show hearing count badges for busy days
✅ Provide "Today" quick navigation
✅ Use visual indicators for today/past/future
✅ Make hearing cards clickable to details page
✅ Show location information when available
✅ Display statistics summary below calendar

### DON'T

❌ Don't load all hearings from all time (performance)
❌ Don't show too many hearings per day (truncate at 3)
❌ Don't forget mobile responsiveness
❌ Don't skip accessibility attributes
❌ Don't use complex animations (impacts performance)

## Future Enhancements

### Planned Features

1. **Drag and Drop**
   - Reschedule hearings by dragging to different dates
   - Visual feedback during drag operation

2. **Multi-Select**
   - Select multiple hearings
   - Bulk actions (reschedule, cancel, export)

3. **Filters**
   - Filter by court level
   - Filter by action type
   - Filter by judge/magistrate

4. **Week View**
   - Alternative weekly layout
   - More detail per hearing

5. **Day View**
   - Click day to see detailed schedule
   - Timeline view with exact times

6. **Export**
   - Export to ICS (Apple Calendar, Google Calendar)
   - Export to PDF
   - Print-friendly view

7. **Recurring Hearings**
   - Support for recurring hearing patterns
   - Visual indicators for series

## Related Documentation

- [Hearing Management](10-hearing-management.md)
- [Daily Cause Lists](17-daily-cause-lists.md)
- [Case Management](07-case-management.md)
- [Database Schema - Hearings](03-database-schema.md#hearings)
