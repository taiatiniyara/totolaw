"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { approveJoinRequestAction, rejectJoinRequestAction } from "./actions";
import { toast } from "sonner";

interface JoinRequestsClientProps {
  requests: any[];
  roles: any[];
  isSuperAdmin: boolean;
}

export default function JoinRequestsClient({
  requests: initialRequests,
  roles,
  isSuperAdmin,
}: JoinRequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const approvedRequests = requests.filter((req) => req.status === "approved");
  const rejectedRequests = requests.filter((req) => req.status === "rejected");

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setLoading(true);

    try {
      const result = await approveJoinRequestAction(
        selectedRequest.id,
        selectedRoleIds
      );

      if (result.success) {
        toast.success(`Request from ${selectedRequest.userName} approved`);
        setRequests(
          requests.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "approved", reviewedAt: new Date() }
              : req
          )
        );
        setApproveDialogOpen(false);
        setSelectedRequest(null);
        setSelectedRoleIds([]);
      } else {
        toast.error(result.error || "Failed to approve request");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setLoading(true);

    try {
      const result = await rejectJoinRequestAction(
        selectedRequest.id,
        rejectionReason
      );

      if (result.success) {
        toast.success(`Request from ${selectedRequest.userName} rejected`);
        setRequests(
          requests.map((req) =>
            req.id === selectedRequest.id
              ? {
                  ...req,
                  status: "rejected",
                  reviewedAt: new Date(),
                  rejectionReason,
                }
              : req
          )
        );
        setRejectDialogOpen(false);
        setSelectedRequest(null);
        setRejectionReason("");
      } else {
        toast.error(result.error || "Failed to reject request");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const openApproveDialog = (request: any) => {
    setSelectedRequest(request);
    setSelectedRoleIds([]);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <Heading as="h1" className="flex items-center gap-2">
              <UserPlus className="h-7 w-7" />
              Join Requests
            </Heading>
            <p className="text-muted-foreground">
              Review and approve user requests to join your organisation
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingRequests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl">{approvedRequests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl">{rejectedRequests.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
            <CardDescription>
              New requests awaiting your review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <UserPlus className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">{request.userName || "Unnamed"}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {request.userEmail}
                        </span>
                        {isSuperAdmin && request.organisationName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {request.organisationName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {request.message && (
                        <div className="mt-2 p-2 bg-accent/50 rounded text-sm">
                          <MessageSquare className="h-3 w-3 inline mr-1" />
                          {request.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRejectDialog(request)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => openApproveDialog(request)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Requests */}
      {approvedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Approved Requests ({approvedRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvedRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-75"
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold">{request.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        Approved on {new Date(request.reviewedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    Approved
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {pendingRequests.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <UserPlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <Heading as="h3" className="mb-2">No Pending Requests</Heading>
              <p className="text-muted-foreground">
                There are no join requests waiting for review
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Add {selectedRequest?.userName} to your organisation and assign roles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm">
                <strong>User:</strong> {selectedRequest?.userName}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {selectedRequest?.userEmail}
              </p>
              {selectedRequest?.message && (
                <p className="text-sm mt-2">
                  <strong>Message:</strong> {selectedRequest.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Assign Roles (Optional)</Label>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center space-x-3 border rounded-lg p-3"
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <label
                      htmlFor={`role-${role.id}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {role.name}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                You can assign roles later from the user management page
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will decline {selectedRequest?.userName}'s request to join your
              organisation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Explain why the request is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
