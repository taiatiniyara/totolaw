"use server";

import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export async function logoutAction() {
  try {
    await authClient.signOut();
    redirect("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to logout");
  }
}
