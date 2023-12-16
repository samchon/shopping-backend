import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../common/internal/prepare_random_bbs_article";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_inquiry_answer } from "./internal/generate_random_sale_inquiry_answer";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_answer_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_customer_join(pool);
  await test_api_shopping_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  question.answer = await generate_random_sale_inquiry_answer(
    pool,
    sale,
    question,
  );
  question.answer.snapshots.push(
    ...(await ArrayUtil.asyncRepeat(4)(async () => {
      const snapshot: IShoppingSaleInquiryAnswer.ISnapshot =
        await ShoppingApi.functional.shoppings.sellers.sales.questions.answer.update(
          pool.customer,
          sale.id,
          question.id,
          question.answer!.id,
          prepare_random_bbs_article(),
        );
      return typia.assertEquals(snapshot);
    })),
  );

  const read: IShoppingSaleQuestion =
    await ShoppingApi.functional.shoppings.customers.sales.questions.at(
      pool.customer,
      sale.id,
      question.id,
    );
  typia.assertEquals(read.answer);
  TestValidator.equals("read")(question)(read);
};
