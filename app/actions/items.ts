"use server";

import { db } from "@/db";
import { items, categories, locations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserId } from "@/lib/auth-server";

export async function getItemsByCategory(categoryId: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify category belongs to user
    const category = await db
      .select({ categoryId: categories.id, userId: locations.userId })
      .from(categories)
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (category.length === 0 || category[0].userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }

    const categoryItems = await db
      .select()
      .from(items)
      .where(eq(items.categoryId, categoryId));

    return { success: true, data: categoryItems };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { success: false, error: "Failed to fetch items" };
  }
}

export async function getItemsToBuy() {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const itemsToBuy = await db
      .select({
        id: items.id,
        name: items.name,
        quantity: items.quantity,
        status: items.status,
        toBuy: items.toBuy,
        categoryId: items.categoryId,
        categoryName: categories.name,
        locationId: locations.id,
        locationName: locations.name,
      })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(and(eq(items.toBuy, true), eq(locations.userId, userId)));

    return { success: true, data: itemsToBuy };
  } catch (error) {
    console.error("Error fetching items to buy:", error);
    return { success: false, error: "Failed to fetch items to buy" };
  }
}

export async function getLowStockItems() {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const lowStockItems = await db
      .select({
        id: items.id,
        name: items.name,
        quantity: items.quantity,
        status: items.status,
        toBuy: items.toBuy,
        categoryId: items.categoryId,
        categoryName: categories.name,
        locationId: locations.id,
        locationName: locations.name,
      })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(
        and(
          eq(locations.userId, userId),
          eq(items.status, "Low Stock")
        )
      );

    return { success: true, data: lowStockItems };
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return { success: false, error: "Failed to fetch low stock items" };
  }
}

export async function createItem(
  categoryId: number,
  name: string,
  quantity: number,
  status: "In Stock" | "Low Stock" | "Out of Stock",
  toBuy: boolean
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify category belongs to user
    const category = await db
      .select({ categoryId: categories.id, userId: locations.userId })
      .from(categories)
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (category.length === 0 || category[0].userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }

    const [newItem] = await db
      .insert(items)
      .values({
        name,
        quantity,
        status,
        toBuy,
        categoryId,
      })
      .returning();

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/shopping-list");
    return { success: true, data: newItem };
  } catch (error) {
    console.error("Error creating item:", error);
    return { success: false, error: "Failed to create item" };
  }
}

export async function updateItem(
  id: number,
  name: string,
  quantity: number,
  status: "In Stock" | "Low Stock" | "Out of Stock",
  toBuy: boolean
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify item belongs to user
    const item = await db
      .select({ itemId: items.id, userId: locations.userId })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(items.id, id))
      .limit(1);

    if (item.length === 0 || item[0].userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

    const [updatedItem] = await db
      .update(items)
      .set({ name, quantity, status, toBuy, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/shopping-list");
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function toggleItemToBuy(id: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify item belongs to user
    const item = await db
      .select({ itemId: items.id, userId: locations.userId, currentToBuy: items.toBuy })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(items.id, id))
      .limit(1);

    if (item.length === 0 || item[0].userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

    const [updatedItem] = await db
      .update(items)
      .set({ toBuy: !item[0].currentToBuy, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/shopping-list");
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Error toggling item to buy:", error);
    return { success: false, error: "Failed to toggle item to buy" };
  }
}

export async function deleteItem(id: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify item belongs to user
    const item = await db
      .select({ itemId: items.id, userId: locations.userId })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(items.id, id))
      .limit(1);

    if (item.length === 0 || item[0].userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

    await db.delete(items).where(eq(items.id, id));

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

