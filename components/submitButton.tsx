import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
// no local React hooks required

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  text: string;
  loadingText?: string;
}

export default function SubmitButton({ 
  text, 
  loadingText, 
  className,
  ...props 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const announce = pending ? loadingText || "Loading" : null;

  return (
    <>
      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className={className}
        {...props}
      >
        {pending ? (
          <>
            <Spinner className="mr-2" />
            {loadingText || "Loading..."}
          </>
        ) : (
          text
        )}
      </Button>

      {/* Screen reader live region */}
      <span aria-live="polite" className="sr-only">
        {announce}
      </span>
    </>
  );
}
