import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, shortenedLinks } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { LinksList } from "@/components/links-list";
import { CreateLinkForm } from "@/components/create-link-form";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const hasDbUrl = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes('username:password');
  let userLinks: any[] = [];
  let queryError: string | null = null;
  let dbUserRecord = null;

  if (hasDbUrl && user) {
    try {
      // 1. Sync User to Database (Auto-sync)
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);

      if (!existingUser || existingUser.length === 0) {
        // User doesn't exist, insert them
        const insertedUser = await db.insert(users).values({
          clerkId: userId,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User",
        }).returning();
        dbUserRecord = insertedUser[0];

        // Seed with useful links for the project!
        await db.insert(shortenedLinks).values([
          {
            userId: dbUserRecord.id,
            originalUrl: "https://nextjs.org/docs",
            shortCode: "nextjs-docs-" + Math.random().toString(36).substring(2, 6),
            title: "Next.js Documentation",
            description: "Useful link for Next.js App Router.",
          },
          {
            userId: dbUserRecord.id,
            originalUrl: "https://clerk.com/docs",
            shortCode: "clerk-docs-" + Math.random().toString(36).substring(2, 6),
            title: "Clerk Authentication",
            description: "Useful link for Clerk Auth.",
          },
          {
            userId: dbUserRecord.id,
            originalUrl: "https://orm.drizzle.team/docs/overview",
            shortCode: "drizzle-docs-" + Math.random().toString(36).substring(2, 6),
            title: "Drizzle ORM Docs",
            description: "Useful link for database schemas.",
          }
        ]);
      } else {
        dbUserRecord = existingUser[0];
      }

      // 2. Fetch user's shortened links
      if (dbUserRecord) {
        userLinks = await db
          .select()
          .from(shortenedLinks)
          .where(eq(shortenedLinks.userId, dbUserRecord.id))
          .orderBy(shortenedLinks.createdAt);
      }
    } catch (error) {
      console.error("Database query error:", error);
      queryError = "Unable to connect to the database. Please try again later.";
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50/50 dark:bg-zinc-950 px-4 py-12 sm:py-24">
      
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Profile Section */}
        <header className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 rounded-3xl border border-zinc-200 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/60">
          <div className="flex items-center gap-5 text-center sm:text-left">
            {user?.imageUrl ? (
              <div className="relative">
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-4 border-white shadow-md dark:border-zinc-900"
                />
                <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900"></div>
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold dark:bg-indigo-900/50 dark:text-indigo-400">
                {user?.firstName?.[0] || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Welcome back, {user?.firstName || user?.username || "User"}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end">
            <div className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Total Links
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {userLinks.length}
            </div>
          </div>
        </header>

        {queryError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
            {queryError}
          </div>
        ) : !hasDbUrl ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-400">
            Database is not configured. Please add a valid DATABASE_URL to your .env.local file.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] items-start">
            {/* Create Link Form - Left Side on Desktop */}
            <div className="sticky top-8">
              <CreateLinkForm />
            </div>

            {/* Links List - Right Side on Desktop */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your Links</h2>
              </div>
              <LinksList links={userLinks as Parameters<typeof LinksList>[0]["links"]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
