/**
 * Managed Lists Service
 * 
 * Service for managing dynamic list items like court levels, case statuses,
 * action types, offense types, etc. that can be configured per organization.
 */

import { db } from "@/lib/drizzle/connection";
import { managedLists } from "@/lib/drizzle/schema/db-schema";
import { eq, and, isNull } from "drizzle-orm";

export interface ManagedListItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type ListCategory =
  | "court_levels"
  | "case_types"
  | "case_statuses"
  | "action_types"
  | "offense_types"
  | "bail_decisions"
  | "sentence_types"
  | "appeal_types"
  | "party_roles"
  | "court_room_types";

/**
 * Get list items by category for an organization
 * Falls back to system default if organization-specific list doesn't exist
 */
export async function getListItems(
  category: ListCategory,
  organisationId?: string
): Promise<ManagedListItem[]> {
  try {
    // First try to get organization-specific list
    if (organisationId) {
      const orgList = await db
        .select()
        .from(managedLists)
        .where(
          and(
            eq(managedLists.category, category),
            eq(managedLists.organisationId, organisationId)
          )
        )
        .limit(1);

      if (orgList.length > 0 && orgList[0]?.items) {
        return orgList[0].items.filter(item => item.isActive !== false);
      }
    }

    // Fall back to system default list
    const systemList = await db
      .select()
      .from(managedLists)
      .where(
        and(
          eq(managedLists.category, category),
          isNull(managedLists.organisationId),
          eq(managedLists.isSystem, true)
        )
      )
      .limit(1);

    if (systemList.length > 0 && systemList[0]?.items) {
      return systemList[0].items.filter(item => item.isActive !== false);
    }

    // Return empty array if no list found
    return [];
  } catch (error) {
    console.error(`Error fetching list items for ${category}:`, error);
    return [];
  }
}

/**
 * Get all list items by category (including inactive)
 */
export async function getAllListItems(
  category: ListCategory,
  organisationId?: string
): Promise<ManagedListItem[]> {
  try {
    const where = organisationId
      ? and(
          eq(managedLists.category, category),
          eq(managedLists.organisationId, organisationId)
        )
      : and(
          eq(managedLists.category, category),
          isNull(managedLists.organisationId),
          eq(managedLists.isSystem, true)
        );

    const list = await db
      .select()
      .from(managedLists)
      .where(where)
      .limit(1);

    return list.length > 0 && list[0]?.items ? list[0].items : [];
  } catch (error) {
    console.error(`Error fetching all list items for ${category}:`, error);
    return [];
  }
}

/**
 * Update list items for a category
 */
export async function updateListItems(
  category: ListCategory,
  items: ManagedListItem[],
  organisationId?: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if list exists
    const where = organisationId
      ? and(
          eq(managedLists.category, category),
          eq(managedLists.organisationId, organisationId)
        )
      : and(
          eq(managedLists.category, category),
          isNull(managedLists.organisationId)
        );

    const existing = await db
      .select()
      .from(managedLists)
      .where(where)
      .limit(1);

    if (existing.length > 0) {
      // Don't allow updating system lists through this function
      if (existing[0]?.isSystem && !organisationId) {
        return {
          success: false,
          error: "Cannot modify system lists"
        };
      }

      // Update existing list
      await db
        .update(managedLists)
        .set({
          items: items,
          updatedAt: new Date()
        })
        .where(eq(managedLists.id, existing[0]!.id));

      return { success: true };
    } else {
      // Create new organization-specific list
      if (!organisationId) {
        return {
          success: false,
          error: "Cannot create new system lists through this function"
        };
      }

      const id = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.insert(managedLists).values({
        id,
        category,
        name: getCategoryDisplayName(category),
        description: `Custom ${getCategoryDisplayName(category)} for organization`,
        organisationId,
        items,
        isSystem: false,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { success: true };
    }
  } catch (error) {
    console.error(`Error updating list items for ${category}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update list"
    };
  }
}

/**
 * Add a new item to a list
 */
export async function addListItem(
  category: ListCategory,
  item: Omit<ManagedListItem, "id">,
  organisationId?: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const existingItems = await getAllListItems(category, organisationId);
    
    const newItem: ManagedListItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isActive: item.isActive !== false
    };

    const updatedItems = [...existingItems, newItem];
    
    return await updateListItems(category, updatedItems, organisationId, userId);
  } catch (error) {
    console.error(`Error adding list item to ${category}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item"
    };
  }
}

/**
 * Get display name for a category
 */
function getCategoryDisplayName(category: ListCategory): string {
  const names: Record<ListCategory, string> = {
    court_levels: "Court Levels",
    case_types: "Case Types",
    case_statuses: "Case Statuses",
    action_types: "Hearing Action Types",
    offense_types: "Offense Types",
    bail_decisions: "Bail Decisions",
    sentence_types: "Sentence Types",
    appeal_types: "Appeal Types",
    party_roles: "Party Roles",
    court_room_types: "Court Room Types"
  };
  return names[category] || category;
}

/**
 * Helper function to convert list items to select options format
 */
export function listItemsToOptions(items: ManagedListItem[]) {
  return items
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map(item => ({
      value: item.value,
      label: item.label,
      description: item.description
    }));
}
