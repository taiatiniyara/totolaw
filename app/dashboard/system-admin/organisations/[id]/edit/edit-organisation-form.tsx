"use client";

/**
 * Edit Organisation Form
 * 
 * Client-side form for editing existing organisations
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { updateOrganisation } from "../../../actions";

interface Organisation {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EditOrganisationFormProps {
  organisation: Organisation;
  organisations: Organisation[];
}

const ORGANIZATION_TYPES = [
  { value: "country", label: "Country" },
  { value: "court", label: "Court" },
  { value: "tribunal", label: "Tribunal" },
  { value: "commission", label: "Commission" },
  { value: "registry", label: "Registry" },
  { value: "department", label: "Department" },
  { value: "other", label: "Other" },
];

export function EditOrganisationForm({ organisation, organisations }: EditOrganisationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: organisation.name,
    type: organisation.type,
    description: organisation.description || "",
    parentId: organisation.parentId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.type) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Check for circular parent relationship
      if (formData.parentId === organisation.id) {
        setError("An organisation cannot be its own parent");
        setIsSubmitting(false);
        return;
      }

      const result = await updateOrganisation(organisation.id, {
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        parentId: formData.parentId || undefined,
      });

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard/system-admin/organisations");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Organisation updated successfully! Redirecting...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Organisation Code (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="code">Organisation Code</Label>
        <Input
          id="code"
          value={organisation.code}
          disabled
          className="font-mono bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Organisation code cannot be changed after creation
        </p>
      </div>

      {/* Organisation Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Organisation Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Fiji High Court"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          The full legal name of the organisation
        </p>
      </div>

      {/* Organisation Type */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Organisation Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select organisation type" />
          </SelectTrigger>
          <SelectContent>
            {ORGANIZATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          The category of this legal organisation
        </p>
      </div>

      {/* Parent Organisation (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="parentId">Parent Organisation (Optional)</Label>
        <div className="space-y-2">
          <Select
            value={formData.parentId || undefined}
            onValueChange={(value) => setFormData({ ...formData, parentId: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger id="parentId">
              <SelectValue placeholder="None (top-level organisation)" />
            </SelectTrigger>
            <SelectContent>
              {organisations
                .filter((org) => org.id !== organisation.id) // Exclude self
                .map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name} ({org.code})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formData.parentId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFormData({ ...formData, parentId: "" })}
              disabled={isSubmitting}
            >
              Clear selection
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          If this organisation is part of a larger entity, select the parent
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter a brief description of the organisation..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={isSubmitting}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">
          Additional information about the organisation&apos;s purpose and jurisdiction
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Organisation...
            </>
          ) : (
            "Update Organisation"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push("/dashboard/system-admin/organisations")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
