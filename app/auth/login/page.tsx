"use client";

import { useEffect, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendMagicLinkAction, type ActionState } from "../actions";
import SubmitButton from "@/components/submitButton";
import Logo from "@/components/logo";
import { Mail, CheckCircle2, Sparkles, Shield, Zap } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-muted p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm animate-fade-in-up relative z-10">
        <CardHeader className="space-y-6 pb-6">
          <div className="flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50 animate-pulse" />
              <Logo width={180} height={62} className="relative" />
            </div>
          </div>
          
          <div className="text-center space-y-2 animate-fade-in delay-200">
            <CardTitle className="text-2xl font-bold">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Secure, passwordless authentication
            </CardDescription>
          </div>

          {/* Features badges */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in delay-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs border">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs border">
              <Zap className="w-3.5 h-3.5" />
              <span>Fast</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs border">
              <Sparkles className="w-3.5 h-3.5" />
              <span>No Passwords</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          {state.success ? (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-xl bg-accent/50 p-6 text-center border-2 shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-secondary p-3 animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <p className="text-base font-semibold mb-2">
                  Check Your Email!
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  We've sent a magic link to
                </p>
                <p className="text-sm font-medium mb-3">
                  {state.email}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs bg-secondary rounded-lg p-2">
                  <Mail className="w-4 h-4" />
                  <span>Click the link to complete sign in</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full h-11 transition-all duration-200"
                onClick={() => window.location.reload()}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send to a different email
              </Button>
            </div>
          ) : (
            <form action={formAction} className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="pl-11 h-12 transition-all duration-200 text-base"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  We'll send you a secure one-time login link
                </p>
              </div>

              <SubmitButton 
                text="Send Magic Link" 
                loadingText="Sending..."
                className="w-full h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              />

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Cancel
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">
                    Secure Authentication
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By signing in, you agree to our secure authentication process.
                  <br />
                  No passwords to remember, no credentials to store.
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer text */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground animate-fade-in delay-500">
          🌴 Made with ❤️ for Pacific Island Court Systems
        </p>
      </div>
    </div>
  );
}
