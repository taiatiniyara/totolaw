'use server';

/**
 * Managed Lists Actions
 * 
 * Server actions for managing system-wide lists
 */

import { db } from "@/lib/drizzle/connection";
import { managedLists } from "@/lib/drizzle/schema/db-schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/middleware/super-admin.middleware";

export interface ManagedListItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get all system managed lists
 */
export async function getAllManagedLists(): Promise<ActionResult<{
  systemLists: Array<{
    id: string;
    category: string;
    name: string;
    description: string | null;
    items: ManagedListItem[];
    isSystem: boolean;
  }>;
  stats: {
    totalLists: number;
    totalItems: number;
    activeItems: number;
    inactiveItems: number;
  };
}>> {
  try {
    await requireSuperAdmin();

    // Get all system lists
    const lists = await db
      .select()
      .from(managedLists)
      .where(
        and(
          isNull(managedLists.organisationId),
          eq(managedLists.isSystem, true)
        )
      )
      .orderBy(managedLists.category);

    // Calculate stats
    let totalItems = 0;
    let activeItems = 0;
    let inactiveItems = 0;

    lists.forEach(list => {
      const items = list.items as ManagedListItem[];
      totalItems += items.length;
      activeItems += items.filter(item => item.isActive !== false).length;
      inactiveItems += items.filter(item => item.isActive === false).length;
    });

    return {
      success: true,
      data: {
        systemLists: lists.map(list => ({
          id: list.id,
          category: list.category,
          name: list.name,
          description: list.description,
          items: list.items as ManagedListItem[],
          isSystem: list.isSystem,
        })),
        stats: {
          totalLists: lists.length,
          totalItems,
          activeItems,
          inactiveItems,
        }
      }
    };
  } catch (error) {
    console.error('Error fetching managed lists:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch lists'
    };
  }
}

/**
 * Get a specific managed list by category
 */
export async function getManagedListByCategory(
  category: string
): Promise<ActionResult<{
  id: string;
  category: string;
  name: string;
  description: string | null;
  items: ManagedListItem[];
  isSystem: boolean;
}>> {
  try {
    await requireSuperAdmin();

    const [list] = await db
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

    if (!list) {
      return { success: false, error: 'List not found' };
    }

    return {
      success: true,
      data: {
        id: list.id,
        category: list.category,
        name: list.name,
        description: list.description,
        items: list.items as ManagedListItem[],
        isSystem: list.isSystem,
      }
    };
  } catch (error) {
    console.error('Error fetching managed list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch list'
    };
  }
}

/**
 * Update managed list items
 */
export async function updateManagedListItems(
  listId: string,
  items: ManagedListItem[]
): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    // Validate items
    const invalidItems = items.filter(item => !item.value || !item.label);
    if (invalidItems.length > 0) {
      return { success: false, error: 'All items must have value and label' };
    }

    // Update list
    await db
      .update(managedLists)
      .set({
        items: items,
        updatedAt: new Date(),
      })
      .where(eq(managedLists.id, listId));

    revalidatePath('/dashboard/system-admin/managed-lists');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating managed list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update list'
    };
  }
}

/**
 * Add item to managed list
 */
export async function addManagedListItem(
  listId: string,
  item: Omit<ManagedListItem, 'id'>
): Promise<ActionResult<{ itemId: string }>> {
  try {
    await requireSuperAdmin();

    // Validate item
    if (!item.value || !item.label) {
      return { success: false, error: 'Item must have value and label' };
    }

    // Get current list
    const [list] = await db
      .select()
      .from(managedLists)
      .where(eq(managedLists.id, listId))
      .limit(1);

    if (!list) {
      return { success: false, error: 'List not found' };
    }

    const currentItems = list.items as ManagedListItem[];
    
    // Check for duplicate value
    if (currentItems.some(i => i.value === item.value)) {
      return { success: false, error: 'Item with this value already exists' };
    }

    // Generate ID and add item
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newItem: ManagedListItem = {
      ...item,
      id: itemId,
      isActive: item.isActive !== false,
      sortOrder: item.sortOrder ?? currentItems.length,
    };

    const updatedItems = [...currentItems, newItem];

    // Update list
    await db
      .update(managedLists)
      .set({
        items: updatedItems,
        updatedAt: new Date(),
      })
      .where(eq(managedLists.id, listId));

    revalidatePath('/dashboard/system-admin/managed-lists');
    
    return { success: true, data: { itemId } };
  } catch (error) {
    console.error('Error adding list item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add item'
    };
  }
}

/**
 * Update specific item in managed list
 */
export async function updateManagedListItem(
  listId: string,
  itemId: string,
  updates: Partial<ManagedListItem>
): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    // Get current list
    const [list] = await db
      .select()
      .from(managedLists)
      .where(eq(managedLists.id, listId))
      .limit(1);

    if (!list) {
      return { success: false, error: 'List not found' };
    }

    const currentItems = list.items as ManagedListItem[];
    const itemIndex = currentItems.findIndex(i => i.id === itemId);

    if (itemIndex === -1) {
      return { success: false, error: 'Item not found' };
    }

    // Update item
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex]!, ...updates };

    // Update list
    await db
      .update(managedLists)
      .set({
        items: updatedItems,
        updatedAt: new Date(),
      })
      .where(eq(managedLists.id, listId));

    revalidatePath('/dashboard/system-admin/managed-lists');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating list item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item'
    };
  }
}

/**
 * Reorder items in managed list
 */
export async function reorderManagedListItems(
  listId: string,
  itemIds: string[]
): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    // Get current list
    const [list] = await db
      .select()
      .from(managedLists)
      .where(eq(managedLists.id, listId))
      .limit(1);

    if (!list) {
      return { success: false, error: 'List not found' };
    }

    const currentItems = list.items as ManagedListItem[];
    
    // Reorder based on itemIds array
    const itemMap = new Map(currentItems.map(item => [item.id, item]));
    const reorderedItems = itemIds
      .map(id => itemMap.get(id))
      .filter((item): item is ManagedListItem => item !== undefined)
      .map((item, index) => ({ ...item, sortOrder: index }));

    // Update list
    await db
      .update(managedLists)
      .set({
        items: reorderedItems,
        updatedAt: new Date(),
      })
      .where(eq(managedLists.id, listId));

    revalidatePath('/dashboard/system-admin/managed-lists');
    
    return { success: true };
  } catch (error) {
    console.error('Error reordering list items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder items'
    };
  }
}
