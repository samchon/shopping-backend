import { TestValidator } from "@nestia/e2e";

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

export const validate_api_shopping_sale_inquiry_comment_create = async (
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

  const comments: [
    IShoppingSaleInquiryComment,
    IShoppingSaleInquiryComment,
    IShoppingSaleInquiryComment,
  ] = [
    await generator(admin),
    await generator(customer),
    await generator(seller),
  ];
  TestValidator.equals("of_admin", comments[0].writer, admin);
  TestValidator.equals("of_customer", comments[1].writer, customer);
  TestValidator.equals("of_seller", comments[2].writer, seller);

  const page: IPage<IShoppingSaleInquiryComment> =
    await ShoppingApi.functional.shoppings.customers.sales[
      `${inquiry.type}s`
    ].comments.index(pool.customer, sale.id, inquiry.id, {
      limit: 3,
      sort: ["+created_at"],
    });
  TestValidator.equals("page", page.data, comments);
};
