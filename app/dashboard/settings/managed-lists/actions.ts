/**
 * Managed Lists Actions
 * 
 * Server actions for fetching and managing dynamic list items
 */

"use server";

import { auth } from "@/lib/auth";
import {
  getListItems,
  getAllListItems,
  updateListItems,
  addListItem,
  listItemsToOptions,
  type ListCategory,
  type ManagedListItem
} from "@/lib/services/managed-lists.service";
import { getUserTenantContext } from "@/lib/services/tenant.service";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get active list items for a category (for display in forms)
 */
export async function getManagedListOptions(
  category: ListCategory
): Promise<ActionResult<{ value: string; label: string; description?: string }[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then(m => m.headers())
    });

    const context = session?.user ? await getUserTenantContext(session.user.id) : null;
    const organisationId = context?.organisationId;
    const items = await getListItems(category, organisationId);
    const options = listItemsToOptions(items);

    return { success: true, data: options };
  } catch (error) {
    console.error(`Error fetching managed list options for ${category}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch list options"
    };
  }
}

/**
 * Get all list items including inactive (for admin management)
 */
export async function getAllManagedListItems(
  category: ListCategory
): Promise<ActionResult<ManagedListItem[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then(m => m.headers())
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const context = await getUserTenantContext(session.user.id);
    const organisationId = context?.organisationId;
    const items = await getAllListItems(category, organisationId);

    return { success: true, data: items };
  } catch (error) {
    console.error(`Error fetching all managed list items for ${category}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch list items"
    };
  }
}

/**
 * Update list items (admin only)
 */
export async function updateManagedList(
  category: ListCategory,
  items: ManagedListItem[]
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then(m => m.headers())
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has admin permissions
    // TODO: Add proper permission check here
    
    const context = await getUserTenantContext(session.user.id);
    const organisationId = context?.organisationId;
    const result = await updateListItems(
      category,
      items,
      organisationId,
      session.user.id
    );

    if (result.success) {
      revalidatePath("/dashboard");
      return { success: true };
    }

    return result;
  } catch (error) {
    console.error(`Error updating managed list for ${category}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update list"
    };
  }
}

/**
 * Add a new item to a list (admin only)
 */
export async function addManagedListItem(
  category: ListCategory,
  item: Omit<ManagedListItem, "id">
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then(m => m.headers())
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has admin permissions
    // TODO: Add proper permission check here

    const context = await getUserTenantContext(session.user.id);
    const organisationId = context?.organisationId;
    const result = await addListItem(
      category,
      item,
      organisationId,
      session.user.id
    );

    if (result.success) {
      revalidatePath("/dashboard");
      return { success: true };
    }

    return result;
  } catch (error) {
    console.error(`Error adding managed list item to ${category}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item"
    };
  }
}
