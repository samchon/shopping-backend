import { Prisma } from "@prisma/sdk";

import { IShoppingSaleInquiry } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiry";

import { BbsArticleProvider } from "../../../common/BbsArticleProvider";
import { ShoppingCitizenProvider } from "../../actors/ShoppingCitizenProvider";

export namespace ShoppingSaleSnapshotInquiryProvider {
  export const search = (
    input: IShoppingSaleInquiry.IRequest.ISearch | null | undefined,
  ) =>
    [
      // BASIC ARTICLE
      ...BbsArticleProvider.search(input).map((base) => ({ base })),

      // MEMBER AND CITIZEN
      ...ShoppingCitizenProvider.search(input).map((citizen) => ({
        customer: { citizen },
      })),
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

      // ANSWERED
      ...(typeof input?.answered === "boolean"
        ? [
            {
              answer: input.answered === true ? { isNot: null } : { is: null },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_sale_snapshot_inquiriesWhereInput["AND"];

  export const orderBy = (
    key: IShoppingSaleInquiry.IRequest.SortableColumns,
    direction: "asc" | "desc",
  ) =>
    (key === "nickname"
      ? {
          customer: {
            member: {
              nickname: direction,
            },
          },
        }
      : key === "answered_at"
        ? {
            answer: {
              base: {
                created_at: direction,
              },
            },
          }
        : {
            base: BbsArticleProvider.orderBy(key, direction),
          }) satisfies Prisma.shopping_sale_snapshot_inquiriesOrderByWithRelationInput;
}
