/**
 * Courtrooms Management Page
 * 
 * Manage physical courtrooms within court buildings
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/common";
import { getCourtRooms } from "./actions";
import { Plus, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CourtRoomsPage() {
  const result = await getCourtRooms();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Courtrooms"
        description="Manage physical courtrooms and their assignments"
      >
        <Button asChild>
          <Link href="/dashboard/settings/courtrooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Courtroom
          </Link>
        </Button>
      </PageHeader>

      {/* Courtrooms List */}
      {!result.success ? (
        <EmptyState
          icon={Building2}
          title="Error loading courtrooms"
          description={result.error || "An error occurred"}
        />
      ) : result.data && result.data.length > 0 ? (
        <div className="grid gap-4">
          {result.data.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription>
                      {room.code} • {room.courtLevel.replace("_", " ")}
                    </CardDescription>
                  </div>
                  <Badge variant={room.isActive ? "default" : "secondary"}>
                    {room.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  {room.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {room.location}
                    </div>
                  )}
                  {room.capacity && (
                    <div className="text-muted-foreground">
                      Capacity: {room.capacity} people
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/settings/courtrooms/${room.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No courtrooms yet"
          description="Add your first courtroom to start scheduling hearings"
        >
          <Button asChild>
            <Link href="/dashboard/settings/courtrooms/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Courtroom
            </Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
