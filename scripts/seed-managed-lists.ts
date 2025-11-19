#!/usr/bin/env tsx

/**
 * Seed Managed Lists Script
 * 
 * Run this script to initialize or reset system-level managed lists
 * 
 * Usage:
 *   source .env.local && npx tsx scripts/seed-managed-lists.ts
 *   
 * Or with dotenv-cli:
 *   npm run seed:managed-lists
 */

import { db } from "@/lib/drizzle/connection";
import { managedLists } from "@/lib/drizzle/schema/db-schema";
import { eq, and, isNull } from "drizzle-orm";

interface ManagedListItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface SystemList {
  id: string;
  category: string;
  name: string;
  description: string;
  items: ManagedListItem[];
}

const SYSTEM_LISTS: SystemList[] = [
  {
    id: "system_court_levels",
    category: "court_levels",
    name: "Court Levels",
    description: "Default court hierarchy levels",
    items: [
      {
        id: "cl_1",
        value: "high_court",
        label: "High Court",
        description: "Superior court for serious matters",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "cl_2",
        value: "magistrates",
        label: "Magistrates Court",
        description: "Lower court for minor matters",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "cl_3",
        value: "court_of_appeal",
        label: "Court of Appeal",
        description: "Appellate court",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "cl_4",
        value: "tribunal",
        label: "Tribunal",
        description: "Specialized tribunals",
        sortOrder: 4,
        isActive: true
      }
    ]
  },
  {
    id: "system_case_types",
    category: "case_types",
    name: "Case Types",
    description: "Default case type categories",
    items: [
      {
        id: "ct_1",
        value: "criminal",
        label: "Criminal",
        description: "Criminal prosecutions",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "ct_2",
        value: "civil",
        label: "Civil",
        description: "Civil disputes",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "ct_3",
        value: "family",
        label: "Family",
        description: "Family law matters",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "ct_4",
        value: "appeal",
        label: "Appeal",
        description: "Appeals from lower courts",
        sortOrder: 4,
        isActive: true
      },
      {
        id: "ct_5",
        value: "agricultural",
        label: "Agricultural",
        description: "Agricultural tribunal matters",
        sortOrder: 5,
        isActive: true
      },
      {
        id: "ct_6",
        value: "small_claims",
        label: "Small Claims",
        description: "Small claims tribunal",
        sortOrder: 6,
        isActive: true
      }
    ]
  },
  {
    id: "system_case_statuses",
    category: "case_statuses",
    name: "Case Statuses",
    description: "Default case status options",
    items: [
      {
        id: "cs_1",
        value: "PENDING",
        label: "Pending",
        description: "Case filed but not yet active",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "cs_2",
        value: "ACTIVE",
        label: "Active",
        description: "Case is actively being processed",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "cs_3",
        value: "IN_PROGRESS",
        label: "In Progress",
        description: "Hearings or trials underway",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "cs_4",
        value: "CLOSED",
        label: "Closed",
        description: "Case concluded",
        sortOrder: 4,
        isActive: true
      },
      {
        id: "cs_5",
        value: "ARCHIVED",
        label: "Archived",
        description: "Case archived for records",
        sortOrder: 5,
        isActive: true
      },
      {
        id: "cs_6",
        value: "APPEALED",
        label: "Appealed",
        description: "Under appeal",
        sortOrder: 6,
        isActive: true
      },
      {
        id: "cs_7",
        value: "DISMISSED",
        label: "Dismissed",
        description: "Case dismissed",
        sortOrder: 7,
        isActive: true
      }
    ]
  },
  {
    id: "system_action_types",
    category: "action_types",
    name: "Hearing Action Types",
    description: "Default hearing action type options based on Fiji court procedures",
    items: [
      {
        id: "at_1",
        value: "MENTION",
        label: "Mention",
        description: "Brief court appearance",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "at_2",
        value: "HEARING",
        label: "Hearing",
        description: "General hearing",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "at_3",
        value: "TRIAL",
        label: "Trial",
        description: "Main trial proceedings",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "at_4",
        value: "CONTINUATION_OF_TRIAL",
        label: "Continuation of Trial",
        description: "Ongoing trial session",
        sortOrder: 4,
        isActive: true
      },
      {
        id: "at_5",
        value: "VOIR_DIRE_HEARING",
        label: "Voir Dire Hearing",
        description: "Trial within a trial",
        sortOrder: 5,
        isActive: true
      },
      {
        id: "at_6",
        value: "PRE_TRIAL_CONFERENCE",
        label: "Pre-Trial Conference",
        description: "Case management conference",
        sortOrder: 6,
        isActive: true
      },
      {
        id: "at_7",
        value: "RULING",
        label: "Ruling",
        description: "Judgment or ruling delivery",
        sortOrder: 7,
        isActive: true
      },
      {
        id: "at_8",
        value: "FIRST_CALL",
        label: "First Call",
        description: "Initial case call",
        sortOrder: 8,
        isActive: true
      },
      {
        id: "at_9",
        value: "BAIL_HEARING",
        label: "Bail Hearing",
        description: "Bail application hearing",
        sortOrder: 9,
        isActive: true
      },
      {
        id: "at_10",
        value: "SENTENCING",
        label: "Sentencing",
        description: "Sentencing hearing",
        sortOrder: 10,
        isActive: true
      },
      {
        id: "at_11",
        value: "CASE_CONFERENCE",
        label: "Case Conference",
        description: "Case management discussion",
        sortOrder: 11,
        isActive: true
      },
      {
        id: "at_12",
        value: "OTHER",
        label: "Other",
        description: "Other hearing type",
        sortOrder: 12,
        isActive: true
      }
    ]
  },
  {
    id: "system_offense_types",
    category: "offense_types",
    name: "Common Offense Types",
    description: "Common criminal offenses in Fiji",
    items: [
      {
        id: "of_1",
        value: "theft",
        label: "Theft contrary to section 291 of the Crimes Act",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "of_2",
        value: "assault_abh",
        label: "Assault Causing Actual Bodily Harm",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "of_3",
        value: "aggravated_robbery",
        label: "Aggravated Robbery",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "of_4",
        value: "rape",
        label: "Rape contrary to section 207 of the Crimes Act",
        sortOrder: 4,
        isActive: true
      },
      {
        id: "of_5",
        value: "murder",
        label: "Murder contrary to section 237 of the Crimes Act",
        sortOrder: 5,
        isActive: true
      },
      {
        id: "of_6",
        value: "dangerous_driving_death",
        label: "Dangerous Driving Occasioning Death",
        sortOrder: 6,
        isActive: true
      },
      {
        id: "of_7",
        value: "drug_possession",
        label: "Possession of Illicit Drugs",
        sortOrder: 7,
        isActive: true
      },
      {
        id: "of_8",
        value: "breach_of_trust",
        label: "Breach of Trust",
        sortOrder: 8,
        isActive: true
      },
      {
        id: "of_9",
        value: "obtaining_financial_advantage",
        label: "Obtaining Financial Advantage by Deception",
        sortOrder: 9,
        isActive: true
      },
      {
        id: "of_10",
        value: "burglary",
        label: "Burglary",
        sortOrder: 10,
        isActive: true
      }
    ]
  },
  {
    id: "system_bail_decisions",
    category: "bail_decisions",
    name: "Bail Decisions",
    description: "Bail decision options",
    items: [
      {
        id: "bd_1",
        value: "not_decided",
        label: "Not yet decided",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "bd_2",
        value: "granted",
        label: "Granted",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "bd_3",
        value: "denied",
        label: "Denied",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "bd_4",
        value: "continued",
        label: "Continued",
        sortOrder: 4,
        isActive: true
      }
    ]
  },
  {
    id: "system_sentence_types",
    category: "sentence_types",
    name: "Sentence Types",
    description: "Types of sentences that can be imposed",
    items: [
      {
        id: "st_1",
        value: "imprisonment",
        label: "Imprisonment",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "st_2",
        value: "fine",
        label: "Fine",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "st_3",
        value: "community_service",
        label: "Community Service",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "st_4",
        value: "suspended_sentence",
        label: "Suspended Sentence",
        sortOrder: 4,
        isActive: true
      },
      {
        id: "st_5",
        value: "probation",
        label: "Probation",
        sortOrder: 5,
        isActive: true
      },
      {
        id: "st_6",
        value: "life_imprisonment",
        label: "Life Imprisonment",
        sortOrder: 6,
        isActive: true
      }
    ]
  },
  {
    id: "system_appeal_types",
    category: "appeal_types",
    name: "Appeal Types",
    description: "Types of appeals",
    items: [
      {
        id: "apt_1",
        value: "criminal_appeal",
        label: "Criminal Appeal",
        sortOrder: 1,
        isActive: true
      },
      {
        id: "apt_2",
        value: "civil_appeal",
        label: "Civil Appeal",
        sortOrder: 2,
        isActive: true
      },
      {
        id: "apt_3",
        value: "bail_application",
        label: "Bail Application",
        sortOrder: 3,
        isActive: true
      },
      {
        id: "apt_4",
        value: "leave_to_appeal",
        label: "Leave to Appeal",
        sortOrder: 4,
        isActive: true
      }
    ]
  }
];

async function seedManagedLists() {
  console.log("🌱 Seeding managed lists...\n");

  try {
    for (const list of SYSTEM_LISTS) {
      console.log(`Seeding: ${list.name} (${list.category})`);

      // Check if list already exists
      const existing = await db
        .select()
        .from(managedLists)
        .where(
          and(
            eq(managedLists.category, list.category),
            isNull(managedLists.organisationId),
            eq(managedLists.isSystem, true)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing list
        await db
          .update(managedLists)
          .set({
            name: list.name,
            description: list.description,
            items: list.items,
            updatedAt: new Date()
          })
          .where(eq(managedLists.id, existing[0]!.id));

        console.log(`  ✓ Updated ${list.items.length} items\n`);
      } else {
        // Insert new list
        await db.insert(managedLists).values({
          id: list.id,
          organisationId: null,
          category: list.category,
          name: list.name,
          description: list.description,
          items: list.items,
          isSystem: true,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        console.log(`  ✓ Created with ${list.items.length} items\n`);
      }
    }

    console.log("✅ Successfully seeded all managed lists!");
  } catch (error) {
    console.error("❌ Error seeding managed lists:", error);
    throw error;
  }
}

// Run the seed function
seedManagedLists()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
