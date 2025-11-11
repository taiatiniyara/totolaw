/**
 * Seed Fiji Court System
 * 
 * This script seeds the database with Fiji court hierarchy, courtrooms,
 * and common legal representatives based on actual court file samples.
 */

import { db } from "@/lib/drizzle/connection";
import {courtRooms, legalRepresentatives } from "@/lib/drizzle/schema/db-schema";
import { organisations } from "@/lib/drizzle/schema/organisation-schema";
import { generateUUID } from "@/lib/services/uuid.service";

interface CourtOrg {
  id: string;
  name: string;
  code: string;
  type: string;
  courtLevel?: string;
  courtType?: string;
  jurisdiction?: string;
  parentId?: string;
}

async function seedFijiCourtSystem() {
  console.log("🏛️  Seeding Fiji Court System...");

  const courts: CourtOrg[] = [];

  // Root: Fiji Court System
  const fijiSystemId = generateUUID();
  courts.push({
    id: fijiSystemId,
    name: "Fiji Court System",
    code: "FJ",
    type: "court_system",
  });

  // Court of Appeal
  const coaId = generateUUID();
  courts.push({
    id: coaId,
    name: "Court of Appeal",
    code: "FJ-COA",
    type: "court",
    courtLevel: "court_of_appeal",
    parentId: fijiSystemId,
  });

  // High Court - Criminal Division
  const hcCrimId = generateUUID();
  courts.push({
    id: hcCrimId,
    name: "High Court - Criminal Division",
    code: "FJ-HC-CRIM",
    type: "court",
    courtLevel: "high_court",
    courtType: "criminal",
    parentId: fijiSystemId,
  });

  // High Court - Civil Division
  const hcCivilId = generateUUID();
  courts.push({
    id: hcCivilId,
    name: "High Court - Civil Division",
    code: "FJ-HC-CIVIL",
    type: "court",
    courtLevel: "high_court",
    courtType: "civil",
    parentId: fijiSystemId,
  });

  // Magistrates' Courts by Location
  const magistratesCourts = [
    { name: "Suva", jurisdiction: "Suva District" },
    { name: "Nadi", jurisdiction: "Nadi District" },
    { name: "Lautoka", jurisdiction: "Lautoka District" },
    { name: "Labasa", jurisdiction: "Labasa District" },
    { name: "Nausori", jurisdiction: "Nausori District" },
  ];

  magistratesCourts.forEach((court) => {
    courts.push({
      id: generateUUID(),
      name: `${court.name} Magistrates Court`,
      code: `FJ-MC-${court.name.toUpperCase()}`,
      type: "court",
      courtLevel: "magistrates",
      jurisdiction: court.jurisdiction,
      parentId: fijiSystemId,
    });
  });

  // Specialized Tribunals
  const tribunals = [
    {
      name: "Agricultural Tribunal",
      code: "FJ-AT",
      courtType: "agricultural",
    },
    {
      name: "Small Claims Tribunal",
      code: "FJ-SCT",
      courtType: "small_claims",
    },
  ];

  tribunals.forEach((tribunal) => {
    courts.push({
      id: generateUUID(),
      name: tribunal.name,
      code: tribunal.code,
      type: "tribunal",
      courtLevel: "tribunal",
      courtType: tribunal.courtType,
      parentId: fijiSystemId,
    });
  });

  // Insert all courts
  for (const court of courts) {
    await db.insert(organisations).values({
      id: court.id,
      name: court.name,
      code: court.code,
      type: court.type,
      courtLevel: court.courtLevel,
      courtType: court.courtType,
      jurisdiction: court.jurisdiction,
      parentId: court.parentId,
      isActive: true,
      settings: JSON.stringify({
        caseNumberFormat: getCaseNumberFormat(court.courtLevel, court.courtType),
      }),
    });
  }

  console.log(`✅ Created ${courts.length} court organisations`);

  return { fijiSystemId, coaId, hcCrimId, hcCivilId };
}

function getCaseNumberFormat(
  courtLevel?: string,
  courtType?: string
): string {
  if (courtLevel === "high_court" && courtType === "criminal") return "HAC {seq}/{year}";
  if (courtLevel === "high_court" && courtType === "civil") return "HBC {seq}/{year}";
  if (courtLevel === "court_of_appeal") return "ABU {seq}/{year}";
  if (courtLevel === "tribunal" && courtType === "agricultural") return "C & ED {seq}/{year}";
  return "{seq}/{year}";
}

async function seedCourtRooms(courtIds: { hcCrimId: string }) {
  console.log("🏢 Seeding Court Rooms...");

  const rooms = [
    // High Court Rooms
    {
      organisationId: courtIds.hcCrimId,
      name: "HIGH COURT ROOM NO. 1",
      code: "HC-1",
      courtLevel: "high_court",
      location: "Suva Court Complex",
      capacity: 60,
    },
    {
      organisationId: courtIds.hcCrimId,
      name: "HIGH COURT ROOM NO. 2",
      code: "HC-2",
      courtLevel: "high_court",
      location: "Suva Court Complex",
      capacity: 60,
    },
    {
      organisationId: courtIds.hcCrimId,
      name: "HIGH COURT ROOM NO. 4",
      code: "HC-4",
      courtLevel: "high_court",
      location: "Suva Court Complex",
      capacity: 50,
    },
    {
      organisationId: courtIds.hcCrimId,
      name: "HIGH COURT ROOM NO. 10",
      code: "HC-10",
      courtLevel: "high_court",
      location: "Suva Court Complex",
      capacity: 50,
    },
    {
      organisationId: courtIds.hcCrimId,
      name: "HIGH COURT ROOM NO. 13",
      code: "HC-13",
      courtLevel: "high_court",
      location: "Suva Court Complex",
      capacity: 50,
    },
  ];

  for (const room of rooms) {
    await db.insert(courtRooms).values({
      id: generateUUID(),
      ...room,
      isActive: true,
    });
  }

  console.log(`✅ Created ${rooms.length} courtrooms`);
}

async function seedLegalRepresentatives(orgId: string) {
  console.log("⚖️  Seeding Legal Representatives...");

  const representatives = [
    // Government/Statutory Bodies
    {
      name: "Director of Public Prosecutions",
      type: "government",
      firmName: "DPP",
      practiceAreas: ["criminal"],
    },
    {
      name: "Legal Aid Commission",
      type: "legal_aid",
      firmName: "LEGAL AID",
      practiceAreas: ["criminal", "civil", "family"],
    },
    {
      name: "Attorney General's Office",
      type: "government",
      firmName: "AG'S OFFICE",
      practiceAreas: ["civil", "constitutional"],
    },

    // Law Firms (from court samples)
    {
      name: "Mishra Prakash & Associates",
      type: "law_firm",
      practiceAreas: ["civil", "property"],
    },
    {
      name: "Sen Lawyers",
      type: "law_firm",
      practiceAreas: ["civil", "property", "appeals"],
    },
    {
      name: "Vosarogo Lawyers",
      type: "law_firm",
      practiceAreas: ["criminal"],
    },
    {
      name: "Amrit Chand Lawyers",
      type: "law_firm",
      practiceAreas: ["criminal"],
    },
    {
      name: "Tuifagalele Lawyers",
      type: "law_firm",
      practiceAreas: ["criminal"],
    },
    {
      name: "Tirath Sharma Lawyers",
      type: "law_firm",
      practiceAreas: ["criminal"],
    },
    {
      name: "Ezer Law Chambers",
      type: "law_firm",
      practiceAreas: ["civil", "commercial"],
    },
    {
      name: "Saneem Lawyers",
      type: "law_firm",
      practiceAreas: ["civil"],
    },
    {
      name: "Shelvin Singh Lawyers",
      type: "law_firm",
      practiceAreas: ["civil", "commercial"],
    },
    {
      name: "TLTB Legal",
      type: "statutory",
      firmName: "I-TAUKEI LAND TRUST BOARD",
      practiceAreas: ["land", "property"],
    },
    {
      name: "Naidu Lawyers",
      type: "law_firm",
      practiceAreas: ["civil", "property"],
    },
    {
      name: "Rokoika & Vakalalabure Lawyers",
      type: "law_firm",
      practiceAreas: ["civil", "property"],
    },
    {
      name: "Kumar Goundar Lawyers",
      type: "law_firm",
      practiceAreas: ["civil", "administrative"],
    },
    {
      name: "Crown Law",
      type: "government",
      practiceAreas: ["civil", "administrative"],
    },
  ];

  for (const rep of representatives) {
    await db.insert(legalRepresentatives).values({
      id: generateUUID(),
      organisationId: orgId,
      name: rep.name,
      type: rep.type as any,
      firmName: rep.firmName || rep.name,
      practiceAreas: rep.practiceAreas,
      isActive: true,
    });
  }

  console.log(`✅ Created ${representatives.length} legal representatives`);
}

async function main() {
  console.log("🌴 Starting Fiji Court System seed...\n");

  try {
    const courtIds = await seedFijiCourtSystem();
    await seedCourtRooms(courtIds);
    await seedLegalRepresentatives(courtIds.hcCrimId);

    console.log("\n✨ Fiji Court System seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding Fiji Court System:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedFijiCourtSystem, seedCourtRooms, seedLegalRepresentatives };
