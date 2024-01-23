import { InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";

import { ShoppingGlobal } from "../../../../ShoppingGlobal";
import { BbsArticleProvider } from "../../../common/BbsArticleProvider";
import { BbsArticleSnapshotProvider } from "../../../common/BbsArticleSnapshotProvider";
import { ShoppingSellerProvider } from "../../actors/ShoppingSellerProvider";

export namespace ShoppingSaleSnapshotInquiryAnswerProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace summarize {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_inquiry_answersGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleInquiryAnswer.ISummary => ({
      ...BbsArticleProvider.summarize.transform(input.base),
      seller: ShoppingSellerProvider.invert.transform(
        () =>
          new InternalServerErrorException(
            "The answer has not been registered by seller.",
          ),
      )(input.sellerCustomer),
    });
    export const select = () =>
      ({
        include: {
          base: BbsArticleProvider.summarize.select(),
          sellerCustomer: ShoppingSellerProvider.invert.select(),
        },
      }) satisfies Prisma.shopping_sale_snapshot_inquiry_answersFindManyArgs;
  }

  export namespace abridge {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_inquiry_answersGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleInquiryAnswer.IAbridge => ({
      ...BbsArticleProvider.abridge.transform(input.base),
      seller: ShoppingSellerProvider.invert.transform(
        () =>
          new InternalServerErrorException(
            "The answer has not been registered by seller.",
          ),
      )(input.sellerCustomer),
    });
    export const select = () =>
      ({
        include: {
          base: BbsArticleProvider.abridge.select(),
          sellerCustomer: ShoppingSellerProvider.invert.select(),
        },
      }) satisfies Prisma.shopping_sale_snapshot_inquiry_answersFindManyArgs;
  }

  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_inquiry_answersGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleInquiryAnswer => {
      const seller = ShoppingSellerProvider.invert.transform(
        () =>
          new InternalServerErrorException(
            "The answer has not been registered by seller.",
          ),
      )(input.sellerCustomer);
      return {
        ...BbsArticleProvider.json.transform(input.base),
        seller,
      };
    };
    export const select = () =>
      ({
        include: {
          base: BbsArticleProvider.json.select(),
          sellerCustomer: ShoppingSellerProvider.invert.select(),
        },
      }) satisfies Prisma.shopping_sale_snapshot_inquiry_answersFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (seller: IShoppingSeller.IInvert) =>
    (related: { sale: IEntity; inquiry: IEntity }) =>
    async (
      input: IShoppingSaleInquiryAnswer.ICreate,
    ): Promise<IShoppingSaleInquiryAnswer> => {
      await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiries.findFirstOrThrow(
        {
          where: {
            id: related.inquiry.id,
            snapshot: {
              sale: {
                id: related.sale.id,
                sellerCustomer: {
                  member: {
                    of_seller: {
                      id: seller.id,
                    },
                  },
                },
              },
            },
          },
        },
      );
      const record =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_answers.create(
          {
            data: collect(seller)(related.inquiry)(input),
            ...json.select(),
          },
        );
      return json.transform(record);
    };

  export const update =
    (seller: IShoppingSeller.IInvert) =>
    (related: { sale: IEntity; inquiry: IEntity }) =>
    async (
      input: IShoppingSaleInquiryAnswer.IUpdate,
    ): Promise<IShoppingSaleInquiryAnswer.ISnapshot> => {
      const answer =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_answers.findFirstOrThrow(
          {
            where: {
              inquiry: {
                id: related.inquiry.id,
                snapshot: {
                  shopping_sale_id: related.sale.id,
                },
              },
              sellerCustomer: {
                member: {
                  of_seller: {
                    id: seller.id,
                  },
                },
              },
            },
          },
        );
      return BbsArticleSnapshotProvider.create(answer)(input);
    };

  const collect =
    (seller: IShoppingSeller.IInvert) =>
    (inquiry: IEntity) =>
    (input: IShoppingSaleInquiryAnswer.ICreate) =>
      ({
        base: {
          create: BbsArticleProvider.collect(
            BbsArticleSnapshotProvider.collect,
          )(input),
        },
        inquiry: {
          connect: {
            id: inquiry.id,
          },
        },
        sellerCustomer: {
          connect: {
            id: seller.customer.id,
          },
        },
      }) satisfies Prisma.shopping_sale_snapshot_inquiry_answersCreateInput;
}
