import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";
import type { IShoppingSaleSnapshot } from "../../../../../src/api/structures/shoppings/sales/IShoppingSaleSnapshot";

export const test_api_shoppings_sellers_sales_update = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSale =
    await api.functional.shoppings.sellers.sales.update(connection, {
      id: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingSaleSnapshot.ICreate>(),
    });
  typia.assert(output);
};
