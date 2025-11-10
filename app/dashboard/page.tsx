/**
 * Dashboard Page
 * 
 * Main dashboard showing statistics and quick access
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCaseStats } from "./cases/actions";
import { getCurrentOrganization, getUpcomingHearings, getRecentCases } from "./actions";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Scale,
  Plus,
  Eye,
  ArrowRight,
  MapPin
} from "lucide-react";

export default async function DashboardPage() {
  const [statsResult, orgResult, hearingsResult, casesResult] = await Promise.all([
    getCaseStats(),
    getCurrentOrganization(),
    getUpcomingHearings(5),
    getRecentCases(5),
  ]);

  const stats = statsResult.data || { total: 0, active: 0, pending: 0, closed: 0 };
  const org = orgResult.data;
  const upcomingHearings = hearingsResult.data || [];
  const recentCases = casesResult.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {org?.organizationName ? `${org.organizationName} - ${org.roleName}` : "Welcome to Totolaw"}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/cases">
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All cases in your organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
            {stats.active > 0 && (
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Cases</CardTitle>
            <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Hearings and Recent Cases */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Hearings</CardTitle>
                <CardDescription>Next scheduled court dates</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingHearings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No upcoming hearings</p>
                  <p className="text-xs mt-1">Schedule a hearing to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingHearings.map((hearing: any) => (
                    <Link
                      key={hearing.id}
                      href={`/dashboard/hearings/${hearing.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {hearing.caseTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(hearing.date).toLocaleDateString()}</span>
                            {hearing.location && (
                              <>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{hearing.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/hearings">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Hearings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Latest case updates</CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No cases yet</p>
                  <p className="text-xs mt-1">Create your first case to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCases.map((caseItem: any) => (
                    <Link
                      key={caseItem.id}
                      href={`/dashboard/cases/${caseItem.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {caseItem.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              caseItem.status === 'active' ? 'default' :
                              caseItem.status === 'closed' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {caseItem.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {caseItem.type}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/cases">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Cases
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>Your current organization context</CardDescription>
        </CardHeader>
        <CardContent>
          {org ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organization</p>
                <p className="text-lg font-semibold mt-1">{org.organizationName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Role</p>
                <p className="text-lg font-semibold mt-1">{org.roleName || "Member"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold mt-1">
                  {org.memberSince ? new Date(org.memberSince).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No organization context available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
