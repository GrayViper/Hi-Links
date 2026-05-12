"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

interface AuthButtonsProps {
  variant?: "hero" | "cta" | "nav";
}

export function AuthButtons({ variant = "hero" }: AuthButtonsProps) {
  const navButtonClasses = "px-3 py-2 text-sm font-medium border border-zinc-300 rounded-md hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors";
  const primaryButtonClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors";
  const secondaryButtonClasses = "inline-flex items-center justify-center px-6 py-3 font-semibold border border-zinc-300 rounded-lg hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors";

  if (variant === "nav") {
    return (
      <div className="flex items-center gap-2">
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className={navButtonClasses}>Sign In</button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <button className={navButtonClasses}>Sign Up</button>
        </SignUpButton>
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <button className={primaryButtonClasses}>
            Create Your Account <ArrowRight className="h-4 w-4" />
          </button>
        </SignUpButton>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className={secondaryButtonClasses}>Sign In</button>
        </SignInButton>
      </div>
    );
  }

  // Default hero variant
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <SignInButton mode="modal" forceRedirectUrl="/dashboard">
        <button className={primaryButtonClasses}>
          Sign In <ArrowRight className="h-4 w-4" />
        </button>
      </SignInButton>
      <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
        <button className={secondaryButtonClasses}>Create Account</button>
      </SignUpButton>
    </div>
  );
}
