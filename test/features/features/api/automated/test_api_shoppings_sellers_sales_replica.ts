import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";

export const test_api_shoppings_sellers_sales_replica = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSale.ICreate =
    await api.functional.shoppings.sellers.sales.replica(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
