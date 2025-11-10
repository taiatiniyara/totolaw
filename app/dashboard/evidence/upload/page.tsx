"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadEvidence } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X } from "lucide-react";

export default function UploadEvidencePage({
  searchParams,
}: {
  searchParams: { caseId?: string; hearingId?: string };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (!selectedFile) {
      setError("Please select a file to upload");
      setIsSubmitting(false);
      return;
    }

    formData.set("file", selectedFile);

    const result = await uploadEvidence(formData);

    if (result.success) {
      const caseId = formData.get("caseId") as string;
      router.push(`/dashboard/cases/${caseId}`);
      router.refresh();
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Evidence</CardTitle>
          <CardDescription>
            Upload documents, images, videos, or other files as evidence for a case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="caseId">Case ID *</Label>
              <Input
                id="caseId"
                name="caseId"
                defaultValue={searchParams.caseId}
                placeholder="Enter case ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hearingId">Hearing ID (Optional)</Label>
              <Input
                id="hearingId"
                name="hearingId"
                defaultValue={searchParams.hearingId}
                placeholder="Enter hearing ID (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this evidence..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>File *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Drag and drop your file here, or
                      </p>
                      <Label
                        htmlFor="file"
                        className="text-sm text-primary cursor-pointer hover:underline"
                      >
                        browse to upload
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 50MB
                      <br />
                      Supported: PDF, Images, Documents, Videos, Audio
                    </p>
                  </div>
                )}
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt,.mp4,.mov,.mp3,.wav"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedFile}>
                {isSubmitting ? "Uploading..." : "Upload Evidence"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
