/**
 * Courtroom Form Component (Server Actions)
 * 
 * Form for creating and editing courtrooms using server actions with FormData
 */

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormActions } from "@/components/forms";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";

const COURT_LEVELS = [
  { value: "court_of_appeal", label: "Court of Appeal" },
  { value: "high_court", label: "High Court" },
  { value: "magistrates", label: "Magistrates Court" },
  { value: "tribunal", label: "Tribunal" },
];

interface CourtRoomFormServerProps {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
  initialData?: {
    name?: string;
    code?: string;
    courtLevel?: string;
    location?: string | null;
    capacity?: number | null;
    isActive?: boolean;
  };
  mode: "create" | "edit";
}

export function CourtRoomFormServer({
  action,
  deleteAction,
  initialData,
  mode,
}: CourtRoomFormServerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Courtroom Details</CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update the courtroom information below"
            : "Enter the details for the new courtroom"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {/* Name */}
          <FormField
            label="Name"
            name="name"
            type="text"
            placeholder="e.g., HIGH COURT ROOM NO. 2"
            required
            helpText="The display name of the courtroom"
            defaultValue={initialData?.name}
          />

          {/* Code */}
          <FormField
            label="Code"
            name="code"
            type="text"
            placeholder="e.g., HC-2 or MC-1"
            required
            helpText="Short code for quick reference"
            defaultValue={initialData?.code}
          />

          {/* Court Level */}
          <FormField
            label="Court Level"
            name="courtLevel"
            type="select"
            placeholder="Select court level"
            required
            helpText="The level or type of court"
            options={COURT_LEVELS}
            defaultValue={initialData?.courtLevel}
          />

          {/* Location */}
          <FormField
            label="Location"
            name="location"
            type="textarea"
            placeholder="e.g., Justice Complex, 3rd Floor, South Wing"
            helpText="Building and floor details (optional)"
            defaultValue={initialData?.location || ""}
          />

          {/* Capacity */}
          <FormField
            label="Capacity"
            name="capacity"
            type="number"
            placeholder="e.g., 50"
            min="1"
            helpText="Maximum number of people (optional)"
            defaultValue={initialData?.capacity?.toString()}
          />

          {/* Active Status */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive courtrooms cannot be scheduled for hearings
              </p>
            </div>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={initialData?.isActive ?? true}
              className="h-10 w-10 rounded"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div>
              {mode === "edit" && deleteAction && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Courtroom?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the courtroom{" "}
                        <strong>{initialData?.name}</strong>. This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <form action={deleteAction}>
                        <AlertDialogAction
                          type="submit"
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <FormActions
              cancelHref="/dashboard/settings/courtrooms"
              submitLabel={mode === "edit" ? "Update Courtroom" : "Create Courtroom"}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
