"use client";

/**
 * Edit Organization Form
 * 
 * Client-side form for editing existing organizations
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
import { updateOrganization } from "../../../actions";

interface Organization {
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

interface EditOrganizationFormProps {
  organization: Organization;
  organizations: Organization[];
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

export function EditOrganizationForm({ organization, organizations }: EditOrganizationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: organization.name,
    type: organization.type,
    description: organization.description || "",
    parentId: organization.parentId || "",
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
      if (formData.parentId === organization.id) {
        setError("An organization cannot be its own parent");
        setIsSubmitting(false);
        return;
      }

      const result = await updateOrganization(organization.id, {
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
        router.push("/dashboard/system-admin/organizations");
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
          Organization updated successfully! Redirecting...
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

      {/* Organization Code (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="code">Organization Code</Label>
        <Input
          id="code"
          value={organization.code}
          disabled
          className="font-mono bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Organization code cannot be changed after creation
        </p>
      </div>

      {/* Organization Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Organization Name <span className="text-destructive">*</span>
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
          The full legal name of the organization
        </p>
      </div>

      {/* Organization Type */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Organization Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select organization type" />
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
          The category of this legal organization
        </p>
      </div>

      {/* Parent Organization (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="parentId">Parent Organization (Optional)</Label>
        <div className="space-y-2">
          <Select
            value={formData.parentId || undefined}
            onValueChange={(value) => setFormData({ ...formData, parentId: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger id="parentId">
              <SelectValue placeholder="None (top-level organization)" />
            </SelectTrigger>
            <SelectContent>
              {organizations
                .filter((org) => org.id !== organization.id) // Exclude self
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
          If this organization is part of a larger entity, select the parent
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter a brief description of the organization..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={isSubmitting}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">
          Additional information about the organization&apos;s purpose and jurisdiction
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
              Updating Organization...
            </>
          ) : (
            "Update Organization"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push("/dashboard/system-admin/organizations")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
