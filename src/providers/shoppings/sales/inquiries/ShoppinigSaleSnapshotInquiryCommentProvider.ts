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
      >
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
          `The comment has not been registered by ${input.actor_type}.`
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
      }) satisfies Prisma.shopping_sale_snapshot_inquiry_commentsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    inquiry: IEntity;
    input: IShoppingSaleInquiryComment.IRequest;
  }): Promise<IPage<IShoppingSaleInquiryComment>> => {
    if (props.actor.type === "seller")
      await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          id: props.sale.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.actor.id,
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
              bbs_article_id: props.inquiry.id,
            },
          },
          ...search(props.input.search),
        ],
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(BbsArticleCommentProvider.orderBy)(
            props.input.sort
          ).map((base) => ({ base }))
        : [{ base: { created_at: "asc" } }],
    })(props.input);
  };

  export const at = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    inquiry: IEntity;
    id: string;
  }): Promise<IShoppingSaleInquiryComment> => {
    if (props.actor.type === "seller")
      await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          id: props.sale.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.actor.id,
              },
            },
          },
        },
      });
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_comments.findFirstOrThrow(
        {
          where: {
            id: props.id,
            base: {
              article: {
                of_inquiry: {
                  id: props.inquiry.id,
                  snapshot: {
                    shopping_sale_id: props.sale.id,
                  },
                },
              },
            },
          },
          ...json.select(),
        }
      );
    return json.transform(record);
  };

  const search = (
    input: undefined | IShoppingSaleInquiryComment.IRequest.ISearch
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
  export const create = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    inquiry: IEntity;
    input: IShoppingSaleInquiryComment.ICreate;
  }): Promise<IShoppingSaleInquiryComment> => {
    const inquiry =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiries.findFirstOrThrow(
        {
          where: {
            id: props.inquiry.id,
            snapshot: {
              sale: {
                id: props.sale.id,
                sellerCustomer:
                  props.actor.type === "seller"
                    ? {
                        member: {
                          of_seller: {
                            id: props.actor.id,
                          },
                        },
                      }
                    : undefined,
              },
            },
          },
        }
      );
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshot_inquiry_comments.create(
        {
          data: collect({
            actor: props.actor,
            input: props.input,
            inquiry,
          }),
          ...json.select(),
        }
      );
    return json.transform(record);
  };

  export const update = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    inquiry: IEntity;
    id: string;
    input: IShoppingSaleInquiryComment.IUpdate;
  }): Promise<IShoppingSaleInquiryComment.ISnapshot> => {
    const comment: IShoppingSaleInquiryComment = await at(props);
    if (false === ShoppingActorProvider.equals(comment.writer, props.actor))
      throw ErrorProvider.forbidden({
        accessor: "id",
        message: `This comment is not yours.`,
      });
    return BbsArticleCommentSnapshotProvider.create({ id: props.id })(
      props.input
    );
  };

  const collect = (props: {
    actor: IShoppingActorEntity;
    inquiry: IEntity;
    input: IShoppingSaleInquiryComment.ICreate;
  }) =>
    ({
      base: {
        create: BbsArticleCommentProvider.collect(
          BbsArticleCommentSnapshotProvider.collect
        )(props.inquiry)(props.input),
      },
      actor_type: props.actor.type,
      customer: {
        connect: {
          id:
            props.actor.type === "customer"
              ? props.actor.id
              : props.actor.customer.id,
        },
      },
    }) satisfies Prisma.shopping_sale_snapshot_inquiry_commentsCreateInput;
}
