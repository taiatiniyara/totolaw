/**
 * No Organization Page
 * 
 * Shown when user is not a member of any organization
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building2 } from "lucide-react";

export default function NoOrganizationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Alert>
          <Building2 className="h-5 w-5" />
          <AlertTitle className="text-xl font-bold">
            No Organization Access
          </AlertTitle>
          <AlertDescription className="mt-2">
            You are not currently a member of any organization.
            <br />
            <br />
            To access the platform, you need to:
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Accept an invitation from an organization</li>
              <li>Contact your administrator to request access</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help getting started?</p>
          <Link
            href="/dashboard/support"
            className="text-primary hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
