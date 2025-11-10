/**
 * Cases List Page
 * 
 * Displays all cases for the current organization with permission checks
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionGate } from "@/components/auth/permission-gate";
import { getCases } from "./actions";
import { Plus, FileText } from "lucide-react";

export default async function CasesPage() {
  const result = await getCases({ limit: 20 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage and track all court cases
          </p>
        </div>
        <PermissionGate permission="cases:create">
          <Button asChild>
            <Link href="/dashboard/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        </PermissionGate>
      </div>

      {/* Cases List */}
      {!result.success ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      ) : result.data && result.data.length > 0 ? (
        <div className="grid gap-4">
          {result.data.map((caseItem) => (
            <Card key={caseItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {caseItem.title}
                    </CardTitle>
                    <CardDescription>
                      {caseItem.type} • {caseItem.status}
                    </CardDescription>
                  </div>
                  <PermissionGate permission="cases:read">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/cases/${caseItem.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </PermissionGate>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Filed: {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                  {caseItem.assignedTo && (
                    <span>Assigned to: {caseItem.assignedTo}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cases found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your first case
            </p>
            <PermissionGate permission="cases:create">
              <Button asChild>
                <Link href="/dashboard/cases/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Case
                </Link>
              </Button>
            </PermissionGate>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
