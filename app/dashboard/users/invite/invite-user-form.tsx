"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, UserPlus, Send, Loader2, Info, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { inviteUser } from "../actions";
import { createSystemAdminInvitation } from "@/app/dashboard/system-admin/actions";
import { toast } from "sonner";

interface InviteUserFormProps {
  roles: { id: string; name: string; slug: string }[];
  organisations: any[];
  permissions: any[];
  isSuperAdmin: boolean;
  currentOrganisationId: string;
}

export default function InviteUserForm({
  roles,
  organisations,
  permissions,
  isSuperAdmin,
  currentOrganisationId,
}: InviteUserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedOrganisationId, setSelectedOrganisationId] = useState(
    currentOrganisationId !== "*" ? currentOrganisationId : ""
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [showPermissions, setShowPermissions] = useState(false);

  // Filter roles by selected organisation
  const filteredRoles = selectedOrganisationId
    ? roles.filter((r: any) => 
        isSuperAdmin 
          ? r.organisationId === selectedOrganisationId || !r.organisationId
          : true
      )
    : roles;

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (isSuperAdmin && !selectedOrganisationId) {
      toast.error("Please select an organisation");
      return;
    }

    if (selectedRoleIds.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (isSuperAdmin) {
        // Use system admin invitation
        result = await createSystemAdminInvitation(
          email,
          selectedOrganisationId,
          selectedRoleIds,
          selectedPermissionIds
        );
      } else {
        // Use regular invitation
        result = await inviteUser(
          email,
          selectedRoleIds,
          selectedPermissionIds
        );
      }

      if (result.success) {
        toast.success("Invitation sent successfully!");
        router.push("/dashboard/users");
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by resource
  const permissionsByResource = permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <Heading as="h1" className="flex items-center gap-2">
            <UserPlus className="h-7 w-7" />
            Invite User
          </Heading>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? "Invite a user to any organisation with custom roles and permissions"
              : "Add a new member to your organisation"}
          </p>
        </div>
      </div>

      {/* Super Admin Info */}
      {isSuperAdmin && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>System Admin Mode:</strong> You can invite users to any organisation 
            and assign any combination of roles and permissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Invitation Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              Enter the email address and select roles for the new user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                The user will receive an invitation email with a link to join
              </p>
            </div>

            {/* Organisation Selection (Super Admin Only) */}
            {isSuperAdmin && organisations.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="organisation">Organisation *</Label>
                <Select
                  value={selectedOrganisationId}
                  onValueChange={setSelectedOrganisationId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} ({org.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Roles * {selectedRoleIds.length > 0 && `(${selectedRoleIds.length} selected)`}</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select one or more roles to assign to the user
              </p>
              
              {filteredRoles.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {isSuperAdmin && !selectedOrganisationId
                      ? "Please select an organisation first"
                      : "No roles available for this organisation"}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredRoles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleRoleToggle(role.id)}
                    >
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoleIds.includes(role.id)}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`role-${role.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {role.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {role.slug}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Permission Selection (Super Admin Only) */}
            {isSuperAdmin && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Additional Permissions (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPermissions(!showPermissions)}
                  >
                    {showPermissions ? "Hide" : "Show"} Permissions
                  </Button>
                </div>
                
                {showPermissions && (
                  <>
                    {selectedPermissionIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-accent/50 rounded-lg">
                        <span className="text-sm font-medium">Selected:</span>
                        {selectedPermissionIds.map((id) => {
                          const perm = permissions.find((p) => p.id === id);
                          return perm ? (
                            <Badge key={id} variant="secondary">
                              {perm.slug}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      Grant specific permissions beyond role permissions
                    </p>

                    <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                      {Object.keys(permissionsByResource)
                        .sort()
                        .map((resource) => (
                          <div key={resource} className="space-y-2">
                            <h4 className="font-semibold text-sm capitalize">
                              {resource}
                            </h4>
                            <div className="grid gap-2 md:grid-cols-2">
                              {permissionsByResource[resource].map((perm: any) => (
                                <div
                                  key={perm.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`perm-${perm.id}`}
                                    checked={selectedPermissionIds.includes(perm.id)}
                                    onCheckedChange={() => handlePermissionToggle(perm.id)}
                                  />
                                  <label
                                    htmlFor={`perm-${perm.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {perm.slug}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
            disabled={loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
