/**
 * Legal Representative Form Component (Server Actions)
 * 
 * Form for creating and editing legal representatives using server actions with FormData
 */

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormActions } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const REPRESENTATIVE_TYPES = [
  { value: "individual", label: "Individual Lawyer" },
  { value: "law_firm", label: "Law Firm" },
  { value: "legal_aid", label: "Legal Aid" },
];

const PRACTICE_AREA_OPTIONS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Commercial Law",
  "Constitutional Law",
  "Employment Law",
  "Property Law",
  "Tax Law",
  "Immigration Law",
  "Administrative Law",
];

interface LegalRepresentativeFormServerProps {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
  initialData?: {
    name?: string;
    type?: string;
    firmName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    practiceAreas?: unknown;
    notes?: string | null;
    isActive?: boolean;
  };
  mode: "create" | "edit";
}

export function LegalRepresentativeFormServer({
  action,
  deleteAction,
  initialData,
  mode,
}: LegalRepresentativeFormServerProps) {
  const practiceAreasArray = (initialData?.practiceAreas as string[]) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Representative Details</CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update the legal representative information below"
            : "Enter the details for the new legal representative"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {/* Name */}
          <FormField
            label="Name"
            name="name"
            type="text"
            placeholder="e.g., John Smith or ABC Law Firm"
            required
            helpText="Full name of the lawyer or organization"
            defaultValue={initialData?.name}
          />

          {/* Type */}
          <FormField
            label="Type"
            name="type"
            type="select"
            placeholder="Select representative type"
            required
            helpText="Type of legal representative"
            options={REPRESENTATIVE_TYPES}
            defaultValue={initialData?.type}
          />

          {/* Firm Name (conditional) */}
          {initialData?.type === "individual" && (
            <FormField
              label="Law Firm"
              name="firmName"
              type="text"
              placeholder="e.g., Smith & Associates"
              helpText="Name of the law firm (if applicable)"
              defaultValue={initialData?.firmName || ""}
            />
          )}

          {/* Email */}
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="e.g., contact@example.com"
            helpText="Contact email address"
            defaultValue={initialData?.email || ""}
          />

          {/* Phone */}
          <FormField
            label="Phone"
            name="phone"
            type="text"
            placeholder="e.g., +679 123 4567"
            helpText="Contact phone number"
            defaultValue={initialData?.phone || ""}
          />

          {/* Address */}
          <FormField
            label="Address"
            name="address"
            type="textarea"
            placeholder="Office address..."
            helpText="Physical or mailing address"
            defaultValue={initialData?.address || ""}
          />

          {/* Practice Areas */}
          <div className="space-y-3">
            <Label>Practice Areas</Label>
            <p className="text-sm text-muted-foreground">
              Select or add practice areas (comma-separated for multiple custom areas)
            </p>
            
            {/* Checkboxes for predefined areas */}
            <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
              {PRACTICE_AREA_OPTIONS.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`area-${area}`}
                    name="practiceAreas"
                    value={area}
                    defaultChecked={practiceAreasArray.includes(area)}
                    className="h-4 w-4 rounded"
                  />
                  <label
                    htmlFor={`area-${area}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>

            {/* Custom practice areas input */}
            <FormField
              label="Custom Practice Areas"
              name="customPracticeAreas"
              type="text"
              placeholder="e.g., Maritime Law, Aviation Law (comma-separated)"
              helpText="Add custom practice areas not listed above"
              defaultValue=""
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional information..."
              defaultValue={initialData?.notes || ""}
            />
          </div>

          {/* Active Status */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive representatives will not appear in case assignments
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
                      <AlertDialogTitle>Delete Legal Representative?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete{" "}
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
              cancelHref="/dashboard/settings/legal-representatives"
              submitLabel={mode === "edit" ? "Update Representative" : "Create Representative"}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
