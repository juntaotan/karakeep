import { and, eq, inArray } from "drizzle-orm";

import type { DB } from "@karakeep/db";
import { bookmarks } from "@karakeep/db/schema";
import {
  AssetPreprocessingQueue,
  QueuePriority,
} from "@karakeep/shared-server";
import { BookmarkTypes } from "@karakeep/shared/types/bookmarks";

export interface ReprocessImageOcrResult {
  totalItems: number;
  queuedItems: number;
  skippedAlreadyProcessed: number;
  skippedUnsupported: number;
}

/**
 * The shared OCR dispatch boundary for image bookmarks. Collection code only
 * needs to pass its ordered item bookmark ids; OCR extraction and persistence
 * remain owned by AssetPreprocessingWorker.
 */
export class ImageOcrService {
  constructor(private readonly db: DB) {}

  async reprocess(
    bookmarkIds: string[],
    userId: string,
    force: boolean,
  ): Promise<ReprocessImageOcrResult> {
    const uniqueBookmarkIds = [...new Set(bookmarkIds)];
    if (uniqueBookmarkIds.length === 0) {
      return {
        totalItems: 0,
        queuedItems: 0,
        skippedAlreadyProcessed: 0,
        skippedUnsupported: 0,
      };
    }

    const imageBookmarks = await this.db.query.bookmarks.findMany({
      where: and(
        inArray(bookmarks.id, uniqueBookmarkIds),
        eq(bookmarks.userId, userId),
      ),
      with: {
        asset: true,
      },
    });
    const bookmarksById = new Map(
      imageBookmarks.map((bookmark) => [bookmark.id, bookmark]),
    );

    const itemsToQueue: {
      bookmarkId: string;
      assetId: string;
    }[] = [];
    let skippedAlreadyProcessed = 0;
    let skippedUnsupported = 0;

    // Preserve the caller's order so collection positions also determine queue
    // submission order.
    for (const bookmarkId of uniqueBookmarkIds) {
      const bookmark = bookmarksById.get(bookmarkId);
      const asset = bookmark?.asset;

      if (
        bookmark?.type !== BookmarkTypes.ASSET ||
        asset?.assetType !== "image"
      ) {
        skippedUnsupported++;
        continue;
      }

      // This matches the asset preprocessing worker's fix-mode behavior:
      // preserve existing OCR text unless the caller explicitly forces a rerun.
      if (!force && asset.content) {
        skippedAlreadyProcessed++;
        continue;
      }

      itemsToQueue.push({ bookmarkId, assetId: asset.assetId });
    }

    await Promise.all(
      itemsToQueue.map(({ bookmarkId, assetId }) =>
        AssetPreprocessingQueue.enqueue(
          {
            bookmarkId,
            fixMode: !force,
          },
          {
            groupId: userId,
            priority: QueuePriority.Default,
            idempotencyKey: `image-ocr:${bookmarkId}:${assetId}:${force ? "force" : "missing"}`,
          },
        ),
      ),
    );

    return {
      totalItems: uniqueBookmarkIds.length,
      queuedItems: itemsToQueue.length,
      skippedAlreadyProcessed,
      skippedUnsupported,
    };
  }
}
