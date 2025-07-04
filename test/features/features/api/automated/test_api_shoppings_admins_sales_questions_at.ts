import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleQuestion } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

export const test_api_shoppings_admins_sales_questions_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleQuestion =
    await api.functional.shoppings.admins.sales.questions.at(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
