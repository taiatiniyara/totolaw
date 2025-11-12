/**
 * Edit Legal Representative Page
 */

import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/common";
import { LegalRepresentativeFormServer } from "../representative-form-server";
import { getLegalRepresentativeById, updateLegalRepresentative, deleteLegalRepresentative } from "../actions";

async function handleUpdateRepresentative(repId: string, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const firmName = formData.get("firmName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;
  const isActive = formData.get("isActive") === "on";

  // Get practice areas from checkboxes
  const practiceAreas = formData.getAll("practiceAreas") as string[];
  
  // Get custom practice areas and split by comma
  const customAreas = formData.get("customPracticeAreas") as string;
  if (customAreas) {
    const customAreasArray = customAreas.split(",").map(area => area.trim()).filter(Boolean);
    practiceAreas.push(...customAreasArray);
  }

  const result = await updateLegalRepresentative(repId, {
    name,
    type,
    firmName: firmName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    address: address || undefined,
    practiceAreas,
    notes: notes || undefined,
    isActive,
  });

  if (result.success) {
    redirect("/dashboard/settings/legal-representatives");
  } else {
    throw new Error(result.error || "Failed to update legal representative");
  }
}

async function handleDeleteRepresentative(repId: string) {
  "use server";

  const result = await deleteLegalRepresentative(repId);

  if (result.success) {
    redirect("/dashboard/settings/legal-representatives");
  } else {
    throw new Error(result.error || "Failed to delete legal representative");
  }
}

export default async function EditLegalRepresentativePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLegalRepresentativeById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const representative = result.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Legal Representative"
        description="Update legal representative details"
      />
      <LegalRepresentativeFormServer
        action={handleUpdateRepresentative.bind(null, id)}
        deleteAction={handleDeleteRepresentative.bind(null, id)}
        initialData={representative}
        mode="edit"
      />
    </div>
  );
}
