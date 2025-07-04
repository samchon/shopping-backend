import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleQuestion } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

export const test_api_shoppings_customers_sales_questions_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleQuestion =
    await api.functional.shoppings.customers.sales.questions.create(
      connection,
      {
        saleId: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingSaleQuestion.ICreate>(),
      },
    );
  typia.assert(output);
};
