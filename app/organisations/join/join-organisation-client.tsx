"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ArrowLeft,
  Building2,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Search,
} from "lucide-react";
import { requestToJoinOrganisation, cancelMyJoinRequest } from "@/app/dashboard/users/requests/actions";
import { toast } from "sonner";

interface JoinOrganisationClientProps {
  organisations: any[];
  myRequests: any[];
  userOrganisations: any[];
}

export default function JoinOrganisationClient({
  organisations,
  myRequests: initialRequests,
  userOrganisations,
}: JoinOrganisationClientProps) {
  const [myRequests, setMyRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const userOrgIds = userOrganisations.map((org) => org.organisationId);

  // Filter organisations
  const filteredOrgs = organisations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrganisationStatus = (orgId: string) => {
    if (userOrgIds.includes(orgId)) {
      return { type: "member", label: "Member", variant: "default" as const };
    }
    
    const request = myRequests.find((req) => req.organisationId === orgId);
    if (request) {
      if (request.status === "pending") {
        return { type: "pending", label: "Pending", variant: "secondary" as const };
      }
      if (request.status === "rejected") {
        return { type: "rejected", label: "Rejected", variant: "destructive" as const };
      }
    }
    
    return { type: "available", label: "Request to Join", variant: "outline" as const };
  };

  const handleRequestJoin = async () => {
    if (!selectedOrg) return;

    setLoading(true);

    try {
      const result = await requestToJoinOrganisation(selectedOrg.id, message);

      if (result.success) {
        toast.success(`Request sent to ${selectedOrg.name}`);
        setMyRequests([...myRequests, result.data]);
        setDialogOpen(false);
        setMessage("");
        setSelectedOrg(null);
      } else {
        toast.error(result.error || "Failed to send request");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string, orgName: string) => {
    const result = await cancelMyJoinRequest(requestId);

    if (result.success) {
      toast.success(`Request to ${orgName} cancelled`);
      setMyRequests(myRequests.filter((req) => req.id !== requestId));
    } else {
      toast.error(result.error || "Failed to cancel request");
    }
  };

  const openRequestDialog = (org: any) => {
    setSelectedOrg(org);
    setMessage("");
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <Heading as="h1" className="flex items-center gap-2">
                <Building2 className="h-7 w-7" />
                Join an Organisation
              </Heading>
              <p className="text-muted-foreground">
                Browse organisations and request to join
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search organisations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* My Pending Requests */}
        {myRequests.filter((req) => req.status === "pending").length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>
                Waiting for admin approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myRequests
                  .filter((req) => req.status === "pending")
                  .map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div>
                          <div className="font-semibold">
                            {request.organisationName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requested on{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCancelRequest(request.id, request.organisationName)
                        }
                      >
                        Cancel Request
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Organisations List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Organisations</CardTitle>
            <CardDescription>
              Select an organisation to request access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrgs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No organisations found</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrgs.map((org) => {
                  const status = getOrganisationStatus(org.id);
                  return (
                    <Card key={org.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{org.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {org.code}
                            </CardDescription>
                          </div>
                          <Badge variant={status.variant} className="ml-2">
                            {status.type === "member" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {status.type === "pending" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {status.type === "rejected" && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {org.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {org.description}
                          </p>
                        )}
                        
                        {status.type === "available" && (
                          <Button
                            className="w-full"
                            onClick={() => openRequestDialog(org)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Request to Join
                          </Button>
                        )}
                        
                        {status.type === "rejected" && (
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => openRequestDialog(org)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Request Again
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request to Join {selectedOrg?.name}</DialogTitle>
              <DialogDescription>
                Send a request to the organisation administrators
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Tell the admins why you want to join..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Your message will be visible to organisation administrators
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestJoin} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
