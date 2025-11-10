import { getHearings } from "../actions";
import { CalendarView } from "@/components/calendar-view";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/permission-gate";
import { Calendar, Plus, List } from "lucide-react";
import Link from "next/link";

export default async function HearingsCalendarPage() {
  const result = await getHearings({ limit: 1000 });

  if (!result.success) {
    return (
      <div className="p-6">
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  const hearings = result.data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Hearings Calendar</h1>
            <p className="text-muted-foreground">
              View all scheduled hearings in calendar format
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/hearings">
              <List className="w-4 h-4 mr-2" />
              List View
            </Link>
          </Button>
          <PermissionGate permission="hearings:create">
            <Button asChild>
              <Link href="/dashboard/hearings/new">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Hearing
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </div>

      <CalendarView hearings={hearings} />
    </div>
  );
}
