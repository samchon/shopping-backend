import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IBbsArticleComment } from "@samchon/shopping-api/lib/structures/common/IBbsArticleComment";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";

import { BbsArticleCommentSnapshotProvider } from "./BbsArticleCommentSnapshotProvider";

export namespace BbsArticleCommentProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_commentsGetPayload<ReturnType<typeof select>>,
    ): IBbsArticleComment => ({
      id: input.id,
      parent_id: input.parent_id,
      snapshots: input.snapshots
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(BbsArticleCommentSnapshotProvider.json.transform),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          snapshots: BbsArticleCommentSnapshotProvider.json.select(),
        },
      }) satisfies Prisma.bbs_article_commentsFindManyArgs;
  }

  export const search = (
    input: IBbsArticleComment.IRequest.ISearch | null | undefined,
  ) =>
    (input?.body?.length
      ? [
          {
            snapshots: {
              some: {
                body: {
                  contains: input.body,
                  mode: "insensitive",
                },
              },
            },
          },
        ]
      : []) satisfies Prisma.bbs_article_commentsWhereInput["AND"];

  export const orderBy = (
    key: IBbsArticleComment.IRequest.SortableColumns,
    value: "asc" | "desc",
  ): Prisma.bbs_article_commentsOrderByWithRelationInput | null =>
    key === "created_at" ? { created_at: value } : null;

  export const collect =
    <Input extends IBbsArticleComment.ICreate>(
      factory: (
        input: Input,
      ) => Omit<Prisma.bbs_article_comment_snapshotsCreateInput, "comment">,
    ) =>
    (article: IEntity) =>
    (input: Input): Prisma.bbs_article_commentsCreateInput => ({
      id: v4(),
      article: {
        connect: { id: article.id },
      },
      snapshots: {
        create: [factory(input)],
      },
      created_at: new Date(),
    });
}
