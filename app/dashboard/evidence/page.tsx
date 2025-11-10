import { getAllEvidence } from "./actions";
import { PermissionGate } from "@/components/auth/permission-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Evidence</h1>
          <p className="text-muted-foreground">
            Manage case evidence and uploaded files
          </p>
        </div>
        <PermissionGate permission="evidence:create">
          <Link href="/dashboard/evidence/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>
          </Link>
        </PermissionGate>
      </div>

      {evidenceList.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No evidence files found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {evidenceList.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <h3 className="font-semibold">{item.fileName}</h3>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground ml-8">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 ml-8 text-sm text-muted-foreground">
                      <Link
                        href={`/dashboard/cases/${item.caseId}`}
                        className="hover:underline"
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
