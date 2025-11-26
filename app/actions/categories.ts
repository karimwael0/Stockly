"use server";

import { db } from "@/db";
import { categories, locations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserId } from "@/lib/auth-server";

export async function getCategoriesByLocation(locationId: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify location belongs to user
    const location = await db
      .select()
      .from(locations)
      .where(and(eq(locations.id, locationId), eq(locations.userId, userId)))
      .limit(1);

    if (location.length === 0) {
      throw new Error("Location not found or unauthorized");
    }

    const locationCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.locationId, locationId));

    return { success: true, data: locationCategories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createCategory(locationId: number, name: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify location belongs to user
    const location = await db
      .select()
      .from(locations)
      .where(and(eq(locations.id, locationId), eq(locations.userId, userId)))
      .limit(1);

    if (location.length === 0) {
      throw new Error("Location not found or unauthorized");
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        locationId,
      })
      .returning();

    revalidatePath("/dashboard/inventory");
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify category belongs to user's location
    const category = await db
      .select({ categoryId: categories.id, userId: locations.userId })
      .from(categories)
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(categories.id, id))
      .limit(1);

    if (category.length === 0 || category[0].userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({ name, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/dashboard/inventory");
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify category belongs to user's location
    const category = await db
      .select({ categoryId: categories.id, userId: locations.userId })
      .from(categories)
      .innerJoin(locations, eq(categories.locationId, locations.id))
      .where(eq(categories.id, id))
      .limit(1);

    if (category.length === 0 || category[0].userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

