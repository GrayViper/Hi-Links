"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { shortenedLinks, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to generate a random 6-character short code
function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createLink(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Unauthorized" };

  const originalUrl = formData.get("originalUrl") as string;
  let shortCode = formData.get("shortCode") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!originalUrl) return { error: "Original URL is required" };

  // Validate URL format
  let finalUrl = originalUrl;
  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    finalUrl = "https://" + finalUrl;
  }
  try {
    new URL(finalUrl);
  } catch {
    return { error: "Invalid URL format" };
  }

  if (!shortCode) {
    shortCode = generateShortCode();
  } else {
    // Sanitize custom short code
    shortCode = shortCode.trim().replace(/[^a-zA-Z0-9-_]/g, "");
    if (!shortCode) return { error: "Invalid custom short code" };
  }

  // Get internal user ID
  const dbUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!dbUser || dbUser.length === 0) {
    return { error: "User profile not synced. Please refresh the page." };
  }

  try {
    await db.insert(shortenedLinks).values({
      userId: dbUser[0].id,
      originalUrl: finalUrl,
      shortCode,
      title: title || null,
      description: description || null,
    });
  } catch (error: any) {
    if (error?.code === '23505' || (error?.message && error.message.includes('unique'))) {
      return { error: "This short code is already taken. Please choose another one." };
    }
    console.error("Failed to create link:", error);
    return { error: "Failed to create link. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(linkId: number) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Unauthorized" };

  const dbUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!dbUser || dbUser.length === 0) return { error: "User not found" };

  try {
    await db.delete(shortenedLinks)
      .where(
        and(
          eq(shortenedLinks.id, linkId),
          eq(shortenedLinks.userId, dbUser[0].id)
        )
      );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { error: "Failed to delete link." };
  }
}

export async function toggleLink(linkId: number, currentActive: boolean) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Unauthorized" };

  const dbUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!dbUser || dbUser.length === 0) return { error: "User not found" };

  try {
    await db.update(shortenedLinks)
      .set({ isActive: !currentActive })
      .where(
        and(
          eq(shortenedLinks.id, linkId),
          eq(shortenedLinks.userId, dbUser[0].id)
        )
      );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle link:", error);
    return { error: "Failed to update link." };
  }
}
