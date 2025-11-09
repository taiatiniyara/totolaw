import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

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
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
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
  );
}
