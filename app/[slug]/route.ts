import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shortenedLinks } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const link = await db
      .select()
      .from(shortenedLinks)
      .where(eq(shortenedLinks.shortCode, slug))
      .limit(1);

    if (!link || link.length === 0) {
      return NextResponse.json(
        { error: `Short link "/${slug}" not found.` },
        { status: 404 }
      );
    }

    const found = link[0];

    // Check if link is active
    if (!found.isActive) {
      return NextResponse.json(
        { error: `Short link "/${slug}" is currently disabled.` },
        { status: 410 } // 410 Gone = intentionally disabled
      );
    }

    // Increment click counter (fire-and-forget, don't block redirect)
    db.update(shortenedLinks)
      .set({ clicks: sql`${shortenedLinks.clicks} + 1` })
      .where(eq(shortenedLinks.id, found.id))
      .catch((err) => console.error("Failed to increment clicks:", err));

    return NextResponse.redirect(found.originalUrl, { status: 307 });
  } catch (error) {
    console.error("Error looking up short link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
