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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, UserPlus, X } from "lucide-react";
import { assignRoleToUser, revokeRoleFromUser, getOrganisationRoles, getUserRolesForDisplay } from "@/app/dashboard/settings/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
}

interface UserRole {
  role: Role;
  userRole: {
    id: string;
    isActive: boolean;
  };
}

interface ManageUserRolesDialogProps {
  userId: string;
  userName: string;
  organisationId: string;
  variant?: "default" | "ghost" | "outline";
}

export function ManageUserRolesDialog({
  userId,
  userName,
  organisationId,
  variant = "outline",
}: ManageUserRolesDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [roleToRevoke, setRoleToRevoke] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [rolesResult, userRolesResult] = await Promise.all([
        getOrganisationRoles(),
        getUserRolesForDisplay(userId, organisationId),
      ]);

      if (rolesResult.success && rolesResult.roles) {
        setAvailableRoles(rolesResult.roles);
      }

      if (userRolesResult.success && userRolesResult.data) {
        setUserRoles(userRolesResult.data);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      loadData();
    } else {
      setSelectedRoles(new Set());
    }
  };

  const toggleRole = (roleId: string) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const handleAssignRoles = async () => {
    if (selectedRoles.size === 0) {
      toast.error("Please select at least one role");
      return;
    }

    setLoading(true);

    try {
      const results = await Promise.all(
        Array.from(selectedRoles).map((roleId) =>
          assignRoleToUser(userId, roleId)
        )
      );

      const errors = results.filter((r: any) => r.error);
      const successes = results.filter((r: any) => r.success);

      if (errors.length > 0) {
        toast.error(`Failed to assign ${errors.length} role(s)`);
      }

      if (successes.length > 0) {
        toast.success(`Assigned ${successes.length} role(s) successfully`);
        setSelectedRoles(new Set());
        await loadData();
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to assign roles");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeRole = async () => {
    if (!roleToRevoke) return;

    setLoading(true);
    try {
      const result = await revokeRoleFromUser(roleToRevoke.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Revoked role: ${roleToRevoke.name}`);
        setRevokeDialogOpen(false);
        setRoleToRevoke(null);
        await loadData();
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to revoke role");
    } finally {
      setLoading(false);
    }
  };

  const currentRoleIds = new Set(userRoles.map((ur) => ur.role.id));
  const availableToAssign = availableRoles.filter((r) => !currentRoleIds.has(r.id));

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant={variant} size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Manage Roles
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Assign or revoke roles for {userName}
            </DialogDescription>
          </DialogHeader>

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex-1 space-y-6 overflow-y-auto px-1">
              {/* Current Roles */}
              <div>
                <Label className="text-base font-semibold">Current Roles</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Roles currently assigned to this user
                </p>

                {userRoles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                    No roles assigned yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userRoles.map((ur) => (
                      <div
                        key={ur.userRole.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{ur.role.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {ur.role.slug}
                            </Badge>
                            {ur.role.isSystem && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </div>
                          {ur.role.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {ur.role.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRoleToRevoke({
                              id: ur.userRole.id,
                              name: ur.role.name,
                            });
                            setRevokeDialogOpen(true);
                          }}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign New Roles */}
              {availableToAssign.length > 0 && (
                <div>
                  <Label className="text-base font-semibold">Assign New Roles</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select roles to assign to this user
                  </p>

                  <div className="border rounded-lg">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2 p-3">
                        {availableToAssign.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                          >
                            <Checkbox
                              checked={selectedRoles.has(role.id)}
                              onCheckedChange={() => toggleRole(role.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{role.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {role.slug}
                                </Badge>
                                {role.isSystem && (
                                  <Badge variant="outline" className="text-xs">
                                    System
                                  </Badge>
                                )}
                              </div>
                              {role.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {role.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {selectedRoles.size > 0 && (
                    <div className="mt-3">
                      <Button
                        onClick={handleAssignRoles}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign {selectedRoles.size} Role(s)
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {availableToAssign.length === 0 && userRoles.length > 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                  All available roles have been assigned
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the role "{roleToRevoke?.name}" from{" "}
              {userName}? This will remove all associated permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeRole}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
