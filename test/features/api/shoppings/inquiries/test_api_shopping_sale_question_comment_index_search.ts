import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_inquiry_comment } from "./internal/generate_random_sale_inquiry_comment";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_comment_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  const admin: IShoppingAdministrator.IInvert =
    await test_api_shopping_admin_login(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );
  const seller: IShoppingSeller.IInvert = await test_api_shopping_seller_join(
    pool,
  );

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  const generator = generate_random_sale_inquiry_comment({
    pool,
    sale,
    inquiry: question,
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
        await ShoppingApi.functional.shoppings.customers.sales.questions.comments.index(
          pool.customer,
          sale.id,
          question.id,
          {
            search,
            limit: total.length,
          },
        );
      return typia.assertEquals(page).data;
    },
  )(total);

  await search({
    fields: ["name"],
    values: (c) => [c.writer?.citizen?.name!],
    request: ([name]) => ({ name }),
    filter: (c, [name]) => c.writer?.citizen?.name === name,
  });
  await search({
    fields: ["nickname"],
    values: (c) => [c.writer.member!.nickname],
    request: ([nickname]) => ({ nickname }),
    filter: (c, [nickname]) =>
      c.writer.member!.nickname!?.includes(nickname) ?? false,
  });
  await search({
    fields: ["body"],
    values: (c) => [c.snapshots.at(-1)!.body.substring(0, 10)],
    request: ([body]) => ({ body }),
    filter: (c, [body]) => c.snapshots.at(-1)!.body.includes(body),
  });
};
