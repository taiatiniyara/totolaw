/**
 * Audit Log Page
 * 
 * Super admin page to view system admin audit log
 */

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";
import { getAuditLog } from "../actions";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowLeft, Clock, FileText } from "lucide-react";
import Link from "next/link";

export default async function AuditLogPage() {
  try {
    await requireSuperAdmin();
  } catch (error) {
    redirect("/dashboard/access-denied");
  }

  const result = await getAuditLog(100, 0);

  if (!result.success) {
    return <div>Error loading audit log</div>;
  }

  const { logs } = result;

  // Group logs by date
  const logsByDate = logs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, typeof logs>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/system-admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading as="h1" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            System Admin Audit Log
          </Heading>
          <p className="text-muted-foreground mt-1">
            Track all system administrator actions
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">Last 100 actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(logsByDate).length}</div>
            <p className="text-xs text-muted-foreground">Days with activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {logs.length > 0
                ? new Date(logs[0].createdAt).toLocaleString()
                : "No activity"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>
            Complete history of system administrator actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit log entries found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(logsByDate).map(([date, dateLogs]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2 sticky top-0 bg-background py-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{date}</h3>
                    <Badge variant="secondary">{dateLogs.length} events</Badge>
                  </div>
                  <div className="space-y-2 pl-6 border-l-2">
                    {dateLogs.map((log) => (
                      <div
                        key={log.id}
                        className="relative p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="absolute -left-[27px] top-6 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {/* Action and Entity */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={
                                  log.action.includes("created")
                                    ? "default"
                                    : log.action.includes("deleted") || log.action.includes("deactivated")
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {log.action}
                              </Badge>
                              {log.entityType && (
                                <Badge variant="outline" className="capitalize">
                                  {log.entityType}
                                </Badge>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm">{log.description}</p>

                            {/* Metadata */}
                            {log.metadata && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                  View details
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                  {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                                </pre>
                              </details>
                            )}

                            {/* Footer Info */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </span>
                              {log.ipAddress && (
                                <span>IP: {log.ipAddress}</span>
                              )}
                              {log.entityId && (
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  ID: {log.entityId.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
