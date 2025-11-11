"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, MoreVertical, Edit, Trash2, Shield, Eye, Loader2 } from "lucide-react";
import { getRolePermissions, deleteRole, getUsersWithRole } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditRoleDialog } from "./edit-role-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Role {
  id: string;
  organisationId: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Permission {
  id: string;
  resource: string;
  action: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
}

interface RoleCardProps {
  role: Role;
  canManage: boolean;
  permissions: Permission[];
  permissionsByResource: Record<string, Permission[]>;
}

export function RoleCard({ role, canManage, permissions, permissionsByResource }: RoleCardProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const router = useRouter();

  const loadRoleDetails = async () => {
    setLoading(true);
    try {
      const [permsResult, usersResult] = await Promise.all([
        getRolePermissions(role.id),
        getUsersWithRole(role.id),
      ]);

      if (permsResult.success && permsResult.permissions) {
        setRolePermissions(permsResult.permissions);
      }

      if (usersResult.success && usersResult.assignments) {
        setUserCount(usersResult.assignments.length);
      }
    } catch (error) {
      console.error("Error loading role details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewOpen) {
      loadRoleDetails();
    }
  }, [viewOpen]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteRole(role.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role deleted successfully");
        setDeleteOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by resource
  const permissionsByRes = rolePermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {role.isSystem ? (
                  <Shield className="h-5 w-5 text-primary" />
                ) : (
                  <Users className="h-5 w-5 text-muted-foreground" />
                )}
                {role.name}
              </CardTitle>
              <CardDescription className="mt-1">
                <code className="text-xs bg-muted px-2 py-0.5 rounded">
                  {role.slug}
                </code>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {role.isSystem && (
                <Badge variant="secondary">System</Badge>
              )}
              {canManage && !role.isSystem && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewOpen(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteOpen(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!canManage && (
                <Button variant="ghost" size="icon" onClick={() => setViewOpen(true)}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {role.description && (
            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Click to view permissions</span>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {role.isSystem ? (
                <Shield className="h-5 w-5 text-primary" />
              ) : (
                <Users className="h-5 w-5" />
              )}
              {role.name}
            </DialogTitle>
            <DialogDescription>
              {role.description || "No description provided"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Role Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <code className="ml-2 bg-muted px-2 py-0.5 rounded">
                  {role.slug}
                </code>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary" className="ml-2">
                  {role.isSystem ? "System" : "Custom"}
                </Badge>
              </div>
              {userCount !== null && (
                <div>
                  <span className="text-muted-foreground">Assigned Users:</span>
                  <span className="ml-2 font-semibold">{userCount}</span>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissions
              </h4>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : rolePermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No permissions assigned to this role
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(permissionsByRes).map(([resource, perms]) => (
                    <div key={resource} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium capitalize">{resource}</h5>
                        <Badge variant="outline">{perms.length}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {perms.map((perm) => (
                          <Badge key={perm.id} variant="secondary">
                            {perm.action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editOpen && (
        <EditRoleDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          role={role}
          currentPermissions={rolePermissions}
          allPermissions={permissions}
          permissionsByResource={permissionsByResource}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{role.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
