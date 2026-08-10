import { beforeEach, describe, expect, test, vi } from "vitest";

import { bookmarkAssets, bookmarks } from "@karakeep/db/schema";
import { QueuePriority } from "@karakeep/shared-server";
import { BookmarkTypes } from "@karakeep/shared/types/bookmarks";

import type { CustomTestContext, TestDB } from "../testUtils";
import { defaultBeforeEach, getTestQueueMocks } from "../testUtils";

const testQueueMocks = getTestQueueMocks();

beforeEach<CustomTestContext>(async (context) => {
  vi.clearAllMocks();
  await defaultBeforeEach(true)(context);
});

async function seedImageBookmarks(
  db: TestDB,
  ownerId: string,
  otherUserId: string,
) {
  const [missingImage, processedImage, pdf, text, otherUserImage] = await db
    .insert(bookmarks)
    .values([
      { userId: ownerId, type: BookmarkTypes.ASSET },
      { userId: ownerId, type: BookmarkTypes.ASSET },
      { userId: ownerId, type: BookmarkTypes.ASSET },
      { userId: ownerId, type: BookmarkTypes.TEXT },
      { userId: otherUserId, type: BookmarkTypes.ASSET },
    ])
    .returning();

  await db.insert(bookmarkAssets).values([
    {
      id: missingImage.id,
      assetType: "image",
      assetId: "missing-image-asset",
      content: null,
    },
    {
      id: processedImage.id,
      assetType: "image",
      assetId: "processed-image-asset",
      content: "Existing OCR text",
    },
    {
      id: pdf.id,
      assetType: "pdf",
      assetId: "pdf-asset",
      content: null,
    },
    {
      id: otherUserImage.id,
      assetType: "image",
      assetId: "other-user-image-asset",
      content: null,
    },
  ]);

  return { missingImage, processedImage, pdf, text, otherUserImage };
}

describe("Image OCR dispatch", () => {
  test<CustomTestContext>("queues OCR only for owned image bookmarks without extracted text", async ({
    apiCallers,
    db,
  }) => {
    const [owner, otherUser] = await db.query.users.findMany({
      orderBy: (user, { asc }) => [asc(user.email)],
      limit: 2,
    });
    const seeded = await seedImageBookmarks(db, owner.id, otherUser.id);

    const result = await apiCallers[0].imageOcr.reprocess({
      bookmarkIds: [
        seeded.missingImage.id,
        seeded.processedImage.id,
        seeded.pdf.id,
        seeded.text.id,
        seeded.otherUserImage.id,
        seeded.missingImage.id,
      ],
    });

    expect(result).toEqual({
      totalItems: 5,
      queuedItems: 1,
      skippedAlreadyProcessed: 1,
      skippedUnsupported: 3,
    });
    expect(testQueueMocks.assetPreprocessingEnqueue).toHaveBeenCalledOnce();
    expect(testQueueMocks.assetPreprocessingEnqueue).toHaveBeenCalledWith(
      {
        bookmarkId: seeded.missingImage.id,
        fixMode: true,
      },
      {
        groupId: owner.id,
        priority: QueuePriority.Default,
        idempotencyKey: `image-ocr:${seeded.missingImage.id}:missing-image-asset:missing`,
      },
    );
  });

  test<CustomTestContext>("force mode queues both missing and already processed image bookmarks", async ({
    apiCallers,
    db,
  }) => {
    const [owner, otherUser] = await db.query.users.findMany({
      orderBy: (user, { asc }) => [asc(user.email)],
      limit: 2,
    });
    const seeded = await seedImageBookmarks(db, owner.id, otherUser.id);

    const result = await apiCallers[0].imageOcr.reprocess({
      bookmarkIds: [seeded.missingImage.id, seeded.processedImage.id],
      force: true,
    });

    expect(result).toEqual({
      totalItems: 2,
      queuedItems: 2,
      skippedAlreadyProcessed: 0,
      skippedUnsupported: 0,
    });
    expect(testQueueMocks.assetPreprocessingEnqueue).toHaveBeenCalledTimes(2);
    expect(testQueueMocks.assetPreprocessingEnqueue).toHaveBeenNthCalledWith(
      1,
      { bookmarkId: seeded.missingImage.id, fixMode: false },
      expect.objectContaining({
        groupId: owner.id,
        idempotencyKey: expect.stringMatching(/:force$/),
      }),
    );
    expect(testQueueMocks.assetPreprocessingEnqueue).toHaveBeenNthCalledWith(
      2,
      { bookmarkId: seeded.processedImage.id, fixMode: false },
      expect.objectContaining({
        groupId: owner.id,
        idempotencyKey: expect.stringMatching(/:force$/),
      }),
    );
  });
});
