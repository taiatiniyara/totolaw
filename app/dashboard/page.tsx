"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.push("/auth/login");
          return;
        }
        
        setUser(session.data.user);
      } catch (error) {
        console.error("Session check error:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Totolaw!</CardTitle>
            <CardDescription>
              You're successfully authenticated via magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                {user.name && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Name:</span>
                    <span className="text-muted-foreground">{user.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">User ID:</span>
                  <span className="text-muted-foreground font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email Verified:</span>
                  <span className={user.emailVerified ? "text-green-600" : "text-amber-600"}>
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
