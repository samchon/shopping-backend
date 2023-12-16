import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiry } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiry";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_sale_inquiry_comment =
  (asset: {
    pool: ConnectionPool;
    sale: IShoppingSale;
    inquiry: IShoppingSaleInquiry<any, any>;
  }) =>
  async (
    actor: IShoppingActorEntity,
    input?: Partial<IShoppingSaleInquiryComment.ICreate>,
  ): Promise<IShoppingSaleInquiryComment> => {
    const type =
      actor.type === "customer"
        ? "customer"
        : actor.type === "seller"
        ? "seller"
        : "admin";
    const comment: IShoppingSaleInquiryComment =
      await ShoppingApi.functional.shoppings[
        `${type}s`
      ].sales.questions.comments.create(
        asset.pool[type],
        asset.sale.id,
        asset.inquiry.id,
        {
          body: RandomGenerator.content()()(),
          format: "txt",
          files: [],
          ...input,
        },
      );
    return typia.assertEquals(comment);
  };
