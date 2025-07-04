import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";

export const test_api_shoppings_sellers_sales_units_stocks_supplements_erase =
  async (connection: api.IConnection) => {
    const output =
      await api.functional.shoppings.sellers.sales.units.stocks.supplements.erase(
        connection,
        {
          saleId: typia.random<string & Format<"uuid">>(),
          unitId: typia.random<string & Format<"uuid">>(),
          stockId: typia.random<string & Format<"uuid">>(),
          id: typia.random<string & Format<"uuid">>(),
        },
      );
    typia.assert(output);
  };
