"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
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
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2,
  ArrowLeft,
  UserPlus,
  Building2,
  Calendar
} from "lucide-react";
import { revokeUserInvitation } from "../actions";
import { toast } from "sonner";

interface InvitationsClientProps {
  invitations: any[];
  isSuperAdmin: boolean;
}

function formatDistanceToNow(date: Date): string {
  const now = new Date().getTime();
  const target = date.getTime();
  const diff = now - target;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function InvitationsClient({ invitations: initialInvitations, isSuperAdmin }: InvitationsClientProps) {
  const [invitations, setInvitations] = useState(initialInvitations);

  const handleRevoke = async (invitationId: string, email: string) => {
    const result = await revokeUserInvitation(invitationId);

    if (result.success) {
      toast.success(`Invitation to ${email} has been revoked`);
      setInvitations(invitations.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: "revoked" }
          : inv
      ));
    } else {
      toast.error(result.error || "Failed to revoke invitation");
    }
  };

  const getStatusBadge = (status: string, expiresAt: Date) => {
    const now = new Date();
    const expired = new Date(expiresAt) < now;

    if (expired && status === "pending") {
      return <Badge variant="destructive">Expired</Badge>;
    }

    switch (status) {
      case "pending":
        return <Badge variant="default">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="border-green-500 text-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Accepted
        </Badge>;
      case "revoked":
        return <Badge variant="outline" className="border-red-500 text-red-600">
          <XCircle className="mr-1 h-3 w-3" />
          Revoked
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingInvitations = invitations.filter(inv => {
    const now = new Date();
    const expired = new Date(inv.expiresAt) < now;
    return inv.status === "pending" && !expired;
  });

  const expiredInvitations = invitations.filter(inv => {
    const now = new Date();
    const expired = new Date(inv.expiresAt) < now;
    return inv.status === "pending" && expired;
  });

  const acceptedInvitations = invitations.filter(inv => inv.status === "accepted");
  const revokedInvitations = invitations.filter(inv => inv.status === "revoked");

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
              <Mail className="h-7 w-7" />
              User Invitations
            </Heading>
            <p className="text-muted-foreground">
              Manage pending and completed user invitations
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingInvitations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-3xl">{acceptedInvitations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl">{expiredInvitations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Revoked</CardDescription>
            <CardTitle className="text-3xl">{revokedInvitations.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations ({pendingInvitations.length})</CardTitle>
            <CardDescription>
              Invitations waiting to be accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Mail className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">{invitation.email}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        {isSuperAdmin && invitation.organisationName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {invitation.organisationName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Invited {formatDistanceToNow(new Date(invitation.createdAt))}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {formatDistanceToNow(new Date(invitation.expiresAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(invitation.status, invitation.expiresAt)}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Revoke
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke Invitation?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will cancel the invitation to <strong>{invitation.email}</strong>. 
                            They will no longer be able to use this invitation link.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevoke(invitation.id, invitation.email)}
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accepted Invitations */}
      {acceptedInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accepted Invitations ({acceptedInvitations.length})</CardTitle>
            <CardDescription>
              Users who have joined the organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acceptedInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-75"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <div className="font-semibold">{invitation.email}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        {isSuperAdmin && invitation.organisationName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {invitation.organisationName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Accepted {formatDistanceToNow(new Date(invitation.acceptedAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(invitation.status, invitation.expiresAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Invitations */}
      {expiredInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expired Invitations ({expiredInvitations.length})</CardTitle>
            <CardDescription>
              Invitations that have passed their expiry date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-semibold">{invitation.email}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        {isSuperAdmin && invitation.organisationName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {invitation.organisationName}
                          </span>
                        )}
                        <span>Expired {formatDistanceToNow(new Date(invitation.expiresAt))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(invitation.status, invitation.expiresAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {invitations.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <Heading as="h3" className="mb-2">No Invitations</Heading>
              <p className="text-muted-foreground mb-4">
                You haven't sent any invitations yet
              </p>
              <Button asChild>
                <Link href="/dashboard/users/invite">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Your First User
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
