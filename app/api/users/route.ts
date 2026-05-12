import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export async function GET() {
  try {
    const usersList = await db.select().from(users).limit(10);
    return NextResponse.json(usersList);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch users." }, { status: 500 });
  }
}
