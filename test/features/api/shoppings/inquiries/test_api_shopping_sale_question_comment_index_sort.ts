import { GaffComparator, TestValidator } from "@nestia/e2e";
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

export const test_api_shopping_sale_question_comment_index_sort = async (
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

  const validator = TestValidator.sort("sort comments")<
    IShoppingSaleInquiryComment,
    IShoppingSaleInquiryComment.IRequest.SortableColumns,
    IPage.Sort<IShoppingSaleInquiryComment.IRequest.SortableColumns>
  >(
    async (
      input: IPage.Sort<IShoppingSaleInquiryComment.IRequest.SortableColumns>,
    ) => {
      const page: IPage<IShoppingSaleInquiryComment> =
        await ShoppingApi.functional.shoppings.customers.sales.questions.comments.index(
          pool.customer,
          sale.id,
          question.id,
          {
            sort: input,
            limit: total.length,
          },
        );
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
