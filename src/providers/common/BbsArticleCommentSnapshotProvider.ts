import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IBbsArticleComment } from "@samchon/shopping-api/lib/structures/common/IBbsArticleComment";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";

import { ShoppingGlobal } from "../../ShoppingGlobal";
import { AttachmentFileProvider } from "./AttachmentFileProvider";

export namespace BbsArticleCommentSnapshotProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_comment_snapshotsGetPayload<
        ReturnType<typeof select>
      >,
    ): IBbsArticleComment.ISnapshot => ({
      id: input.id,
      format: input.format as any,
      body: input.body,
      files: input.files
        .sort((a, b) => a.sequence - b.sequence)
        .map((p) => AttachmentFileProvider.json.transform(p.file)),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          files: {
            include: {
              file: AttachmentFileProvider.json.select(),
            },
          },
        },
      }) satisfies Prisma.bbs_article_comment_snapshotsFindManyArgs;
  }

  export const create =
    (comment: IEntity) =>
    async (
      input: IBbsArticleComment.IUpdate,
    ): Promise<IBbsArticleComment.ISnapshot> => {
      const snapshot =
        await ShoppingGlobal.prisma.bbs_article_comment_snapshots.create({
          data: {
            ...collect(input),
            comment: { connect: { id: comment.id } },
          },
          ...json.select(),
        });
      return json.transform(snapshot);
    };

  export const collect = (
    input: IBbsArticleComment.ICreate,
  ): Omit<Prisma.bbs_article_comment_snapshotsCreateInput, "comment"> => ({
    id: v4(),
    format: input.format,
    body: input.body,
    created_at: new Date(),
    files: {
      create: input.files.map((file, i) => ({
        id: v4(),
        file: {
          create: AttachmentFileProvider.collect(file),
        },
        sequence: i,
      })),
    },
  });
}
