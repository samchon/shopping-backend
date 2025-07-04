import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";

export const test_api_shoppings_sellers_sales_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSale =
    await api.functional.shoppings.sellers.sales.create(connection, {
      body: typia.random<IShoppingSale.ICreate>(),
    });
  typia.assert(output);
};
