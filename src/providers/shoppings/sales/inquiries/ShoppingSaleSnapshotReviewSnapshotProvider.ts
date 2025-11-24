import { Prisma } from "@prisma/sdk";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ShoppingGlobal } from "../../../../ShoppingGlobal";
import { ErrorProvider } from "../../../../utils/ErrorProvider";
import { BbsArticleSnapshotProvider } from "../../../common/BbsArticleSnapshotProvider";

export namespace ShoppingSaleReviewSnapshotProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_snapshotsGetPayload<ReturnType<typeof select>>,
    ): IShoppingSaleReview.ISnapshot => {
      const rs = input.of_review;
      if (rs === null)
        throw ErrorProvider.internal("Unable to get the score value.");
      return {
        ...BbsArticleSnapshotProvider.json.transform(input),
        score: rs.score,
      };
    };
    export const select = () =>
      ({
        include: {
          ...BbsArticleSnapshotProvider.json.select().include,
          of_review: true,
        },
      }) satisfies Prisma.bbs_article_snapshotsFindManyArgs;
  }

  export const create = async (props: {
    review: IEntity;
    input: IShoppingSaleReview.IUpdate;
  }): Promise<IShoppingSaleReview.ISnapshot> => {
    const record = await ShoppingGlobal.prisma.bbs_article_snapshots.create({
      data: {
        ...collect(props.input),
        article: { connect: { id: props.review.id } },
      },
      ...json.select(),
    });
    return json.transform(record);
  };

  export const collect = (input: IShoppingSaleReview.IUpdate) =>
    ({
      ...BbsArticleSnapshotProvider.collect(input),
      of_review: {
        create: {
          score: input.score,
        },
      },
    }) satisfies Prisma.bbs_article_snapshotsCreateWithoutArticleInput;
}
