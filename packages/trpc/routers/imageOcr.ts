import { z } from "zod";

import { createScopedAuthedProcedure, router } from "../index";
import { ImageOcrService } from "../models/imageOcr.service";

const imageOcrProcedure = createScopedAuthedProcedure("bookmarks");

export const imageOcrAppRouter = router({
  reprocess: imageOcrProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()).max(500),
        force: z.boolean().optional().default(false),
      }),
    )
    .output(
      z.object({
        totalItems: z.number().int().nonnegative(),
        queuedItems: z.number().int().nonnegative(),
        skippedAlreadyProcessed: z.number().int().nonnegative(),
        skippedUnsupported: z.number().int().nonnegative(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await new ImageOcrService(ctx.db).reprocess(
        input.bookmarkIds,
        ctx.user.id,
        input.force,
      );
    }),
});
