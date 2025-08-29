import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  const read: IShoppingSaleQuestion =
    await ShoppingApi.functional.shoppings.customers.sales.questions.at(
      pool.customer,
      sale.id,
      question.id,
    );
  TestValidator.equals("read", question, read);

  const page: IPage<IShoppingSaleQuestion.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.questions.index(
      pool.customer,
      sale.id,
      {
        limit: 1,
      },
    );
  TestValidator.equals("page", question.id, page.data[0].id);
};
