"use client";

import { useState } from "react";
import { Copy, ExternalLink, Trash2, Check, Loader2, LinkIcon, MousePointerClick, Power } from "lucide-react";
import { deleteLink, toggleLink } from "@/app/actions/links";

interface ShortenedLink {
  id: number;
  userId: number;
  shortCode: string;
  originalUrl: string;
  title: string | null;
  description: string | null;
  metadata: Record<string, string | number | boolean | string[] | Record<string, unknown>> | null;
  qrCode: string | null;
  clicks: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface LinksListProps {
  links: ShortenedLink[];
}

export function LinksList({ links }: LinksListProps) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const copyToClipboard = async (link: ShortenedLink) => {
    const shortUrl = `${baseUrl}/${link.shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this link?")) {
      setDeletingId(id);
      await deleteLink(id);
      setDeletingId(null);
    }
  };

  const handleToggle = async (link: ShortenedLink) => {
    setTogglingId(link.id);
    await toggleLink(link.id, link.isActive);
    setTogglingId(null);
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 mb-4">
          <LinkIcon size={24} />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No links yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          Create your first short link using the form above to track and share your URLs easily.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <div
          key={link.id}
          className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            link.isActive
              ? "border-zinc-200 bg-white/60 hover:bg-white hover:shadow-zinc-200/50 dark:border-zinc-800/60 dark:bg-zinc-950/60 dark:hover:bg-zinc-950 dark:hover:shadow-black/40"
              : "border-zinc-200/60 bg-zinc-50/40 hover:bg-zinc-50/60 dark:border-zinc-800/30 dark:bg-zinc-950/30 dark:hover:bg-zinc-950/50"
          }`}
        >
          {/* Active / Inactive badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* Status dot */}
                <span
                  className={`inline-flex h-2 w-2 rounded-full flex-shrink-0 ${
                    link.isActive
                      ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]"
                      : "bg-zinc-400 dark:bg-zinc-600"
                  }`}
                  title={link.isActive ? "Active" : "Inactive"}
                />
                <h3 className={`truncate font-bold text-lg ${
                  link.isActive
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}>
                  {link.title || "Untitled Link"}
                </h3>
              </div>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center text-sm text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 truncate"
              >
                <span className="truncate">{link.originalUrl}</span>
                <ExternalLink size={14} className="ml-1.5 flex-shrink-0" />
              </a>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              {/* Toggle active/inactive */}
              <button
                onClick={() => handleToggle(link)}
                disabled={togglingId === link.id}
                className={`rounded-full p-2 transition-all disabled:opacity-50 ${
                  link.isActive
                    ? "text-zinc-400 hover:bg-amber-50 hover:text-amber-600 dark:text-zinc-600 dark:hover:bg-amber-950/50 dark:hover:text-amber-400"
                    : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:text-emerald-500 dark:hover:bg-emerald-950/50"
                }`}
                title={link.isActive ? "Disable link" : "Enable link"}
                suppressHydrationWarning
              >
                {togglingId === link.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Power size={18} />
                )}
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(link.id)}
                disabled={deletingId === link.id}
                className="rounded-full p-2 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-600 dark:text-zinc-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 disabled:opacity-50"
                title="Delete link"
                suppressHydrationWarning
              >
                {deletingId === link.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Footer: short code + clicks + copy */}
          <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800/50">
            <div className="flex items-center gap-3">
              {/* Short code pill */}
              <div className="flex items-center rounded-lg bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
                <span className="text-zinc-400 text-sm select-none mr-1">/</span>
                <span className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {link.shortCode}
                </span>
              </div>

              {/* Click counter */}
              <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400" title="Total clicks">
                <MousePointerClick size={14} className="text-indigo-400" />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{link.clicks}</span>
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={() => copyToClipboard(link)}
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              suppressHydrationWarning
            >
              {copiedId === link.id ? (
                <>
                  <Check size={16} className="text-emerald-400 dark:text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
