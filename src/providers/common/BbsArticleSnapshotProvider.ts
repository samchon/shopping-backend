import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IBbsArticle } from "@samchon/shopping-api/lib/structures/common/IBbsArticle";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";

import { ShoppingGlobal } from "../../ShoppingGlobal";
import { AttachmentFileProvider } from "./AttachmentFileProvider";

export namespace BbsArticleSnapshotProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_snapshotsGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle.ISnapshot => ({
      id: input.id,
      title: input.title,
      format: input.format as any,
      body: input.body,
      files: input.to_files
        .sort((a, b) => a.sequence - b.sequence)
        .map((p) => AttachmentFileProvider.json.transform(p.file)),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          to_files: {
            include: {
              file: AttachmentFileProvider.json.select(),
            },
          },
        },
      }) satisfies Prisma.bbs_article_snapshotsFindManyArgs;
  }

  export const create =
    (article: IEntity) =>
    async (input: IBbsArticle.IUpdate): Promise<IBbsArticle.ISnapshot> => {
      const snapshot = await ShoppingGlobal.prisma.bbs_article_snapshots.create(
        {
          data: {
            ...collect(input),
            article: { connect: { id: article.id } },
          },
          ...json.select(),
        },
      );
      await ShoppingGlobal.prisma.mv_bbs_article_last_snapshots.update({
        where: {
          bbs_article_id: article.id,
        },
        data: {
          bbs_article_snapshot_id: snapshot.id,
        },
      });
      return json.transform(snapshot);
    };

  export const collect = (
    input: IBbsArticle.ICreate,
  ): Omit<Prisma.bbs_article_snapshotsCreateInput, "article"> => ({
    id: v4(),
    title: input.title,
    format: input.format,
    body: input.body,
    created_at: new Date(),
    to_files: {
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
