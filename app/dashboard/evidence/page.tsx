import { getAllEvidence } from "./actions";
import { PermissionGate } from "@/components/auth/permission-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, ListItemCard, EmptyState } from "@/components/common";
import Link from "next/link";
import { FileText, Upload, Download } from "lucide-react";

export default async function EvidencePage() {
  const result = await getAllEvidence({ limit: 100 });

  if (!result.success) {
    return (
      <div className="p-6">
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  const evidenceList = result.data || [];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Evidence"
        description="Manage case evidence and uploaded files"
      >
        <PermissionGate permission="evidence:create">
          <Link href="/dashboard/evidence/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>
          </Link>
        </PermissionGate>
      </PageHeader>

      {evidenceList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No evidence files found"
          description="Upload evidence files to get started"
        />
      ) : (
        <div className="grid gap-4">
          {evidenceList.map((item) => (
            <ListItemCard
              key={item.id}
              title={item.fileName}
              description={item.description}
              icon={FileText}
            >
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <Link
                  href={`/dashboard/cases/${item.caseId}`}
                  className="hover:underline text-primary"
                >
                  Case: {item.caseTitle}
                </Link>
                <span>•</span>
                <span>
                  {(item.fileSize / 1024).toFixed(1)} KB
                </span>
                <span>•</span>
                <Badge variant="outline">{item.fileType}</Badge>
                <span>•</span>
                <span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={item.filePath} target="_blank" download>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </Link>
                <PermissionGate permission="evidence:delete">
                  <Link href={`/dashboard/evidence/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </PermissionGate>
              </div>
            </ListItemCard>
          ))}
        </div>
      )}
    </div>
  );
}
