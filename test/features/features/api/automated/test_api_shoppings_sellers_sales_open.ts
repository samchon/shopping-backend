import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";

export const test_api_shoppings_sellers_sales_open = async (
  connection: api.IConnection,
) => {
  const output = await api.functional.shoppings.sellers.sales.open(connection, {
    id: typia.random<string & Format<"uuid">>(),
    body: typia.random<IShoppingSale.IUpdateOpeningTime>(),
  });
  typia.assert(output);
};
