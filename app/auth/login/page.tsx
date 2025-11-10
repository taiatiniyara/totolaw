"use client";

import { useEffect, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendMagicLinkAction, type ActionState } from "../actions";
import SubmitButton from "@/components/submitButton";
import Logo from "@/components/logo";

const initialState: ActionState = {
  success: undefined,
  message: undefined,
  error: undefined,
};

export default function LoginPage() {
  const [state, formAction] = useActionState(sendMagicLinkAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Magic link sent!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo width={160} height={55} />
          </div>
          <CardDescription className="text-center">
            Enter your email to receive a secure magic login link
            <br />
            <span className="text-xs mt-1 block">
              No passwords required - we'll send you a one-time login link
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-sm text-green-800">
                  We've sent a magic link to <strong>{state.email}</strong>
                </p>
                <p className="mt-2 text-xs text-green-700">
                  Click the link in your email to log in.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Send to a different email
              </Button>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <SubmitButton 
                text="Send Magic Login Link" 
                loadingText="Sending..."
                className="w-full"
              />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
