"use server";

import { getInvitationByToken, acceptInvitation } from "@/lib/services/invitation.service";

export async function getInvitationDetails(token: string) {
  try {
    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    return { success: true, invitation };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to get invitation details" };
  }
}

export async function acceptInvitationAction(token: string, userName: string) {
  try {
    const result = await acceptInvitation(token, userName);

    return { success: true, userId: result.userId, organisationId: result.organisationId };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to accept invitation" };
  }
}
