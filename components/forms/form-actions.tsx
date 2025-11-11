import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface FormActionsProps {
  cancelHref: string;
  cancelLabel?: string;
  submitLabel?: string;
  submitDisabled?: boolean;
  isLoading?: boolean;
}

export function FormActions({
  cancelHref,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  submitDisabled = false,
  isLoading = false,
}: FormActionsProps) {
  return (
    <div className="flex gap-3 justify-end">
      <Button type="button" variant="outline" asChild>
        <Link href={cancelHref}>{cancelLabel}</Link>
      </Button>
      <Button type="submit" disabled={submitDisabled || isLoading}>
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}
