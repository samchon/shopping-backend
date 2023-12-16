import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_sale_question = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  input?: Partial<IShoppingSaleQuestion.ICreate>,
): Promise<IShoppingSaleQuestion> => {
  const question: IShoppingSaleQuestion =
    await ShoppingApi.functional.shoppings.customers.sales.questions.create(
      pool.customer,
      sale.id,
      {
        title: RandomGenerator.paragraph()(),
        body: RandomGenerator.content()()(),
        format: "txt",
        files: [],
        secret: false,
        ...input,
      },
    );
  return typia.assertEquals(question);
};
