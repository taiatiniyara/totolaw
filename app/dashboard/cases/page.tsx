/**
 * Cases List Page
 * 
 * Displays all cases for the current organization with permission checks
 */

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PageHeader, ListItemCard, EmptyState } from "@/components/common";
import { getCases } from "./actions";
import { Plus, FileText } from "lucide-react";

export default async function CasesPage() {
  const result = await getCases({ limit: 20 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Cases"
        description="Manage and track all court cases"
      >
        <PermissionGate permission="cases:create">
          <Button asChild>
            <Link href="/dashboard/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        </PermissionGate>
      </PageHeader>

      {/* Cases List */}
      {!result.success ? (
        <EmptyState
          icon={FileText}
          title="Error loading cases"
          description={result.error || "An error occurred"}
        />
      ) : result.data && result.data.length > 0 ? (
        <div className="grid gap-4">
          {result.data.map((caseItem) => (
            <PermissionGate key={caseItem.id} permission="cases:read">
              <ListItemCard
                title={caseItem.title}
                description={`${caseItem.type} • ${caseItem.status}`}
                icon={FileText}
                action={{
                  label: "View Details",
                  href: `/dashboard/cases/${caseItem.id}`,
                  variant: "outline",
                }}
              >
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Filed: {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                  {caseItem.assignedTo && (
                    <span>Assigned to: {caseItem.assignedTo}</span>
                  )}
                </div>
              </ListItemCard>
            </PermissionGate>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No cases found"
          description="Get started by creating your first case"
        >
          <PermissionGate permission="cases:create">
            <Button asChild>
              <Link href="/dashboard/cases/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Case
              </Link>
            </Button>
          </PermissionGate>
        </EmptyState>
      )}
    </div>
  );
}
