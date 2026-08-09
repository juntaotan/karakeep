"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

import type { ZBookmarkTypeCollection } from "@karakeep/shared/types/bookmarks";
import { getAssetUrl } from "@karakeep/shared/utils/assetUtils";

import { BookmarkLayoutAdaptingCard } from "./BookmarkLayoutAdaptingCard";

function CollectionImage({
  bookmark,
  className,
  imageCountLabel,
  coverLabel,
}: {
  bookmark: ZBookmarkTypeCollection;
  className?: string;
  imageCountLabel: string;
  coverLabel: string;
}) {
  const cover = bookmark.content.items.at(0);
  const count = bookmark.content.items.length;

  return (
    <Link
      href={`/dashboard/preview/${bookmark.id}`}
      className="relative block size-full"
    >
      {cover ? (
        <Image
          alt={coverLabel}
          src={getAssetUrl(cover.assetId)}
          fill={true}
          unoptimized
          className={className}
        />
      ) : (
        <div className={cn(className, "bg-muted")} />
      )}
      {count > 1 && (
        <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {imageCountLabel}
        </span>
      )}
    </Link>
  );
}

export default function CollectionCard({
  bookmark,
  className,
  bookmarkIndex,
}: {
  bookmark: ZBookmarkTypeCollection;
  className?: string;
  bookmarkIndex?: number;
}) {
  const { t } = useTranslation();
  const imageCountLabel = t("common.image_count", {
    count: bookmark.content.items.length,
  });

  return (
    <BookmarkLayoutAdaptingCard
      title={bookmark.title ?? imageCountLabel}
      bookmark={bookmark}
      className={className}
      bookmarkIndex={bookmarkIndex}
      wrapTags={true}
      image={(_layout, className) => (
        <div className="relative size-full flex-1">
          <CollectionImage
            bookmark={bookmark}
            className={className}
            imageCountLabel={imageCountLabel}
            coverLabel={t("common.collection_cover")}
          />
        </div>
      )}
    />
  );
}
