/**
 * Create New Courtroom Page
 */

import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common";
import { CourtRoomFormServer } from "../courtroom-form-server";
import { createCourtRoom } from "../actions";

async function handleCreateCourtRoom(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const courtLevel = formData.get("courtLevel") as string;
  const location = formData.get("location") as string;
  const capacity = formData.get("capacity") as string;
  const isActive = formData.get("isActive") === "on";

  const result = await createCourtRoom({
    name,
    code,
    courtLevel,
    location: location || undefined,
    capacity: capacity ? parseInt(capacity, 10) : undefined,
    isActive,
  });

  if (result.success) {
    redirect("/dashboard/settings/courtrooms");
  } else {
    throw new Error(result.error || "Failed to create courtroom");
  }
}

export default function NewCourtRoomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Courtroom"
        description="Create a new courtroom for scheduling hearings"
      />
      <CourtRoomFormServer
        action={handleCreateCourtRoom}
        mode="create"
      />
    </div>
  );
}
