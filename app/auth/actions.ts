"use server";

import { authClient } from "@/lib/auth-client";

export type ActionState = {
  success?: boolean;
  message?: string;
  error?: string;
  email?: string;
};

export async function sendMagicLinkAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      success: false,
      error: "Please enter your email address",
    };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    };
  }

  try {
    const response = await authClient.signIn.magicLink({
      email,
    });

    if (response.error) {
      console.error("Magic link error:", response.error);
      return {
        success: false,
        error: response.error.message || "Failed to send magic link",
      };
    }

    return {
      success: true,
      message: "Magic link sent! Check your email.",
      email,
    };
  } catch (error) {
    console.error("Magic link error:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<ActionState> {
  try {
    await authClient.signOut();
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}
