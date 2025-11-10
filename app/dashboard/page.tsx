/**
 * Dashboard Page
 * 
 * Main dashboard showing statistics and quick access
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCaseStats } from "./cases/actions";
import { getCurrentOrganization } from "./actions";
import { FileText, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const statsResult = await getCaseStats();
  const orgResult = await getCurrentOrganization();

  const stats = statsResult.data || { total: 0, active: 0, pending: 0, closed: 0 };
  const org = orgResult.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {org?.organizationName ? `${org.organizationName} - ${org.roleName}` : "Welcome to Totolaw"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All cases in your organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closed}</div>
            <p className="text-xs text-muted-foreground">
              Completed cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/cases">
                <FileText className="mr-2 h-4 w-4" />
                View All Cases
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/cases/new">
                <FileText className="mr-2 h-4 w-4" />
                Create New Case
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/users">
                <FileText className="mr-2 h-4 w-4" />
                Manage Users
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
            <CardDescription>Your current organization context</CardDescription>
          </CardHeader>
          <CardContent>
            {org ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Organization:</span>
                  <p className="text-muted-foreground">{org.organizationName}</p>
                </div>
                <div>
                  <span className="font-medium">Your Role:</span>
                  <p className="text-muted-foreground">{org.roleName || "Member"}</p>
                </div>
                <div>
                  <span className="font-medium">Member Since:</span>
                  <p className="text-muted-foreground">
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
    </div>
  );
}
