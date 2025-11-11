"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { createRole } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Permission {
  id: string;
  resource: string;
  action: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
}

interface CreateRoleDialogProps {
  permissions: Permission[];
  permissionsByResource: Record<string, Permission[]>;
  variant?: "default" | "outline";
}

export function CreateRoleDialog({ 
  permissions, 
  permissionsByResource,
  variant = "outline" 
}: CreateRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    const autoSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleResource = (resource: string) => {
    const resourcePerms = permissionsByResource[resource];
    const allSelected = resourcePerms.every(p => selectedPermissions.has(p.id));
    
    const newSelected = new Set(selectedPermissions);
    resourcePerms.forEach(perm => {
      if (allSelected) {
        newSelected.delete(perm.id);
      } else {
        newSelected.add(perm.id);
      }
    });
    setSelectedPermissions(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !slug.trim()) {
      toast.error("Please provide role name and slug");
      return;
    }

    setLoading(true);

    try {
      const result = await createRole({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        permissionIds: Array.from(selectedPermissions),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role created successfully");
        setOpen(false);
        setName("");
        setSlug("");
        setDescription("");
        setSelectedPermissions(new Set());
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Create a custom role with specific permissions for your organisation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto px-1">
            {/* Role Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Case Manager"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="e.g., case-manager"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  pattern="[a-z0-9-]+"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and responsibilities of this role"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Permissions Selection */}
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  Select permissions for this role
                </p>
                <Badge variant="secondary">
                  {selectedPermissions.size} selected
                </Badge>
              </div>

              <div className="border rounded-lg">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(permissionsByResource).map(([resource, resourcePerms]) => {
                    const selectedCount = resourcePerms.filter(p => 
                      selectedPermissions.has(p.id)
                    ).length;
                    const allSelected = selectedCount === resourcePerms.length;

                    return (
                      <AccordionItem key={resource} value={resource}>
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center gap-3 flex-1">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={() => toggleResource(resource)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="font-semibold capitalize">{resource}</span>
                            <Badge variant="outline">
                              {selectedCount}/{resourcePerms.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 px-4 pb-4">
                            {resourcePerms.map((perm) => (
                              <div
                                key={perm.id}
                                className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                              >
                                <Checkbox
                                  checked={selectedPermissions.has(perm.id)}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                                      {perm.slug}
                                    </code>
                                    <Badge variant="outline" className="text-xs">
                                      {perm.action}
                                    </Badge>
                                  </div>
                                  {perm.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {perm.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
