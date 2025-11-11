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
import { PageHeader, StatCard, LinkCard, } from "@/components/common";
import { getCaseStats } from "./cases/actions";
import { getCurrentOrganisation, getUpcomingHearings, getRecentCases } from "./actions";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Calendar,
  Scale,
  Plus,
  Eye,
  MapPin
} from "lucide-react";

export default async function DashboardPage() {
  const [statsResult, orgResult, hearingsResult, casesResult] = await Promise.all([
    getCaseStats(),
    getCurrentOrganisation(),
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
      <PageHeader
        title="Dashboard"
        description={org?.organisationName ? `${org.organisationName} - ${org.roleName}` : "Welcome to Totolaw"}
        action={{
          label: "New Case",
          href: "/dashboard/cases",
          icon: Plus,
        }}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Cases"
          value={stats.total}
          description="All cases in your organisation"
          icon={FileText}
          iconColor="text-primary"
        />
        <StatCard
          title="Active Cases"
          value={stats.active}
          description="Currently in progress"
          icon={Clock}
          iconColor="text-blue-500"
          badge={stats.active > 0 ? { label: "Active" } : undefined}
        />
        <StatCard
          title="Pending Cases"
          value={stats.pending}
          description="Awaiting action"
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Closed Cases"
          value={stats.closed}
          description="Completed cases"
          icon={CheckCircle}
          iconColor="text-green-500"
        />
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
                    <LinkCard
                      key={hearing.id}
                      href={`/dashboard/hearings/${hearing.id}`}
                      title={hearing.caseTitle}
                    >
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
                    </LinkCard>
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
                    <LinkCard
                      key={caseItem.id}
                      href={`/dashboard/cases/${caseItem.id}`}
                      title={caseItem.title}
                    >
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
                    </LinkCard>
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

      {/* Organisation Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organisation Information</CardTitle>
          <CardDescription>Your current organisation context</CardDescription>
        </CardHeader>
        <CardContent>
          {org ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organisation</p>
                <p className="text-lg font-semibold mt-1">{org.organisationName}</p>
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
              No organisation context available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
