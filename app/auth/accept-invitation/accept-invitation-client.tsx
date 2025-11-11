"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heading } from "@/components/ui/heading";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  UserPlus, 
  Building2,
  Mail,
  Shield
} from "lucide-react";
import { acceptInvitationAction, getInvitationDetails } from "./actions";
import { toast } from "sonner";

export default function AcceptInvitationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadInvitation = async () => {
      if (!token) {
        setError("Invalid invitation link");
        setLoading(false);
        return;
      }

      const result = await getInvitationDetails(token);

      if (!result.success || !result.invitation) {
        setError(result.error || "Invalid or expired invitation");
        setLoading(false);
        return;
      }

      if (result.invitation.expired || result.invitation.status !== "pending") {
        setError("This invitation has expired or already been used");
        setLoading(false);
        return;
      }

      setInvitation(result.invitation);
      setLoading(false);
    };

    loadInvitation();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!token) {
      toast.error("Invalid invitation");
      return;
    }

    setAccepting(true);

    try {
      const result = await acceptInvitationAction(token, name);

      if (result.success) {
        toast.success("Invitation accepted! You can now log in.");
        // Redirect to login with email pre-filled
        router.push(`/auth/login?email=${encodeURIComponent(invitation.email)}`);
      } else {
        toast.error(result.error || "Failed to accept invitation");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Verifying invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <CardTitle>Invalid Invitation</CardTitle>
                <CardDescription>Unable to process this invitation</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>You're Invited!</CardTitle>
              <CardDescription>
                Complete your account setup to join the organisation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
            <Heading as="h3" className="text-base">Invitation Details</Heading>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Organisation</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.organisation?.name || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{invitation.email}</p>
                </div>
              </div>

              {invitation.inviter && (
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Invited by</p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.inviter.name || invitation.inviter.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Setup Form */}
          <form onSubmit={handleAccept} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={accepting}
              />
              <p className="text-xs text-muted-foreground">
                This will be visible to other members of the organisation
              </p>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                By accepting this invitation, you'll be able to log in using a magic link 
                sent to your email address.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/auth/login")}
                disabled={accepting}
                className="flex-1"
              >
                Decline
              </Button>
              <Button type="submit" disabled={accepting} className="flex-1">
                {accepting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
