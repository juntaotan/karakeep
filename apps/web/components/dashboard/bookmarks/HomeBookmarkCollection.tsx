"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";

import type {
  ZBookmark,
  ZGetBookmarksRequest,
  ZGetBookmarksResponse,
} from "@karakeep/shared/types/bookmarks";
import { BookmarkTypes } from "@karakeep/shared/types/bookmarks";
import { getAssetUrl } from "@karakeep/shared/utils/assetUtils";
import {
  getBookmarkLinkImageUrl,
  getBookmarkTitle,
  getSourceUrl,
} from "@karakeep/shared/utils/bookmarkUtils";

import UpdatableBookmarksGrid from "./UpdatableBookmarksGrid";

function getCoverImage(bookmark: ZBookmark) {
  if (bookmark.content.type === BookmarkTypes.LINK) {
    return getBookmarkLinkImageUrl(bookmark.content)?.url;
  }

  if (bookmark.content.type === BookmarkTypes.ASSET) {
    if (bookmark.content.assetType === "image") {
      return getAssetUrl(bookmark.content.assetId);
    }

    const screenshot = bookmark.assets.find(
      (asset) => asset.assetType === "assetScreenshot",
    );
    return screenshot ? getAssetUrl(screenshot.id) : undefined;
  }

  return undefined;
}

function getCoverDescription(bookmark: ZBookmark) {
  if (bookmark.summary) return bookmark.summary;

  switch (bookmark.content.type) {
    case BookmarkTypes.LINK:
      return bookmark.content.description;
    case BookmarkTypes.TEXT:
      return bookmark.content.text;
    case BookmarkTypes.ASSET:
      return bookmark.note;
    case BookmarkTypes.UNKNOWN:
      return null;
  }
}

function CoverDetails({ bookmark }: { bookmark: ZBookmark }) {
  const title = getBookmarkTitle(bookmark) ?? "Saved item";
  const description = getCoverDescription(bookmark);
  const source = getSourceUrl(bookmark);
  let host: string | undefined;

  if (source) {
    try {
      host = new URL(source).hostname.replace(/^www\./, "");
    } catch {
      host = source;
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="line-clamp-2 text-lg font-semibold leading-snug">{title}</p>
      {description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {host && <p className="truncate text-xs text-muted-foreground">{host}</p>}
    </div>
  );
}

export default function HomeBookmarkCollection({
  query,
  bookmarks,
  showEditorCard = false,
}: {
  query: Omit<ZGetBookmarksRequest, "sortOrder" | "includeContent">;
  bookmarks: ZGetBookmarksResponse;
  showEditorCard?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const firstBookmark = bookmarks.bookmarks[0];
  const coverImage = firstBookmark ? getCoverImage(firstBookmark) : undefined;

  if (!firstBookmark) {
    return (
      <UpdatableBookmarksGrid
        query={query}
        bookmarks={bookmarks}
        showEditorCard={showEditorCard}
      />
    );
  }

  if (isOpen) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          All saved items
        </button>
        <UpdatableBookmarksGrid
          query={query}
          bookmarks={bookmarks}
          showEditorCard={showEditorCard}
        />
      </div>
    );
  }

  return (
    <section aria-labelledby="home-collection-title" className="py-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block w-full max-w-3xl text-left"
        aria-label="Open all saved items"
      >
        <span className="absolute inset-x-7 -top-2 h-full rounded-2xl border bg-muted/40" />
        <span className="absolute inset-x-3 -top-1 h-full rounded-2xl border bg-muted/70" />
        <span className="relative grid min-h-72 overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
          <span className="relative block min-h-56 overflow-hidden bg-muted md:min-h-80">
            {coverImage ? (
              <Image
                src={coverImage}
                alt=""
                fill
                unoptimized
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 via-muted to-accent">
                <FolderOpen
                  className="size-20 text-primary/60"
                  strokeWidth={1.25}
                />
              </span>
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent md:hidden" />
          </span>
          <span className="flex flex-col justify-between gap-8 p-6 md:p-8">
            <span>
              <span className="mb-5 flex items-center justify-between gap-3">
                <span>
                  <span
                    id="home-collection-title"
                    className="block text-2xl font-semibold tracking-tight"
                  >
                    All saved items
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Your collection
                  </span>
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
                  <ChevronRight className="size-5" />
                </span>
              </span>
              <CoverDetails bookmark={firstBookmark} />
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {bookmarks.nextCursor
                ? `${bookmarks.bookmarks.length}+ items`
                : `${bookmarks.bookmarks.length} ${
                    bookmarks.bookmarks.length === 1 ? "item" : "items"
                  }`}
            </span>
          </span>
        </span>
      </button>
    </section>
  );
}
