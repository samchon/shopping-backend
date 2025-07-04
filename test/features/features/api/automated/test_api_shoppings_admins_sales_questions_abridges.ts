import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSaleQuestion } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

export const test_api_shoppings_admins_sales_questions_abridges = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSaleQuestion.IAbridge> =
    await api.functional.shoppings.admins.sales.questions.abridges(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingSaleQuestion.IRequest>(),
    });
  typia.assert(output);
};
