"use server";

import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserId } from "@/lib/auth-server";

export async function getLocations() {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const userLocations = await db
      .select()
      .from(locations)
      .where(eq(locations.userId, userId));

    return { success: true, data: userLocations };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return { success: false, error: "Failed to fetch locations" };
  }
}

export async function createLocation(name: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [newLocation] = await db
      .insert(locations)
      .values({
        name,
        userId,
      })
      .returning();

    revalidatePath("/dashboard/inventory");
    return { success: true, data: newLocation };
  } catch (error) {
    console.error("Error creating location:", error);
    return { success: false, error: "Failed to create location" };
  }
}

export async function updateLocation(id: number, name: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [updatedLocation] = await db
      .update(locations)
      .set({ name, updatedAt: new Date() })
      .where(and(eq(locations.id, id), eq(locations.userId, userId)))
      .returning();

    revalidatePath("/dashboard/inventory");
    return { success: true, data: updatedLocation };
  } catch (error) {
    console.error("Error updating location:", error);
    return { success: false, error: "Failed to update location" };
  }
}

export async function deleteLocation(id: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(locations)
      .where(and(eq(locations.id, id), eq(locations.userId, userId)));

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting location:", error);
    return { success: false, error: "Failed to delete location" };
  }
}

