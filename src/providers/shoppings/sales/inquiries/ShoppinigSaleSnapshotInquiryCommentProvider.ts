import { Prisma } from "@prisma/client";

import {
  ShoppingAdministratorDiagnoser,
  ShoppingSellerDiagnoser,
} from "@samchon/shopping-api/lib/diagnosers/shoppings";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

import { ShoppingGlobal } from "../../../../ShoppingGlobal";
import { ErrorProvider } from "../../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../../utils/PaginationUtil";
import { BbsArticleCommentProvider } from "../../../common/BbsArticleCommentProvider";
import { BbsArticleCommentSnapshotProvider } from "../../../common/BbsArticleCommentSnapshotProvider";
import { ShoppingActorProvider } from "../../actors/ShoppingActorProvider";
import { ShoppingCitizenProvider } from "../../actors/ShoppingCitizenProvider";
import { ShoppingCustomerProvider } from "../../actors/ShoppingCustomerProvider";

export namespace ShoppingSaleSnapshotInquiryCommentProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_inquiry_commentsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleInquiryComment => {
      const customer = ShoppingCustomerProvider.json.transform(input.customer);
      const writer =
        input.actor_type === "customer"
          ? customer
          : input.actor_type === "seller"
          ? ShoppingSellerDiagnoser.invert(customer)
          : ShoppingAdministratorDiagnoser.invert(customer);
      if (writer === null)
        throw ErrorProvider.internal(
          `The comment has not been registered by ${input.actor_type}.`,
        );
      return {
        ...BbsArticleCommentProvider.json.transform(input.base),
        writer,
      };
    };
    export const select = () =>
      ({
        include: {
          base: BbsArticleCommentProvider.json.select(),
          customer: ShoppingCustomerProvider.json.select(),
        },
      } satisfies Prisma.shopping_sale_snapshot_inquiry_commentsFindManyArgs);
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (actor: IShoppingActorEntity) =>
    (related: { sale: IEntity; inquiry: IEntity }) =>
    async (
      input: IShoppingSaleInquiryComment.IRequest,
    ): Promise<IPage<IShoppingSaleInquiryComment>> => {
      if (actor.type === "seller")
        await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
          where: {
            id: related.sale.id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: actor.id,
                },
              },
            },
          },
        });
      return PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_comments,
        payload: json.select(),
        transform: json.transform,
      })({
        where: {
          AND: [
            {
              base: {
                bbs_article_id: related.inquiry.id,
              },
            },
            ...search(input.search),
          ],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(BbsArticleCommentProvider.orderBy)(
              input.sort,
            ).map((base) => ({ base }))
          : [{ base: { created_at: "asc" } }],
      })(input);
    };

  export const at =
    (actor: IShoppingActorEntity) =>
    (related: { sale: IEntity; inquiry: IEntity }) =>
    async (id: string): Promise<IShoppingSaleInquiryComment> => {
      if (actor.type === "seller")
        await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
          where: {
            id: related.sale.id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: actor.id,
                },
              },
            },
          },
        });
      const record =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_comments.findFirstOrThrow(
          {
            where: {
              id,
              base: {
                article: {
                  of_inquiry: {
                    id: related.inquiry.id,
                    snapshot: {
                      shopping_sale_id: related.sale.id,
                    },
                  },
                },
              },
            },
            ...json.select(),
          },
        );
      return json.transform(record);
    };

  const search = (
    input: undefined | IShoppingSaleInquiryComment.IRequest.ISearch,
  ) =>
    [
      ...BbsArticleCommentProvider.search(input).map((base) => ({
        base,
      })),
      ...(input?.name?.length
        ? ShoppingCitizenProvider.search(input).map((citizen) => ({
            customer: { citizen },
          }))
        : []),
      ...(input?.nickname?.length
        ? [
            {
              customer: {
                member: {
                  nickname: {
                    contains: input.nickname,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_sale_snapshot_inquiry_commentsWhereInput["AND"];

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (actor: IShoppingActorEntity) =>
    (related: { sale: IEntity; inquiry: IEntity }) =>
    async (
      input: IShoppingSaleInquiryComment.ICreate,
    ): Promise<IShoppingSaleInquiryComment> => {
      const inquiry =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiries.findFirstOrThrow(
          {
            where: {
              id: related.inquiry.id,
              snapshot: {
                sale: {
                  id: related.sale.id,
                  sellerCustomer:
                    actor.type === "seller"
                      ? {
                          member: {
                            of_seller: {
                              id: actor.id,
                            },
                          },
                        }
                      : undefined,
                },
              },
            },
          },
        );
      const record =
        await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_comments.create(
          {
            data: collect(actor)(inquiry)(input),
            ...json.select(),
          },
        );
      return json.transform(record);
    };

  export const update =
    (actor: IShoppingActorEntity) =>
    (related: { sale: IEntity; inquiry: IEntity }) =>
    (id: string) =>
    async (
      input: IShoppingSaleInquiryComment.IUpdate,
    ): Promise<IShoppingSaleInquiryComment.ISnapshot> => {
      const comment = await at(actor)(related)(id);
      if (false === ShoppingActorProvider.equals(comment.writer)(actor))
        throw ErrorProvider.forbidden({
          accessor: "id",
          message: `This comment is not yours.`,
        });
      return BbsArticleCommentSnapshotProvider.create({ id })(input);
    };

  const collect =
    (actor: IShoppingActorEntity) =>
    (inquiry: IEntity) =>
    (input: IShoppingSaleInquiryComment.ICreate) =>
      ({
        base: {
          create: BbsArticleCommentProvider.collect(
            BbsArticleCommentSnapshotProvider.collect,
          )(inquiry)(input),
        },
        actor_type: actor.type,
        customer: {
          connect: {
            id: actor.type === "customer" ? actor.id : actor.customer.id,
          },
        },
      } satisfies Prisma.shopping_sale_snapshot_inquiry_commentsCreateInput);
}
