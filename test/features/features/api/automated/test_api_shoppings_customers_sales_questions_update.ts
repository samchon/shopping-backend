import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IBbsArticle } from "../../../../../src/api/structures/common/IBbsArticle";

export const test_api_shoppings_customers_sales_questions_update = async (
  connection: api.IConnection,
) => {
  const output: IBbsArticle.ISnapshot =
    await api.functional.shoppings.customers.sales.questions.update(
      connection,
      {
        saleId: typia.random<string & Format<"uuid">>(),
        id: typia.random<string & Format<"uuid">>(),
        body: typia.random<IBbsArticle.ICreate>(),
      },
    );
  typia.assert(output);
};
