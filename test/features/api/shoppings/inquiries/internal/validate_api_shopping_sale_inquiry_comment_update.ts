import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiry } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiry";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article_comment } from "../../../common/internal/prepare_random_bbs_article_comment";
import { generate_random_sale_inquiry_comment } from "./generate_random_sale_inquiry_comment";

export const validate_api_shopping_sale_inquiry_comment_update = async (
  pool: ConnectionPool,
  customer: IShoppingCustomer,
  sale: IShoppingSale,
  inquiry: IShoppingSaleInquiry<"question" | "review", any>,
): Promise<void> => {
  const comment: IShoppingSaleInquiryComment =
    await generate_random_sale_inquiry_comment({
      pool,
      sale,
      inquiry,
    })(customer);

  comment.snapshots.push(
    ...(await ArrayUtil.asyncRepeat(4)(async () => {
      const snapshot: IShoppingSaleInquiryComment.ISnapshot =
        await ShoppingApi.functional.shoppings.customers.sales[
          `${inquiry.type}s`
        ].comments.update(
          pool.customer,
          sale.id,
          inquiry.id,
          comment.id,
          prepare_random_bbs_article_comment(),
        );
      return typia.assertEquals(snapshot);
    })),
  );

  const read: IShoppingSaleInquiryComment =
    await ShoppingApi.functional.shoppings.customers.sales[
      `${inquiry.type}s`
    ].comments.at(pool.customer, sale.id, inquiry.id, comment.id);
  typia.assertEquals(read);
  TestValidator.equals("read")(read)(comment);
};
