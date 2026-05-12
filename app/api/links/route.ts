import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { shortenedLinks, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by clerk_id
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId_db = user[0].id;

    // Fetch user's shortened links
    const links = await db
      .select()
      .from(shortenedLinks)
      .where(eq(shortenedLinks.userId, userId_db))
      .orderBy(shortenedLinks.createdAt);

    return NextResponse.json({ links, user: user[0] });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shortCode, originalUrl, title, description, metadata, qrCode } = body;

    if (!shortCode || !originalUrl) {
      return NextResponse.json(
        { error: "shortCode and originalUrl are required" },
        { status: 400 }
      );
    }

    // Find user by clerk_id
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId_db = user[0].id;

    // Create shortened link
    const newLink = await db
      .insert(shortenedLinks)
      .values({
        userId: userId_db,
        shortCode,
        originalUrl,
        title: title || null,
        description: description || null,
        metadata: metadata || null,
        qrCode: qrCode || null,
      })
      .returning();

    return NextResponse.json(newLink[0], { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
