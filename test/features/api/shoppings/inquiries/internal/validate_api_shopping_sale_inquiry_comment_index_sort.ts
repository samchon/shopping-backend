import { GaffComparator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiry } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiry";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { generate_random_sale_inquiry_comment } from "./generate_random_sale_inquiry_comment";

export const validate_api_shopping_sale_inquiry_comment_index_sort = async (
  pool: ConnectionPool,
  admin: IShoppingAdministrator.IInvert,
  customer: IShoppingCustomer,
  seller: IShoppingSeller.IInvert,
  sale: IShoppingSale,
  inquiry: IShoppingSaleInquiry<"question" | "review", any>,
): Promise<void> => {
  const generator = generate_random_sale_inquiry_comment({
    pool,
    sale,
    inquiry,
  });
  const total: IShoppingSaleInquiryComment[] = [
    await generator(admin),
    await generator(customer),
    await generator(seller),
    await generator(admin),
    await generator(customer),
    await generator(seller),
    await generator(admin),
    await generator(customer),
    await generator(seller),
  ];

  const validator = TestValidator.sort("sort comments")<
    IShoppingSaleInquiryComment,
    IShoppingSaleInquiryComment.IRequest.SortableColumns,
    IPage.Sort<IShoppingSaleInquiryComment.IRequest.SortableColumns>
  >(
    async (
      input: IPage.Sort<IShoppingSaleInquiryComment.IRequest.SortableColumns>,
    ) => {
      const page: IPage<IShoppingSaleInquiryComment> =
        await ShoppingApi.functional.shoppings.customers.sales[
          `${inquiry.type}s`
        ].comments.index(pool.customer, sale.id, inquiry.id, {
          sort: input,
          limit: total.length,
        });
      return typia.assertEquals(page).data;
    },
  );

  const components = [
    validator("created_at")(GaffComparator.dates((x) => x.created_at)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
