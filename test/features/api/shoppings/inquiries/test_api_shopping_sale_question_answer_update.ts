import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";
import { validate_api_shopping_sale_inquiry_answer_update } from "./internal/validate_api_shopping_sale_inquiry_answer_update";

export const test_api_shopping_sale_question_answer_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  await validate_api_shopping_sale_inquiry_answer_update({
    read: ShoppingApi.functional.shoppings.customers.sales.questions.at,
    create:
      ShoppingApi.functional.shoppings.sellers.sales.questions.answer.create,
    update:
      ShoppingApi.functional.shoppings.sellers.sales.questions.answer.update,
  })(pool, sale, question);
};
