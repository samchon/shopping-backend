import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";
import { validate_api_shopping_sale_inquiry_comment_update } from "./internal/validate_api_shopping_sale_inquiry_comment_update";

export const test_api_shopping_sale_question_comment_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  await validate_api_shopping_sale_inquiry_comment_update(
    pool,
    customer,
    sale,
    question,
  );
};
