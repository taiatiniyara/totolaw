/**
 * Hearings List Page
 * 
 * View and manage all court hearings
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PageHeader, ListItemCard, EmptyState } from "@/components/common";
import { getHearings } from "./actions";
import { Plus, Calendar, MapPin, Clock, CalendarDays } from "lucide-react";

export default async function HearingsPage() {
  const result = await getHearings({ limit: 50 });

  // Helper to check if hearing is in the past
  const isPast = (date: Date) => new Date(date) < new Date();

  // Helper to check if hearing is today
  const isToday = (date: Date) => {
    const today = new Date();
    const hearingDate = new Date(date);
    return (
      hearingDate.getDate() === today.getDate() &&
      hearingDate.getMonth() === today.getMonth() &&
      hearingDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Hearings"
        description="Schedule and manage court hearings"
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/hearings/calendar">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar View
            </Link>
          </Button>
          <PermissionGate permission="hearings:create">
            <Button asChild>
              <Link href="/dashboard/hearings/new">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Hearing
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </PageHeader>

      {/* Hearings List */}
      {!result.success ? (
        <EmptyState
          icon={Calendar}
          title="Error loading hearings"
          description={result.error || "An error occurred"}
        />
      ) : result.data && result.data.length > 0 ? (
        <div className="grid gap-4">
          {result.data.map((hearing) => (
            <PermissionGate key={hearing.id} permission="hearings:read">
              <ListItemCard
                title={hearing.caseTitle}
                description={
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(hearing.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {hearing.scheduledTime && ` at ${hearing.scheduledTime}`}
                    </span>
                    {hearing.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {hearing.location}
                      </span>
                    )}
                  </div>
                }
                icon={Calendar}
                action={{
                  label: "View Details",
                  href: `/dashboard/hearings/${hearing.id}`,
                  variant: "outline",
                }}
              >
                <div className="flex gap-2 items-center mb-2">
                  {isToday(hearing.scheduledDate) && (
                    <Badge variant="default">Today</Badge>
                  )}
                  {isPast(hearing.scheduledDate) && !isToday(hearing.scheduledDate) && (
                    <Badge variant="secondary">Past</Badge>
                  )}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <Link 
                    href={`/dashboard/cases/${hearing.caseId}`}
                    className="hover:underline text-primary"
                  >
                    View Case
                  </Link>
                  {hearing.bailDecision && (
                    <span>Bail: {hearing.bailDecision}</span>
                  )}
                </div>
              </ListItemCard>
            </PermissionGate>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No hearings scheduled"
          description="Schedule your first court hearing to get started"
        >
          <PermissionGate permission="hearings:create">
            <Button asChild>
              <Link href="/dashboard/hearings/new">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Hearing
              </Link>
            </Button>
          </PermissionGate>
        </EmptyState>
      )}
    </div>
  );
}
