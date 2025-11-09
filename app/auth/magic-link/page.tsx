"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MagicLinkVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyMagicLink = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid magic link. No token found.");
        return;
      }

      try {
        const response = await authClient.magicLink.verify({
          query: {
            token,
          },
        });

        if (response.error) {
          setStatus("error");
          setErrorMessage(response.error.message || "Failed to verify magic link");
        } else {
          setStatus("success");
          // Redirect to dashboard after successful verification
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage("An unexpected error occurred");
      }
    };

    verifyMagicLink();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {status === "loading" && "Verifying..."}
            {status === "success" && "Success!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Please wait while we verify your magic link"}
            {status === "success" && "You're being redirected to your dashboard"}
            {status === "error" && "There was a problem verifying your login link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex justify-center py-8">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          
          {status === "success" && (
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-3 text-sm text-green-800">
                Successfully verified! Redirecting...
              </p>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <p className="mt-3 text-sm text-red-800">{errorMessage}</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/auth/login")}
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
