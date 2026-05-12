"use client";

import { useState } from "react";
import { createLink } from "@/app/actions/links";
import { Link2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateLinkForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await createLink(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        (document.getElementById("create-link-form") as HTMLFormElement).reset();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/60 backdrop-blur-xl p-8 shadow-xl shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-950/60 dark:shadow-black/20 transition-all hover:bg-white/80 dark:hover:bg-zinc-950/80">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
          <Link2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create Link</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Shorten a new URL destination.</p>
        </div>
      </div>

      <form id="create-link-form" action={onSubmit} className="space-y-5">
        <div className="space-y-2 relative group">
          <label htmlFor="originalUrl" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
            Destination URL
          </label>
          <div className="relative transition-transform duration-200 group-focus-within:-translate-y-1">
            <input
              id="originalUrl"
              name="originalUrl"
              type="url"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              required
              className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-5 py-4 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-indigo-500 dark:focus:bg-zinc-950"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 relative group">
            <label htmlFor="title" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
              Title <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <div className="relative transition-transform duration-200 group-focus-within:-translate-y-1">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="My awesome link"
                className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-5 py-4 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-indigo-500 dark:focus:bg-zinc-950"
              />
            </div>
          </div>
          <div className="space-y-2 relative group">
            <label htmlFor="shortCode" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
              Custom Alias <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <div className="relative flex items-center transition-transform duration-200 group-focus-within:-translate-y-1">
              <span className="absolute left-5 font-mono text-zinc-400 select-none">/</span>
              <input
                id="shortCode"
                name="shortCode"
                type="text"
                placeholder="alias"
                className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 py-4 pl-9 pr-5 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-indigo-500 dark:focus:bg-zinc-950"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-600 border border-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            Link successfully shortened!
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-zinc-900 py-6 text-base font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:-translate-y-1 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-white dark:hover:shadow-white/20 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <Plus className="mr-2" size={20} />
            )}
            {loading ? "Shortening..." : "Shorten Link"}
          </Button>
        </div>
      </form>
    </div>
  );
}
