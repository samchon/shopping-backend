import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IBbsArticle } from "@samchon/shopping-api/lib/structures/common/IBbsArticle";

import { AttachmentFileProvider } from "./AttachmentFileProvider";
import { BbsArticleSnapshotProvider } from "./BbsArticleSnapshotProvider";

export namespace BbsArticleProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_articlesGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle => ({
      id: input.id,
      snapshots: input.snapshots
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(BbsArticleSnapshotProvider.json.transform),
      created_at: input.created_at.toISOString(),
    });

    export const select = () =>
      ({
        include: {
          snapshots: BbsArticleSnapshotProvider.json.select(),
        },
      } satisfies Prisma.bbs_articlesFindManyArgs);
  }

  export namespace abridge {
    export const transform = (
      input: Prisma.bbs_articlesGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle.IAbridge => ({
      id: input.id,
      title: input.mv_last!.snapshot.title,
      body: input.mv_last!.snapshot.body,
      format: input.mv_last!.snapshot.format as IBbsArticle.Format,
      created_at: input.created_at.toISOString(),
      updated_at: input.mv_last!.snapshot.created_at.toISOString(),
      files: input.mv_last!.snapshot.to_files.map((p) =>
        AttachmentFileProvider.json.transform(p.file),
      ),
    });
    export const select = () => ({
      include: {
        mv_last: {
          include: {
            snapshot: {
              include: {
                to_files: {
                  include: {
                    file: AttachmentFileProvider.json.select(),
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  export namespace summarize {
    export const transform = (
      input: Prisma.bbs_articlesGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle.ISummary => ({
      id: input.id,
      title: input.mv_last!.snapshot.title,
      created_at: input.created_at.toISOString(),
      updated_at: input.mv_last!.snapshot.created_at.toISOString(),
    });
    export const select = () => ({
      include: {
        mv_last: {
          include: {
            snapshot: {
              select: {
                title: true,
                created_at: true,
              },
            },
          },
        },
      },
    });
  }

  export const search = (input: IBbsArticle.IRequest.ISearch | undefined) =>
    [
      ...(input?.title?.length
        ? [
            {
              mv_last: {
                snapshot: {
                  title: {
                    contains: input.title,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ]
        : []),
      ...(input?.body?.length
        ? [
            {
              mv_last: {
                snapshot: {
                  body: {
                    contains: input.body,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ]
        : []),
      ...(input?.title_or_body?.length
        ? [
            {
              OR: [
                {
                  mv_last: {
                    snapshot: {
                      title: {
                        contains: input.title_or_body,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
                {
                  mv_last: {
                    snapshot: {
                      body: {
                        contains: input.title_or_body,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
              ],
            },
          ]
        : []),
      ...(input?.from?.length
        ? [
            {
              created_at: {
                gte: new Date(input.from),
              },
            },
          ]
        : []),
      ...(input?.to?.length
        ? [
            {
              created_at: {
                lte: new Date(input.to),
              },
            },
          ]
        : []),
    ] satisfies Prisma.bbs_articlesWhereInput["AND"];

  export const orderBy = (
    key: IBbsArticle.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "title"
      ? { mv_last: { snapshot: { title: value } } }
      : key === "created_at"
      ? { created_at: value }
      : {
          mv_last: { snapshot: { created_at: value } },
        }) satisfies Prisma.bbs_articlesOrderByWithRelationInput;

  export const collect =
    <Input extends IBbsArticle.ICreate>(
      snapshotFactory: (
        input: Input,
      ) => Omit<Prisma.bbs_article_snapshotsCreateInput, "article">,
    ) =>
    (input: Input): Prisma.bbs_articlesCreateInput => {
      const snapshot = snapshotFactory(input);
      return {
        id: v4(),
        snapshots: {
          create: [snapshot],
        },
        created_at: new Date(),
        deleted_at: null,
        mv_last: {
          create: {
            snapshot: { connect: { id: snapshot.id } },
          },
        },
      };
    };
}
