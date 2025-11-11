"use client";

/**
 * Create Organization Form
 * 
 * Client-side form for creating new organizations
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
import { createOrganization } from "../../actions";

interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
}

interface CreateOrganizationFormProps {
  organizations: Organization[];
}

const ORGANIZATION_TYPES = [
  { value: "court", label: "Court" },
  { value: "tribunal", label: "Tribunal" },
  { value: "commission", label: "Commission" },
  { value: "registry", label: "Registry" },
  { value: "department", label: "Department" },
  { value: "other", label: "Other" },
];

export function CreateOrganizationForm({ organizations }: CreateOrganizationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    description: "",
    parentId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.type) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate code format (alphanumeric, no spaces)
      if (!/^[A-Z0-9_-]+$/.test(formData.code.toUpperCase())) {
        setError("Organization code must contain only letters, numbers, hyphens, and underscores");
        setIsSubmitting(false);
        return;
      }

      // Check if code already exists
      const codeExists = organizations.some(
        (org) => org.code.toUpperCase() === formData.code.toUpperCase()
      );
      if (codeExists) {
        setError("An organization with this code already exists");
        setIsSubmitting(false);
        return;
      }

      const result = await createOrganization({
        name: formData.name,
        code: formData.code,
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
        router.push("/dashboard/system-admin");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Auto-format code to uppercase and replace spaces with hyphens
    const formatted = value.toUpperCase().replace(/\s+/g, "-");
    setFormData({ ...formData, code: formatted });
  };

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Organization created successfully! Redirecting...
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

      {/* Organization Code */}
      <div className="space-y-2">
        <Label htmlFor="code">
          Organization Code <span className="text-destructive">*</span>
        </Label>
        <Input
          id="code"
          placeholder="e.g., FIJI-HIGH-COURT"
          value={formData.code}
          onChange={(e) => handleCodeChange(e.target.value)}
          required
          disabled={isSubmitting}
          className="font-mono"
        />
        <p className="text-sm text-muted-foreground">
          A unique identifier (will be converted to uppercase, spaces to hyphens)
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
        <Select
          value={formData.parentId}
          onValueChange={(value) => setFormData({ ...formData, parentId: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger id="parentId">
            <SelectValue placeholder="None (top-level organization)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None (top-level organization)</SelectItem>
            {organizations
              .filter((org) => org.id !== formData.parentId)
              .map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name} ({org.code})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
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
              Creating Organization...
            </>
          ) : (
            "Create Organization"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push("/dashboard/system-admin")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
