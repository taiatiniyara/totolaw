/**
 * Accept Invitation Page
 * 
 * Handles user invitation acceptance and account creation
 */

import { Suspense } from "react";
import AcceptInvitationClient from "./accept-invitation-client";

export const dynamic = 'force-dynamic';

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AcceptInvitationClient />
    </Suspense>
  );
}
