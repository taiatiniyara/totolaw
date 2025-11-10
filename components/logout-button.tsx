"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  variant?: "outline" | "default" | "ghost";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export function LogoutButton({ 
  variant = "outline", 
  className = "",
  size = "sm",
  fullWidth = false
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if there's an error
      router.push("/");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={fullWidth ? `w-full justify-start ${className}` : className}
      size={size}
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
