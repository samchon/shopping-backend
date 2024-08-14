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

export const validate_api_shopping_sale_inquiry_comment_index_search = async (
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

  const search = TestValidator.search("search comments")(
    async (search: IShoppingSaleInquiryComment.IRequest.ISearch) => {
      const page: IPage<IShoppingSaleInquiryComment> =
        await ShoppingApi.functional.shoppings.customers.sales[
          `${inquiry.type}s`
        ].comments.index(pool.customer, sale.id, inquiry.id, {
          search,
          limit: total.length,
        });
      return page.data;
    },
  )(total);

  await search({
    fields: ["name"],
    values: (c) => [c.writer.citizen!.name!],
    request: ([name]) => ({ name }),
    filter: (c, [name]) => c.writer.citizen!.name === name,
  });
  await search({
    fields: ["nickname"],
    values: (c) => [c.writer.member!.nickname],
    request: ([nickname]) => ({ nickname }),
    filter: (c, [nickname]) =>
      c.writer.member!.nickname.includes(nickname) ?? false,
  });
  await search({
    fields: ["body"],
    values: (c) => [c.snapshots.at(-1)!.body.substring(0, 10)],
    request: ([body]) => ({ body }),
    filter: (c, [body]) => c.snapshots.at(-1)!.body.includes(body),
  });
};
