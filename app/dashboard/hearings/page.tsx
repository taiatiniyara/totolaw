/**
 * Hearings List Page
 * 
 * View and manage all court hearings
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { PermissionGate } from "@/components/auth/permission-gate";
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
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h1">Hearings</Heading>
          <p className="text-muted-foreground">
            Schedule and manage court hearings
          </p>
        </div>
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
      </div>

      {/* Hearings List */}
      {!result.success ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      ) : result.data && result.data.length > 0 ? (
        <div className="grid gap-4">
          {result.data.map((hearing) => (
            <Card key={hearing.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {hearing.caseTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(hearing.date).toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {hearing.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hearing.location}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    {isToday(hearing.date) && (
                      <Badge variant="default">Today</Badge>
                    )}
                    {isPast(hearing.date) && !isToday(hearing.date) && (
                      <Badge variant="secondary">Past</Badge>
                    )}
                    <PermissionGate permission="hearings:read">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/hearings/${hearing.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <Heading as="h3" className="mb-2">No hearings scheduled</Heading>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule your first court hearing to get started
            </p>
            <PermissionGate permission="hearings:create">
              <Button asChild>
                <Link href="/dashboard/hearings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Hearing
                </Link>
              </Button>
            </PermissionGate>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
