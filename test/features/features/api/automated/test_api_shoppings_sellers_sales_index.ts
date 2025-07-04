import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";

export const test_api_shoppings_sellers_sales_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSale.ISummary> =
    await api.functional.shoppings.sellers.sales.index(connection, {
      body: typia.random<IShoppingSale.IRequest>(),
    });
  typia.assert(output);
};
