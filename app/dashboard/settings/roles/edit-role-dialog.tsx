"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { updateRole } from "../actions";
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

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  currentPermissions: Permission[];
  allPermissions: Permission[];
  permissionsByResource: Record<string, Permission[]>;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  currentPermissions,
  allPermissions,
  permissionsByResource,
}: EditRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(role.name);
  const [slug, setSlug] = useState(role.slug);
  const [description, setDescription] = useState(role.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(currentPermissions.map(p => p.id))
  );
  const router = useRouter();

  // Reset form when role changes
  useEffect(() => {
    setName(role.name);
    setSlug(role.slug);
    setDescription(role.description || "");
    setSelectedPermissions(new Set(currentPermissions.map(p => p.id)));
  }, [role, currentPermissions]);

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
      const result = await updateRole(role.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        permissionIds: Array.from(selectedPermissions),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role updated successfully");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role details and permissions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto px-1">
            {/* Role Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Role Name *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  pattern="[a-z0-9-]+"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
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
                  Update permissions for this role
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
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
