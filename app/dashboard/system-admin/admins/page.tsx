"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Shield, Plus, UserX, UserCheck, Mail, Calendar } from "lucide-react";
import {
  getSystemAdmins,
  addNewSystemAdmin,
  deactivateSystemAdmin,
  activateSystemAdmin,
} from "../actions";
import { toast } from "sonner";

export default function ManageSystemAdminsClient() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    notes: "",
  });

  const loadAdmins = async () => {
    setLoading(true);
    const result = await getSystemAdmins();
    if (result.success) {
      setAdmins(result.admins);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!formData.email || !formData.name) {
      toast.error("Email and name are required");
      return;
    }

    const result = await addNewSystemAdmin(
      formData.email,
      formData.name,
      formData.notes || undefined
    );

    if (result.success) {
      toast.success("System admin added successfully");
      setDialogOpen(false);
      setFormData({ email: "", name: "", notes: "" });
      loadAdmins();
    } else {
      toast.error(result.error || "Failed to add system admin");
    }
  };

  const handleDeactivate = async (adminId: string) => {
    const result = await deactivateSystemAdmin(adminId);
    if (result.success) {
      toast.success("System admin deactivated");
      loadAdmins();
    } else {
      toast.error(result.error || "Failed to deactivate");
    }
  };

  const handleActivate = async (adminId: string) => {
    const result = await activateSystemAdmin(adminId);
    if (result.success) {
      toast.success("System admin reactivated");
      loadAdmins();
    } else {
      toast.error(result.error || "Failed to reactivate");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h1" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            System Administrators
          </Heading>
          <p className="text-muted-foreground mt-1">
            Manage super admin team members
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add System Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add System Administrator</DialogTitle>
              <DialogDescription>
                Add a new team member who can manage the entire system. They will
                be automatically elevated to super admin when they log in.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information about this admin"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>Add Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Admins */}
      <Card>
        <CardHeader>
          <CardTitle>Active Administrators ({admins.filter(a => a.isSuperAdmin).length})</CardTitle>
          <CardDescription>
            System admins with full platform access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins
              .filter((admin) => admin.isSuperAdmin)
              .map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="font-semibold">{admin.name || "Unnamed"}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </div>
                      {admin.notes && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {admin.notes}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Added: {new Date(admin.addedAt).toLocaleDateString()}
                        {admin.lastLogin && (
                          <span>
                            • Last login:{" "}
                            {new Date(admin.lastLogin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deactivate System Admin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will revoke super admin privileges from{" "}
                            <strong>{admin.email}</strong>. They will no longer have
                            platform-wide access. You can reactivate them later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeactivate(admin.id)}
                          >
                            Deactivate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            {admins.filter((a) => a.isSuperAdmin).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active system administrators
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inactive Admins */}
      {admins.filter((a) => !a.isSuperAdmin).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive Administrators ({admins.filter(a => !a.isSuperAdmin).length})</CardTitle>
            <CardDescription>
              Deactivated system admins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {admins
                .filter((admin) => !admin.isSuperAdmin)
                .map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <Shield className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="font-semibold">{admin.name || "Unnamed"}</div>
                        <div className="text-sm text-muted-foreground">
                          {admin.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivate(admin.id)}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Reactivate
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
