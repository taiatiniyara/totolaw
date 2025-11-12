"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";

interface Hearing {
  id: string;
  caseId: string;
  caseTitle: string;
  scheduledDate: Date;
  scheduledTime?: string;
  location: string | null;
}

interface CalendarViewProps {
  hearings: Hearing[];
}

export function CalendarView({ hearings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Calculate total days to display (including padding)
  const daysInMonth = lastDayOfMonth.getDate();
  const totalDays = startingDayOfWeek + daysInMonth;
  const weeksToShow = Math.ceil(totalDays / 7);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get hearings for a specific date
  const getHearingsForDate = (date: Date) => {
    return hearings.filter((hearing) => {
      const hearingDate = new Date(hearing.scheduledDate);
      return (
        hearingDate.getFullYear() === date.getFullYear() &&
        hearingDate.getMonth() === date.getMonth() &&
        hearingDate.getDate() === date.getDate()
      );
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Check if date is in the past
  const isPast = (date: Date) => {
    return date < today;
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];

    for (let week = 0; week < weeksToShow; week++) {
      const weekDays = [];

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayNumber = week * 7 + dayOfWeek - startingDayOfWeek + 1;
        
        if (dayNumber < 1 || dayNumber > daysInMonth) {
          // Empty cell for days outside current month
          weekDays.push(
            <div
              key={`empty-${week}-${dayOfWeek}`}
              className="min-h-[120px] bg-muted/30 border border-border"
            />
          );
        } else {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayNumber
          );
          const dayHearings = getHearingsForDate(date);
          const isTodayDate = isToday(date);
          const isPastDate = isPast(date);

          weekDays.push(
            <div
              key={`day-${dayNumber}`}
              className={`min-h-[120px] border border-border p-2 ${
                isTodayDate
                  ? "bg-primary/5 border-primary"
                  : isPastDate
                  ? "bg-muted/50"
                  : "bg-background"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    isTodayDate
                      ? "text-primary font-bold"
                      : isPastDate
                      ? "text-muted-foreground"
                      : ""
                  }`}
                >
                  {dayNumber}
                </span>
                {dayHearings.length > 0 && (
                  <Badge variant="secondary" className="text-xs h-5">
                    {dayHearings.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                {dayHearings.slice(0, 3).map((hearing) => (
                  <Link
                    key={hearing.id}
                    href={`/dashboard/hearings/${hearing.id}`}
                    className="block"
                  >
                    <div className="text-xs p-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors truncate border border-primary/20">
                      <p className="font-medium truncate">{hearing.caseTitle}</p>
                      {hearing.location && (
                        <p className="text-muted-foreground truncate text-[10px]">
                          {hearing.location}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                {dayHearings.length > 3 && (
                  <p className="text-[10px] text-muted-foreground text-center">
                    +{dayHearings.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        }
      }

      days.push(
        <div key={`week-${week}`} className="grid grid-cols-7">
          {weekDays}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heading as="h2">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Heading>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary bg-primary/5" />
          <span className="text-muted-foreground">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-border bg-muted/50" />
          <span className="text-muted-foreground">Past</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-border bg-background" />
          <span className="text-muted-foreground">Future</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Day names header */}
          <div className="grid grid-cols-7 border-b border-border">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="divide-y divide-border">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hearings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All scheduled hearings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                hearings.filter((h) => {
                  const hDate = new Date(h.scheduledDate);
                  return (
                    hDate.getMonth() === currentDate.getMonth() &&
                    hDate.getFullYear() === currentDate.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In {monthNames[currentDate.getMonth()]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                hearings.filter((h) => new Date(h.scheduledDate) >= today).length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Future hearings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
