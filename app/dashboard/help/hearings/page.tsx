/**
 * Hearings Guide
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Eye,
  Edit,
  CalendarDays,
} from "lucide-react";

export default function HearingsHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1">Hearings Guide</Heading>
          <p className="text-muted-foreground">
            Schedule and manage court hearings
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            What are Hearings?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Hearings are scheduled court sessions for specific cases. They include information about when and where the hearing will take place, who will preside, and what occurred during the session.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Scheduling a Hearing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold">Navigate to Hearings</p>
                <p className="text-sm text-muted-foreground">Click <strong>Hearings</strong> in the sidebar or <strong>Schedule Hearing</strong> from a case page</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold">Fill in Details</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• <strong>Case:</strong> Select the case (if not pre-selected)</li>
                  <li>• <strong>Date & Time:</strong> When the hearing will occur</li>
                  <li>• <strong>Location:</strong> Courtroom or venue</li>
                  <li>• <strong>Judge:</strong> Presiding judge (optional)</li>
                  <li>• <strong>Notes:</strong> Any additional information</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold">Create the Hearing</p>
                <p className="text-sm text-muted-foreground">Click <strong>Schedule Hearing</strong> to save</p>
              </div>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/hearings/new">
              <Plus className="mr-2 h-4 w-4" />
              Schedule a Hearing
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Viewing Hearings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Hearings List</h4>
              <p className="text-muted-foreground mb-2">Shows all scheduled hearings with:</p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Date and time with visual indicators for today/past hearings</li>
                <li>• Related case information</li>
                <li>• Location and presiding judge</li>
                <li>• Quick links to case details</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Calendar View</h4>
              <p className="text-muted-foreground">View hearings in a monthly calendar format for better scheduling visualization</p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link href="/dashboard/hearings/calendar">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View Calendar
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Managing Hearings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-3">
              <strong className="text-sm">Reschedule</strong>
              <p className="text-xs text-muted-foreground mt-1">Change date, time, or location of a hearing</p>
            </div>
            <div className="border rounded-lg p-3">
              <strong className="text-sm">Add Notes</strong>
              <p className="text-xs text-muted-foreground mt-1">Record what happened during the hearing</p>
            </div>
            <div className="border rounded-lg p-3">
              <strong className="text-sm">Link Evidence</strong>
              <p className="text-xs text-muted-foreground mt-1">Associate documents with specific hearings</p>
            </div>
            <div className="border rounded-lg p-3">
              <strong className="text-sm">View Case</strong>
              <p className="text-xs text-muted-foreground mt-1">Quick access to related case information</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Schedule hearings well in advance to allow proper notification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Include specific location details (courtroom number, building)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Check the calendar view to avoid scheduling conflicts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Add notes immediately after hearings while details are fresh</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/cases">Case Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/evidence">Evidence Management</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
