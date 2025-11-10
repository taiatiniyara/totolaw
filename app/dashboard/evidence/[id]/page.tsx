"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEvidenceById, deleteEvidence } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Download, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Evidence = {
  id: string;
  organizationId: string;
  caseId: string;
  hearingId: string | null;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  description: string | null;
  submittedBy: string | null;
  createdAt: Date;
};

export default function EvidenceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      const result = await getEvidenceById(params.id);
      if (result.success && result.data) {
        setEvidence(result.data);
      } else {
        setError(!result.success && 'error' in result ? result.error : 'Failed to load evidence');
      }
      setIsLoading(false);
    };

    fetchEvidence();
  }, [params.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEvidence(params.id);

    if (result.success) {
      router.push("/dashboard/evidence");
      router.refresh();
    } else {
      setError(!result.success && 'error' in result ? result.error : 'Failed to delete evidence');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !evidence) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error || "Evidence not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                {evidence.fileName}
              </CardTitle>
              <CardDescription>Evidence Details</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={evidence.filePath} target="_blank" download>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this evidence file? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Heading as="h3" className="text-sm font-medium text-muted-foreground mb-1">
                File Type
              </Heading>
              <Badge variant="outline">{evidence.fileType}</Badge>
            </div>
            <div>
              <Heading as="h3" className="text-sm font-medium text-muted-foreground mb-1">
                File Size
              </Heading>
              <p>{(evidence.fileSize / 1024).toFixed(1)} KB</p>
            </div>
            <div>
              <Heading as="h3" className="text-sm font-medium text-muted-foreground mb-1">
                Case ID
              </Heading>
              <Link
                href={`/dashboard/cases/${evidence.caseId}`}
                className="text-primary hover:underline"
              >
                {evidence.caseId}
              </Link>
            </div>
            <div>
              <Heading as="h3" className="text-sm font-medium text-muted-foreground mb-1">
                Uploaded Date
              </Heading>
              <p>{new Date(evidence.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {evidence.description && (
            <div>
              <Heading as="h3" className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </Heading>
              <p className="text-sm">{evidence.description}</p>
            </div>
          )}

          {evidence.hearingId && (
            <div>
              <Heading as="h3" className="text-sm font-medium text-muted-foreground mb-1">
                Related Hearing
              </Heading>
              <Link
                href={`/dashboard/hearings/${evidence.hearingId}`}
                className="text-primary hover:underline"
              >
                {evidence.hearingId}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
