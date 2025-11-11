"use client";

/**
 * Organization Status Toggle Component
 * 
 * Toggle button to activate/deactivate organizations
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Loader2, Power } from "lucide-react";
import { updateOrganizationStatus } from "../actions";

interface OrganizationStatusToggleProps {
  organizationId: string;
  currentStatus: boolean;
}

export function OrganizationStatusToggle({
  organizationId,
  currentStatus,
}: OrganizationStatusToggleProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateOrganizationStatus(organizationId, !currentStatus);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Failed to update organization status");
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Power className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentStatus ? "Deactivate" : "Activate"} Organization?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentStatus ? (
              <>
                This will deactivate the organization. Users will no longer be able to
                access this organization&apos;s data until it is reactivated.
                <br />
                <br />
                <strong>This action does not delete any data.</strong>
              </>
            ) : (
              <>
                This will reactivate the organization. Users will be able to access
                this organization&apos;s data again.
              </>
            )}
          </AlertDialogDescription>
          {error && (
            <div className="text-sm text-destructive mt-2">{error}</div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggle}
            className={currentStatus ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {currentStatus ? "Deactivate" : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
