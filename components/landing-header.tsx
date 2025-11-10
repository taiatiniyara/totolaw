"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { LayoutDashboard } from "lucide-react";

export function LandingHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsLoggedIn(!!session?.data?.user);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo width={140} height={45} className="h-10" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            {!isChecking && (
              isLoggedIn ? (
                <Button onClick={() => router.push("/dashboard")} variant="default">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              ) : (
                <Button onClick={() => router.push("/auth/login")} variant="default">
                  Sign In
                </Button>
              )
            )}
          </nav>
          {!isChecking && (
            <Button 
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/auth/login")} 
              variant="default" 
              className="md:hidden"
            >
              {isLoggedIn ? (
                <>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
