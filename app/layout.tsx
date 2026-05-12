import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButtons } from "@/components/auth-buttons";
import { Separator } from "@/components/ui/separator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clerk App",
  description: "A modern authentication app powered by Clerk and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <ThemeProvider defaultTheme="system" storageKey="clerk-app-theme">
          <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <header className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-lg dark:border-zinc-800/50 dark:bg-zinc-950/90">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600" />
                  <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Clerk App
                  </span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <Show when="signed-out">
                    <AuthButtons variant="nav" />
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </div>
            </header>
          <main className="flex-1">{children}</main>
        </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
