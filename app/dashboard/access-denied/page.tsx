/**
 * Access Denied Page
 * 
 * Shown when user tries to access a resource without proper permissions
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-xl font-bold">Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You don't have permission to access this page or resource.
            <br />
            <br />
            If you believe this is an error, please contact your system
            administrator to request the necessary permissions.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/dashboard/cases">View Cases</Link>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help?</p>
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
