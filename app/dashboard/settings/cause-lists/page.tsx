/**
 * Daily Cause Lists Management Page
 * 
 * Manage daily court schedules with generation, publishing, and viewing capabilities
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDailyCauseLists } from "./actions";

export default async function DailyCauseListsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get recent cause lists
  const result = await getDailyCauseLists({ limit: 20 });
  const causeLists = result.success ? result.data : [];

  return (
    <ProtectedRoute requiredPermission="hearings:read">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Daily Cause Lists"
          description="Generate and manage daily court schedules"
        >
          <Link href="/dashboard/settings/cause-lists/new">
            <Button>Generate Cause List</Button>
          </Link>
        </PageHeader>

        {/* Cause Lists Grid */}
        {causeLists && causeLists.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {causeLists.map((list: any) => (
              <Card key={list.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {new Date(list.date).toLocaleDateString("en-FJ", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <CardDescription>
                        {list.courtRoom
                          ? `${list.courtRoom.name} (${list.courtRoom.code})`
                          : "All Courtrooms"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        list.status === "PUBLISHED"
                          ? "default"
                          : list.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {list.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hearings:</span>
                      <span className="font-medium">
                        {list.hearings?.length || 0}
                      </span>
                    </div>
                    {list.courtRoom && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Court Level:</span>
                        <span className="font-medium">{list.courtRoom.courtLevel}</span>
                      </div>
                    )}
                    {list.publishedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span className="font-medium">
                          {new Date(list.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/dashboard/settings/cause-lists/${list.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/settings/cause-lists/${list.id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                No daily cause lists found
              </p>
              <Link href="/dashboard/settings/cause-lists/new">
                <Button>Generate Your First Cause List</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
