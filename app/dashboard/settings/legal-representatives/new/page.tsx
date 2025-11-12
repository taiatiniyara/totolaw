/**
 * Create New Legal Representative Page
 */

import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common";
import { LegalRepresentativeFormServer } from "../representative-form-server";
import { createLegalRepresentative } from "../actions";

async function handleCreateRepresentative(formData: FormData) {
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

  const result = await createLegalRepresentative({
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
    throw new Error(result.error || "Failed to create legal representative");
  }
}

export default function NewLegalRepresentativePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Legal Representative"
        description="Add a new lawyer, law firm, or legal aid organization to the directory"
      />
      <LegalRepresentativeFormServer
        action={handleCreateRepresentative}
        mode="create"
      />
    </div>
  );
}
