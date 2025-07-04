import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSaleSnapshot } from "../../../../../src/api/structures/shoppings/sales/IShoppingSaleSnapshot";

export const test_api_shoppings_sellers_sales_snapshots_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSaleSnapshot.ISummary> =
    await api.functional.shoppings.sellers.sales.snapshots.index(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      body: typia.random<IPage.IRequest>(),
    });
  typia.assert(output);
};
