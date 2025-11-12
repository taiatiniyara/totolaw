"use client";

/**
 * Cause List Form Component
 * 
 * Form for generating and previewing daily cause lists
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createDailyCauseList, getHearingsForCauseList } from "../actions";
import { Loader2, Calendar, Scale, Clock, MapPin } from "lucide-react";
import type { CourtRoom } from "@/lib/drizzle/schema/db-schema";

interface CauseListFormProps {
  courtrooms: CourtRoom[];
}

export function CauseListForm({ courtrooms }: CauseListFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [hearings, setHearings] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    listDate: "",
    courtLevel: "",
    courtRoomId: "",
    presidingOfficerId: "",
    presidingOfficerTitle: "",
    sessionTime: "9:30AM",
    notes: "",
  });

  const courtLevels = [
    { value: "high_court", label: "High Court" },
    { value: "magistrates", label: "Magistrates Court" },
    { value: "court_of_appeal", label: "Court of Appeal" },
    { value: "tribunal", label: "Tribunal" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Load preview hearings when date/filters change
  useEffect(() => {
    if (formData.listDate) {
      loadPreview();
    }
  }, [formData.listDate, formData.courtRoomId, formData.courtLevel]);

  async function loadPreview() {
    if (!formData.listDate) return;

    setIsLoadingPreview(true);
    try {
      const result = await getHearingsForCauseList({
        date: new Date(formData.listDate),
        courtRoomId: formData.courtRoomId || undefined,
        courtLevel: formData.courtLevel || undefined,
      });

      if (result.success) {
        setHearings(result.data || []);
      } else {
        toast.error(result.error || "Failed to load hearings");
      }
    } catch (error) {
      console.error("Error loading preview:", error);
      toast.error("Failed to load hearings preview");
    } finally {
      setIsLoadingPreview(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.listDate || !formData.courtLevel || !formData.presidingOfficerId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (hearings.length === 0) {
      toast.error("No hearings found for this date. Please select a different date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createDailyCauseList({
        listDate: new Date(formData.listDate),
        courtLevel: formData.courtLevel,
        courtRoomId: formData.courtRoomId || undefined,
        presidingOfficerId: formData.presidingOfficerId,
        presidingOfficerTitle: formData.presidingOfficerTitle || undefined,
        sessionTime: formData.sessionTime || undefined,
        notes: formData.notes || undefined,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to create cause list");
        return;
      }

      toast.success("Cause list created successfully");
      router.push("/dashboard/settings/cause-lists");
      router.refresh();
    } catch (error) {
      console.error("Error creating cause list:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filter courtrooms by selected court level
  const filteredCourtrooms = formData.courtLevel
    ? courtrooms.filter(cr => cr.courtLevel === formData.courtLevel)
    : courtrooms;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Cause List Details</CardTitle>
          <CardDescription>
            Enter the details for the daily cause list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="listDate">Date *</Label>
              <Input
                id="listDate"
                type="date"
                value={formData.listDate}
                onChange={(e) => handleChange("listDate", e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Court Level */}
            <div className="space-y-2">
              <Label htmlFor="courtLevel">Court Level *</Label>
              <select
                id="courtLevel"
                value={formData.courtLevel}
                onChange={(e) => {
                  handleChange("courtLevel", e.target.value);
                  handleChange("courtRoomId", ""); // Reset courtroom when level changes
                }}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
              >
                <option value="">Select court level</option>
                {courtLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Courtroom */}
            {formData.courtLevel && filteredCourtrooms.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="courtRoomId">Courtroom (Optional)</Label>
                <select
                  id="courtRoomId"
                  value={formData.courtRoomId}
                  onChange={(e) => handleChange("courtRoomId", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                >
                  <option value="">All courtrooms</option>
                  {filteredCourtrooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.code})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">
                  Leave empty to include all courtrooms
                </p>
              </div>
            )}

            {/* Presiding Officer */}
            <div className="space-y-2">
              <Label htmlFor="presidingOfficerId">Presiding Officer ID *</Label>
              <Input
                id="presidingOfficerId"
                placeholder="Enter judge/magistrate user ID"
                value={formData.presidingOfficerId}
                onChange={(e) => handleChange("presidingOfficerId", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                System user ID of the presiding judge or magistrate
              </p>
            </div>

            {/* Presiding Officer Title */}
            <div className="space-y-2">
              <Label htmlFor="presidingOfficerTitle">Presiding Officer Title</Label>
              <Input
                id="presidingOfficerTitle"
                placeholder="e.g., HON. MR. JUSTICE GOUNDAR"
                value={formData.presidingOfficerTitle}
                onChange={(e) => handleChange("presidingOfficerTitle", e.target.value)}
              />
            </div>

            {/* Session Time */}
            <div className="space-y-2">
              <Label htmlFor="sessionTime">Session Time</Label>
              <Input
                id="sessionTime"
                placeholder="e.g., 9:30AM"
                value={formData.sessionTime}
                onChange={(e) => handleChange("sessionTime", e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Optional notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/settings/cause-lists")}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || hearings.length === 0} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Cause List"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Hearings</CardTitle>
          <CardDescription>
            {formData.listDate 
              ? `Scheduled hearings for ${new Date(formData.listDate).toLocaleDateString("en-FJ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
              : "Select a date to preview hearings"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : hearings.length > 0 ? (
            <div className="space-y-3">
              {hearings.map((item: any, index: number) => (
                <div key={index} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm">
                      {item.case?.caseNumber}: {item.case?.title}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.hearing.actionType}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.hearing.scheduledTime}
                    </div>
                    {item.courtRoom && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.courtRoom.code}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : formData.listDate ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hearings scheduled for this date</p>
              <p className="text-xs mt-1">Try selecting a different date or adjust filters</p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a date to preview scheduled hearings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
