"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useTranslation } from "@/lib/i18n/client";
import { useTRPC } from "@karakeep/shared-react/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";

import { BookmarkTypes, ZBookmark } from "@karakeep/shared/types/bookmarks";
import { getAssetUrl } from "@karakeep/shared/utils/assetUtils";

export function CollectionContentSection({
  bookmark,
}: {
  bookmark: ZBookmark;
}) {
  if (bookmark.content.type !== BookmarkTypes.COLLECTION) {
    throw new Error("Invalid content type");
  }

  const { t } = useTranslation();
  const items = [...bookmark.content.items].sort(
    (a, b) => a.position - b.position,
  );
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: reorderItems, isPending } = useMutation(
    api.bookmarks.reorderImageCollectionItems.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          api.bookmarks.getBookmark.queryFilter({ bookmarkId: bookmark.id }),
        );
        queryClient.invalidateQueries(api.bookmarks.getBookmarks.pathFilter());
      },
      onError: () => {
        toast({
          description: t("preview.failed_to_reorder_images"),
          variant: "destructive",
        });
      },
    }),
  );

  const moveItem = (fromIndex: number, toIndex: number) => {
    const nextItems = [...items];
    const [item] = nextItems.splice(fromIndex, 1);
    if (!item) {
      return;
    }
    nextItems.splice(toIndex, 0, item);

    reorderItems({
      bookmarkId: bookmark.id,
      bookmarkIds: nextItems.map((item) => item.bookmarkId),
    });
  };

  return (
    <div className="flex h-full min-w-full flex-col gap-3">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto">
        {items.map((item, index) => (
          <div key={item.bookmarkId} className="flex flex-col gap-2">
            {items.length > 1 && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  {index + 1} / {items.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={index === 0 || isPending}
                    onClick={() => moveItem(index, index - 1)}
                    title="Move up"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={index === items.length - 1 || isPending}
                    onClick={() => moveItem(index, index + 1)}
                    title="Move down"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="relative min-h-[60vh] overflow-hidden rounded border bg-muted">
              <Link
                href={`/dashboard/preview/${item.bookmarkId}`}
                aria-label={t("preview.collection_image", {
                  index: index + 1,
                })}
              >
                <Image
                  alt={t("preview.collection_image", { index: index + 1 })}
                  fill={true}
                  unoptimized
                  className="object-contain"
                  src={getAssetUrl(item.assetId)}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
