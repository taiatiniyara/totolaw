/**
 * Edit Courtroom Page
 */

import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/common";
import { CourtRoomFormServer } from "../courtroom-form-server";
import { getCourtRoomById, updateCourtRoom, deleteCourtRoom } from "../actions";

async function handleUpdateCourtRoom(roomId: string, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const courtLevel = formData.get("courtLevel") as string;
  const location = formData.get("location") as string;
  const capacity = formData.get("capacity") as string;
  const isActive = formData.get("isActive") === "on";

  const result = await updateCourtRoom(roomId, {
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
    throw new Error(result.error || "Failed to update courtroom");
  }
}

async function handleDeleteCourtRoom(roomId: string) {
  "use server";

  const result = await deleteCourtRoom(roomId);

  if (result.success) {
    redirect("/dashboard/settings/courtrooms");
  } else {
    throw new Error(result.error || "Failed to delete courtroom");
  }
}

export default async function EditCourtRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCourtRoomById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const courtRoom = result.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Courtroom"
        description="Update courtroom details"
      />
      <CourtRoomFormServer
        action={handleUpdateCourtRoom.bind(null, id)}
        deleteAction={handleDeleteCourtRoom.bind(null, id)}
        initialData={courtRoom}
        mode="edit"
      />
    </div>
  );
}
