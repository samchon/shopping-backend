import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_customer_join(pool);
  await test_api_shopping_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const total: IShoppingSaleQuestion[] = await ArrayUtil.asyncRepeat(10)(() =>
    generate_random_sale_question(pool, sale),
  );

  const validator = TestValidator.sort("sort questions")<
    IShoppingSaleQuestion.ISummary,
    IShoppingSaleQuestion.IRequest.SortableColumns,
    IPage.Sort<IShoppingSaleQuestion.IRequest.SortableColumns>
  >(
    async (
      input: IPage.Sort<IShoppingSaleQuestion.IRequest.SortableColumns>,
    ) => {
      const page: IPage<IShoppingSaleQuestion.ISummary> =
        await ShoppingApi.functional.shoppings.customers.sales.questions.index(
          pool.customer,
          sale.id,
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
    validator("updated_at")(GaffComparator.dates((x) => x.updated_at)),
    validator("title")(GaffComparator.strings((x) => x.title)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
