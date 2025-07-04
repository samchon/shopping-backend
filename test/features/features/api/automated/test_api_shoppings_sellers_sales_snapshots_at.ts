import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleSnapshot } from "../../../../../src/api/structures/shoppings/sales/IShoppingSaleSnapshot";

export const test_api_shoppings_sellers_sales_snapshots_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleSnapshot =
    await api.functional.shoppings.sellers.sales.snapshots.at(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
