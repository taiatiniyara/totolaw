"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login since we only use magic links
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}
