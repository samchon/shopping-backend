import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../common/internal/prepare_random_bbs_article";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  question.snapshots.push(
    ...(await ArrayUtil.asyncRepeat(4, async () => {
      const snapshot: IShoppingSaleQuestion.ISnapshot =
        await ShoppingApi.functional.shoppings.customers.sales.questions.update(
          pool.customer,
          sale.id,
          question.id,
          prepare_random_bbs_article(),
        );
      return snapshot;
    })),
  );

  const read: IShoppingSaleQuestion =
    await ShoppingApi.functional.shoppings.customers.sales.questions.at(
      pool.customer,
      sale.id,
      question.id,
    );
  TestValidator.equals("read", question, read);
};
